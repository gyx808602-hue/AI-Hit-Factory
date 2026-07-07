## Context

当前项目使用 React 19、React Router 7、TypeScript、Ant Design、TailwindCSS 和 TanStack Query。路由表 `routeRegistry.tsx` 已经存在 `meta.cache`，动态菜单映射 `dynamicRoutes.ts` 也已经能把后端 `keepAlive` 合并为前端 `cache`。这说明“页面是否允许缓存”的元信息已经具备，但 `App.tsx` 当前仍然直接渲染 `<Routes>`，路由切换时旧页面组件会被卸载。

上一轮 `split-view-pages-by-feature` 已经把多个大页面按领域下沉到 `features/*`，但这只是第一层结构治理。后续还需要补齐两个能力：

- 页面实例缓存：让列表/统计类页面切换回来时保留筛选、分页、滚动和局部 UI 状态。
- 组件质量治理：让页面、feature 组件、shared 组件有更清楚的职责说明和判断标准，避免代码“拆了但仍然难读”。

## Goals / Non-Goals

**Goals:**

- 用 React Router `useOutlet` 建立轻量页面缓存出口，复用现有 `route.meta.cache` 和运行时 `availableRoutes`。
- 让 `meta.cache: true` 的列表/统计页保留组件实例，`cache: false` 的新增/详情/登录/错误页继续正常卸载。
- 为后续 `tagsView` 预留缓存删除能力，关闭标签时能按 `route.key` 销毁对应页面实例。
- 在组件文件中补充必要的中文说明，解释组件职责、边界和放置目录原因。
- 继续把页面文件控制在“路由级编排”角色，复杂领域 UI 放到 `features/<module>`，稳定跨领域能力才进入 `shared`。
- 建立可执行的页面/组件质量检查清单，后续每个页面按清单小批量优化。

**Non-Goals:**

- 不引入第三方 keep-alive 库。
- 不一次性实现完整 `tagsView` UI。
- 不把 React Query 接口数据复制进页面缓存或全局状态。
- 不改变后端菜单、权限、API Client、React Query hooks 或 query key 契约。
- 不为了减少行数机械拆分所有 JSX，也不创建 `BaseForm/BaseTable/BaseModal` 这类大而全组件。

## Decisions

### Decision 1: 使用 `useOutlet` 作为页面缓存入口

推荐把受保护页面的渲染改造成嵌套路由结构，让 Dashboard 工作区布局内通过 `useOutlet()` 拿到当前子路由页面元素，再交给 `KeepAliveOutlet` 管理。

Why：`useOutlet()` 返回的是当前匹配子路由已经生成好的 React 元素。它天然适合放在布局出口层，做“当前页面显示，旧页面隐藏但不卸载”。相比在 `App.tsx` 中手动缓存 `<Routes>` 的返回结果，`useOutlet` 更贴近 React Router 的模型，后续接入 `tagsView`、嵌套路由和布局拆分时也更清晰。

备选方案是保留当前 `<Routes>` 写法，新增 `CachedRoutes` 手动匹配并缓存页面元素。该方案改动更小，但会继续让路由匹配、布局渲染和缓存逻辑耦合在 `App.tsx`，后续维护成本更高。因此本 change 推荐直接整理为布局路由 + `useOutlet`。

### Decision 2: 缓存 key 使用 `route.key`，缓存开关使用运行时 `route.meta.cache`

缓存容器必须基于运行时 `availableRoutes` 匹配当前 pathname，而不是只读取静态 `routeRegistry`。缓存 key 使用 `route.key`，因为它是静态注册表、动态菜单、activeMenuKey 和后续 tagsView 都能共同识别的稳定身份。

Why：动态路由下，真正可访问的路由来自“静态注册表 + 后端菜单权限 + 前端权限过滤”的运行时结果。只看静态路由表会绕开权限；只看 pathname 会让动态详情页参数复杂化。`route.key` 能表达页面身份，`route.meta.cache` 能表达是否允许缓存，二者职责清楚。

### Decision 3: 只缓存页面组件实例，不缓存接口数据

KeepAlive 只负责保留 React 组件树、局部 UI 状态和 DOM 状态。接口数据仍由 TanStack Query 管理，新鲜度、失效、重试和后台刷新不放进页面缓存。

Why：页面缓存类似“把前端房间暂时关灯但不拆掉”，React Query 类似“服务端数据缓存”。两者不能混用。若把接口数据也放进页面实例缓存，权限变化、后台数据变化、企业空间切换时容易显示过期数据。

知识点拨：后端里的缓存通常也分层，例如网关缓存、应用缓存、数据库缓存各管各的。前端也是一样：页面实例缓存管 UI 上下文，React Query 管接口数据。把两者混在一起，就像让数据库连接池顺便管用户页面滚动位置，职责会乱。

### Decision 4: 详情页、新增页和错误页默认不缓存

`/xxx/:id` 详情页、创建页、登录页、403/404、隐藏且带业务上下文的页面默认 `cache: false`。列表页、统计页、普通管理页可以 `cache: true`。

Why：详情页依赖业务 ID，同一个 route key 可能对应不同参数。如果缓存实例，很容易出现“进入 A 详情后再进 B 详情仍残留 A 状态”的问题。新增页也不应保留草稿脏数据，除非以后单独设计草稿保存能力。

### Decision 5: 为 tagsView 预留缓存控制接口，但不实现完整标签栏

缓存容器暴露按 route key 删除缓存、清空全部缓存的能力。未来 tagsView 只需要在关闭标签时调用删除缓存；退出登录、权限刷新、账号/企业空间切换时调用清空缓存。

Why：tagsView 不只是顶部 UI，也会成为页面缓存生命周期的可视化控制器。先把缓存删除能力设计好，后续加 UI 时不会反向重构缓存底层。

### Decision 6: 组件优化按“说明 + 边界 + 必要拆分”推进

每个被优化的 feature 组件文件需要补充少量中文说明，说明：

- 这个文件承接哪个业务页面的展示/交互。
- 页面层仍负责什么。
- 为什么暂时放在 feature，而不是 shared。
- 哪些状态或请求不应该进入该组件。

组件继续拆分时只拆真实边界：输入区、筛选区、列表区、详情抽屉、上传预览、状态映射等。单纯为了行数好看而把 10 行 JSX 抽成组件不做。

Why：你说“我是外行都觉得一般”，本质不是行数，而是读者看不出代码分工。注释和边界说明能帮助外行先建立地图；合理拆分能降低阅读负担；过度拆分反而会让读者在文件之间来回跳。

### Decision 7: Ant Design 继续承担当下主要交互

后续组件质量优化时，表单、上传、表格、分页、弹窗、确认、加载、空状态优先使用 Ant Design；Tailwind 继续用于布局、间距、响应式和局部视觉微调。

Why：Ant Design 已经提供可访问性、键盘交互、loading/disabled/error 状态。手写控件看起来短，但长期会在交互一致性上欠债。

## Risks / Trade-offs

- [Risk] 改造为嵌套路由可能影响当前权限拦截和菜单高亮 → Mitigation：先补 App 路由回归测试，再重构渲染结构，保持 `resolveRouteAccess`、`resolveActiveMenuRoute`、`availableRoutes` 逻辑不变。
- [Risk] KeepAlive 隐藏页面后仍保留定时器或轮询 → Mitigation：第一阶段只缓存列表/统计页；对带轮询的页面单独检查可见性逻辑，必要时保持 `cache: false`。
- [Risk] 缓存页面绕过权限变化 → Mitigation：当动态菜单结果、登录状态、账号/企业空间上下文变化时清空缓存，并继续在路由守卫层校验当前 routeAccess。
- [Risk] 组件继续拆分导致文件数量过多 → Mitigation：每次拆分必须说明职责边界和复用/降复杂原因；不创建无业务语义 wrapper。
- [Risk] 给所有组件补注释导致噪声增加 → Mitigation：只在文件顶部、复杂适配逻辑和边界容易误解处写中文注释，不解释显而易见的赋值。

## Migration Plan

1. 先补充 `route-keepalive` 相关测试，覆盖缓存页切换保留实例、非缓存页切换卸载、权限/退出登录清空缓存。
2. 新增 `KeepAliveOutlet` 或等价路由缓存组件，并把受保护路由改为 Dashboard 布局下的嵌套路由出口。
3. 保持登录页、403、404 继续走普通渲染，不进入缓存池。
4. 对已拆分的 feature 组件文件补充边界说明，优先处理数字人、音色、积分、图文生成视频、视频追爆详情。
5. 扫描当前页面和 feature 组件行数、props 数量、native 控件和重复区块，列出第一批继续优化页面。
6. 每批只优化 1 到 2 个页面，跑对应定向测试、`npm run typecheck` 和 OpenSpec strict 校验。

Rollback 策略：页面缓存改造集中在 app/router 和 App 路由结构中。如果出现路由行为回归，可以暂时切回原 `<Routes>` 渲染方式，同时保留组件质量文档和 feature 组件说明。

## Open Questions

- `tagsView` 是否在本 change 后立即实现 UI，还是只保留缓存控制接口后另开 change？
- 带轮询的任务列表页是否全部允许缓存，还是按页面单独确认？
- 是否需要为页面复杂度设置硬性阈值，例如页面文件超过 250 行必须审计，超过 400 行必须拆分计划？
