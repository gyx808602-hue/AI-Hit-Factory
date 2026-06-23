## Why

当前前端 API 层已经存在 `GET /api/v1/menus/routes` 调用，但应用路由和侧边栏仍主要依赖本地静态配置，尚未把后端菜单权限结果接入到 React 路由生成链路中。为了对接动态路由，需要先固定后端返回结构、前端转换规则和权限边界，避免后端返回的组件路径被前端直接动态 import。

## What Changes

- 新增动态菜单路由对接任务，消费 `GET /api/v1/menus/routes` 返回的路由树。
- 将后端返回的 Youlai/Vue 风格字段转换为当前 React 前端可使用的菜单树和可访问路由集合。
- 明确 `component: "system/user/index"` 这类后端组件标识只作为路由白名单映射线索，不直接作为 React 动态 import 路径。
- 建立后端 `component`/`name`/`path` 与前端静态 `RouteKey -> component` 注册表的映射策略。
- 接入 `meta.title`、`meta.icon`、`meta.hidden`、`meta.keepAlive`、`meta.alwaysShow`、`meta.params` 等元数据，用于侧边栏、页面缓存和路由守卫。
- 覆盖登录后加载、刷新恢复、未知组件降级、隐藏菜单、重定向、403/404 等验收场景。

## Capabilities

### New Capabilities

- `dynamic-menu-routes`: 对接 `/api/v1/menus/routes`，将后端菜单路由树转换为 React 前端动态菜单、可访问路由和页面缓存元数据。

### Modified Capabilities

- 无。

## Impact

- 前端 API：复用并修正 `src/api/system/menus/index.ts` 和 `src/api/system/menus/types.ts` 中的动态路由接口类型。
- 前端路由：影响 `src/app/router/*`，需要新增后端路由树到静态 route registry 的转换层。
- 应用壳：影响侧边栏菜单、刷新恢复、登录后初始化和无权限兜底。
- 状态管理：接口数据交给 React Query 管理；全局状态只保存必要的 UI/会话摘要。
- 后端/API：当前仓库未发现后端 Controller/Service 实现；本 change 先固定前端对接契约，后端必须保证返回结构稳定。
