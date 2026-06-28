## 1. OpenSpec 上下文与现状核对

- [x] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、`openspec/changes/redesign-video-remix-step-flow/proposal.md`、`design.md`、`specs/video-remix-step-flow/spec.md`
- [x] 1.2 核对当前追爆任务现有实现文件：`src/pages/ViralRemixPage.tsx`、`src/pages/VideoRemixTasksPage.tsx`、`src/pages/VideoRemixTaskDetailPage.tsx`、`src/features/video-remix/form.ts`、`src/features/video-remix/status.ts`
- [x] 1.3 确认本次改造不新增全局 store、不新增子路由、不修改后端接口路径，并在实现前更新 `doc/progress.md` 和专项进展文档

## 2. 追爆任务表单与状态适配层改造

- [ ] 2.1 调整 `src/features/video-remix/form.ts`，为“素材上传和配置”“提示词”“视频生成”三步重新梳理字段映射边界
- [ ] 2.2 保留内部图片 URL 文本映射兼容逻辑，但移除 UI 对商品图、人物图 URL 直接输入的依赖
- [ ] 2.3 扩展 `src/features/video-remix/status.ts`，补充提示词生成阶段、视频生成阶段的按钮可用性、进度展示和失败反馈判断
- [x] 2.4 为步骤切换、提示词可编辑、进度条展示新增或更新对应的 feature 层测试

## 3. 任务详情页步骤式工作流重构

- [ ] 3.1 重构 `src/pages/VideoRemixTaskDetailPage.tsx`，加入三步流程导航并以页面局部状态控制当前步骤
- [ ] 3.2 将“素材上传和配置”改为第一个步骤，调整字段顺序为“素材上传在前，内容方向在后”
- [ ] 3.3 在素材步骤中为“复刻方向”增加备注说明，并为“产品信息”“口播文案”增加“AI 自动生成”按钮入口
- [ ] 3.4 删除素材步骤中的“视频摘要”输入区，并将商品图、人物图交互改为“上传 + 预览 + 删除”
- [ ] 3.5 缩小参考视频预览布局，占用更少页面空间但保留预览能力
- [ ] 3.6 将提示词区域改造成独立步骤，展示当前提示词、支持手动编辑、支持触发生成提示词
- [ ] 3.7 将视频生成区域改造成独立步骤，加入参考视频与生成视频的对比展示
- [ ] 3.8 在提示词生成、视频生成步骤中加入步骤区内的 loading、进度条、状态文案和失败原因展示

## 4. 入口页与列表页协同调整

- [ ] 4.1 保持 `src/pages/VideoRemixTasksPage.tsx` 的“创建任务后进入详情页”链路不变，必要时调整提示文案以匹配新步骤流
- [ ] 4.2 核对 `src/pages/ViralRemixPage.tsx` 是否仍需保留为旧入口页或引导页，避免与当前主链路产生冲突
- [ ] 4.3 确认 `src/app/router/routeRegistry.tsx`、`routeTypes.ts`、相关菜单高亮逻辑无需新增子路由，仅保持现有任务列表与详情路由可用

## 5. 页面测试与回归验证

- [ ] 5.1 更新 `src/pages/VideoRemixTaskDetailPage.test.tsx`，覆盖步骤导航、字段顺序、删除视频摘要、隐藏 URL 输入、提示词可编辑、进度反馈和视频对比
- [ ] 5.2 根据实际改动更新 `src/pages/ViralRemixPage.test.tsx`、`src/pages/VideoRemixTasksPage.test.tsx` 或相关路由测试
- [ ] 5.3 执行追爆任务相关测试命令，确认页面主流程回归通过
- [ ] 5.4 执行类型检查或构建命令，确认本次改造未破坏现有工程

## 6. 文档与收尾

- [ ] 6.1 完成每一小阶段后更新 `doc/progress.md`
- [ ] 6.2 同步更新 `doc/2026-06-27-video-remix-stepflow-progress.md`，记录本次 OpenSpec 建立、方案决策和后续执行状态
- [ ] 6.3 在实现完成后，补充最终验证结果与剩余风险说明
