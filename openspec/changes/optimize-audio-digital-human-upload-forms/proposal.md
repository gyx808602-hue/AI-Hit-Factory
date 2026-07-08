## Why

当前“文件音色”和“数字人”两个新建弹窗都涉及素材输入，但体验和数据闭环还不统一：

- 文件音色新建应先收敛到最小必要字段，只保留名称和音频地址。音频地址不应主要依赖手动粘贴，而应参考追爆页的上传方式，通过现有上传 API 获得稳定 URL 后再提交。
- 数字人新建弹窗中的本地训练素材应参考追爆页的上传交互，视频和图片上传后必须有结果回显，并且用户可以手动删除已上传结果。
- 这类本地修改需要明确记录在项目文档和 OpenSpec 任务中，避免后续迭代误把已经确认的上传式表单又改回原始输入框或本地 File 直传模式。

本变更的目标是统一这两处“先上传素材、再提交业务表单”的前端交互，并用文档固定约束。

## What Changes

- 文件音色新建弹窗只保留“音色名称”和“音频地址/音频上传结果”两个必要字段。
- 文件音色音频地址参考追爆页上传方式：使用 Ant Design Upload 或 Upload.Dragger，手动调用项目现有 `uploadAudio(file)`，上传成功后把返回 URL 写入表单。
- 文件音色创建 payload 只主动提交名称和音频 URL，不再主动提交模型、语种、试听文案等隐藏字段。
- 数字人新建弹窗本地训练素材改为上传式流程：用户选择图片或视频后，使用现有上传 API 上传，保存返回的 URL、文件名和素材类型。
- 数字人本地训练素材上传成功后展示结果回显：图片展示图片预览，视频展示视频播放器或可识别的视频预览区。
- 数字人本地训练素材回显区提供删除入口，删除后同步清空 URL、文件名、素材类型和表单校验状态。
- 保持现有列表、搜索、筛选、分页、刷新、删除、详情跳转、编辑入口等非本次范围行为不变。
- 在 OpenSpec 与 `doc/progress.md` 中记录本地修改边界，后续实现后继续更新专题进展文档，降低误回退风险。

## Capabilities

### New Capabilities

- `audio-digital-human-upload-forms`: 约束文件音色新建和数字人新建本地训练素材的上传、回显、删除、提交与防回退记录行为。

### Modified Capabilities

- `customised-audio-create-form`: 扩展既有音色创建表单优化范围，明确只保留名称和音频地址，并使用上传结果作为音频地址来源。
- `digital-human-management-flow`: 扩展数字人新建弹窗的本地训练素材输入方式，要求上传后回显和可删除。

## Impact

- 前端页面：
  - `src/pages/digital-human/CustomisedAudiosPage.tsx`
  - `src/pages/digital-human/DigitalHumansPage.tsx`
- 领域组件与表单：
  - `src/features/digital-human/audio/components.tsx`
  - `src/features/digital-human/audio/form.ts`
  - `src/features/digital-human/components.tsx`
  - `src/features/digital-human/form.ts`
- API 复用：
  - `src/api/aigc/uploads/index.ts` 中的 `uploadAudio`、`uploadImage`、`uploadVideo`
  - `src/api/aigc/customised-audios/types.ts`
  - `src/api/aigc/digital-persons/types.ts`
  - `src/api/aigc/digital-persons/index.ts`
- 测试：
  - `src/pages/digital-human/CustomisedAudiosPage.test.tsx`
  - `src/pages/digital-human/DigitalHumansPage.test.tsx`
  - 对应 feature form 测试按实际改动补充
- 文档：
  - `doc/progress.md`
  - 建议新增专题进展文档：`doc/2026-07-07-audio-digital-human-upload-forms-progress.md`

本变更不新增依赖，不调整路由，不改菜单权限，不改后端接口路径。
