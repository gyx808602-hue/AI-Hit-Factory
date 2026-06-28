# 2026-06-27 追爆任务详情页工作区对齐进展

## 已完成
- 已按截图目标把页面工作区高度链打通：
  - `PageShell` 从整页滚动结构调整为 `flex` 高度承接结构
  - 标题区固定在上方
  - 页面主体内容区承接剩余高度
- 已保持追爆详情页主卡片继续 `h-full` 铺满内容区，并保留最低高度兜底
- 已保留详情页内部滚动逻辑：
  - 外层工作区不再自己滚长页面
  - 实际滚动发生在详情卡片内部步骤内容区

## 涉及文件
- `src/shared/components/PageShell.tsx`
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
- 现在整体布局更接近你截图里的效果：标题栏在上，大卡片吃满主工作区，滚动发生在卡片内部。
- 这一轮是结构级优化，不只是调一个高度类名，所以后续同样使用 `PageShell` 的页面也能复用这套更稳的高度承接方式。
