# 视频追爆任务实施文档

更新时间：2026-06-23

## 1. 背景

`用户端.md` 中的 `08.AIGC-视频追爆` 已经不是单一表单接口，而是一整套异步任务链路，包含：

- 分页查询追爆任务列表：`GET /api/aigc/video-remix-tasks`
- 创建追爆任务：`POST /api/aigc/video-remix-tasks`
- 追爆任务详情：`GET /api/aigc/video-remix-tasks/{id}`
- 删除追爆任务：`DELETE /api/aigc/video-remix-tasks/{id}`
- 校验 Prompt：`POST /api/aigc/video-remix-tasks/{id}/check-prompt`
- 保存追爆表单：`PUT /api/aigc/video-remix-tasks/{id}/form`
- 生成 Prompt：`POST /api/aigc/video-remix-tasks/{id}/generate-prompt`
- 生成视频：`POST /api/aigc/video-remix-tasks/{id}/generate-video`
- 刷新追爆任务状态：`GET /api/aigc/video-remix-tasks/{id}/refresh`

当前项目中的 [ViralRemixPage.tsx](/F:/AAA_AI_aisperce/AI-Hit-Factory/src/pages/ViralRemixPage.tsx) 仍是演示页，只覆盖“上传 + 模式切换 + 本地成功态”，没有承接任务创建、草稿保存、异步状态刷新、详情回填和结果回看。

## 2. 技术栈感知

当前仓库前端基线是：

- `React 19`
- `Vite`
- `TypeScript`
- `Ant Design`
- `React Query`
- `Axios`
- `Vitest + Testing Library`

这意味着视频追爆应继续沿用现有风格：

- 接口层走 `src/api/**`
- 页面层走 `src/pages/**`
- 查询与动作状态优先放进 `React Query`
- 上传继续复用 `src/api/aigc/uploads/**`

## 3. 方案构思

### 方案 A：全部堆在 `ViralRemixPage`

做法：

- 继续使用 `/viral-remix`
- 在同一页里同时处理创建、编辑、详情、生成和结果展示

优点：

- 首次改动文件少
- 路由新增最少

缺点：

- 文件会迅速膨胀，后续联调和测试成本高
- 异步任务的“列表 -> 详情 -> 刷新 -> 回填”链路不清晰
- 不利于从任务记录页深链跳转回具体任务

### 方案 B：三页闭环，推荐

做法：

- 保留 `/viral-remix` 作为“新建追爆任务”入口页
- 新增 `/viral-remix/tasks` 作为“追爆任务列表页”
- 新增 `/viral-remix/tasks/:taskId` 作为“追爆任务详情/编辑/生成页”

优点：

- 更符合 `用户端.md` 的接口结构
- 异步任务状态与表单状态分层清晰
- 后续从通用任务记录页跳转到追爆详情页更自然
- 页面职责更单一，测试也更好拆

缺点：

- 需要补路由和两张缺失页面

### 结论

推荐采用 **方案 B**。

第一性原理上，视频追爆不是“一个表单”，而是“一个需要被持续刷新和追踪的异步任务系统”。把它拆成创建页、列表页、详情页，和它的后端接口形态是一致的，也更适合后续接审核、失败重试和任务回看。

## 4. 现有页面复用与缺失页面补充

| 页面/模块 | 当前状态 | 处理建议 |
| :--- | :--- | :--- |
| `src/pages/ViralRemixPage.tsx` | 已存在，演示态 | 复用为“创建追爆任务 + 首次填写表单”的入口页 |
| `src/pages/TaskRecordsPage.tsx` | 已存在，通用 mock 任务页 | 保留为通用任务中心，不建议直接承担追爆专用详情逻辑 |
| `src/pages/VideoRemixTasksPage.tsx` | 缺失 | 需要手动补充，承接追爆任务列表、筛选、删除、进入详情 |
| `src/pages/VideoRemixTaskDetailPage.tsx` | 缺失 | 需要手动补充，承接详情回填、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态 |
| `src/api/aigc/video-remix-tasks/*` | 缺失 | 需要新增接口封装和类型定义 |

## 5. 接口与前端动作映射

| 接口 | 前端动作 | 推荐落点 |
| :--- | :--- | :--- |
| `GET /api/aigc/video-remix-tasks` | 任务列表查询、状态筛选、关键字搜索 | `VideoRemixTasksPage` |
| `POST /api/aigc/video-remix-tasks` | 创建空任务，拿到本地 `id` | `ViralRemixPage` |
| `GET /api/aigc/video-remix-tasks/{id}` | 详情回填、页面初始化 | `VideoRemixTaskDetailPage` |
| `PUT /api/aigc/video-remix-tasks/{id}/form` | 保存表单草稿 | `VideoRemixTaskDetailPage` |
| `POST /api/aigc/video-remix-tasks/{id}/check-prompt` | 校验 prompt 是否通过 | `VideoRemixTaskDetailPage` |
| `POST /api/aigc/video-remix-tasks/{id}/generate-prompt` | 生成 prompt | `VideoRemixTaskDetailPage` |
| `POST /api/aigc/video-remix-tasks/{id}/generate-video` | 触发视频生成 | `VideoRemixTaskDetailPage` |
| `GET /api/aigc/video-remix-tasks/{id}/refresh` | 手动刷新任务状态 | `VideoRemixTaskDetailPage` |
| `DELETE /api/aigc/video-remix-tasks/{id}` | 列表删除 / 详情删除 | `VideoRemixTasksPage`、`VideoRemixTaskDetailPage` |

## 6. 字段重点

### 6.1 任务主信息

- `id`：本地 UUID，是前端路由和后续动作的主键
- `chanjingId`：外部平台主键，前端只展示或调试，不参与路由
- `name`
- `remark`
- `status`
- `statusLabel`
- `progress`
- `errReason`
- `videoUrl`
- `coverUrl`
- `duration`
- `createTime`
- `updateTime`

### 6.2 表单主体

`PUT /form` 的请求体是这一轮实现的核心：

- `name`
- `remark`
- `targetVideoModel`
- `referenceVideoUrl`
- `videoMetaSummary`
- `productImageUrls`
- `characterImageUrls`
- `audioUrl`
- `productInfo`
- `voiceoverScript`
- `direction`
- `generationDuration`

### 6.3 页面设计含义

这组字段说明详情页不能只做“只读结果页”，它本质上是：

- 一个可编辑的任务表单页
- 一个可操作的生成控制台
- 一个可刷新的结果回看页

## 7. 文件级实施计划

| 模块层级 | 文件路径 | 修改逻辑简述 |
| :--- | :--- | :--- |
| **API** | `src/api/aigc/video-remix-tasks/types.ts` | 新增任务查询、任务详情、表单请求、状态响应类型 |
| **API** | `src/api/aigc/video-remix-tasks/index.ts` | 新增列表、创建、详情、删除、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态接口 |
| **Shared** | `src/api/shared/types.ts` | 如有必要，补充更贴近当前后端的分页结构兼容层 |
| **Feature** | `src/features/video-remix/status.ts` | 抽离状态码到文案、颜色、按钮可用性映射 |
| **Feature** | `src/features/video-remix/form.ts` | 抽离表单默认值、回填转换、请求体适配逻辑 |
| **Frontend** | `src/pages/ViralRemixPage.tsx` | 从演示页改造成新建入口页，创建任务后跳详情页 |
| **Frontend** | `src/pages/VideoRemixTasksPage.tsx` | 手动补充追爆列表页 |
| **Frontend** | `src/pages/VideoRemixTaskDetailPage.tsx` | 手动补充详情/编辑/生成页 |
| **Router** | `src/app/router/routeTypes.ts` | 补充追爆列表、追爆详情 route key |
| **Router** | `src/app/router/routeRegistry.tsx` | 注册列表页和详情页路由，详情页建议隐藏在菜单中 |
| **Router** | `src/app/router/dynamicRoutes.ts` | 为后端组件映射预留追爆列表页 route key |
| **Test** | `src/pages/video-remix-pages.test.tsx` | 补充列表、详情、创建跳转的页面级测试 |
| **Test** | `src/api/aigc/video-remix-tasks/index.test.ts` | 补充接口封装测试 |

## 8. 分步任务清单

- [ ] **任务 1：补齐视频追爆 API 模块**
  - 新增 `src/api/aigc/video-remix-tasks/types.ts`
  - 新增 `src/api/aigc/video-remix-tasks/index.ts`
  - 对齐 `用户端.md` 中 9 个接口

- [ ] **任务 2：抽离追爆状态与表单适配层**
  - 新增 `src/features/video-remix/status.ts`
  - 新增 `src/features/video-remix/form.ts`
  - 统一处理 `status/statusLabel/progress/errReason` 和表单回填

- [ ] **任务 3：改造 `ViralRemixPage` 为创建入口页**
  - 保留原有上传、分析、模式选择 UI
  - 新增“创建任务”动作
  - 创建成功后跳转到 `/viral-remix/tasks/:taskId`

- [ ] **任务 4：手动补充追爆任务列表页**
  - 新增 `src/pages/VideoRemixTasksPage.tsx`
  - 接 `GET /api/aigc/video-remix-tasks`
  - 支持关键字搜索、状态筛选、进入详情、删除任务

- [ ] **任务 5：手动补充追爆任务详情页**
  - 新增 `src/pages/VideoRemixTaskDetailPage.tsx`
  - 初始化加载任务详情
  - 保存表单
  - 校验 Prompt
  - 生成 Prompt
  - 生成视频
  - 刷新任务状态
  - 展示结果视频、封面、失败原因、进度

- [ ] **任务 6：补路由与菜单映射**
  - 修改 `src/app/router/routeTypes.ts`
  - 修改 `src/app/router/routeRegistry.tsx`
  - 修改 `src/app/router/dynamicRoutes.ts`

- [ ] **任务 7：补测试与验收**
  - 接口层测试
  - 页面层测试
  - 路由跳转测试
  - 类型检查与构建验证

## 9. 推荐实施顺序

1. 先做 API 与类型。
2. 再做状态映射和表单适配层。
3. 然后改造 `ViralRemixPage`，把“演示页”变成“任务入口页”。
4. 接着补 `VideoRemixTaskDetailPage`，先打通创建后的主链路。
5. 最后补 `VideoRemixTasksPage` 和通用入口跳转。

这样安排的原因是：详情页是整条链路的中枢，列表页反而可以稍后接入。先把“创建 -> 详情 -> 保存 -> 生成 -> 刷新”打通，业务价值最大。

## 10. 验证步骤

- `npm test -- src/api/aigc/video-remix-tasks/index.test.ts`
- `npm test -- src/pages/video-remix-pages.test.tsx`
- `npm run typecheck`
- `npm run build`

浏览器验收重点：

- `/viral-remix` 能创建追爆任务并跳转
- `/viral-remix/tasks` 能展示后端任务列表
- `/viral-remix/tasks/:taskId` 能回填表单
- 保存表单后刷新页面仍能看到最新数据
- 生成 Prompt / 生成视频后能看到状态变化
- 失败态能展示 `errReason`

## 11. 风险提醒

- 当前 `PageData<T>` 是 `list/total` 结构，而 `用户端.md` 里的分页返回更像 `records/total/current/size`；落地时要先确认请求层是否已经做了结果转换。
- `ViralRemixPage.tsx` 当前存在明显演示态代码，改造时不要把所有逻辑继续堆在一个文件里，否则很快会失控。
- `check-prompt`、`generate-prompt`、`generate-video` 都是异步动作，按钮状态必须和任务状态绑定，避免重复点击。
- 详情页建议把“表单编辑区”和“任务结果区”拆开，避免未来扩展失败重试时互相污染。
