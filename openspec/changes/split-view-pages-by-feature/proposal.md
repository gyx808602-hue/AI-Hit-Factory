## Why

当前 `src/pages` 中所有路由页面基本平铺在同一级目录，随着业务页面增多，查找、归属判断和路由维护都会变乱；同时多个页面文件还承担了页面编排、表单状态、弹窗、列表卡片、上传预览、状态派生和局部工具函数等多种职责，已经出现 400 行以上页面较多、详情页超过 1500 行的维护压力。现在需要先按业务领域整理 `pages` 目录，再把页面内部稳定功能下沉到对应 `features/<module>`，降低后续页面迭代和测试成本。

## What Changes

- 为 `src/pages` 建立领域分组规则，避免所有页面继续平铺在同一级目录。
- 为现有 view/page 文件建立拆分规则：页面只保留路由级编排、数据装配和跨区块协调；业务区块、表单弹窗、列表卡片、状态派生、上传预览等放入对应 feature 文件。
- 优先拆解体量大、职责混合明显的页面：
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.tsx`
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/LoginPage.tsx`
  - `src/pages/CustomisedAudiosPage.tsx`
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/PointsUsageStatisticsPage.tsx`
- 建立推荐落位：
  - 路由入口按业务领域放入 `src/pages/<domain>/*Page.tsx`，例如 `content`、`digital-human`、`points`、`auth`、`workspace`、`system`。
  - `src/pages/index.ts` 可作为可选聚合出口，帮助路由注册表减少深层路径噪音。
  - 领域组件放入 `src/features/<module>/components/*`。
  - 领域 hooks、状态映射、表单模型、常量和工具函数放入对应 feature 邻近文件。
  - 只有跨 2 个以上真实业务场景稳定复用的纯 UI 能力才提升到 `src/shared/components`。
- 同步调整 `src/app/router/routeRegistry.tsx` 的 lazy import 路径和页面测试路径，但不改变 URL path、route key、route meta、权限模型、API 契约、React Query key、缓存策略和用户可见业务行为。
- 拆分过程需要同步调整测试导入路径，并补充关键回归测试，确保移动文件不变行为。

## Capabilities

### New Capabilities

- `view-page-feature-decomposition`: 约束 `src/pages` 先按业务领域分组，再将页面内部功能按边界拆分到 page、feature 和 shared 层，并规定可验收的页面职责、目录归属、测试和行为保持要求。

### Modified Capabilities

- 无。本 change 是前端工程结构与可维护性优化，不修改已有业务能力的用户需求契约。

## Impact

- 影响范围主要是前端文件组织和测试路径：
  - `src/pages/**/*.tsx`
  - `src/pages/**/*.test.tsx`
  - `src/app/router/routeRegistry.tsx`
  - `src/features/digital-human/**`
  - `src/features/digital-human-video/**`
  - `src/features/video-remix/**`
  - `src/features/text-image-video/**`
  - `src/features/points/**`
  - 必要时少量涉及 `src/shared/components/**`
- 不新增 npm 依赖，不引入新的状态管理库或 UI 框架。
- 不变更后端接口、API Client 契约、动态路由注册表和权限数据结构。
- 需要运行目标页面测试、相关 feature 单测、`npm run typecheck` 和 OpenSpec strict 校验。
