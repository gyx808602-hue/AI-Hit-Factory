## Why

当前项目已经形成 Vite + React + TypeScript + Ant Design + TailwindCSS 的后台工作台结构，但“整体主题色”和“页面布局状态”仍然分散在多个位置：

- Ant Design 主题 token 硬编码在 `src/app/App.tsx` 的 `ConfigProvider` 中。
- 全局 CSS 变量硬编码在 `src/app/styles.css` 的 `:root` 中。
- 侧边栏折叠状态保存在 `src/app/layouts/DashboardLayout.tsx` 的本地 `useState` 中。

这会导致后续做主题切换、品牌色配置、布局偏好记忆或全局 UI 偏好入口时，需要同时修改组件、样式和布局代码，状态来源不统一。用户明确要求主题色是“整体的”，所以本次不能只调整 Ant Design 组件主题，而应把应用级 CSS 变量、Ant Design token、布局偏好统一纳入 Redux Toolkit 管理。

## What Changes

- 新增 Redux Toolkit 与 React Redux 作为客户端 UI 偏好状态管理基础。
- 新增应用级 store，并在入口 `main.tsx` 使用 `Provider` 包裹现有 React Query 与 Router。
- 新增 `uiPreferences` slice，统一保存：
  - 整体主题色 token，例如 primary、info、success、warning、error。
  - 应用级背景与文字变量，例如 appBg、sidebarBg、cardBg、mutedBg、lineSubtle、textPrimary、textSecondary、textMuted。
  - 页面布局偏好，例如 sidebarCollapsed。
- 新增 selector 与 action，供 `App.tsx`、`DashboardLayout.tsx` 和后续设置页面复用。
- 将 `ConfigProvider theme.token` 从硬编码改为从 Redux selector 派生。
- 将全局 CSS 变量从固定 `:root` 值改为由 Redux 状态同步到 document root，确保页面背景、侧边栏、文字、滚动条等整体视觉一起受控。
- 将 `DashboardLayout` 的侧边栏折叠状态从组件本地 state 迁移到 Redux。
- 本次先只做内存态 Redux，不默认写入 localStorage；如后续需要跨刷新记忆，再单独补持久化方案，避免一开始引入过多边界。
- 不改变后端接口、动态路由、权限模型、React Query 服务端数据缓存和业务页面数据流。

## Capabilities

### New Capabilities

- `ui-preferences`: 统一管理客户端整体主题色、全局视觉变量与页面布局偏好，并通过 Redux Toolkit 暴露可测试的 reducer、actions、selectors。

### Modified Capabilities

- 无。本次只新增客户端 UI 偏好能力，不修改已有业务能力规格。

## Impact

- Frontend:
  - 预计新增 `@reduxjs/toolkit`、`react-redux` 依赖。
  - 预计新增 `src/app/store.ts`、`src/app/hooks.ts` 或同等轻量文件，提供 typed dispatch/selector。
  - 预计新增 `src/features/ui-preferences/`，包含 slice、types、selectors、主题变量同步工具与测试。
  - 预计修改 `src/app/main.tsx`，接入 Redux Provider。
  - 预计修改 `src/app/App.tsx`，从 Redux 派生 Ant Design theme，并挂载 CSS 变量同步组件或 hook。
  - 预计修改 `src/app/layouts/DashboardLayout.tsx`，将 sidebar collapsed 迁移到 Redux。
  - 预计补充或调整 App/Layout/store 相关测试。
- UI:
  - 保持当前暗色后台视觉不变，只把硬编码值迁移到 Redux 默认状态。
  - 整体主题色同时影响 Ant Design token 与 CSS 变量，不只影响组件库。
- Tests:
  - 新增 reducer/selector 测试。
  - 补充侧边栏折叠状态通过 Redux action 切换的组件测试。
  - 补充主题变量同步测试，确保 CSS custom properties 会被写入 document root。
- Docs:
  - 更新 `doc/progress.md` 记录调研、OpenSpec、后续执行状态。
