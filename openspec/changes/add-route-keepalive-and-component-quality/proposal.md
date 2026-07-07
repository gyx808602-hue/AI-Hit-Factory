## Why

当前项目已经完成 pages 按领域迁移和部分大页面拆分，但路由层仍然在切换页面时卸载组件实例，导致列表页返回后筛选、分页、滚动和局部 UI 状态容易丢失；同时部分新拆出的 feature 组件虽然降低了页面行数，但还缺少统一的组件说明、边界约束和二次优化标准。

现在补上页面组件实例缓存和组件质量治理，可以让后续 `tagsView`、动态路由和页面重构都有清晰基线，避免继续出现“页面不算大但读起来仍然散”的问题。

## What Changes

- 新增基于 React Router `useOutlet` 的页面实例缓存能力，优先服务 `meta.cache: true` 的列表/统计类页面。
- 明确详情页、新增页、登录页、403/404 和带业务 ID 的动态详情页默认不缓存。
- 为后续 `tagsView` 预留按 `route.key` 移除缓存的能力：标签存在时保留实例，标签关闭后销毁实例，再进入页面重新挂载并重新请求。
- 基于运行时 `availableRoutes` 和 `route.key` 决定缓存，不绕开现有动态菜单、权限过滤和静态组件映射。
- 增加组件质量治理规则：页面文件只做路由级编排，feature 组件承接领域 UI，shared 只放稳定跨场景能力。
- 为当前已拆分组件补充描述性注释和边界说明，重点解释“这个组件负责什么、不负责什么、为什么放在 feature 而不是 shared”。
- 对过长或职责仍混杂的页面/组件进行小批量优化，但禁止为了行数机械拆分、过度 wrapper 或大而全 `Base*` 抽象。

## Capabilities

### New Capabilities

- `route-keepalive`: 基于路由元信息的页面组件实例缓存、缓存清理和后续 tagsView 生命周期预留。
- `component-quality`: 组件职责说明、页面复杂度控制、feature/shared 归属边界和组件二次优化验收规则。

### Modified Capabilities

- 无。本 change 新增路由缓存和组件质量治理能力，不修改既有业务能力规格。

## Impact

- 主要影响前端基础设施与页面结构：
  - `src/app/App.tsx`
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - 可能新增 `src/app/router/KeepAliveOutlet.tsx` 或 `src/app/router/RouteKeepAliveProvider.tsx`
  - `src/app/layouts/DashboardLayout.tsx`
  - 已拆分的 `src/features/**/components*.tsx`
  - 当前较大的 `src/pages/**/*.tsx`
- 不新增后端接口，不改变现有 API Client、React Query hooks、query key 和权限接口契约。
- 不引入新的 UI 框架、状态库或页面缓存依赖。
- 需要补充路由缓存测试、缓存清理测试、组件边界/页面复杂度回归测试。
