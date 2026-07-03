## Context

当前项目已经具备 `React + TypeScript + Ant Design + React Query + Axios` 的前端基础设施，并且已经存在 [src/api/customer/text-image-video/index.ts](F:\AAA_AI_aisperce\AI-Hit-Factory\src\api\customer\text-image-video\index.ts) 这一层请求封装。但页面层仍处于演示态：

- [ImageVideoPage.tsx](F:\AAA_AI_aisperce\AI-Hit-Factory\src\pages\ImageVideoPage.tsx) 只做了输入方式切换、图片上传和本地“生成成功”模拟。
- [TaskRecordsPage.tsx](F:\AAA_AI_aisperce\AI-Hit-Factory\src\pages\TaskRecordsPage.tsx) 仍然消费 mock 数据，没有接入文图生视频真实任务。
- 路由层当前只有 `/image-video` 单页入口，没有文图生视频专属任务列表和详情路由。

`用户端.md` 里的“文图生视频”实际提供的是一套异步任务接口，而不是一次性表单提交：

- `GET /api/v1/customer/text-image-video/tasks`
- `POST /api/v1/customer/text-image-video/tasks`
- `GET /api/v1/customer/text-image-video/tasks/{id}`
- `DELETE /api/v1/customer/text-image-video/tasks/{id}`

这意味着前端不能只做一个“提交按钮”，而需要承接“创建任务 -> 查看列表 -> 查看详情 -> 等待结果 -> 删除任务”的完整任务生命周期。

知识点拨：
从后端视角看，这类接口更像“异步 Job 任务中心”，而不是普通同步表单接口。你可以把它类比成前端里的 `mutation + query` 组合：先发起 `mutation` 创建任务，再通过 `query` 查询任务状态和结果，只不过后端把这个状态实体化并持久化了，所以前端需要有可恢复的详情页来接住刷新和回看场景。

## Goals / Non-Goals

**Goals:**

- 让文图生视频页面接入真实任务创建能力，使用后端返回的任务 ID 驱动后续流程。
- 新增文图生视频任务列表页，支持分页、状态筛选、回看和删除。
- 新增文图生视频任务详情页，支持任务详情恢复、进度展示、结果预览和失败原因展示。
- 提取最小必要的任务状态映射和表单适配逻辑，避免把 API 字段映射散落在多个页面里。
- 保持“request 基础层 -> API Client -> React Query -> 页面”的分层，不在页面里直接拼接接口请求。

**Non-Goals:**

- 不修改后端接口路径、请求体和返回体。
- 不在本次 change 中改造通用 `TaskRecordsPage` 为全站统一任务中心，只做文图生视频专属闭环。
- 不在本次 change 中接入数字人真实业务，只为后续复用预留最小公共能力。
- 不额外引入新的全局状态库，也不把服务端任务数据放进全局 store。

## Decisions

### Decision 1：保留 `src/api/customer/text-image-video` 作为 API 边界，并补齐前端适配

采用：

- 继续使用 `src/api/customer/text-image-video/index.ts`
- 完善 `src/api/customer/text-image-video/types.ts`
- 视需要补充该模块内部的分页响应适配工具

Why：

- 当前项目已经有文图生视频 API 目录，继续沿用能保证业务边界清晰。
- `用户端.md` 中的分页结构是 `data.list + data.total`，与现有共享分页类型需要显式核对。把适配收敛在 API 层，比把字段差异散落到页面里更稳。

备选方案：

- 新建一套平行的 API 模块
- 在页面中直接处理后端字段差异

不选原因：

- 新建平行模块会造成重复职责。
- 页面直接吃原始响应会让后续类型维护成本上升。

### Decision 2：文图生视频采用“三页闭环”，而不是继续堆在单页里

采用：

- `/image-video`：创建任务入口页
- `/image-video/tasks`：文图生视频任务列表页
- `/image-video/tasks/:taskId`：文图生视频任务详情页

Why：

- 创建接口返回的是任务实体，而不是最终视频，后续所有动作都围绕任务 ID 展开。
- 详情页是“可恢复的任务容器”，刷新页面后仍能回到当前任务状态，这比把所有状态留在入口页的本地内存里可靠得多。
- 列表页承担搜索、筛选、回看和删除职责，能避免入口页和详情页职责膨胀。

备选方案：

- 继续只保留 `/image-video` 一个页面
- 把文图生视频并入通用 `TaskRecordsPage`

不选原因：

- 单页模式难以承接刷新恢复和回看。
- 直接并入通用任务页会扩大本次范围，影响交付节奏。

### Decision 3：新增 `src/features/text-image-video` 承接状态映射和表单适配

采用：

- `src/features/text-image-video/status.ts`
- `src/features/text-image-video/form.ts`
- 如页面组合复杂，再增加局部 hooks

Why：

- 状态文案、结果显示规则、失败态逻辑都属于文图生视频领域，不适合塞回页面 JSX。
- 这组能力目前只服务文图生视频，但未来数字人任务也可能复用“状态映射”和“结果展示规则”，先放在 feature 内最合适，等稳定后再考虑提升到 `shared`。

备选方案：

- 全写在页面文件
- 直接提升到 `shared`

不选原因：

- 全写在页面里会让三个页面重复维护一套状态逻辑。
- 直接进 `shared` 过早，会引入没有稳定复用依据的抽象。

### Decision 4：使用 React Query 管理列表、详情和动作后的缓存失效

采用：

- 列表页使用 `useQuery`
- 详情页使用 `useQuery`
- 创建和删除使用 `useMutation`
- 通过 `invalidateQueries` 和必要的 `setQueryData` 维护列表与详情一致性

Why：

- 文图生视频任务是典型的服务端状态，不应该放进全局 store。
- React Query 天然适合处理“创建成功后跳详情”“删除成功后回列表”“详情刷新后同步最新结果”的链路。

备选方案：

- 用组件本地 state 手写缓存同步
- 用全局状态库维护任务列表和详情

不选原因：

- 本地 state 难以处理跨页面同步。
- 全局状态库不适合承担服务端数据新鲜度和失效管理。

### Decision 5：任务详情页采用“表单信息区 + 结果预览区”的双区布局

采用：

- 左侧或上半部分展示任务输入信息、模型、图片列表、提示词
- 右侧或下半部分展示状态、进度、封面、视频、时长和失败原因

Why：

- 详情接口已经返回了输入字段和结果字段，前端应同时支持“看输入”和“看结果”。
- 双区布局更适合任务型页面，能让用户快速理解“我提交了什么”和“系统现在处理到哪一步”。

备选方案：

- 全部信息单列堆叠

不选原因：

- 结果区和输入区容易相互打断，尤其是失败原因和视频结果会把表单阅读节奏打散。

### Decision 6：只抽最小公共能力，不提前构造“全站异步任务框架”

采用：

- 只抽任务状态映射、状态按钮可用性判断、表单字段适配
- 页面布局和详情展示先保留在文图生视频 feature 内

Why：

- 这次 change 的目标是让文图生视频可用，不是顺手重构整个异步任务体系。
- KISS 原则下，先验证文图生视频和后续数字人是否真的共用相同抽象，再做提升更稳。

备选方案：

- 直接建立通用 `AsyncTaskLayout`、`TaskResultPanel`、`TaskFormShell`

不选原因：

- 当前缺少足够多的真实复用场景，提前抽象风险高。

## Risks / Trade-offs

- [Risk] 文档里的任务状态码没有完整枚举语义，只能看到 `status` 和 `statusLabel`。  
  Mitigation：前端使用“状态码兜底 + `statusLabel` 优先展示”的双轨映射，未知状态不阻塞页面显示。

- [Risk] 当前共享分页类型可能与文图生视频接口真实分页结构不完全一致。  
  Mitigation：在 API 层显式做分页适配，不让页面依赖不稳定的底层结构。

- [Risk] 入口页已经有上传能力，但上传成功后的图片 URL 与任务创建参数必须保持一致，否则创建后详情回显会错位。  
  Mitigation：统一通过 feature 层表单适配，把上传结果和创建请求体映射收敛到一处。

- [Risk] 如果把文图生视频列表和详情同时塞进通用任务记录页，会导致本次 change 范围扩大。  
  Mitigation：本次只做专属列表和详情，通用任务中心作为后续独立优化项。

## Migration Plan

1. 保持现有 `/image-video` 路由不变，先将其改造成真实创建入口，避免菜单入口变化。
2. 新增 `/image-video/tasks` 和 `/image-video/tasks/:taskId`，并在路由注册表与动态菜单映射里补齐 route key。
3. API 层兼容现有调用方，优先通过增量方式完善类型和响应结构，避免影响其他模块。
4. 如需回滚，只需要移除新增页面、feature 支撑层和对应路由，并把 `ImageVideoPage` 恢复为演示态实现；本次不涉及后端迁移和数据结构变更。

## Open Questions

- 文图生视频任务列表未来是否要并入通用 `TaskRecordsPage`，还是长期保留独立入口。
- 模型字段当前文档只明确了 `seedance2.0`，是否需要前端显式暴露模型选择，还是只保留默认值。
- 数字人后续接入时，是否会复用同样的任务详情布局；如果会，再评估哪些能力可提升到 `shared`。
