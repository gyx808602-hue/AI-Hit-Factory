## Why

当前仓库里的 [DigitalHumansPage.tsx](F:\AAA_AI_aisperce\AI-Hit-Factory\src\pages\DigitalHumansPage.tsx) 仍是本地 mock 管理页，用户只能在前端临时添加、筛选和删除卡片，还没有接入 `用户端.md` 中真实的数字人形象管理接口。现在既然数字人形象已经有完整的列表、创建、详情、删除和刷新接口，就应该尽快把页面从演示态推进到真实业务态，避免后续数字人视频、任务记录和企业资产管理继续建立在假数据之上。

## What Changes

- 将当前数字人管理页从本地 mock 列表改为真实的数字人形象管理入口，对接 `GET/POST/DELETE /api/aigc/digital-persons` 与 `GET /api/aigc/digital-persons/{id}`、`GET /api/aigc/digital-persons/{id}/refresh`。
- 重建数字人创建弹窗字段，使其与真实创建契约一致：名称、训练素材文件或远程 `fileUrl`、训练类型、语种、错误帧跳过等，而不是继续使用当前 mock 的性别/风格/音色假字段。
- 新增数字人详情页，用于承接单个数字人的训练状态、进度、预览图、预览视频、失败原因和刷新动作，保证刷新页面后仍能恢复上下文。
- 抽取数字人领域最小公共能力，包括接口类型、状态映射、表单适配和 React Query hooks，避免把状态判断和 multipart 提交逻辑散落到页面 JSX 中。
- 补齐数字人管理相关路由、动态菜单映射和测试，确保它能在现有工作台路由体系里稳定访问。

## Capabilities

### New Capabilities
- `digital-human-management-flow`: 提供数字人形象的创建、分页查询、详情查看、状态刷新和删除闭环能力。

### Modified Capabilities

无。

## Impact

- 前端页面：
  - `src/pages/DigitalHumansPage.tsx`
  - 新增 `src/pages/DigitalHumanDetailPage.tsx`
- 前端接口层：
  - 新增 `src/api/aigc/digital-persons/index.ts`
  - 新增 `src/api/aigc/digital-persons/types.ts`
- 数字人领域支持层：
  - 新增 `src/features/digital-human/*`
- 路由层：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 测试与文档：
  - 数字人 API、feature、页面与路由测试
  - `doc/2026-06-23-digital-human-management-progress.md`
