## 1. 前置复核

- [x] 1.1 读取 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md` 和 `specs/audio-digital-human-upload-forms/spec.md`，确认范围只覆盖文件音色新建与数字人新建本地训练素材。
- [x] 1.2 复核追爆页上传实现：`src/pages/content/ViralRemixPage.tsx`，确认可复用的 `Upload/Dragger + beforeUpload + upload API + 回显` 模式。
- [x] 1.3 复核上传 API：`src/api/aigc/uploads/index.ts`，确认 `uploadAudio`、`uploadImage`、`uploadVideo` 的返回字段。
- [x] 1.4 复核创建 API 契约：`src/api/aigc/customised-audios/types.ts`、`src/api/aigc/digital-persons/types.ts`、`src/api/aigc/digital-persons/index.ts`，确认音色 URL 字段和数字人 URL 创建路径。

## 2. 测试先行

- [x] 2.1 更新 `src/pages/digital-human/CustomisedAudiosPage.test.tsx`，覆盖新建弹窗只展示音色名称和音频上传入口，不展示模型、语种、试听文案。
- [x] 2.2 更新音色测试，mock `uploadAudio`，覆盖上传成功后展示文件名、音频播放器、删除入口，并在提交 payload 中只包含名称和音频 URL。
- [x] 2.3 更新音色测试，覆盖未填写名称、未上传音频、上传失败时阻止创建并展示反馈。
- [x] 2.4 更新 `src/pages/digital-human/DigitalHumansPage.test.tsx`，mock `uploadImage` 和 `uploadVideo`，覆盖本地训练素材图片上传后回显图片和可删除。
- [x] 2.5 更新数字人测试，覆盖本地训练素材视频上传后回显视频和可删除。
- [x] 2.6 更新数字人测试，覆盖删除已上传素材后创建请求被校验拦截，且不会继续提交旧 URL。

## 3. 文件音色表单实现

- [x] 3.1 调整 `src/features/digital-human/audio/form.ts`，创建态表单值收敛到 `name`、`url`，保留必要 UI 状态时不进入创建 payload。
- [x] 3.2 调整 `src/features/digital-human/audio/components.tsx` 的 `AudioFormModal`，创建模式只渲染名称和音频上传/回显/删除区；编辑模式按当前能力保持可回填，不扩大编辑保存范围。
- [x] 3.3 在 `src/pages/digital-human/CustomisedAudiosPage.tsx` 接入 `uploadAudio`，管理上传中、上传错误、上传文件名等弹窗局部状态。
- [x] 3.4 上传成功后将返回 URL 写入 `formValues.url`，删除音频时同步清空 URL、文件名和错误。
- [x] 3.5 提交创建时只主动提交名称和音频 URL 对应字段；当前后端字段仍为 `url`。

## 4. 数字人本地训练素材实现

- [x] 4.1 调整 `src/features/digital-human/form.ts`，整理本地上传后的 URL、文件名、素材类型字段，避免创建 payload 继续依赖已删除的旧 File。
- [x] 4.2 调整 `src/pages/digital-human/DigitalHumansPage.tsx`，引入并使用 `uploadImage`、`uploadVideo`，根据 MIME 类型选择上传 API。
- [x] 4.3 调整 `src/features/digital-human/components.tsx` 的 `DigitalHumanCreateModal`，把本地训练素材入口改为 Ant Design Upload/Dragger 风格，并展示图片/视频上传结果。
- [x] 4.4 为数字人素材回显区增加删除入口，删除时清空 URL、文件名、素材类型、本地 File 和相关校验错误。
- [x] 4.5 创建数字人时优先提交上传成功后的 `fileUrl`；当前接口类型已支持 `fileUrl`。
- [x] 4.6 保持数字人列表、筛选、分页、刷新、删除、详情跳转行为不变。

## 5. 防回退记录

- [x] 5.1 新增专题进展文档 `doc/2026-07-07-audio-digital-human-upload-forms-progress.md`，记录本次行为边界、已改文件、验证结果和“不要回退为手动地址输入/本地 File 直传”的原因。
- [x] 5.2 更新 `doc/progress.md`，记录每个小阶段完成情况、当前判断、下一步和验证结果。
- [x] 5.3 在相关测试中保留可读断言，明确要求音色新建不展示隐藏字段、数字人上传结果删除后不提交旧 URL。

## 6. 验证

- [x] 6.1 运行 `cmd /c npm test -- --config vitest.customised-audios-temp.config.ts`。
- [x] 6.2 运行 `cmd /c npm test -- --config vitest.digital-humans-local-upload-temp.config.ts`。
- [ ] 6.3 运行 `cmd /c npm run typecheck`。
- [ ] 6.4 运行 `cmd /c openspec validate optimize-audio-digital-human-upload-forms --strict`。
- [ ] 6.5 如果改动 UI 明显，启动 dev server 并在浏览器检查 `/customised-audios` 和 `/digital-humans` 的弹窗上传、回显、删除流程。
