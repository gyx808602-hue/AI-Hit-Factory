# 2026-07-07 项目结构规范化审视进展

## 已完成

- 已扫描当前项目根目录、`package.json`、`src` 一级目录结构。
- 已确认技术栈为 Vite + React 19 + TypeScript + React Router 7 + Ant Design + TailwindCSS + TanStack Query。
- 已读取 OpenSpec 当前变更列表，确认存在进行中的 `split-view-pages-by-feature`，该变更正对应页面按领域拆分和职责整理。
- 已读取 `split-view-pages-by-feature` 的 `proposal.md`、`design.md`、`tasks.md`，确认它已经完成 pages 领域目录迁移，但页面内部拆分尚未完成。
- 已统计当前页面体量，发现重点大文件包括：
  - `src/pages/content/VideoRemixTaskDetailPage.tsx`：约 1500 行。
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.tsx`：约 984 行。
  - `src/pages/content/ImageVideoPage.tsx`：约 547 行。
  - `src/pages/auth/LoginPage.tsx`：约 528 行。
  - `src/pages/digital-human/DigitalHumansPage.tsx`：约 481 行。
  - `src/pages/digital-human/CustomisedAudiosPage.tsx`：约 461 行。
  - `src/pages/points/PointsUsageStatisticsPage.tsx`：约 432 行。
- 已查看动态路由、请求层、应用入口和当前用户路由 hooks，确认项目已有动态菜单映射、统一请求封装、React Query Provider 和路由权限入口。

## 当前判断

- 项目结构并不是混乱状态，当前已经具备 `app / api / pages / features / shared / utils` 的基本分层。
- `src/pages` 已完成领域目录迁移，说明结构治理已经开始推进。
- 当前主要问题不在目录一级结构，而在页面内部职责仍偏重：部分页面同时承担数据请求、表单状态、弹窗、列表渲染、上传预览、状态映射和工具函数。
- 注释目前存在两类问题：
  - 关键基础逻辑有注释，但部分中文内容存在编码显示异常。
  - 大页面内部缺少“区块级说明”，阅读时不容易快速定位职责边界。
- 后续优化应继续沿用 `split-view-pages-by-feature`，不要另起一套重复 change。

## 下一步

1. 等待用户确认是否进入“开始执行”。
2. 若开始执行，优先从 `split-view-pages-by-feature` 未完成任务继续推进。
3. 优先处理 `VideoRemixTaskDetailPage.tsx` 和 `DigitalHumanVideoTasksPage.tsx`，先补测试，再做纯组件拆分。
4. 对基础设施层增加少量关键注释，避免在简单代码上堆注释。

## 验证结果

- 本阶段仅做结构调研和方案判断，尚未修改业务源码。
- 尚未运行测试命令。

---

## 2026-07-07 17:45 视频追爆详情页结构拆分进展

### 已完成

- 已继续执行 OpenSpec change：`split-view-pages-by-feature`。
- 已将 `src/pages/content/VideoRemixTaskDetailPage.tsx` 中稳定的详情页展示组件下沉到 `src/features/video-remix/components/detailComponents.tsx`：
  - `SectionTitle`
  - `UploadTrigger`
  - `AssetPreviewGrid`
  - `StepNavigation`
  - `StepActions`
  - `VideoPreviewCard`
  - `StepContentHint`
  - 页面级提示组件与素材 URL 工具函数
- 已让页面文件继续只负责：路由参数读取、React Query 查询与 mutation、表单状态与草稿协调、上传/保存/生成动作串联、最终页面区块组合。
- 已给 feature 组件补充关键中文注释，说明组件边界和 Ant Design 上传触发逻辑。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选视频追爆详情页拆分、命名、导入、测试验证相关任务。

### 当前判断

- 这次拆分没有改变 API、路由、React Query key、按钮行为和测试查询方式。
- `VideoRemixTaskDetailPage.tsx` 从约 1500 行降到约 1224 行；新增的 `detailComponents.tsx` 约 317 行，职责更集中。
- 目前没有把组件提升到 `shared`，因为这些组件仍然带有视频追爆详情页业务语义，放在 `features/video-remix` 更合适。

### 下一步

- 继续按 OpenSpec 处理下一个大页面：`src/pages/digital-human/DigitalHumanVideoTasksPage.tsx`。
- 优先抽取列表页中稳定的筛选区、指标摘要、任务卡片/列表区、分页与空/错/加载状态。
- 每拆完一批继续跑对应页面测试，并更新本进展文档。

### 验证结果

- `cmd /c npm test -- --config vitest.video-remix-temp.config.ts`：通过，1 个测试文件，36 个用例通过。
- `cmd /c npm test -- --config vitest.video-remix-form-temp.config.ts`：通过，1 个测试文件，5 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate split-view-pages-by-feature --strict`：通过。
---

## 2026-07-07 17:55 数字人视频任务列表页拆分进展

### 已完成

- 已新增 `src/features/digital-human/video/components/listComponents.tsx`，抽出数字人视频任务列表相关组件：
  - `DigitalHumanVideoMetricsGrid`
  - `DigitalHumanVideoTaskFilters`
  - `DigitalHumanVideoTaskListSection`
  - `buildDigitalHumanVideoMetrics`
- 已让 `src/pages/digital-human/DigitalHumanVideoTasksPage.tsx` 不再直接拼装指标卡片、筛选条、任务卡片列表和分页。
- 页面仍保留查询参数、分页状态、创建弹窗状态、删除确认、刷新 mutation、跳转详情等流程控制。
- 已将列表页可见文案恢复为正常中文，保持测试查询和用户可见行为稳定。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选列表页测试基线和数字人视频任务页列表区拆分任务。

### 当前判断

- 本阶段只拆出列表展示区，没有拆创建弹窗，避免一次改动覆盖过多表单和拖拽预览逻辑。
- 新组件放在 `features/digital-human/video/components`，因为当前页面和 hooks/form/status 都在 `features/digital-human/video` 下；相比另一个 `features/digital-human-video` 目录，这样更贴近现有依赖边界。
- `DigitalHumanVideoTasksPage.tsx` 当前约 869 行，新增 `listComponents.tsx` 约 266 行；页面职责比之前更偏向编排层。

### 下一步

- 可继续拆 `CustomisedAudiosPage.tsx` 或 `DigitalHumansPage.tsx`。
- 如果继续处理 `DigitalHumanVideoTasksPage.tsx`，下一步应谨慎拆创建弹窗，先补充更聚焦的弹窗/表单回归测试。

### 验证结果

- `cmd /c npm test -- --config vitest.digital-human-video-temp.config.ts`：通过，2 个测试文件，16 个用例通过。
- `cmd /c npm run typecheck`：通过。
---

## 2026-07-07 18:05 音色管理页拆分进展

### 已完成

- 已将 `src/pages/digital-human/CustomisedAudiosPage.tsx` 中的音色表单模型、校验、payload 映射下沉到 `src/features/digital-human/audio/form.ts`。
- 已将音色状态映射下沉到 `src/features/digital-human/audio/status.ts`。
- 已新增 `src/features/digital-human/audio/components.tsx`，承接：
  - `AudioFormModal`
  - `CustomisedAudioMetricsGrid`
  - `CustomisedAudioFilters`
  - `CustomisedAudioListSection`
  - `buildCustomisedAudioMetrics`
- 页面文件保留查询参数、分页状态、弹窗开关、创建/刷新/删除 mutation 和最终组合。
- 已新增 `vitest.customised-audios-temp.config.ts`，用于单独验证音色管理页回归测试。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选 `CustomisedAudiosPage.tsx` 拆分任务。

### 当前判断

- `CustomisedAudiosPage.tsx` 当前约 167 行，已经明显回到页面编排层。
- 音色表单、状态和列表 UI 没有提升到 `shared`，因为它们依赖音色领域字段和文案，属于 `digital-human/audio` feature。
- 本次没有改后端接口、React Query hooks、删除确认、创建提交或刷新行为。

### 下一步

- 继续处理 `DigitalHumansPage.tsx`，优先抽取数字人卡片列表、创建弹窗、本地上传预览和筛选控件。
- 处理前应先跑 `vitest.digital-humans-local-upload-temp.config.ts` 建立基线。

### 验证结果

- `cmd /c npm test -- --config vitest.customised-audios-temp.config.ts`：通过，1 个测试文件，4 个用例通过。
- `cmd /c npm run typecheck`：通过。---

## 2026-07-07 18:15 数字人列表页拆分进展

### 已完成
- 已完成 `src/pages/digital-human/DigitalHumansPage.tsx` 的内部职责拆分。
- 已新增并整理 `src/features/digital-human/components.tsx`，承接数字人列表页中稳定的 UI 与展示逻辑：
  - `DigitalHumanCreateModal`
  - `DigitalHumanMetricsGrid`
  - `DigitalHumanFilters`
  - `DigitalHumanListSection`
  - `buildDigitalHumanMetrics`
  - `getLocalUploadPreviewKind`
- 页面文件继续保留路由跳转、React Query 查询和 mutation、分页、筛选状态、弹窗开关与最终页面组合，避免把流程控制分散到展示组件里。
- 已修复新拆出组件中的用户可见文案和可访问名称乱码，包括本地上传图片预览、查看详情、刷新状态、删除数字人等测试依赖的可访问文本。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选 `5.5 DigitalHumansPage.tsx` 拆分任务。

### 当前判断
- `DigitalHumansPage.tsx` 当前约 188 行，已经回到页面编排层；`src/features/digital-human/components.tsx` 当前约 417 行，集中承接数字人领域展示组件。
- 本次没有修改 API 契约、路由路径、React Query key、创建/刷新/删除行为，只做结构拆分和乱码文案修复。
- 数字人相关组件仍保留在 `features/digital-human`，没有上提到 `shared`，因为它们依赖数字人领域字段和业务文案，不是通用组件。

### 下一步
- 继续处理 `PointsUsageStatisticsPage.tsx`，优先抽取统计指标、筛选区、用量列表/表格展示块到 `src/features/points`。
- 处理前先阅读页面现状和测试覆盖，避免拆分影响现有统计、分页和筛选行为。

### 验证结果
- `cmd /c npm test -- --config vitest.digital-humans-local-upload-temp.config.ts`：通过，1 个测试文件，7 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate split-view-pages-by-feature --strict`：通过。
---

## 2026-07-07 18:20 积分统计页拆分进展

### 已完成
- 已完成 `src/pages/points/PointsUsageStatisticsPage.tsx` 的内部职责拆分。
- 已新增 `src/features/points/components.tsx`，承接积分统计页中稳定的展示和格式化逻辑：
  - `PointsSummaryMetrics`
  - `PointsUsageOverview`
  - `PointsUsageRecordsPanel`
  - `PointsUsageDetailDrawer`
  - `buildPointsBusinessStats`
  - `formatPoints` / `formatDirectionPoints`
  - 积分业务类型、方向、状态的选项与展示映射
- 页面文件继续保留查询参数状态、分页变化、详情抽屉选中记录、React Query hooks 调用和错误提示组合。
- 已恢复本次触达区域内的正常中文文案，保持用户可见文本和测试断言一致。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选 `5.6 PointsUsageStatisticsPage.tsx` 拆分任务。

### 当前判断
- `PointsUsageStatisticsPage.tsx` 当前约 105 行，已经主要承担页面编排职责。
- `src/features/points/components.tsx` 当前约 457 行，集中放置积分统计页的领域展示组件、表格列定义和格式化规则。
- 本次没有修改积分接口契约、React Query key、分页和筛选行为，也没有把积分领域组件误提到 `shared`。

### 下一步
- 继续处理 `ImageVideoPage.tsx` 与相关任务页边界，先确认 text-image-video 的 feature 目录和现有测试，再决定是否拆分。
- 剩余最终检查项包括确认没有过度 wrapper、没有把一次性业务组件错误提升到 `shared`。

### 验证结果
- `cmd /c npm test -- --config vitest.points-usage-statistics-temp.config.ts`：通过，4 个测试文件，8 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate split-view-pages-by-feature --strict`：通过。
---

## 2026-07-07 18:30 图文生成视频页拆分与最终检查进展

### 已完成
- 已完成 `src/pages/content/ImageVideoPage.tsx` 的结构拆分。
- 已新增 `src/features/text-image-video/components.tsx`，承接图文生成视频页稳定 UI：
  - `InputModeSelector`
  - `UploadButtonTrigger`
  - `EmptyAssetPanel`
  - `AssetPreviewGrid`
  - `inputModeOptions`
  - `ImageVideoInputMode` / `UploadedImage` 类型
- 页面文件继续保留路由跳转、上传 mutation、生成文案 mutation、创建任务 mutation、表单状态、校验和最终页面组合。
- 修复了拆分前已暴露的几个回归点：
  - 恢复 `AI 生成文案` 按钮入口。
  - 上传 input 补回 `name="file"`，兼容既有测试和文件选择逻辑。
  - 上传按钮文案统一为 `上传商品图`。
  - 上传卡片显示文件名，删除按钮可访问名称统一为 `删除商品图-文件名`。
  - 测试预期对齐当前默认模型 `dreamina-seedance-2-0` 和当前接口路径 `/text-image-video/tasks`。
- 已更新 `openspec/changes/split-view-pages-by-feature/tasks.md`，勾选 `5.7` 与最终检查项 `7.5`。

### 当前判断
- `ImageVideoPage.tsx` 当前约 373 行，较拆分前更聚焦于页面流程；`features/text-image-video/components.tsx` 当前约 194 行，承接可复用的本领域 UI。
- 本次没有新增 `shared` 业务组件；`shared/components` 仍只包含 `LazyImage`、`MetricCard`、`PageShell`、`StatusPill` 等基础稳定组件。
- 当前拆出的组件数量适中，没有把每一行 JSX 都包装成 wrapper，主要围绕输入方式、上传触发和素材预览这些稳定边界拆分。

### 下一步
- `split-view-pages-by-feature` 的任务清单已全部勾选，可进入最终总体验证或后续归档准备。
- 如果继续优化，可另开或继续 UI 一致性 change，处理剩余乱码文案、Ant Design 组件统一和更细的交互一致性问题。

### 验证结果
- `cmd /c npm test -- --config vitest.text-image-video-temp.config.ts`：通过，5 个测试文件，25 个用例通过。
- `cmd /c npm test -- --config vitest.image-video-upload-style-temp.config.ts`：通过，1 个测试文件，3 个用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate split-view-pages-by-feature --strict`：通过。
