## Context

当前项目已经具备 React + TypeScript + Ant Design + React Query + Axios 的前端基线，也已经落了 Figma 一期 UI 页面骨架。其中 [ViralRemixPage.tsx](/F:/AAA_AI_aisperce/AI-Hit-Factory/src/pages/ViralRemixPage.tsx) 只覆盖“上传视频、选择改编模式、展示本地分析结果、显示假成功态”，并没有接入真实任务系统。

`用户端.md` 中 `08.AIGC-视频追爆` 实际提供的是一套完整的异步任务接口，而不是单次提交表单：

- `GET /customer/aigc/video-remix-tasks`
- `POST /customer/aigc/video-remix-tasks`
- `GET /customer/aigc/video-remix-tasks/{id}`
- `DELETE /customer/aigc/video-remix-tasks/{id}`
- `PUT /customer/aigc/video-remix-tasks/{id}/form`
- `POST /customer/aigc/video-remix-tasks/{id}/check-prompt`
- `POST /customer/aigc/video-remix-tasks/{id}/generate-prompt`
- `POST /customer/aigc/video-remix-tasks/{id}/generate-video`
- `GET /customer/aigc/video-remix-tasks/{id}/refresh`

这意味着前端必须从“单页演示”升级成“任务入口 + 任务详情 + 任务列表”的闭环。否则后续联调会出现两个典型问题：

- 页面能上传素材，但没有任务实体可追踪
- 页面能显示结果，但刷新后无法回填草稿和状态

知识点拨：
从后端视角看，视频追爆和前端常见的“提交表单后立刻拿结果”不同，它更像一个异步 Job 系统。你可以把它类比成前端里的“发起 mutation 后，后续还要靠 query 轮询结果”，只是后端这里的任务状态落库了，所以详情页就像一个“可恢复的异步状态容器”。

## Goals / Non-Goals

**Goals:**

- 对齐 `用户端.md` 中视频追爆任务接口，补齐前端任务闭环。
- 把现有 `ViralRemixPage` 改造成“创建任务入口页”，而不是继续保留纯演示态。
- 新增追爆任务列表页，支持分页查询、关键字搜索、状态筛选、删除和进入详情。
- 新增追爆任务详情页，支持任务详情回填、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态和结果展示。
- 在现有工程结构下新增最小必要的 `src/features/video-remix` 领域支撑层，避免把所有接口和状态逻辑堆进页面文件。
- 保持请求分层：`request` 基础层 -> `API Client` -> `React Query` -> 页面。

**Non-Goals:**

- 不修改后端接口，不新增后端字段。
- 不在本次 change 中接入账号体系里的实名、企业认证、协议签署等高风险准入判断，只预留页面文案和状态展示接口位。
- 不把通用 `TaskRecordsPage` 一次性改造成所有任务类型的统一真实任务中心。
- 不重构全站目录结构，只在现有项目基础上做最小增量落地。

## Decisions

### Decision 1：新增独立的 `video-remix-tasks` API 模块

采用：

- `src/api/aigc/video-remix-tasks/types.ts`
- `src/api/aigc/video-remix-tasks/index.ts`

Why：

- 当前已有 `src/api/customer/text-image-video/*` 作为真实任务型接口的参考实现，视频追爆最自然的落地方式也是独立业务模块，而不是塞进上传模块或页面内联请求。
- 这样做能把“接口契约”与“页面表现”分开，后面接口字段变动时只改 API 层和适配层，不会同时污染多个页面。

备选方案：

- 把追爆请求临时写进 `ViralRemixPage.tsx`
- 把追爆请求混进 `src/api/customer/text-image-video/*`

不选原因：

- 前者会迅速造成页面膨胀
- 后者会模糊业务边界，后续维护成本更高

### Decision 2：采用“三页闭环”而不是“单页承载所有状态”

采用：

- `/viral-remix`：创建追爆任务入口页
- `/viral-remix/tasks`：追爆任务列表页
- `/viral-remix/tasks/:taskId`：追爆任务详情/编辑/生成页

Why：

- `POST /customer/aigc/video-remix-tasks` 创建出来的是一个本地任务实体，后续所有动作都围绕这个 `id` 展开。前端若没有详情页，刷新和回填能力就没有稳定承接点。
- 任务详情页负责“草稿 + 状态 + 结果”聚合，任务列表页负责“查找 + 回看 + 删除”，这和接口结构天然一致。

备选方案：

- 继续把所有逻辑放进 `/viral-remix`

不选原因：

- 页面职责混乱
- 难以从列表或通用任务中心深链跳转
- 单页文件体积和状态复杂度会快速失控

### Decision 3：新增最小领域层 `src/features/video-remix`

采用：

- `src/features/video-remix/status.ts`
- `src/features/video-remix/form.ts`
- 如有必要，再补 `hooks.ts` 或局部组件

Why：

- 当前仓库已经存在 `src/features/workspace/*`，说明项目允许按领域放轻量逻辑层。
- 视频追爆最少需要两个可复用支撑：
  - 状态码到文案/颜色/动作可用性的映射
  - 详情数据到表单默认值、表单值到请求体的适配

这两类逻辑都不应该继续堆在页面 JSX 里。

备选方案：

- 放进 `src/shared`

不选原因：

- 这组能力当前只服务视频追爆，还没达到跨业务稳定复用的条件，提升到 `shared` 过早

### Decision 4：用 React Query 管理列表、详情和动作后的缓存失效

采用：

- `useQuery` 拉任务列表
- `useQuery` 拉任务详情
- `useMutation` 做创建、删除、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态
- 通过 `invalidateQueries` 或 `setQueryData` 更新列表和详情缓存

Why：

- 这是典型的“服务端状态”场景，不应放进全局 store。
- 追爆任务的本质是“异步远端状态”，和前端组件本地状态不一样。React Query 很适合处理：
  - 请求进行中
  - 错误回显
  - 提交后缓存更新
  - 刷新恢复

知识点拨：
如果把 React Query 看成后端里的缓存层，那么 `invalidateQueries` 就像通知缓存“这份数据已经脏了，请重新回源”。这比页面手写一堆 `loading/success/error` 状态更稳。

### Decision 5：详情页采用“表单区 + 任务结果区”双区布局

采用：

- 左侧或上半部分：表单编辑区
- 右侧或下半部分：任务状态、Prompt 结果、视频结果、失败原因

Why：

- `PUT /form` 表明任务表单是持久化草稿，而不是一次性输入。
- `generate-prompt`、`generate-video` 和 `refresh` 都作用在同一个任务实体上，因此详情页必须能同时展示编辑态和执行态。

备选方案：

- 只做单列长表单，结果插在页面尾部

不选原因：

- 信息回看成本高
- 刷新状态、失败信息和结果预览会把表单阅读打断

### Decision 6：路由层显式补追爆列表与详情 route key

采用：

- 在 `routeTypes.ts` 中新增：
  - `content.viralRemixTasks`
  - `content.viralRemixTaskDetail`
- 在 `routeRegistry.tsx` 中注册：
  - 列表页可按需显示在菜单或从任务记录页进入
  - 详情页默认 `hideInMenu`

Why：

- 当前路由系统已经是“静态 route registry + 动态菜单映射”的模型，新增页面必须继续沿用这条规则。
- 详情页属于深层路由，通常不应直接作为主菜单展示项。

备选方案：

- 只保留路径，不补 route key

不选原因：

- 会破坏现有动态路由映射的一致性

## Risks / Trade-offs

- [Risk] `用户端.md` 的分页结构看起来是 `records/total/current/size`，而当前共享类型 `PageData<T>` 是 `list/total`。  
  Mitigation：实现前先在 API 层显式做分页响应适配，避免页面直接依赖不匹配结构。

- [Risk] 状态码 `0~7` 在文档里没有完整枚举语义。  
  Mitigation：先保留“状态码 + 文案兜底”双轨映射，未知状态显示原始 `statusLabel` 和通用处理中样式。

- [Risk] 长耗时动作如 `generate-prompt`、`generate-video` 会导致重复点击。  
  Mitigation：按钮态与 mutation pending 态、任务状态联合控制，必要时对同任务动作做串行限制。

- [Risk] 把列表页也塞进通用 `TaskRecordsPage` 会导致本次 change 范围失控。  
  Mitigation：本次只补视频追爆专用任务页，不重构全站任务中心。

- [Risk] 详情页职责较重，若组件拆分失控，可能形成新的“巨型页面文件”。  
  Mitigation：把状态映射、表单适配和结果展示拆到 `features/video-remix`，页面只做组合。

## Migration Plan

1. 新增 OpenSpec 变更文档，明确视频追爆真实任务流边界。
2. 先补 `video-remix-tasks` API Client 与类型。
3. 再补 `features/video-remix` 适配层。
4. 改造 `ViralRemixPage` 为创建入口。
5. 新增追爆详情页，优先打通“创建 -> 详情 -> 保存 -> 生成 -> 刷新”主链路。
6. 新增追爆任务列表页。
7. 补路由与测试。

回滚策略：

- 本次变更只新增前端模块和路由，不涉及数据库迁移。
- 如需回滚，可删除新增页面、API 模块和路由项，并恢复 `ViralRemixPage` 的演示态实现。

## Open Questions

- `status 0~7` 的精确业务语义是否需要后端进一步给出枚举说明，还是以前端 `statusLabel` 为准。
- 追爆任务列表页最终是否要并入通用任务记录页，还是长期保持单独入口。
- `check-prompt` 是否应该在详情页显式暴露单独按钮，还是作为 `generate-prompt` 之后的只读结果展示。
