## Why

当前项目已经形成 React + TypeScript + Ant Design + Tailwind 的 SaaS 后台技术栈，但页面实现里仍存在几类不统一点：部分页面使用原生 `button/input` 承担主要交互，上传、卡片列表、分页、空状态、确认删除等结构在多个页面重复，个别页面文件过大导致后续维护成本升高。现在补充 UI 统一规范后，需要把这些问题沉淀成可执行的 OpenSpec 优化任务，避免后续页面继续分散演进。

## What Changes

- 新增一轮 UI 组件统一性优化任务，优先处理可见且重复的交互结构，而不是做全局视觉换肤。
- 明确后续页面与组件默认优先使用 Ant Design；Tailwind 只负责布局、响应式、外层容器和局部微调。
- 识别并规划轻量二次封装候选：上传触发器、卡片列表分页壳、确认删除、统一加载/空/错误状态、步骤导航。
- 规划替换当前页面中承担主要交互的原生 `button/input`，优先回归 Ant Design `Button/Upload/Input`。
- 规划拆分超大页面 `VideoRemixTaskDetailPage.tsx` 的局部组件，降低单文件复杂度，但不改变业务链路。
- 使用 UI/UX Pro Max 作为体验检查工具，只采纳表单 label、加载反馈、响应式表格、按钮防重复提交、可访问性等检查项，不引入新配色、新字体或新主题。

## Capabilities

### New Capabilities

- `ui-component-consistency`: 约束并验收 Ant Design 优先、轻量二次封装、Tailwind 使用边界、UI/UX Pro Max 体验检查与页面重复结构优化。

### Modified Capabilities

- 无。本 change 只新增 UI 统一优化能力，不修改既有业务能力规格。

## Impact

- 影响范围主要是前端 UI 层：
  - `src/pages/DashboardPage.tsx`
  - `src/pages/AssetLibraryPage.tsx`
  - `src/pages/ProductVideoPage.tsx`
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/CustomisedAudiosPage.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/shared/components/*`
- 不新增后端接口，不调整 API 契约，不改变动态路由、权限码和业务数据模型。
- 不引入新的 UI 依赖；继续使用现有 Ant Design、Tailwind、lucide-react。
- 需要补充或调整相关页面测试，重点覆盖上传、按钮 loading/disabled、空状态、分页、删除确认和步骤切换。
