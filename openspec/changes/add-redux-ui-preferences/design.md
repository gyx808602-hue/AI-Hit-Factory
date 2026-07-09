## Context

项目当前是 Vite + React + TypeScript，UI 使用 Ant Design + TailwindCSS，服务端状态使用 TanStack Query。当前没有 Redux 依赖。全局视觉与布局偏好分布如下：

- `src/app/App.tsx`: `ConfigProvider` 里硬编码 Ant Design 暗色算法与 token。
- `src/app/styles.css`: `:root` 硬编码整体背景、侧边栏、卡片、文字、边框、滚动条等 CSS 变量。
- `src/app/layouts/DashboardLayout.tsx`: 侧边栏折叠状态使用本地 `useState(false)`。

这类状态属于客户端 UI 偏好，不是服务端数据。它和 React Query 的边界应保持清晰：React Query 管接口返回数据；Redux 管用户在浏览器里的 UI 偏好和会话级客户端状态。

## Goals / Non-Goals

**Goals:**

- 使用 Redux Toolkit 管理整体主题色与页面布局偏好。
- 让整体主题同时驱动 Ant Design token 与 CSS custom properties。
- 保持当前视觉默认值不变，避免借本次迁移做视觉重设计。
- 让侧边栏折叠状态成为全局可读写状态，便于后续设置页、快捷入口或持久化扩展。
- 提供清晰 typed hooks、selectors、actions 和 reducer 测试。

**Non-Goals:**

- 不做主题编辑器页面。
- 不做 localStorage / 后端偏好持久化。
- 不做明暗主题切换。
- 不调整动态路由、权限模型、菜单接口。
- 不把服务端接口数据放进 Redux。

## Approach Options

### Option A: Redux Toolkit 统一管理 UI Preferences（推荐）

新增 `uiPreferences` slice，把默认主题 token、CSS 变量、布局偏好集中在 Redux 中。`App.tsx` 使用 selector 派生 Ant Design `ConfigProvider.theme`；一个轻量 hook 或组件把 CSS 变量同步到 `document.documentElement.style`；`DashboardLayout` 使用 Redux 读写 `sidebarCollapsed`。

优点：

- 状态来源统一，符合用户“存到 Redux 中，并配合 Redux Toolkit 使用”的要求。
- Ant Design 和 Tailwind/CSS 变量都能吃到同一份主题状态，能覆盖“整体主题色”。
- 后续做设置页、持久化、品牌色切换时，只扩展 slice 和同步逻辑。

缺点：

- 需要新增依赖与 Provider。
- App 层会多一个 CSS 变量同步副作用，需要测试覆盖，避免 SSR/测试环境报错。

### Option B: 只用 React Context 管主题和布局

新增 Theme/Layout Context，绕开 Redux 依赖。

优点：

- 依赖更少。
- 对当前小范围状态足够轻。

缺点：

- 不满足用户指定的 Redux Toolkit。
- 后续如果项目已有更多全局 UI 偏好，Context 容易分散成多个 Provider。

### Option C: 只改 Ant Design ConfigProvider

把 `ConfigProvider.theme` 抽成对象或 hook，不管理 CSS 变量和布局。

优点：

- 改动最小。

缺点：

- 只影响组件库，不影响 `--app-bg`、`--sidebar-bg`、文字色、滚动条等整体页面变量。
- 不满足“整体的不只是组件的主题色”。

## Decisions

### Decision 1: 使用 Redux Toolkit 管客户端 UI 偏好

本次新增 `uiPreferences` slice，保存客户端 UI 状态。状态形状建议为：

```ts
type ThemePalette = {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
};

type ThemeSurfaces = {
  appBg: string;
  sidebarBg: string;
  cardBg: string;
  mutedBg: string;
  lineSubtle: string;
};

type ThemeText = {
  primary: string;
  secondary: string;
  muted: string;
};

type LayoutPreferences = {
  sidebarCollapsed: boolean;
};
```

Why：主题色如果只存在于 Ant Design token，页面外层背景、侧边栏、Tailwind 任意值引用的 CSS 变量都不会变。把 palette/surfaces/text/layout 放进同一个 slice，本质上是把“设计 token 的运行时状态”前置到 Redux，组件只消费派生结果。

### Decision 2: Redux 存语义 token，App 层派生 Ant Design token

Redux 中保存项目语义变量，例如 `primary`、`appBg`、`sidebarBg`。`App.tsx` 或 `ui-preferences/selectors.ts` 负责派生 Ant Design token：

- `colorPrimary <- palette.primary`
- `colorInfo <- palette.info`
- `colorBgBase <- surfaces.appBg`
- `colorBgContainer <- surfaces.cardBg`
- `colorBgElevated <- surfaces.mutedBg`
- `colorTextBase <- text.primary`

Why：Redux 不应该直接塞满第三方库内部配置。语义 token 更稳定，后续即使 Ant Design 升级 token 命名，业务状态结构也不必跟着大改。

### Decision 3: CSS 变量通过一个受控副作用同步

新增 `useSyncThemeCssVariables` 或 `ThemeCssVariables`，监听 Redux theme state，并写入：

- `--app-bg`
- `--sidebar-bg`
- `--card-bg`
- `--muted-bg`
- `--line-subtle`
- `--text-primary`
- `--text-secondary`
- `--text-muted`
- 可选补充 `--brand-primary`、`--brand-info`、`--brand-warning` 等，供布局渐变和自定义区域复用。

Why：CSS 变量是浏览器渲染层能力，Redux 是 JS 状态容器。二者之间需要一个明确同步点，类似前端中“状态变化后同步副作用”。这和后端里“配置中心变更后刷新运行时配置”相似：配置本身集中管理，但落到具体运行环境需要适配层。

### Decision 4: 侧边栏折叠迁移到 Redux，布局组件只派发意图

`DashboardLayout` 不再本地 `useState(false)`，改为：

- `const collapsed = useAppSelector(selectSidebarCollapsed)`
- `const dispatch = useAppDispatch()`
- 点击时 `dispatch(toggleSidebarCollapsed())`

Why：布局偏好是典型客户端全局 UI 状态。放在组件本地时，只有该组件知道；放进 Redux 后，设置页、快捷键、响应式策略、持久化都可以复用同一状态。

### Decision 5: 暂不做持久化

本次 Redux 默认值保持当前视觉与布局，刷新后恢复默认。后续如果需要记忆用户偏好，再新增明确的 persistence change。

Why：持久化会引入版本迁移、非法颜色值兜底、跨账号隔离和退出登录清理等问题。当前用户说“先这样”，所以先完成 Redux Toolkit 状态统一，不扩大范围。

## Component And File Boundaries

- `src/app/store.ts`: 配置 Redux store。
- `src/app/hooks.ts`: typed `useAppDispatch` / `useAppSelector`。
- `src/features/ui-preferences/slice.ts`: reducer、actions、默认状态。
- `src/features/ui-preferences/selectors.ts`: selector 与派生 Ant Design theme / CSS variables。
- `src/features/ui-preferences/ThemeCssVariables.tsx` 或 `hooks.ts`: 同步 CSS custom properties。
- `src/app/App.tsx`: 读取主题 selector，传入 `ConfigProvider`，挂载 CSS 变量同步。
- `src/app/layouts/DashboardLayout.tsx`: 读取与切换 sidebarCollapsed。

不新增大型 `shared` 抽象；这是明确的 app-level UI 状态能力，放在 `features/ui-preferences` 比放进业务页面更合适。

## Risks / Trade-offs

- [Risk] Redux 引入后被误用于服务端数据缓存。Mitigation: 文档和命名限定为 `uiPreferences`，服务端数据继续走 React Query。
- [Risk] CSS 变量同步遗漏导致 AntD 变了但外层背景没变。Mitigation: selector 测试覆盖 CSS 变量 map，组件测试断言 document root style。
- [Risk] 默认主题迁移后出现视觉回归。Mitigation: 初始值完全复制当前 `App.tsx` 与 `styles.css` 硬编码值。
- [Risk] 测试环境没有完整 DOM。Mitigation: CSS 变量同步 hook 判断 `typeof document !== "undefined"`。

## Knowledge Notes

Redux Toolkit 的 slice 类似后端里一个小型“领域状态模块”：它把状态结构、修改入口和默认值放在一起。组件不直接改状态对象，而是派发 action，这类似后端不要让 Controller 直接改数据库字段，而是通过 Service 表达业务意图。

React Query 和 Redux 的分工也要清楚：React Query 管“后端返回的数据缓存”，Redux 管“浏览器里的交互状态”。把服务端列表、详情数据放进 Redux 会让缓存失效、重新请求、错误重试这些能力都要自己造，反而复杂。

## Migration Plan

1. 安装 `@reduxjs/toolkit`、`react-redux`。
2. 新增 store、typed hooks、`uiPreferences` slice、selectors 和 CSS 变量同步能力。
3. 在 `main.tsx` 接入 Redux Provider。
4. 在 `App.tsx` 使用 Redux 派生 Ant Design theme，并同步 CSS 变量。
5. 在 `DashboardLayout.tsx` 将折叠状态迁移到 Redux。
6. 补充 reducer/selector/theme sync/layout 相关测试。
7. 运行定向测试、`npm run typecheck`、OpenSpec strict 校验。

Rollback 策略：如果迁移出现问题，可先保留 Redux 依赖和 slice，把 `App.tsx` 与 `DashboardLayout.tsx` 临时切回硬编码/本地 state；由于不改业务数据流，回退面较小。
