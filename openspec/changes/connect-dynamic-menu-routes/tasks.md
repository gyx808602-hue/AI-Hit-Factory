## 1. 前置阅读与现状确认

- [ ] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md`、`specs/dynamic-menu-routes/spec.md`。
- [ ] 1.2 确认 `src/api/system/menus/index.ts` 中 `getCurrentUserRoutes()` 是否仍请求 `/api/v1/menus/routes`。
- [ ] 1.3 扫描 `src/app/router`、应用壳侧边栏和当前路由渲染入口，记录动态路由需要接入的最小文件范围。

## 2. 类型定义与 API 契约

- [ ] 2.1 修正 `src/api/system/menus/types.ts` 中动态路由返回类型，使 `children` 能兼容真实数组、缺失值和异常值。
- [ ] 2.2 补充后端路由 meta 类型：`title`、`icon`、`hidden`、`keepAlive`、`alwaysShow`、`params`。
- [ ] 2.3 保持 `getCurrentUserRoutes()` 作为唯一 API Client 入口，不在页面或组件中直接拼接 `/api/v1/menus/routes`。

## 3. 动态路由白名单与转换器

- [ ] 3.1 在 `src/app/router` 邻近位置新增后端 `component` 标识到前端 `RouteKey` 的白名单映射。
- [ ] 3.2 实现动态路由转换器：递归处理后端路由树，输出可访问路由集合和侧边栏菜单树。
- [ ] 3.3 转换器必须过滤未知 `component`，并避免执行任何基于后端字符串的动态 import。
- [ ] 3.4 转换器必须处理 `meta.hidden`、`meta.keepAlive`、`meta.alwaysShow`、`meta.params` 和 `redirect`。
- [ ] 3.5 外链 `redirect` 必须识别为外部导航，不能注册成 React Router 内部路径。

## 4. React Query 与应用初始化

- [ ] 4.1 新增 `useCurrentUserRoutes` 或等价 hook，通过 React Query 管理动态菜单接口数据。
- [ ] 4.2 登录态存在时，受保护路由渲染前必须先加载动态菜单并完成转换。
- [ ] 4.3 动态菜单加载中显示 loading/skeleton 兜底，避免提前显示 403/404。
- [ ] 4.4 动态菜单加载失败且判断为登录过期时，清理会话并进入登录或登录过期流程。
- [ ] 4.5 登录、退出、企业空间或角色上下文变化时，必须让动态菜单 query 失效并重新获取。

## 5. 应用壳、菜单和路由装配

- [ ] 5.1 将侧边栏菜单来源从纯静态配置切换为动态转换结果，并保留静态 fallback。
- [ ] 5.2 将 React Router 可访问路由来源接入动态转换结果，刷新业务页面时不能直接落到 404。
- [ ] 5.3 未登录访问 `requiresAuth: true` 路由时，必须跳转到 `/login?redirect=<当前路径>`，并保留登录后回跳能力。
- [ ] 5.4 登录失效事件触发后，必须清理会话并统一跳转到登录页，同时保留来源路径用于重新登录后恢复。
- [ ] 5.5 无权限访问已知业务路由时显示 403；访问不存在路径时显示 404。
- [ ] 5.6 隐藏菜单项不得显示在侧边栏，但映射成功的隐藏路由仍可按权限访问。
- [ ] 5.7 检查组件拆分边界，不新增无复用价值的大型通用 Route/Menu 组件。

## 6. 测试与验证

- [ ] 6.1 为动态路由转换器新增单元测试，覆盖已知组件映射、未知组件过滤、异常 children 归一化、隐藏菜单、keepAlive 映射和外链 redirect。
- [ ] 6.2 为动态菜单初始化或路由恢复补充测试，覆盖刷新受保护页面时先加载菜单再渲染目标页。
- [ ] 6.3 补充路由跳转级测试，覆盖未登录访问受保护页跳转到 `/login`、登录后按 `redirect` 回跳、登录失效事件触发后跳转到登录页。
- [ ] 6.4 运行 `npm run typecheck`，确保动态路由类型无错误。
- [ ] 6.5 运行 `npm test`，确保新增与既有测试通过。
- [ ] 6.6 运行 `npm run build`，确保生产构建通过。
- [ ] 6.7 手动或浏览器验证登录态下动态菜单渲染、刷新恢复、未登录跳登录页、登录失效跳登录页、未知路由 404、无权限 403、隐藏菜单和外链 redirect 行为。
- [ ] 6.8 完成后更新 `doc/progress.md`，记录实现内容、验证结果、剩余风险和下一步。
