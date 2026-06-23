## Context

当前仓库已经是 Vite + React + TypeScript 前端工程，并已封装系统菜单 API。`src/api/system/menus/index.ts` 中存在 `getCurrentUserRoutes()`，请求路径是 `GET /api/v1/menus/routes`。仓库内没有发现后端 Controller/Service 实现，因此本次 change 聚焦前端对接契约和实现任务。

用户提供的接口返回结构如下：

```json
{
  "code": "string",
  "data": [
    {
      "path": "user",
      "component": "system/user/index",
      "redirect": "https://www.youlai.tech",
      "name": "string",
      "meta": {
        "title": "string",
        "icon": "string",
        "hidden": true,
        "keepAlive": true,
        "alwaysShow": true,
        "params": {
          "additionalProp1": "string"
        }
      },
      "children": "string"
    }
  ],
  "msg": "string"
}
```

这里的结构明显偏 Vue/Youlai 动态路由风格。React 前端不能直接把 `component: "system/user/index"` 当成文件路径动态 import，而应该把它视为后端菜单标识，再映射到前端维护的静态 route registry。

## Goals / Non-Goals

**Goals:**

- 复用 `GET /api/v1/menus/routes`，并修正前端 TypeScript 类型以兼容真实返回结构。
- 新增后端路由树到前端菜单树、可访问路由集合、页面缓存 meta 的转换层。
- 建立 `backend component/name/path -> RouteKey -> React component` 的白名单映射。
- 登录后加载动态菜单；刷新页面时能先恢复菜单/路由再渲染目标页面。
- 支持 `meta.hidden`、`meta.keepAlive`、`meta.alwaysShow`、`redirect` 和 `meta.params`。
- 对未知组件、非法 children、空菜单、无权限路由提供明确降级。
- 为转换逻辑和路由恢复补充测试。

**Non-Goals:**

- 不实现后端 `/api/v1/menus/routes` 接口本身。
- 不实现完整账号体系、复杂 RBAC、企业空间角色切换和后端权限复核。
- 不让 React 前端根据后端 `component` 字段执行任意动态 import。
- 不重构所有页面结构；只围绕动态路由接入做必要改造。

## Decisions

### Decision 1: 后端组件字段只做白名单映射线索

前端新增一张映射表，例如：

```ts
const backendComponentRouteKeyMap = {
  "dashboard/index": "workspace.dashboard",
  "content/product-video/index": "content.productVideo",
  "system/user/index": "system.user",
} satisfies Record<string, RouteKey>;
```

Why：后端返回菜单权限，前端决定加载哪个已打包组件。这样既能让后台配置菜单，又不会让后台字符串控制前端构建产物。类比后端网关，配置可以决定请求能不能进某条路由，但不能让请求随意加载服务器上的任意类文件。

备选方案是直接 `import(component)`。这个方案看起来动态，但在 Vite/React 中构建不可控，也有安全边界问题：后端字符串一旦错误或被污染，前端就会白屏或加载非预期模块。

### Decision 2: 通过转换器隔离后端结构和前端路由结构

建议新增 `src/app/router/dynamicRoutes.ts` 或同级模块，负责：

- 递归清洗后端 `RouteItem[]`。
- 容错处理 `children`，当后端返回 `"string"`、`null` 或缺失时统一转成空数组。
- 过滤 `meta.hidden === true` 的侧边栏项，但保留必要的可访问路由。
- 将 `meta.keepAlive` 映射为前端 `cache`。
- 将 `meta.title`、`meta.icon`、`meta.params` 合并到前端 route meta。
- 根据 `redirect` 生成默认重定向行为，但拒绝把外链 redirect 当作内部 React route。

Why：后端 DTO 和前端路由模型不是同一个领域。转换器相当于前端的 adapter，类似后端把第三方 API 响应转换成内部领域对象，避免外部字段污染内部结构。

### Decision 3: React Query 管理菜单接口数据

动态菜单属于服务端数据，应该通过 React Query hook 管理，例如 `useCurrentUserRoutes()`。全局状态只保留侧边栏折叠、当前选中菜单等 UI 状态，不复制一份菜单接口数据。

Why：菜单权限会随角色、账号状态、企业空间或后端配置变化。React Query 更适合处理缓存、失效和重新请求；全局 store 如果保存服务端菜单，很容易出现权限已变但菜单还旧的问题。

### Decision 4: 初始化路由时处理刷新恢复

应用启动时，如果用户已有 token，必须先请求 `/api/v1/menus/routes` 并完成转换，再渲染受保护业务路由。加载期间显示骨架屏或轻量 loading；接口失败时进入登录过期、403 或错误兜底。

Why：动态路由最常见的问题是“登录后能点进去，刷新后 404”。本质原因是刷新时内存里的路由表丢失，目标页面匹配发生在动态菜单加载之前。解决办法是把菜单加载作为受保护路由初始化的一部分。

### Decision 5: 组件抽象保持轻量

本 change 只建议抽象以下边界：

- API 类型与 API client：继续放在 `src/api/system/menus`。
- React Query hook：放在菜单或路由邻近位置。
- 动态路由转换器：放在 `src/app/router`。
- 应用壳消费结果：现有侧边栏和 router 装配小幅改造。

不新增大而全的 `RouteManager`、`MenuFactory` 或复杂插件系统。

Why：当前需求只是把一个菜单接口接到既有 route registry。KISS 原则下，小转换器和白名单映射足够清晰，过早抽象会让后续账号体系、企业权限和缓存策略更难调整。

## Risks / Trade-offs
- [Risk] 后端返回 `children` 示例是 `"string"`，真实接口可能存在类型不稳定。→ Mitigation：前端类型允许 unknown 输入，转换器中统一归一化为数组。
- [Risk] 后端 `component` 命名与 React `RouteKey` 不一致。→ Mitigation：维护显式映射表，未知项记录告警并过滤，不让未知组件导致白屏。
- [Risk] 外链 `redirect` 被当成内部路由处理。→ Mitigation：区分 `http/https` 外链和内部 path；外链只作为菜单跳转或打开新窗口策略，不注入 React Router 内部 redirect。
- [Risk] 动态菜单加载失败导致业务页刷新异常。→ Mitigation：受保护路由初始化阶段必须有 loading/error/expired fallback。
- [Risk] 菜单缓存过久导致权限变化不生效。→ Mitigation：React Query query key 纳入用户/企业空间上下文，登录、退出、角色变化和企业空间切换时 invalidate。

## Migration Plan

1. 修正 `RouteItem` 类型，使其准确表达后端返回结构并兼容异常 children。
2. 新增后端组件标识到前端 `RouteKey` 的白名单映射。
3. 新增动态路由转换器和单元测试。
4. 新增 React Query hook 包装 `getCurrentUserRoutes()`。
5. 改造应用路由初始化和侧边栏菜单来源。
6. 验证登录后加载、刷新恢复、隐藏菜单、未知组件、空菜单和 403/404。

回滚策略：保留现有静态 route registry；如果动态菜单接口不可用，可通过配置开关或本地 fallback 回退到静态菜单，保证 UI 底座仍可演示。

## Open Questions

- 后端是否会补充权限码字段？当前示例没有 `permissionCode/perm`，若后端不返回，前端只能按菜单可见性控制入口。
- `component` 字段是否稳定使用 Youlai 风格路径，例如 `system/user/index`？若会变化，需要后端提供固定 `routeKey` 字段降低前端映射成本。
- 外链 redirect 是否真的用于菜单外跳？如果是，需要明确在当前窗口打开还是新窗口打开。
