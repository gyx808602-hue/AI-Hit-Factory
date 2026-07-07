## Context

项目当前是 React 19 + TypeScript + Vite，UI 使用 Ant Design、TailwindCSS 和 lucide-react，服务端状态主要通过 React Query hooks 封装。现有目录已经具备 `app / pages / features / shared` 分层，但 `src/pages` 里的路由页面全部平铺在一级目录，内容生成、数字人、积分、认证和工作台页面混在一起；同时不少页面还混合了业务组件、表单校验、状态派生、列表渲染和弹窗逻辑。

本次扫描发现页面复杂度基线如下：

- `VideoRemixTaskDetailPage.tsx`：1512 行，混合详情数据、步骤导航、上传、素材预览、提示词生成、视频生成和底部动作。
- `DigitalHumanVideoTasksPage.tsx`：992 行，混合任务列表、筛选、状态统计、卡片渲染、分页和局部交互。
- `ImageVideoPage.tsx`、`LoginPage.tsx`、`CustomisedAudiosPage.tsx`、`DigitalHumansPage.tsx`、`PointsUsageStatisticsPage.tsx` 均超过 400 行或接近 400 行，存在继续膨胀风险。

## Goals / Non-Goals

**Goals:**

- 让 `src/pages/*Page.tsx` 只承担路由级组合、页面级状态协调和数据装配。
- 让 `src/pages` 按业务领域分组，解决页面平级堆放导致的查找和归属混乱。
- 把稳定业务功能按领域放入 `src/features/<module>`，例如数字人、音色、视频改编、文图生视频、积分统计。
- 把纯 UI 且跨多个真实场景复用的组件谨慎提升到 `src/shared/components`。
- 拆分后保持用户行为、路由、接口调用、权限逻辑、缓存语义和测试意图不变。
- 通过更小的文件和更明确的边界，让后续开发能定位“功能在哪个文件”，而不是在一个超大页面里搜索。

**Non-Goals:**

- 不做全局 UI 换肤。
- 不重写业务流程。
- 不重写路由系统；只调整页面文件物理路径和路由注册表 import。
- 不改变 API Client、React Query key 或后端接口契约。
- 不为了拆分而创建空目录、复杂 `Base*` 组件或配置驱动式大组件。

## Decisions

### Decision 1: pages 目录先按业务领域分组

`src/pages` 不应长期保持所有页面平铺。推荐按路由领域和业务归属建立浅层目录：

```text
src/pages/
  auth/
    LoginPage.tsx
  workspace/
    DashboardPage.tsx
    AssetLibraryPage.tsx
    TaskRecordsPage.tsx
  content/
    ProductVideoPage.tsx
    ViralRemixPage.tsx
    VideoRemixTasksPage.tsx
    VideoRemixTaskDetailPage.tsx
    ImageVideoPage.tsx
    TextImageVideoTasksPage.tsx
    TextImageVideoTaskDetailPage.tsx
  digital-human/
    DigitalHumansPage.tsx
    DigitalHumanDetailPage.tsx
    CustomisedAudiosPage.tsx
    DigitalHumanVideoTasksPage.tsx
    DigitalHumanVideoTaskDetailPage.tsx
  points/
    PointsUsageStatisticsPage.tsx
  system/
    ForbiddenPage.tsx
    NotFoundPage.tsx
```

可选增加 `src/pages/index.ts` 或各领域 `index.ts` 作为导出聚合，前提是它能减少 `routeRegistry.tsx` 的路径噪音，而不是制造循环依赖。

Why：这类似后端按 Controller 模块分包。所有 Controller 都放在一个目录时，小项目能忍，大项目会很快找不到边界；按领域分组后，路由入口的位置本身就表达业务归属。这里保持一层领域目录即可，不做过深嵌套，避免“目录很架构、定位更痛苦”。

### Decision 2: 路由页面只做编排层

`src/pages/*Page.tsx` 应保留页面入口、路由参数读取、页面级 hooks 调用、跨区块事件串联和最终 JSX 编排。表单弹窗、筛选栏、卡片列表、预览区、步骤操作条等稳定 UI 区块应下沉到 feature 内。

Why：页面文件相当于后端里的 Controller，不应该塞满领域规则和细节 UI。Controller 负责“把请求交给谁处理、把结果怎么组合返回”，而不是亲自完成所有业务。前端页面同理，页面越薄，越容易读懂路由入口和数据流。

### Decision 3: feature 是业务功能默认归属

按现有领域边界落位：

- `VideoRemixTaskDetailPage.tsx` 的步骤导航、素材上传、素材预览、视频预览和动作条优先进入 `src/features/video-remix/components`。
- `DigitalHumanVideoTasksPage.tsx` 的筛选、任务卡片、状态统计和列表状态优先进入 `src/features/digital-human-video/components`。
- `CustomisedAudiosPage.tsx` 的音色表单弹窗、音频上传触发器、音色卡片和状态映射优先进入 `src/features/digital-human/audio/components` 或邻近 `form/status` 文件。
- `DigitalHumansPage.tsx` 的创建弹窗、素材预览、数字人卡片和筛选工具优先进入 `src/features/digital-human/components`。
- `PointsUsageStatisticsPage.tsx` 的统计筛选、指标摘要和流水展示优先进入 `src/features/points/components`。
- `ImageVideoPage.tsx` 和文图生视频任务相关区块优先进入 `src/features/text-image-video/components`。

Why：feature 层承载领域语义。比如“音色创建弹窗”不是通用 Modal，它知道音色名称、参考音频、训练状态和提交行为，所以应放在 digital-human/audio 领域内，而不是上升到 shared。

### Decision 4: shared 只收稳定复用的纯 UI 能力

只有满足至少 2 个真实业务场景复用，且不依赖业务 API、业务状态枚举和页面私有文案的能力，才允许进入 `src/shared/components`。例如已有 `PageShell`、`MetricCard`、`StatusPill` 属于稳定通用 UI；而某个页面专用上传表单或任务卡片不应提前 shared 化。

Why：过早 shared 会把“具体业务问题”包装成“全局抽象问题”，后续每个新页面都会被迫理解一套复杂 props。KISS 的做法是先在 feature 内稳定，再按真实重复上提。

### Decision 5: 分批拆分，先移动页面路径，再拆页面内部

本 change 的实施顺序应先解决目录平铺问题，再处理页面内部功能拆分：

1. 先迁移 `src/pages` 文件到领域子目录，并更新 `routeRegistry.tsx` lazy import 与测试引用。
2. 跑基础路由和页面测试，确认 URL、route key、route meta、权限和菜单高亮不变。
3. 再按页面复杂度逐步抽取 feature components/hooks/utils。

Why：路径迁移是低业务风险但影响面广的机械调整；页面内部拆分是中高风险的结构调整。分两步做，失败时更容易定位问题：如果路由挂了，先查 import；如果行为变了，再查组件抽取。

### Decision 6: 分批拆分，先保行为再整理样式

拆分顺序应按风险由高到低分批推进：

1. 先建立基线测试和文件行数基线。
2. 对单个页面做纯组件提取，不改业务数据流。
3. 每完成一批提取就跑目标测试。
4. 再考虑复用抽象和 shared 提升。

Why：大页面里最危险的不是 JSX 长，而是数据流和副作用交织。先做“纯搬家”可以降低回归风险，避免在同一批改动里同时改变结构和行为。

## Component Boundary Rules

- 页面文件可以保留：
  - 路由参数和导航。
  - 页面级 query/mutation hook 调用。
  - 跨多个业务区块共享的状态。
  - 页面标题、整体布局和区块组合。
- pages 领域目录负责：
  - 表达路由入口的业务归属。
  - 收纳对应页面的页面级测试。
  - 保持浅层目录，不继续按 `components`、`hooks` 在 pages 下扩散。
- feature 组件应承接：
  - 业务表单、弹窗、筛选栏、任务卡片、预览区、步骤条。
  - 领域状态映射、领域常量、表单校验、请求 payload 映射。
  - 单一领域内稳定复用的 UI 组合。
- shared 组件只承接：
  - 与业务无关的基础展示组件。
  - 跨多个 feature 复用且 API 稳定的 UI 壳。
- 不建议拆分：
  - 只使用一次且结构很短的 JSX。
  - 需要传入 8 个以上 props 才能工作的“假通用组件”。
  - 仅为了减少行数而产生的目录和 wrapper。

## Testing Strategy

- 拆分前保留或补充页面级行为测试，覆盖提交、上传、刷新、删除、分页、筛选、步骤切换和空状态。
- 纯展示组件可用轻量组件测试覆盖关键文案、按钮状态和回调。
- 领域工具函数、表单映射、状态映射继续放在 feature 单测中验证。
- 每批拆分后运行对应页面测试；最终运行 `npm run typecheck`。

## Risks / Trade-offs

- [Risk] 机械拆分导致 props 传递过长。Mitigation：如果子组件 props 超过约 8 个，需要重新判断是否边界错误，或保留在页面内部。
- [Risk] 拆分时误改 query/mutation 行为。Mitigation：React Query hooks、query key、API Client 调用先保留在页面或原 feature hook，不在本 change 中重写。
- [Risk] shared 过度抽象。Mitigation：先落 feature，只有跨真实场景复用后再提升 shared。
- [Risk] 测试查询路径变化。Mitigation：保留用户可见文案、可访问名称和必要 `data-testid`。

## Migration Plan

1. 建立页面行数和职责基线，确认优先拆分顺序。
2. 迁移 `src/pages` 到领域子目录，更新路由 lazy import 和测试路径。
3. 给最高风险页面补齐关键回归测试。
4. 按页面逐批提取 feature components、form/status/utils。
5. 更新页面测试导入路径和必要组件测试。
6. 运行目标测试、`npm run typecheck` 和 OpenSpec 校验。

Rollback 策略：每批只处理一个页面或一个领域模块；如果出现行为回归，只回退该批新增 feature 组件和页面导入调整，不影响其他页面。
