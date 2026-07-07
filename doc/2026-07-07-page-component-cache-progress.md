# 2026-07-07 页面组件实例缓存进展

## 已完成

- 已确认用户需求是“整个页面组件实例缓存”，不是接口数据缓存，也不是本地持久化缓存。
- 已确认排除范围：详情页、新增页不需要缓存。
- 已扫描当前项目技术栈：Vite + React 19 + React Router 7 + TypeScript + Ant Design + TanStack Query。
- 已确认当前项目已有路由元信息 `meta.cache`，列表类页面多为 `cache: true`，详情页多为 `cache: false` 且 `hideInMenu: true`。
- 已确认当前渲染入口在 `src/app/App.tsx`，当前页面通过 `<Routes>` 匹配后作为 `DashboardLayout` 的 children 渲染。

## 当前判断

- 当前项目不是 Vue，不能直接使用 Vue `KeepAlive`。
- React Router 默认切换路由会卸载旧页面组件，因此如果要保留整个页面实例，需要在路由出口层增加缓存容器，让 `meta.cache: true` 的页面保持挂载，只切换显示/隐藏。
- 详情页、新增页应继续走普通路由渲染，不进入缓存池，避免表单脏数据、详情 ID 串页、权限状态残留等问题。
- 建议优先复用已有 `route.meta.cache`，新增一个轻量 `KeepAliveOutlet` 或 `CachedRoutes` 组件，不引入大型状态库或复杂路由重构。

## 下一步

1. 等待用户确认是否开始执行。
2. 若开始执行，先补充路由缓存行为测试，再实现缓存容器。
3. 修改范围预计集中在 `src/app/App.tsx`、`src/app/router/routeTypes.ts`、新增 `src/app/router/CachedRoutes.tsx` 以及对应测试文件。

## 验证结果

- 尚未执行代码修改。
- 尚未执行测试命令。
- `doc/progress.md` 当前存在非 UTF-8 内容，无法通过 `apply_patch` 安全追加；本次进展先记录到专题文档。

## 方案补充：动态路由影响

### 已完成

- 已补充分析后续动态路由场景下的页面缓存方案。
- 已明确动态路由下不能把缓存逻辑写死到静态 `routeRegistry`，应基于运行时最终可访问的 `availableRoutes` 和 `route.key` 工作。

### 当前判断

- 动态路由下真正的难点不是“能不能缓存组件”，而是缓存 key、权限变化、菜单刷新、账号切换后的缓存清理。
- 推荐使用 `route.meta.cache` 作为缓存开关，使用 `route.key` 作为缓存实例 key。
- 详情页、带业务 ID 的页面、新增页继续 `cache: false`，避免不同参数页面复用同一个旧实例造成串数据。
- 如果后端动态菜单未来也返回缓存配置，前端应先做白名单映射校验，再合并到本地路由 meta，不能完全信任任意后端 path/component 字段。

### 下一步

1. 若开始执行，缓存容器需接收运行时 `availableRoutes`，而不是直接引用静态路由表。
2. 增加权限或用户维度的缓存作用域，账号变化、菜单变化、退出登录时清空缓存。
3. 后续如引入标签页导航，可把页面实例缓存和标签页关闭行为联动。

## 方案补充：TagsView 与页面缓存生命周期

### 已完成

- 已补充说明后续顶部 `tagsView` 与页面组件实例缓存的关系。
- 已明确推荐规则：顶部标签存在时，对应可缓存页面实例保留；顶部标签关闭时，对应缓存实例销毁。

### 当前判断

- `tagsView` 不只是顶部导航 UI，也可以作为页面缓存生命周期的可视化控制器。
- 推荐将 `openedTags` 作为用户可见的页面集合，将 `cachedRouteKeys` 作为实际保留组件实例的集合。
- 对于 `meta.cache: true` 的列表页，打开标签后进入缓存池；关闭标签后从缓存池移除，下次进入页面重新挂载并重新请求。
- 对于详情页、新增页、登录页、403/404，默认不进入缓存池；即使有标签，也不保留组件实例。

### 下一步

1. 如后续实现 `tagsView`，路由元信息可补充 `hideInTagsView`、`affixTag` 等字段。
2. 缓存容器需要暴露按 `route.key` 移除缓存的能力，供关闭标签时调用。
3. 退出登录、切换账号、权限刷新时，应同时清空标签集合和缓存集合。

## 代码讲解补充

### 已完成

- 已补充页面缓存与 `tagsView` 的代码级说明。
- 已明确推荐通过 `route.meta.cache` 判断是否缓存，通过 `route.key` 管理标签和缓存实例。

### 当前判断

- 当前阶段更适合先理解核心代码模型：`RouteMeta` 扩展、`TagsViewProvider` 管标签、`CachedRoutes` 管页面实例。
- 真正实现时应结合现有 `App.tsx` 的 `availableRoutes`、权限状态和退出登录逻辑接入。

### 下一步

1. 若用户确认开始执行，再落地真实代码和测试。
2. 代码落地时优先保证关闭标签会删除缓存实例，再次进入页面会重新挂载并重新请求。

## 代码讲解补充：useOutlet 方案

### 已完成

- 已补充 `useOutlet` 在 React Router 页面缓存中的作用说明。
- 已明确 `useOutlet` 更适合基于嵌套路由的布局出口缓存；当前项目如果继续手写 `<Routes>`，也可以先用自定义 `CachedRoutes`。

### 当前判断

- `useOutlet()` 返回的是当前子路由已经匹配好的 React 元素，适合在布局组件里拿到“当前页面元素”后放进缓存池。
- 如果项目改造成 React Router 嵌套路由结构，`DashboardLayout` 内部可以通过 `useOutlet()` 接收子页面，再做 keep-alive。
- 当前项目现在是在 `App.tsx` 中手写 `<Routes>` 并把结果作为 `DashboardLayout` 的 children，因此不是天然的 `useOutlet` 结构；要使用 `useOutlet` 需要先调整路由组织方式。

### 下一步

1. 若保持当前路由结构，优先实现 `CachedRoutes`，改动更小。
2. 若后续同时做动态路由、tagsView、布局嵌套规范化，可以考虑重构为 `DashboardLayout + Outlet + useOutlet` 的结构。
---

## OpenSpec 新增：页面缓存与组件质量治理

### 已完成
- 已创建新的 OpenSpec change：`add-route-keepalive-and-component-quality`。
- 已新增并完成以下文档：
  - `openspec/changes/add-route-keepalive-and-component-quality/proposal.md`
  - `openspec/changes/add-route-keepalive-and-component-quality/design.md`
  - `openspec/changes/add-route-keepalive-and-component-quality/tasks.md`
  - `openspec/changes/add-route-keepalive-and-component-quality/specs/route-keepalive/spec.md`
  - `openspec/changes/add-route-keepalive-and-component-quality/specs/component-quality/spec.md`
- 已明确缓存方案采用 React Router `useOutlet`，通过布局路由出口缓存页面组件实例。
- 已明确缓存规则：列表/统计类页面按 `meta.cache: true` 缓存；详情页、新增页、登录页、403/404 默认不缓存。
- 已明确后续 `tagsView` 只作为缓存生命周期控制入口预留，本 change 先做缓存底层和清理能力，不直接实现完整标签栏 UI。
- 已明确组件质量优化规则：页面负责编排，feature 组件负责领域 UI，shared 只放稳定跨领域组件；禁止为了行数机械拆分或创建大而全 wrapper。

### 当前判断
- 当前项目已经有 `route.meta.cache` 和动态菜单 `keepAlive -> cache` 映射，具备实现页面实例缓存的基础。
- 真正需要落地的是 `KeepAliveOutlet`、嵌套路由出口、缓存清理机制和对应回归测试。
- 组件优化不应该继续盲目拆文件，而应先补组件说明，再按页面复杂度和职责混杂程度分批处理。

### 下一步
- 等待用户确认“开始执行”。
- 若确认执行，第一批先实现 route keep-alive 测试和缓存出口，不先大面积改组件。
- 缓存通过后，再处理 feature 组件文件说明和第一批组件质量优化。

### 验证结果
- `cmd /c openspec validate add-route-keepalive-and-component-quality --strict`：通过。
- `cmd /c openspec status --change add-route-keepalive-and-component-quality`：4/4 artifacts complete。

---

## 2026-07-07 执行阶段：基线扫描

### 已完成

- 已按 `add-route-keepalive-and-component-quality` 读取 OpenSpec 执行指令、方案、设计、规格和任务清单。
- 已检查缓存落点相关文件：
  - `src/app/App.tsx`
  - `src/app/layouts/DashboardLayout.tsx`
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 已确认当前路由仍由 `App.tsx` 手写 `<Routes>` 后作为 `DashboardLayout` 的 `children` 渲染，后续要改成布局路由 + `useOutlet` 才适合做页面实例缓存。
- 已统计当前较大的页面/组件文件，首批重点仍是已经拆分出的 feature 组件说明与边界优化：
  - `src/pages/content/VideoRemixTaskDetailPage.tsx`：约 1135 行
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.tsx`：约 825 行
  - `src/pages/auth/LoginPage.tsx`：约 480 行
  - `src/features/points/components.tsx`：约 436 行
  - `src/features/digital-human/components.tsx`：约 392 行
  - `src/features/digital-human/audio/components.tsx`：约 340 行
- 已确认本次页面缓存不新增第三方依赖、不新增后端 API、不新增全局状态库。

### 当前判断

- 页面缓存应优先落在 `src/app/router`，由运行时 `availableRoutes`、`route.key` 和 `route.meta.cache` 共同决定。
- 动态路由映射已经把后端 `keepAlive` 合并为前端 `cache`，缓存层不能只读静态 `routeRegistry`。
- 当前工作区存在大量既有改动和旧页面删除记录，本次只做当前 change 范围内的增量修改，不回滚任何历史改动。

### 下一步

1. 先补 route keep-alive 行为测试。
2. 再新增 `KeepAliveOutlet`，并把受保护页面渲染调整为布局路由 + `useOutlet`。
3. 缓存通过后，再补 feature 组件说明与第一批小范围组件质量优化。

### 验证结果

- 本阶段只做基线扫描与任务勾选，尚未运行新增测试。
- `doc/progress.md` 存在历史编码显示问题，本阶段继续优先记录到本专题进展文档，避免整体重写造成更大风险。

---

## 2026-07-07 执行阶段：页面实例缓存落地

### 已完成

- 新增 `src/app/router/KeepAliveOutlet.tsx`：
  - 使用 `useOutlet()` 接收当前子路由页面元素。
  - 使用 `useLocation()` + `matchRoutes()` 从运行时 `availableRoutes` 匹配当前路由。
  - 使用 `route.key` 作为缓存实例 key。
  - 使用 `route.meta.cache` 控制是否缓存。
  - 非当前缓存页面通过 `display: none` 隐藏，但保持组件实例挂载。
  - 暴露 `clearKeepAliveRouteCache(routeKey)` 和 `clearAllKeepAliveRouteCaches()`，为后续 tagsView 关闭标签预留能力。
- 新增 `src/app/router/KeepAliveOutlet.test.tsx` 和 `vitest.route-keepalive-temp.config.ts`：
  - 覆盖缓存页离开后回来仍保留本地状态。
  - 覆盖非缓存页离开后正常卸载。
  - 覆盖运行时 `availableRoutes` 的 `cache` 元信息决定缓存行为。
  - 覆盖 `resetKey` 变化清空缓存。
  - 覆盖按 `route.key` 清理缓存。
- 已调整 `src/app/App.tsx`：
  - 将受保护页面改成 `DashboardLayout` 布局路由 + 子路由出口结构。
  - 将 `KeepAliveOutlet` 放到布局内部，正式使用 `useOutlet` 方案。
  - 退出登录时调用 `clearAllKeepAliveRouteCaches()` 清空受保护页面实例缓存。
  - 当运行时可访问路由的 key/path/cache 身份变化时，通过 `resetKey` 清空旧缓存。

### 当前判断

- 页面实例缓存已经按本次方案落到 app/router 基础层，不会替代 React Query 的接口数据缓存。
- 详情页、新增页只要保持 `meta.cache: false`，就不会进入缓存池。
- 后续 tagsView 只需要在关闭标签时调用 `clearKeepAliveRouteCache(routeKey)`，即可做到“关闭顶部标签后，下次进入页面重新挂载并重新请求”。
- `cmd /c npm test -- --config vitest.app-route-highlight-temp.config.ts` 当前失败，主要原因是现有 `routeRegistry.tsx` 中 `/assets`、`/tasks`、dashboard 等旧测试依赖路由已经被历史改动注释，页面进入 404；这不是本次缓存代码新增的类型错误，但后续需要单独整理 App 路由测试基线。

### 下一步

1. 给指定 feature 组件文件补充中文职责说明和边界说明。
2. 扫描组件质量候选，选择第一批最多两个模块做小优化。
3. 继续运行专项测试、typecheck 和 OpenSpec 校验。

### 验证结果

- `cmd /c npm test -- --config vitest.route-keepalive-temp.config.ts`：通过，1 个测试文件，5 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c npm test -- --config vitest.app-route-highlight-temp.config.ts`：未通过，11 个旧用例失败，失败页面为 404，原因待单独整理为旧路由测试基线问题。

---

## 2026-07-07 执行阶段：组件说明与最终验证

### 已完成

- 已给以下 feature 组件文件补充清晰的中文职责说明：
  - `src/features/digital-human/components.tsx`
  - `src/features/digital-human/audio/components.tsx`
  - `src/features/digital-human/video/components/listComponents.tsx`
  - `src/features/points/components.tsx`
  - `src/features/text-image-video/components.tsx`
  - `src/features/video-remix/components/detailComponents.tsx`
- 已确认本批优化没有把一次性业务组件提升到 `shared/components`。
- 已保留页面层职责：路由参数、React Query hooks、mutation、分页/筛选状态、删除确认和跳转仍在页面或容器边界。
- 已修复 `src/features/video-remix/components/detailComponents.tsx` 中几处历史乱码注释导致的 TSX 解析问题，并恢复关键按钮/标签文案：上一步、下一步、保存、已就绪、操作失败。
- 已完成 `openspec/changes/add-route-keepalive-and-component-quality/tasks.md` 全部任务勾选。

### 当前判断

- 本次组件质量优化以“说明边界 + 修复明显坏注释”为主，没有继续大拆文件，风险较小。
- 当前页面缓存底层已经具备后续 tagsView 联动能力，但 tagsView UI 本身仍应单独开 change 做。
- `doc/progress.md` 仍存在历史编码显示问题，本次继续使用专题文档记录，避免整体重写破坏旧内容。

### 下一步

1. 如继续推进，建议单独整理 `App.test.tsx` 的旧路由基线，让测试与当前 routeRegistry 保持一致。
2. 后续再做 tagsView 时，可直接复用 `clearKeepAliveRouteCache(routeKey)` 和 `clearAllKeepAliveRouteCaches()`。
3. 若要继续治理组件质量，建议一次只选 1 到 2 个页面，先补测试再拆稳定业务区块。

### 验证结果

- `cmd /c npm test -- --config vitest.route-keepalive-temp.config.ts`：通过，1 个测试文件，5 个用例通过。
- `cmd /c npm test -- --config vitest.video-remix-temp.config.ts`：通过，1 个测试文件，36 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate add-route-keepalive-and-component-quality --strict`：通过。
- `cmd /c npm test -- --config vitest.app-route-highlight-temp.config.ts`：未通过，11 个旧用例失败，当前判断为旧测试仍依赖已注释的 `/assets`、`/tasks`、dashboard 等路由入口，需要后续单独整理。

---

## 2026-07-07 补充：缓存注释与图文生视频新增入口恢复

### 已完成

- 已对 `src/app/router/KeepAliveOutlet.tsx` 补充中文注释，重点说明：
  - 为什么使用运行时 `availableRoutes`，而不是静态路由表。
  - 为什么只缓存页面组件实例，不缓存接口数据。
  - 为什么使用 `route.key` 和版本 key 管理缓存。
  - 为什么权限/菜单变化、退出登录、tagsView 关闭标签时需要清缓存。
- 已对 `src/app/App.tsx` 的缓存接入点补充中文注释，说明：
  - `routeCacheResetKey` 的作用。
  - 退出登录清空缓存的原因。
  - 为什么要用 `DashboardLayout + useOutlet` 的布局路由结构。
- 已对照大改前逻辑定位“图文生视频新增按钮不见”的根因：
  - 大改前 `/image-video` 是菜单入口。
  - 大改后 `/image-video` 被改成隐藏新增页，菜单入口变成 `/image-video/tasks`。
  - 但任务列表页没有补“新增视频”按钮，所以用户从菜单进入任务列表后找不到新增入口。
- 已在 `src/pages/content/TextImageVideoTasksPage.tsx` 增加“新增视频”按钮，点击跳转 `/image-video`。
- 已在 `src/pages/content/TextImageVideoTasksPage.test.tsx` 增加回归测试，锁定新增入口行为。

### 当前判断

- 图文生视频新增入口消失不是缓存导致的，而是页面/菜单职责切换后少补了任务列表入口。
- 保持 `/image-video` 为隐藏新增页是合理的；任务列表页显式提供“新增视频”按钮，更符合后续 tagsView 与列表缓存逻辑。

### 下一步

- 如果继续清理，应恢复 `ImageVideoPage.tsx` 和 `features/text-image-video/components.tsx` 中的历史乱码文案，避免页面可见文字异常。
- 后续若做 tagsView，可直接复用当前缓存清理接口。

### 验证结果

- `cmd /c npm test -- --config vitest.text-image-video-temp.config.ts src/pages/content/TextImageVideoTasksPage.test.tsx`：通过，1 个测试文件，6 个用例通过。
- `cmd /c npm test -- --config vitest.route-keepalive-temp.config.ts`：通过，1 个测试文件，5 个用例通过。
- `cmd /c npm run typecheck`：通过。
