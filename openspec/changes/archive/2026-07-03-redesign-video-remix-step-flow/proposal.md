## Why

当前“追爆任务”前端虽然已经具备任务列表、任务详情和基础生成能力，但整体仍是“大表单 + 结果区”的编辑模型，和用户现在要的“分步骤流程导航”存在明显偏差。现在需要把追爆任务重构成更符合创作心智的工作流页面，降低填写负担，并让提示词生成、视频生成这两个异步阶段的状态反馈更清晰。

## What Changes

- 将现有追爆任务编辑体验重构为流程导航式工作流，默认采用“创建任务入口独立保留，详情页承载后续步骤”的方案。
- 重新组织任务详情页内容，拆分为：
  - 素材上传和配置
  - 提示词生成与编辑
  - 视频生成与结果对比
- 在素材上传和配置步骤中调整字段顺序、字段说明和上传交互：
  - 将“内容方向/复刻方向”移动到素材上传之后
  - 为“复刻方向”增加备注说明
  - 为“产品信息”“口播文案”增加“AI 自动生成”按钮入口
  - 缩小参考视频预览区域
  - 删除“视频摘要”字段
  - 商品图、人物图仅保留上传与预览，不再让用户直接输入 URL
  - 移除所有“选择文件 未选择文件”式原生上传文案
- 将提示词从只读结果区提升为独立步骤页面，展示生成结果并允许用户手动修改。
- 在视频生成步骤加入新老视频对比展示，突出改编结果和参考视频的对照关系。
- 完善提示词生成、视频生成过程中的 loading、进度条和阶段状态提示。

## Capabilities

### New Capabilities
- `video-remix-step-flow`: 为追爆任务提供基于步骤导航的素材配置、提示词编辑、视频生成和结果对比工作流。

### Modified Capabilities

## Impact

- 前端页面：
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
- 追爆任务表单适配与状态映射：
  - `src/features/video-remix/form.ts`
  - `src/features/video-remix/status.ts`
- 追爆任务接口契约与交互实现：
  - `src/api/aigc/video-remix-tasks/types.ts`
  - `src/api/aigc/video-remix-tasks/index.ts`
- 页面测试与交互回归：
  - `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - `src/pages/ViralRemixPage.test.tsx`
  - 相关路由或特性测试文件
