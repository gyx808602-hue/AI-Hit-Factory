# 2026-06-24 视频追爆进展 01

## 本轮完成

- 已完成视频追爆详情页 3 个关键交互优化：
  - 切换“目标模型”时，立即重置旧 Prompt、旧生成结果和相关状态字段
  - 点击“生成 Prompt”时，先保存当前表单，再调用生成 Prompt 接口
  - 重新打开“生成视频”按钮，但仅在 Prompt 已成功生成后展示
- 已修复详情页本地缓存与表单显示不同步问题：
  - 原因是切换模型时使用了表单当前值做新旧比较，导致重置逻辑可能提前返回
  - 现已改为基于 React Query 缓存中的最新任务数据判断，并在重置后同步刷新表单

## 本轮代码变更

- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 模型切换时从 query cache 读取最新任务
  - 调用 `resetTaskGeneratedState(...)` 后写回缓存
  - 同步执行 `form.setFieldsValue(...)`，确保 Prompt 区、结果区、按钮区即时刷新

## 验证记录

- 已执行：
  - `npm test -- src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：1 个文件，7 个用例全部通过
- 已执行：
  - `npm test -- src/api/aigc/video-remix-tasks/index.test.ts src/pages/ViralRemixPage.test.tsx src/pages/VideoRemixTasksPage.test.tsx src/pages/VideoRemixTaskDetailPage.test.tsx src/features/video-remix/status.test.ts src/features/video-remix/form.test.ts src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
  - 结果：8 个文件，37 个用例全部通过
- 已执行：
  - `npm run typecheck`
  - 结果：通过
- 已执行：
  - `npm run build`
  - 结果：通过

## 当前遗留

- OpenSpec 中 `7.5 手动验证“创建 -> 详情 -> 保存 -> 生成 -> 刷新 -> 回看”主链路` 还未完成
- 测试运行期间仍有 `jsdom` 的 `getComputedStyle(..., pseudo-elements)` 提示，但不影响断言结果与构建结果
