## 1. OpenSpec 前置与接口契约整理

- [x] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md`、`specs/video-remix-task-flow/spec.md`
- [x] 1.2 对照 `用户端.md` 整理视频追爆 9 个接口的字段映射，确认请求参数、响应字段和分页结构差异
- [x] 1.3 明确 `status 0~7`、`statusLabel`、`progress`、`errReason`、`generatedPrompt`、`videoUrl` 等字段在前端的最小展示语义

## 2. API 模块与类型定义

- [x] 2.1 新增 `src/api/aigc/video-remix-tasks/types.ts`，定义列表查询、任务详情、表单请求和动作响应类型
- [x] 2.2 新增 `src/api/aigc/video-remix-tasks/index.ts`，实现列表、创建、详情、删除、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态接口
- [x] 2.3 处理分页响应适配，避免 `records` 结构直接污染现有页面类型消费方式
- [x] 2.4 为视频追爆 API 模块补充接口层测试

## 3. 追爆领域支撑层

- [x] 3.1 新增 `src/features/video-remix/status.ts`，统一维护状态码、状态文案、颜色、按钮可用性和结果区展示映射
- [x] 3.2 新增 `src/features/video-remix/form.ts`，实现详情响应到表单默认值、表单值到保存请求体的适配
- [ ] 3.3 如页面组合复杂度过高，新增最小必要的局部组件或 hooks，但避免把一次性页面块过早提升到 `shared`

## 4. 入口页改造

- [x] 4.1 改造 `src/pages/ViralRemixPage.tsx`，保留现有上传与模式展示骨架
- [x] 4.2 为入口页新增“创建追爆任务”动作，接入 `POST /customer/aigc/video-remix-tasks`
- [x] 4.3 创建成功后跳转到 `/viral-remix/tasks/:taskId`，创建失败时保留当前页并提示错误
- [x] 4.4 为入口页补充创建任务相关测试

## 5. 缺失页面补齐

- [x] 5.1 新增 `src/pages/VideoRemixTasksPage.tsx`，实现任务列表、关键字搜索、状态筛选、进入详情和删除动作
- [x] 5.2 新增 `src/pages/VideoRemixTaskDetailPage.tsx`，实现详情加载、表单回填和结果区展示
- [x] 5.3 在详情页接入保存表单动作 `PUT /customer/aigc/video-remix-tasks/{id}/form`
- [x] 5.4 在详情页接入 `check-prompt`、`generate-prompt`、`generate-video`、`refresh` 四个动作
- [x] 5.5 在详情页实现成功态、处理中、失败态和空结果态展示，失败时显示 `errReason`

## 6. 路由与菜单接入

- [x] 6.1 修改 `src/app/router/routeTypes.ts`，新增追爆任务列表页和详情页 route key
- [x] 6.2 修改 `src/app/router/routeRegistry.tsx`，注册新增页面并将详情页标记为隐藏菜单项
- [x] 6.3 修改 `src/app/router/dynamicRoutes.ts`，为后端菜单组件映射预留追爆任务列表路由映射
- [x] 6.4 验证从入口页、任务列表页和已有任务中心入口进入详情页时的路由行为一致

## 7. 验证与收尾

- [x] 7.1 运行视频追爆接口测试与页面测试
- [x] 7.2 运行 `npm run typecheck`
- [x] 7.3 运行 `npm test`
- [x] 7.4 运行 `npm run build`
- [ ] 7.5 手动验证“创建 -> 详情 -> 保存 -> 生成 -> 刷新 -> 回看”主链路
- [x] 7.6 更新 `doc/progress.md` 记录实现进展与遗留问题
