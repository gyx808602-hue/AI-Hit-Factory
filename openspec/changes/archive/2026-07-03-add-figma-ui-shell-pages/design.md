## Context

当前仓库还没有 React 前端工程。用户提供的 Figma Make 文件已经包含一个可运行的 React/Vite 原型，页面包括应用壳、侧边栏、工作台、商品视频生成、图文生成视频、爆款视频改编、数字人管理、任务记录和素材库。

本变更的定位是“一期 UI 页面底座”，不是账号体系、积分体系或真实视频生成后端的完整实现。账号体系已有独立 change：`add-account-system-react-pages`，后续应在 UI 底座完成后单独推进。

已确认 UI 技术方案为 Ant Design + TailwindCSS。Figma 原型中的 shadcn/Radix 风格只作为视觉参考，工程实现不引入 shadcn/Radix 作为主组件体系。

## Goals / Non-Goals

**Goals:**

- 创建 Vite + React + TypeScript 前端工程。
- 建立应用基础结构：`src/app`、`src/pages`、`src/features`、`src/components`、`src/api`、`src/store`、`src/utils`。
- 使用 Ant Design `ConfigProvider` 和 TailwindCSS 还原 Figma 暗色 SaaS 工作台风格。
- 实现应用壳、侧边栏、顶部栏和静态路由注册表。
- 还原 Figma 首批页面：工作台、商品视频生成、图文生视频、爆款视频改编、数字人管理、任务记录、素材库。
- 覆盖常见浏览器窗口尺寸，保证 PC 工作台在不同宽高下不白屏、不重叠、不遮挡关键操作。
- 为列表、表格、素材网格、生成任务状态提供 Mock 数据和基础交互。
- 为后续账号体系、动态菜单、权限过滤和真实 API Client 预留扩展点。

**Non-Goals:**

- 不实现真实登录注册、微信绑定、实名认证、企业认证、积分扣费和协议签署。
- 不接入真实短信、文件上传、视频生成、数字人生成或素材存储服务。
- 不实现完整 RBAC、企业空间权限和后端权限复核。
- 不把 Figma 原型代码逐字复制为最终架构；需要翻译成当前项目约束下的 Ant Design + TailwindCSS 实现。
- 不引入 shadcn/Radix 作为主 UI 组件体系。

## Decisions

### Decision 1: 使用 Vite + React + TypeScript 初始化前端工程

采用 Vite + React + TypeScript。仓库当前没有前端工程，Vite 启动快、配置轻、适合 MVP 阶段快速还原 UI。

备选方案是 Next.js。Next.js 更适合需要 SSR、SEO、复杂服务端渲染或全栈路由的场景，但当前产品是登录后的 SaaS 工作台，首要目标是交互页面和后台型 UI，Next.js 会增加不必要的工程复杂度。

### Decision 2: Ant Design 承担复杂交互，TailwindCSS 承担布局

Ant Design 用于表单、表格、上传、步骤条、弹窗、抽屉、菜单、标签页、通知、空态和骨架屏。TailwindCSS 用于页面布局、grid/flex、间距、响应式、内容区背景和 Figma 视觉微调。

Why：AI SaaS 工作台后续会大量出现表单、表格、筛选、分页、上传和状态反馈。Ant Design 在这些场景的工程成熟度高，中文生态和后台系统适配更好。TailwindCSS 则避免为简单布局创建过多 CSS 文件，让 Figma 的间距和页面结构更容易快速落地。

备选方案是 shadcn/Radix。它视觉更贴近 Figma 原型，也更可控，但复杂表格、上传、企业表单、审核列表和权限弹窗都需要更多维护代码，不适合作为本项目一期主栈。

### Decision 3: 保留静态路由注册表，为动态菜单预留接口

本变更先实现静态路由注册表，例如：

```ts
type RouteKey =
  | 'workspace.dashboard'
  | 'content.productVideo'
  | 'content.imageVideo'
  | 'content.viralRemix'
  | 'content.digitalHumans'
  | 'workspace.tasks'
  | 'workspace.assets';
```

页面菜单先来自本地配置，后续账号体系接入后，再由后端返回菜单和权限码，前端用静态 `routeKey -> component` 映射生成可访问路由。

知识点拨：动态路由类似后端网关的路由表。后端可以告诉前端“用户有权访问哪些页面”，但不能直接告诉前端“加载哪个组件文件”。组件映射必须由前端静态维护，才能保证构建安全和权限边界清晰。

### Decision 4: Mock 数据集中管理，但页面内保留轻量 UI 状态

Mock 数据应集中放在业务模块或 `src/api/mock` 中，例如任务记录、素材库、数字人列表、工作台统计。页面内部只保留输入模式、选中项、弹窗开关、生成中/生成成功等短期 UI 状态。

暂不强制引入复杂全局状态库。若实现侧边栏折叠、主题、当前工作台上下文，可使用 Zustand 或 React context，但接口型数据不进入全局 store。

Why：React Query 后续负责服务端数据新鲜度，全局 store 只放客户端上下文。把任务列表、素材列表等接口数据塞进全局 store，会导致后续接 API 时出现缓存失效和刷新不一致。

### Decision 5: 组件抽象保持克制

应用壳、侧边栏、顶部栏、状态徽标、页面标题区、结果预览区等具备复用价值，可以抽为组件。单页面内仅出现一次的表单区块优先放在页面或 feature 内部，不提前抽成大而全的 `BaseForm`、`BaseTable`。

Why：本阶段目标是还原 Figma 并形成稳定页面边界。过早抽象会让后续根据账号体系、积分体系、权限体系改造时成本更高。

### Decision 6: 大数据页面先按真实形态预留性能策略

任务记录使用 Ant Design Table 时必须按服务端分页、筛选和排序的接口形态设计，即使当前使用 Mock 数据。素材库卡片网格必须使用缩略图占位和懒加载思路，不在首屏加载原始媒体。

知识点拨：前端分页和后端分页差别很大。前端分页是一次性拿全部数据再切片，数据量大时会卡；后端分页是每次只请求当前页，类似数据库 `limit/offset` 或游标查询，更适合任务记录和素材库。

### Decision 7: PC 优先，同时做窗口尺寸兜底

一期 UI 是 PC SaaS 工作台，优先适配 `1280x720`、`1366x768`、`1440x900`、`1536x864`、`1920x1080`。`1024px - 1279px` 进入紧凑桌面布局，侧边栏默认允许折叠，表格允许横向滚动。小于 `1024px` 不承诺完整移动端体验，但必须保证页面不白屏、不重叠、不出现不可关闭弹窗。

布局策略：

- 应用壳使用固定侧边栏 + 弹性内容区，内容区设置 `min-width: 0`，避免 grid/table 撑破页面。
- 页面主体使用独立滚动容器，避免浏览器窗口高度较小时顶部栏和主按钮被挤出。
- 宽屏页面对主内容设置最大宽度或合理 grid 上限，避免 1920px 以上卡片过宽。
- 表格类页面使用 Ant Design Table 的 `scroll.x` 或列优先级策略。
- Modal/Drawer 设置 `max-height` 和内部滚动，保证 `720px` 高度下仍可操作。

Why：后台工作台用户的窗口尺寸差异很大，尤其是 1366 笔记本、外接 1920 显示器和半屏办公窗口。窗口兼容不是“移动端适配”，它的核心是保证信息密度、滚动边界和关键操作在不同尺寸下仍稳定。

## Risks / Trade-offs

- [Risk] Figma 原型使用 shadcn/Radix 风格，落地为 Ant Design 后视觉存在差异。→ Mitigation：通过 Ant Design token、暗色主题、Tailwind 外层布局和局部样式微调贴近 Figma，不强求逐像素复制 shadcn 组件细节。
- [Risk] 本变更只做 UI 和 Mock，容易被误解为业务已完成。→ Mitigation：在页面和文档中明确 Mock 边界；账号、积分、权限、协议作为后续独立任务。
- [Risk] 商品视频生成不在用户最初列出的 1-4 中，但 Figma 已覆盖。→ Mitigation：作为 UI 底座的一部分纳入首批页面；后续真实业务可单独拆 change。
- [Risk] 一次性还原页面过多导致组件混乱。→ Mitigation：先建应用壳和路由，再按页面分 feature 落地；只抽复用明确的组件。
- [Risk] 任务记录和素材库后续数据量增长。→ Mitigation：当前就按服务端分页、筛选、懒加载和 React Query 缓存形态预留。
- [Risk] Figma 原型在固定画布下看起来正常，但真实浏览器窗口尺寸变化后出现溢出或遮挡。→ Mitigation：在实现任务中加入窗口矩阵验证，使用弹性布局、内容区滚动、表格横向滚动和弹窗最大高度控制。

## Migration Plan

1. 创建 Vite + React + TypeScript 工程。
2. 安装并配置 Ant Design、TailwindCSS、lucide-react、React Router、必要的 lint/typecheck 工具。
3. 建立主题和应用入口，配置 `ConfigProvider` 暗色 token。
4. 实现静态路由注册表、应用壳、侧边栏、顶部栏。
5. 按 Figma 页面逐步还原工作台、商品视频生成、图文生视频、追爆、数字人、任务记录、素材库。
6. 增加 Mock 数据和基础交互状态。
7. 运行类型检查、构建和浏览器视觉检查。
8. 使用窗口矩阵检查 `1280x720`、`1366x768`、`1440x900`、`1536x864`、`1920x1080`，并对 `1024px - 1279px` 和小于 `1024px` 做兜底验证。

回滚策略：本变更新增前端工程和文档，不迁移已有业务数据；若实现失败，可回退该 change 对应新增文件。

## Open Questions

- 商品视频生成是否作为一期正式验收页面，还是只作为 Figma UI 底座中的附带页面？
- 是否需要在 UI 底座阶段同时加入基础登录占位页，还是留给账号体系 change 实现？
- 是否需要移动端适配到小程序同等体验？当前设计只承诺 PC SaaS 工作台和窄屏浏览器兜底，不承诺完整小程序体验。
