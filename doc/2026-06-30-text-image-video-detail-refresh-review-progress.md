# 2026-06-30 文图生视频详情刷新按钮评审进展

## 阶段 1：现状审查

- 已检查文件：
  - `src/pages/TextImageVideoTaskDetailPage.tsx`
  - `src/pages/DigitalHumanVideoTaskDetailPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.test.tsx`
  - `src/api/customer/text-image-video/index.ts`
- 当前 `文图生视频详情` 页的刷新按钮行为：
  - 点击执行 `taskDetailQuery.refetch()`
  - 即：重新请求 `getTextImageVideoTaskDetail(taskId, { silentError: true })`
  - 不会调用独立的“后端刷新任务状态”接口
- 当前页还存在自动轮询：
  - 当 `getTextImageVideoTaskStatusMeta(task).resultState === "processing"` 时
  - `refetchInterval` 每 `5000ms` 自动拉取一次详情

## 阶段 2：与相邻页面对比

- `TextImageVideoTaskDetailPage`
  - 按钮文案：`刷新详情`
  - 行为：重新拉详情接口
  - 语义：偏“客户端重取数据”
- `DigitalHumanVideoTaskDetailPage`
  - 按钮文案：`刷新状态`
  - 行为：调用 `refreshMutation.mutate(taskId)`
  - 语义：偏“显式触发后端刷新状态”
- `VideoRemixTaskDetailPage`
  - 页面里存在“刷新详情”动作
  - 但其内部实际走的是任务动作流，语义比单纯 `refetch` 更重

## 评审结论

- 这个按钮当前 **能用，而且不算逻辑错误**
- 以实现来看，文案写成 `刷新详情` 是合理的，因为它确实只是“重新获取详情”
- 但从用户心智来看，容易误解为：
  - 会主动推动服务端刷新任务状态
  - 或者会触发一次更强的任务同步动作
- 再叠加页面本身已经有“处理中时每 5 秒自动轮询”：
  - 对处理中任务，手动点这个按钮的边际价值其实不高
  - 对已完成/已失败任务，它更像“立即再拉一次最新详情”

## 建议

- 如果保持当前实现不变：
  - `刷新详情` 这个文案是可以接受的
  - 但建议后续补一个 `loading/disabled` 态，更符合按钮反馈预期
- 如果想让语义更清楚：
  - 可考虑改成 `重新获取`
  - 或 `重新加载详情`
- 不建议把当前按钮直接改叫 `刷新状态`
  - 因为它并没有调用独立状态刷新接口
  - 这样会造成文案承诺大于实际行为
