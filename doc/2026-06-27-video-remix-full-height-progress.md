# 2026-06-27 追爆任务详情页铺满高度微调进展

## 已完成
- 已将追爆任务详情主卡片从“固定视口计算高度”调整为“高度铺满父容器”：
  - 主容器改为 `h-full`
  - 保留 `min-h-[720px]` 作为最低高度兜底
- 已保持内部滚动结构不变：
  - 步骤内容区继续内部滚动
  - 底部 `下一步 / 保存` 仍保持可见

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
- 现在详情主卡片的高度语义更自然，优先跟随可用区域铺满，而不是自己重新计算视口值。
- 最低高度保留下来后，小窗口下也不会让内部布局过度压缩。
