## Why

当前仓库里的“爆款视频改编”只有演示页，仍停留在本地交互和 mock 成功态，尚未承接 `用户端.md` 中 `08.AIGC-视频追爆` 的真实任务链路。现在需要把这组接口对应成可执行的前端能力，并补齐缺失页面，避免后续联调时继续把任务创建、草稿保存、异步生成和结果回看混在一个演示页面里。

## What Changes

- 新增视频追爆真实任务流前端能力，对齐 `用户端.md` 中的列表、创建、详情、删除、保存表单、校验 Prompt、生成 Prompt、生成视频、刷新状态接口。
- 将现有 `src/pages/ViralRemixPage.tsx` 从演示页改造成“创建追爆任务入口页”。
- 手动补齐缺失页面：
  - 追爆任务列表页
  - 追爆任务详情/编辑/生成页
- 新增视频追爆任务 API Client、类型定义、状态映射和表单适配层。
- 补充路由注册、菜单映射和页面测试，使“爆款视频改编”从单页演示升级为完整任务闭环。

## Capabilities

### New Capabilities
- `video-remix-task-flow`: 为爆款视频改编提供真实任务创建、列表查询、详情回填、表单保存、异步生成和结果回看的前端闭环能力

### Modified Capabilities
- 无

## Impact

- 前端页面：
  - `src/pages/ViralRemixPage.tsx`
  - 新增 `src/pages/VideoRemixTasksPage.tsx`
  - 新增 `src/pages/VideoRemixTaskDetailPage.tsx`
- 前端接口层：
  - 新增 `src/api/aigc/video-remix-tasks/index.ts`
  - 新增 `src/api/aigc/video-remix-tasks/types.ts`
- 业务支撑层：
  - 新增 `src/features/video-remix/*`
- 路由层：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 测试层：
  - 新增视频追爆接口与页面测试
