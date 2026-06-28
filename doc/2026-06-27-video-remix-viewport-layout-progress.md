# 2026-06-27 追爆任务详情页视口布局优化进展

## 已完成
- 已将追爆任务详情主卡片改为视口高度内展示：
  - 主详情区域限制在 `h-[calc(100vh-220px)]`
  - 同时保留最小高度，避免过矮窗口下布局塌陷
- 已把步骤内容区改为内部滚动：
  - 外层卡片不再继续无限增高
  - 用户滚动的是当前步骤内容，而不是整页
- 已保留底部 `下一步 / 保存` 悬浮操作区固定可见，配合内部滚动提升长表单操作效率

## 涉及文件
- `src/pages/VideoRemixTaskDetailPage.tsx`
- `src/pages/VideoRemixTaskDetailPage.test.tsx`

## 验证结果
- 已执行：`npx vitest run -c vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：通过，`21 passed`
- 已执行：`npx vitest run -c vitest.video-remix-regression.config.ts`
  - 结果：通过，`9 passed, 62 tests passed`
- 已执行：`npm run typecheck`
  - 结果：通过

## 当前判断
- 现在详情页已经更接近“工作台面板”交互，而不是传统长页面表单。
- 下一步按钮不需要再靠整页滚动去找，长内容会在主卡片内部消化。
- 如果后面还要继续优化，可以再看：
  - 页面头部说明区是否继续压缩
  - 三步导航卡片是否缩成更轻量的横向步骤条
