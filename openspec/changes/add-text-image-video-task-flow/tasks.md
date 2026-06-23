## 1. 前置梳理

- [x] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md`、`specs/text-image-video-task-flow/spec.md`
- [x] 1.2 对照 `用户端.md` 中“文图生视频”接口，核对列表、创建、详情、删除四个接口的请求字段、响应字段和分页结构
- [x] 1.3 复查 `src/pages/ImageVideoPage.tsx`、`src/pages/TaskRecordsPage.tsx`、`src/api/customer/text-image-video/*` 与路由文件，确认现有 mock 边界和待替换点

## 2. API 与类型层

- [x] 2.1 完善 `src/api/customer/text-image-video/types.ts`，补齐任务列表、详情、创建请求和删除动作所需的精确类型
- [x] 2.2 完善 `src/api/customer/text-image-video/index.ts`，确保分页查询、创建、详情和删除函数与 `用户端.md` 接口契约一致
- [x] 2.3 如共享分页结构不兼容，在文图生视频 API 层补充最小响应适配逻辑，避免页面直接消费不稳定结构
- [x] 2.4 为文图生视频 API 层补充或更新测试，覆盖请求参数和响应结构解析

## 3. 领域支撑层

- [x] 3.1 新增 `src/features/text-image-video/status.ts`，集中维护状态文案、视觉样式和按钮可用性规则
- [x] 3.2 新增 `src/features/text-image-video/form.ts`，集中维护入口页表单值、上传结果和详情响应之间的字段适配
- [x] 3.3 如页面状态组合复杂，再新增最小必要的 React Query hooks 或局部组件，但避免无复用价值的 shared 抽象

## 4. 页面实现

- [x] 4.1 改造 `src/pages/ImageVideoPage.tsx`，将本地假生成流程替换为真实任务创建流程
- [x] 4.2 新增 `src/pages/TextImageVideoTasksPage.tsx`，实现分页列表、状态筛选、回看详情和删除任务
- [x] 4.3 新增 `src/pages/TextImageVideoTaskDetailPage.tsx`，实现详情加载、输入信息回显、状态展示、结果预览和失败原因展示
- [x] 4.4 处理入口页、列表页和详情页的加载态、空态、失败态与未知状态兜底，避免页面白屏

## 5. 路由与入口接入

- [x] 5.1 修改 `src/app/router/routeTypes.ts`，新增文图生视频任务列表页和详情页的 route key
- [x] 5.2 修改 `src/app/router/routeRegistry.tsx`，注册 `/image-video/tasks` 与 `/image-video/tasks/:taskId` 路由，并将详情页标记为隐藏菜单项
- [x] 5.3 修改 `src/app/router/dynamicRoutes.ts`，补齐后端组件标识到文图生视频任务列表路由的静态映射
- [x] 5.4 评估 `TaskRecordsPage` 是否需要新增跳转入口或文图生视频任务卡片深链，保证用户能回到真实任务页

## 6. 验证与文档

- [x] 6.1 补充页面与路由测试，覆盖“创建成功跳详情”“列表筛选与删除”“详情成功态/失败态展示”
- [x] 6.2 运行 `npm run typecheck`
- [x] 6.3 运行 `npm test`
- [x] 6.4 运行 `npm run build`
- [x] 6.5 手动验证“创建任务 -> 查看详情 -> 返回列表 -> 删除任务”的主链路
- [x] 6.6 更新 `doc/progress.md` 记录本次实现进展、接口差异和遗留问题
