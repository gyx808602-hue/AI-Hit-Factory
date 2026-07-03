## Why

当前仓库尚未创建前端工程，但用户已提供 Figma Make 原型，覆盖 AI 爆款工厂的一期工作台、视频生成、追爆、图文生视频、数字人、任务记录和素材库页面。需要先把 Figma UI 底座固化为可实现任务，避免后续账号体系和各业务演示任务混在一起导致范围失控。

## What Changes

- 新增一期 Figma UI 页面底座建设任务，先创建 Vite + React + TypeScript 前端工程。
- 使用已确认的 Ant Design + TailwindCSS 方案实现 UI：Ant Design 承担复杂组件，TailwindCSS 承担布局与视觉微调。
- 基于 Figma Make 原型还原应用壳、侧边栏、顶部栏、工作台、商品视频生成、图文生视频、爆款视频改编、数字人管理、任务记录和素材库页面。
- 建立前端静态路由注册表，为后续 SaaS 动态菜单和权限过滤预留 `routeKey -> component` 映射。
- 建立集中 Mock 数据和页面交互状态，先完成演示闭环，不在本变更中接入真实后端、账号体系、积分扣费或高风险合规校验。
- 明确 shadcn/Radix 仅作为 Figma 视觉参考来源，不作为一期工程主 UI 栈。

## Capabilities

### New Capabilities

- `figma-ui-shell-pages`: 基于 Figma Make 原型建设一期前端 UI 底座、应用壳、首批工作台页面、演示页面和 Mock 交互状态。

### Modified Capabilities

- 无。

## Impact

- 前端：新增 Vite + React + TypeScript 工程、路由、主题、布局、页面组件、Mock 数据和基础交互状态。
- UI 依赖：引入 Ant Design、TailwindCSS、lucide-react；不引入 shadcn/Radix 作为主组件体系。
- 路由：新增静态 route registry，为后续动态菜单权限和账号体系接入预留扩展点。
- 后端/API：本变更不要求真实后端接口，但会保留 Mock API 与未来 API Client 的目录边界。
- 文档：复用 `doc/phase-one-ui-task-breakdown.md` 的任务拆解，并在实现阶段继续更新 `doc/progress.md`。
