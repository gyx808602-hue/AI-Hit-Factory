## Context

项目已使用 React + TypeScript + Vite，UI 依赖包括 Ant Design、TailwindCSS、lucide-react。已有稳定 shared 组件包括 `PageShell`、`MetricCard`、`StatusPill`、`LazyImage`，但 shared 层仍很薄，页面里还有较多重复 UI 组合。

本次扫描发现：

- `DashboardPage.tsx`、`AssetLibraryPage.tsx`、`ProductVideoPage.tsx`、`ViralRemixPage.tsx`、`VideoRemixTaskDetailPage.tsx` 等仍有原生 `button/input` 承担主要交互。
- `DigitalHumansPage.tsx`、`CustomisedAudiosPage.tsx`、`DigitalHumanVideoTasksPage.tsx` 存在相似的指标卡、筛选、卡片网格、分页、空状态、删除确认模式。
- `VideoRemixTaskDetailPage.tsx` 超过 1400 行，内部已经出现 `UploadTrigger`、`AssetPreviewGrid`、`StepNavigation`、`StepActions` 等可局部拆分组件。
- UI/UX Pro Max 查询结果对本项目有价值的部分是表单 label、提交反馈、loading 状态、响应式表格、懒加载和可访问性；不采纳其新主题、暗色模式、营销页 hero 建议。

## Goals / Non-Goals

**Goals:**

- 让主要交互控件优先回归 Ant Design，减少原生控件造成的状态、可访问性和视觉差异。
- 对已经跨页面重复的组合做轻量二次封装，提升统一性，但不创建大而全组件。
- 保持项目现有视觉语言：Ant Design + 当前 CSS 变量 + Tailwind 布局。
- 让上传、删除确认、列表空/加载/错误、分页和步骤导航具备一致的交互反馈。
- 降低 `VideoRemixTaskDetailPage.tsx` 的单文件复杂度，让后续修改更可控。

**Non-Goals:**

- 不做全局主题换肤。
- 不引入新 UI 框架、新图标库或新的状态管理库。
- 不重写所有历史页面。
- 不改变业务接口、权限模型、路由结构和数据模型。
- 不把所有 Ant Design 组件都包成 `Base*`，避免过度封装。

## Decisions

### Decision 1: Ant Design 承担交互，Tailwind 承担布局

主要交互控件使用 Ant Design `Button/Input/Upload/Modal/Popconfirm/Table/Pagination/Empty/Skeleton/Spin/Alert`。Tailwind 只用于外层排版、间距、响应式网格、局部视觉微调。

Why：Ant Design 已经内置可访问性、键盘交互、loading、disabled、校验状态和中文后台常见交互；如果手写原生控件，就要自行补齐这些能力，维护成本更高，也容易破坏统一性。

备选方案是继续保留原生控件并用 Tailwind 调整外观。暂不采用，因为这会让视觉看似接近但交互语义不一致，尤其是上传、按钮 loading 和确认删除。

### Decision 2: 二次封装只做“稳定重复组合”

优先封装以下候选：

- `UploadField` 或 `UploadTrigger`：统一 `beforeUpload`、`showUploadList=false`、loading、错误展示和测试入口。
- `EntityCardGrid` 或 feature 内列表壳：统一卡片网格、空状态、分页容器，但不强行规定卡片内容。
- `ConfirmDeleteButton`：统一危险操作确认、loading、aria-label。
- `AsyncStateBlock`：统一 loading、error、empty 三态展示。

Why：这些组合已经在多个页面重复，且每次重复都要处理状态反馈和测试细节。轻量封装可以减少重复，又不会把业务字段配置化到难以理解。

备选方案是创建 `BaseTable/BaseForm/BaseModal`。暂不采用，因为当前项目还没有足够稳定的表单/表格抽象边界，过早上提会变成大配置组件。

### Decision 3: 大页面先拆局部组件，不迁移业务层级

`VideoRemixTaskDetailPage.tsx` 先拆出页面内部已经稳定的 UI 块，例如步骤导航、上传触发器、素材预览网格、视频预览卡、步骤底部操作条。拆分目标是降低阅读成本，不改变 API 调用、React Query 缓存、表单保存和任务生成链路。

Why：该页面业务链路复杂，如果同时重构数据流和 UI，会扩大风险。先拆 UI 块能明显降低单文件复杂度，并保持行为可验证。

### Decision 4: UI/UX Pro Max 只作为检查清单

实现和验收时使用 UI/UX Pro Max 的以下检查项：

- 表单必须有 label，不用 placeholder 替代 label。
- 异步操作必须有 loading/disabled，避免重复提交。
- 上传、生成、删除、刷新必须有明确反馈。
- 表格/网格必须有 loading、empty、error 状态。
- 宽表格和卡片网格必须考虑小屏布局。
- 图标按钮必须有可访问名称。

不采用其推荐的新配色、字体、暗色主题和营销页 hero 模式。

## Risks / Trade-offs

- [Risk] 抽象过度导致组件配置复杂 → Mitigation：只封装重复 2 次以上且交互稳定的组合；一次性 UI 保留局部实现。
- [Risk] 优化范围过大影响已有业务 → Mitigation：按页面分批改，每批都有定向测试和 typecheck。
- [Risk] 替换原生控件导致测试查询方式变化 → Mitigation：保留必要 `data-testid`，优先按可访问名称查询。
- [Risk] 拆分大页面时误改数据流 → Mitigation：第一阶段只拆纯 UI 组件，API、hooks、mutation、query key 不变。
- [Risk] UI/UX Pro Max 建议与项目主题冲突 → Mitigation：只采用体验检查项，不采纳新主题资产。

## Migration Plan

1. 先新增或调整 shared/feature 内轻量组件，并写最小组件测试。
2. 替换原生主交互控件，保持行为和文案不变。
3. 对数字人、音色、视频任务卡片列表做重复结构收敛。
4. 对 `VideoRemixTaskDetailPage.tsx` 做局部组件拆分。
5. 运行相关页面测试、上传集成测试、`npm run typecheck`。

Rollback 策略：每批页面优化保持小提交粒度；若某个页面行为回归，只回退该页面和相关轻量组件，不影响其他页面。

## Open Questions

- `ProductVideoPage.tsx` 当前更像占位/演示页，是否纳入第一批改造需要用户确认。
- `AssetLibraryPage.tsx` 是否已有后端真实素材接口尚不明确，本 change 只规划 UI 控件统一，不补业务接口。
