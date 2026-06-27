# 2026-06-24 视频追爆进展 04

## 本轮完成

- 已按最新要求把视频追爆默认模型统一改为 `seedance2.0`
- 本轮只修改默认值，不恢复也不调整已注释掉的“目标模型”页面选择逻辑

## 本轮代码变更

- `src/features/video-remix/form.ts`
  - `mapTaskDetailToFormValues(...)` 的兜底模型从 `wan2.7-r2v` 改为 `seedance2.0`
- `src/pages/ViralRemixPage.tsx`
  - 创建任务后写入草稿时，`targetVideoModel` 默认值改为 `seedance2.0`
- `src/features/video-remix/form.test.ts`
  - 新增“无后端模型值时默认使用 seedance2.0”的断言

## 验证记录

- 已执行：
  - `npm run typecheck`
  - 结果：通过
- 已执行：
  - `npm run build`
  - 结果：通过

## 当前说明

- 详情页中的“目标模型”字段仍保持你当前手动注释后的状态，没有重新显示
- 如果后面你希望彻底去掉相关旧测试或页面残留文案，我可以再继续做一轮清理
