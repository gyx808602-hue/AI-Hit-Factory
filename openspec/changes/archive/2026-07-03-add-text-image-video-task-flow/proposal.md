## Why

当前仓库里的 [ImageVideoPage.tsx](F:\AAA_AI_aisperce\AI-Hit-Factory\src\pages\ImageVideoPage.tsx) 仍然是演示页，本地状态可以模拟“生成成功”，但还没有真正承接 `用户端.md` 中“文图生视频”任务接口的真实链路。现在已经有基础 API 封装，如果继续让页面停留在 mock 阶段，后续联调时会同时缺少任务创建、任务回看、任务删除和结果恢复能力。

## What Changes

- 将现有“文图生成视频”页面从演示态改为真实任务创建入口。
- 对齐 `用户端.md` 中的文图生视频接口契约，补齐分页查询、创建、详情、删除对应的前端任务流。
- 新增文图生视频任务列表页和任务详情页，支持任务筛选、回看、删除、结果预览与失败原因展示。
- 提取文图生视频任务的最小公共能力，包括任务状态映射、表单适配和详情展示规则，方便后续数字人等异步任务复用。
- 补充路由注册、动态菜单映射和基础测试，确保任务页可从菜单和任务记录入口进入。

## Capabilities

### New Capabilities
- `text-image-video-task-flow`: 提供用户侧文图生视频任务的创建、查询、详情回看、删除和结果展示闭环能力。

### Modified Capabilities

无。

## Impact

- 前端页面：
  - `src/pages/ImageVideoPage.tsx`
  - 新增 `src/pages/TextImageVideoTasksPage.tsx`
  - 新增 `src/pages/TextImageVideoTaskDetailPage.tsx`
- 前端接口层：
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
- 领域支撑层：
  - 新增 `src/features/text-image-video/*`
- 路由层：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 测试与文档：
  - 文图生视频 API 与页面测试
  - `doc/progress.md`
