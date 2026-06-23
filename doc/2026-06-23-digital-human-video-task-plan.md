# 数字人视频任务实现计划

> **目标**：按现有仓库风格接入数字人视频任务列表、创建、详情、删除、刷新链路，并完成页面参数到真实接口字段的映射。

## 1. 实现范围

- 新增数字人视频任务 API 模块：
  - `GET /api/aigc/digital-person-videos`
  - `POST /api/aigc/digital-person-videos`
  - `GET /api/aigc/digital-person-videos/{id}`
  - `DELETE /api/aigc/digital-person-videos/{id}`
  - `GET /api/aigc/digital-person-videos/{id}/refresh`
- 新增数字人视频任务领域层：
  - 状态映射
  - 创建表单默认值
  - 表单校验
  - 前端表单到后端请求参数映射
  - React Query hooks 与缓存更新
- 新增页面：
  - 列表页
  - 创建弹窗
  - 详情页
- 新增路由注册与动态路由映射。

## 2. 文件规划

- 新增：
  - `src/api/aigc/digital-person-videos/types.ts`
  - `src/api/aigc/digital-person-videos/index.ts`
  - `src/api/aigc/digital-person-videos/index.test.ts`
  - `src/features/digital-human-video/form.ts`
  - `src/features/digital-human-video/form.test.ts`
  - `src/features/digital-human-video/status.ts`
  - `src/features/digital-human-video/status.test.ts`
  - `src/features/digital-human-video/hooks.ts`
  - `src/features/digital-human-video/hooks.test.ts`
  - `src/pages/DigitalHumanVideoTasksPage.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.test.tsx`
  - `src/pages/DigitalHumanVideoTaskDetailPage.tsx`
  - `src/pages/DigitalHumanVideoTaskDetailPage.test.tsx`
- 修改：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.ts`
  - `src/app/router/dynamicRoutes.test.ts`
  - `doc/2026-06-23-digital-human-video-task-progress.md`

## 3. 分步任务

### 第一批：底层契约

1. 先写 `digital-person-videos` API 单测。
2. 实现 API 类型与请求封装。
3. 运行 API 定向测试，确认分页与创建参数映射正确。

### 第二批：领域逻辑

1. 先写表单映射与状态映射测试。
2. 实现默认值、校验、字段转换、状态展示。
3. 先写 hooks 测试，再实现 query keys、缓存更新与 mutation。

### 第三批：页面与路由

1. 先写路由测试，补 route key、route registry、dynamic route map。
2. 先写列表页测试，覆盖：
   - 列表查询
   - 状态筛选
   - 打开创建弹窗
   - 表单校验
   - 创建成功后的详情跳转
3. 先写详情页测试，覆盖：
   - 详情展示
   - 刷新动作
   - 删除动作
   - 失败态提示
4. 实现页面代码并跑定向测试。

### 第四批：最终验证

1. 运行本功能相关全部定向测试。
2. 运行 `npm run typecheck`。
3. 如无阻塞，再视情况运行 `npm run build`。

## 4. 当前实现策略

- 页面风格复用当前 `PageShell + MetricCard + StatusPill + Ant Design Modal`。
- 创建弹窗先覆盖真实主字段，非必要字段走接口默认值：
  - 必做：`name`、`personId`、`type`
  - TTS 主字段：`text`、`customAudioId`
  - audio 主字段：`wavUrl`
  - 画布字段：`screenWidth`、`screenHeight`、`x`、`y`、`personWidth`、`personHeight`
  - 背景字段：`bgColor`、`rgbaMode`
  - TTS 参数：`speed`、`pitch`、`volume`、`language`
  - 高级字段：`model`、`addComplianceWatermark`、`resolutionRate`
- 复杂但文档信息不足的对象先做最小可信映射：
  - `bg` 仅在上传或填写背景图后提交
  - `subtitleConfig` 先传最小结构或不传，优先保证主链路稳定

## 5. 验证命令

- `npm test -- src/api/aigc/digital-person-videos/index.test.ts`
- `npm test -- src/features/digital-human-video/form.test.ts src/features/digital-human-video/status.test.ts src/features/digital-human-video/hooks.test.ts`
- `npm test -- src/pages/DigitalHumanVideoTasksPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
- `npm run typecheck`
