# 2026-07-07 音色与数字人上传表单优化进展

## 已完成

- 文件音色新建弹窗已收敛为“音色名称 + 音频上传”。
- 音频地址改为通过 `uploadAudio(file)` 上传后回填，不再以手动输入作为创建主流程。
- 音色上传成功后回显文件名和音频播放器，并支持“删除音频”清空当前表单引用。
- 音色创建 payload 只主动提交 `{ name, url }`，不再提交模型、语种、试听文案等隐藏字段。
- 数字人新建弹窗本地训练素材改为 Ant Design `Upload.Dragger`。
- 数字人本地训练素材根据 MIME 类型分别调用 `uploadImage(file)` 或 `uploadVideo(file)`。
- 数字人上传成功后回填服务端返回的 `fileUrl`、文件名和素材类型，并按图片/视频显示结果。
- 数字人训练素材支持“删除训练素材”，删除后清空 `fileUrl`、文件名、素材类型和本地 `File`。
- 数字人创建 payload 优先提交上传后的 `fileUrl`，不再依赖本地 `File` 直传。

## 已改文件

- `src/features/digital-human/audio/form.ts`
- `src/features/digital-human/audio/components.tsx`
- `src/pages/digital-human/CustomisedAudiosPage.tsx`
- `src/features/digital-human/form.ts`
- `src/features/digital-human/components.tsx`
- `src/pages/digital-human/DigitalHumansPage.tsx`
- `src/pages/digital-human/CustomisedAudiosPage.test.tsx`
- `src/pages/digital-human/DigitalHumansPage.test.tsx`

## 当前判断

- 上传接口负责把浏览器本地文件转为稳定 URL。
- 创建接口只负责消费业务字段和稳定 URL。
- 删除上传回显只清空当前表单状态，不删除远端对象，也不做磁盘删除。

## 不可回退点

- 不要把文件音色新建恢复为手动填写音频地址的主流程。
- 不要在文件音色创建 payload 中恢复提交模型、语种、试听文案等隐藏字段。
- 不要把数字人新建恢复为本地 `File` 直传创建；应先上传素材，再提交 `fileUrl`。
- 删除音频或训练素材后，后续创建请求不能继续提交旧 URL。

## 验证结果

- `cmd /c npm test -- --config vitest.customised-audios-temp.config.ts`：通过，5 个测试全绿。
- `cmd /c npm test -- --config vitest.digital-humans-local-upload-temp.config.ts`：通过，8 个测试全绿。
- `cmd /c npm run typecheck`：待执行。
- `cmd /c openspec validate optimize-audio-digital-human-upload-forms --strict`：待执行。
