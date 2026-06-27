# 2026-06-24 视频追爆进展 03

## 本轮完成

- 已修复视频追爆详情页动作按钮 loading 串台问题：
  - 之前 `刷新详情`、`生成 Prompt`、`生成视频` 共用一个 `actionMutation.isPending`
  - 导致点击任意一个动作时，其它动作按钮也会一起转圈
- 现已按动作维度拆分 loading 展示：
  - `刷新详情` 只在 `refresh` 执行时 loading
  - `生成 Prompt` 只在 `generate-prompt` 执行时 loading
  - `生成视频` 只在 `generate-video` 执行时 loading

## 本轮代码变更

- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 新增 `pendingAction` 本地状态
  - 保留统一的 `actionMutation`，但在发起动作时记录当前动作类型
  - 在 `onSuccess` / `onError` 中清空 `pendingAction`
  - 三个按钮改为分别读取自己的 loading 条件
- `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 新增“点击生成视频时，生成 Prompt 不应一起 loading”的专项断言
  - 保留并通过之前的 Prompt/视频链路、素材删除、音频预览等回归用例

## 验证记录

- 已执行：
  - `npx vitest run -c vitest.video-remix-temp.config.ts`
  - 结果：`src/pages/VideoRemixTaskDetailPage.test.tsx`，10/10 用例通过
- 已执行：
  - `npm run typecheck`
  - 结果：通过
- 已执行：
  - `npm run build`
  - 结果：通过

## 当前遗留

- 仓库当前常规 `npm test -- <file>` 仍受 `vite.config.ts` 中测试 include/exclude 配置影响，详情页专项测试继续依赖临时 vitest 配置运行
- OpenSpec 中 `7.5 手动验证“创建 -> 详情 -> 保存 -> 生成 -> 刷新 -> 回看”主链路` 仍未完成
