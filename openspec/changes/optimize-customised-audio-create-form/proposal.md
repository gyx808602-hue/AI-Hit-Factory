## Why

当前音色管理创建弹窗暴露了模型类型、语种、试听文案和音频地址输入框，但现阶段真实创建参数只需要音色名称和参考音频地址。让用户手填音频 URL 容易出错，也和爆文改编等页面已经形成的上传体验不一致。

本变更用于收敛音色创建表单：隐藏暂不开放的高级字段，把参考音频从手动输入改为上传后展示，降低创建成本并减少无效提交。

## What Changes

- 音色创建弹窗只展示音色名称和参考音频上传入口。
- 模型选择、语种选择、试听文案在创建弹窗中隐藏，不再由用户填写。
- 音频地址不再展示为输入框，改为 Ant Design Upload/Dragger 风格的上传区域。
- 上传成功后展示已上传音频文件名和成功状态，并把上传接口返回的音频 URL 写入创建表单值。
- 创建提交只发送音色名称和参考音频 URL 对应字段；不主动提交模型、语种、试听文案。
- 保持现有音色列表、搜索、状态筛选、分页、刷新、删除、编辑弹窗入口不在本次范围内重做。
- 暂不新增公共上传组件，优先复用页面内现有上传 API 与项目已有上传交互模式。

## Capabilities

### New Capabilities

- `customised-audio-create-form`: 约束音色管理创建弹窗的字段展示、音频上传展示、创建提交和校验行为。

### Modified Capabilities

- 无。本次是音色管理页面内的创建表单增量能力，当前主规格中尚无独立音色创建表单规格。

## Impact

- 前端页面：`src/pages/CustomisedAudiosPage.tsx`
- 页面测试：`src/pages/CustomisedAudiosPage.test.tsx`
- 上传 API 复用：`src/api/aigc/uploads/index.ts` 中的 `uploadAudio`
- 音色创建 API 类型：`src/api/aigc/customised-audios/types.ts`
- 不新增依赖，不调整路由，不修改后端接口路径。
- 字段命名注意：用户口径中的 `referenceAudioUrl` 在当前前端创建请求中对应 `url`。若后端真实契约已改名为 `referenceAudioUrl`，实现阶段应同步调整类型与 API 测试；否则保持现有 `url`，避免扩大接口变更范围。
