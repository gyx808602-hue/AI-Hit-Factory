## 1. 前置复核

- [x] 1.1 读取 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md` 和 `specs/customised-audio-create-form/spec.md`，确认实现范围只覆盖音色创建弹窗。
- [x] 1.2 复核 `src/pages/CustomisedAudiosPage.tsx`、`src/pages/CustomisedAudiosPage.test.tsx`、`src/api/aigc/uploads/index.ts` 和 `src/api/aigc/customised-audios/types.ts`，确认当前创建字段名使用 `url` 还是需要改为 `referenceAudioUrl`。

## 2. 测试先行

- [x] 2.1 在 `src/pages/CustomisedAudiosPage.test.tsx` 中 mock `uploadAudio`，新增或调整用例：创建弹窗只展示音色名称和参考音频上传入口，不展示模型、语种、试听文案。
- [x] 2.2 新增上传成功用例：选择音频文件后调用 `uploadAudio`，展示上传文件名或成功状态，提交时 payload 包含名称和参考音频 URL。
- [x] 2.3 新增校验用例：缺少音色名称或未成功上传参考音频时阻止 `createMutation.mutateAsync`。
- [x] 2.4 新增 payload 收敛断言：创建 payload 不主动包含 `modelType`、`language`、`text`。

## 3. 页面实现

- [x] 3.1 修改 `src/pages/CustomisedAudiosPage.tsx` 的创建表单状态，只保留创建所需的 `name`、音频 URL 和上传展示所需文件名/上传中状态。
- [x] 3.2 引入并复用 `uploadAudio(file)`，使用 Ant Design `Upload` 或 `Upload.Dragger` 的 `beforeUpload` 手动上传音频，并返回 `false` 阻止默认上传。
- [x] 3.3 将音频地址输入框替换为上传展示区域，上传成功后展示文件名/成功状态，上传失败时展示错误反馈且不写入表单 URL。
- [x] 3.4 隐藏创建弹窗中的模型选择、语种选择、试听文案输入；不要新增公共上传组件或 shared 抽象。
- [x] 3.5 修改创建 payload 映射，只主动提交音色名称和参考音频 URL 对应字段；若确认后端字段已改为 `referenceAudioUrl`，同步调整类型和测试，否则保持现有 `url`。
- [x] 3.6 确认音色列表、搜索、状态筛选、分页、刷新、删除、编辑入口行为不因本次修改而变化。

## 4. 验证与文档

- [x] 4.1 执行 `npx vitest run --config vite.request-test.config.ts src/pages/CustomisedAudiosPage.test.tsx`，确认页面定向测试通过。
- [x] 4.2 执行 `npm run typecheck`，确认 TypeScript 检查通过。
- [x] 4.3 执行 `cmd /c openspec validate optimize-customised-audio-create-form --strict`，确认 OpenSpec 校验通过。
- [x] 4.4 更新 `doc/2026-07-07-customised-audio-form-progress.md`，记录实现结果、当前判断、下一步和验证结果。

## 5. 参考音频展示样式补充

- [x] 5.1 调整 `src/pages/CustomisedAudiosPage.test.tsx`，覆盖未上传时的参考音频空态、上传按钮和无播放器状态。
- [x] 5.2 调整 `src/pages/CustomisedAudiosPage.test.tsx`，覆盖上传成功后的已上传状态、音频播放器和删除音频入口。
- [x] 5.3 修改 `src/pages/CustomisedAudiosPage.tsx`，将创建弹窗参考音频区域改为“标题 + 上传音频按钮 + 辅助说明 + 预览/空态容器”的展示形式。
- [x] 5.4 运行页面定向测试、类型检查和 OpenSpec strict 校验，并更新进展文档。
