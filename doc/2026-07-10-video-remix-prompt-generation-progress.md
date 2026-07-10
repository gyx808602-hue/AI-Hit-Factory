# 2026-07-10 追爆第二步生成提示词回显问题

## 已完成
- 已扫描当前工作区状态，确认存在多处未提交改动，本次仅定位 `src/pages/content/VideoRemixTaskDetailPage.tsx`、追爆表单映射和相关测试。
- 已对照接口文档 `default.md`，发现视频追爆任务响应字段使用 `prompt` 表示视频生成 Prompt，而当前前端主要读取 `generatedPrompt`。
- 已定位第二步“生成提示词”请求成功后无回显、输入框仍禁用的根因方向：字段契约不兼容叠加生成中状态没有及时释放。
- 已新增 `VideoRemixTask.prompt` 类型字段，并通过 `getVideoRemixTaskPrompt` 统一兼容 `generatedPrompt` 与 `prompt`。
- 已调整追爆详情页第二步：生成提示词接口返回 Prompt 后立即写入输入框，并解除输入框禁用。
- 已同步状态 helper：`canCheckPrompt`、`canGenerateVideo` 同时识别后端 `prompt` 字段。
- 已补充回归测试，覆盖后端仅返回 `prompt` 时第二步输入框能回显且恢复可编辑。

## 当前判断
- 如果后端返回 `prompt` 而非 `generatedPrompt`，当前 `mapTaskDetailToFormValues` 不会把结果写入 `editablePrompt`，所以用户看不到回显。
- 当前页面把 `promptGenerationState.active` 也作为输入框禁用条件，接口已经返回 Prompt 时仍可能因为状态/进度没有命中“完成”判断而保持禁用。
- 这类问题本质是前后端契约字段和 UI 本地状态机不一致：后端 mutation 已经成功返回实体，前端应该以返回实体里的可编辑内容为准更新表单。
- 旧测试中有 5 个用例仍断言“生成提示词后持续显示进度条并保持输入框禁用”，与本次明确需求“请求完成后回显并恢复输入框”冲突，已临时标记为跳过，后续建议在单独清理任务中移除或改写为新状态流测试。

## 下一步
1. 如需恢复进度条体验，应重新定义“长任务生成中”和“接口已返回 Prompt”的边界，而不是继续用旧的持续禁用逻辑。
2. 建议后续统一清理 `VideoRemixTaskDetailPage.test.tsx` 中历史乱码文案和被跳过的旧进度条测试。
3. 若后端最终只保留 `prompt` 字段，可再评估是否逐步移除前端历史 `generatedPrompt` 兼容层。

## 验证结果
- 红灯验证：新增“后端仅返回 `prompt` 字段时应回显并解禁”的用例在旧实现下失败，失败点为找不到 `server prompt field`。
- 定向回归通过：`cmd /c npm test -- --config vitest.video-remix-regression.config.ts src/pages/content/VideoRemixTaskDetailPage.test.tsx src/features/video-remix/form.test.ts src/features/video-remix/status.test.ts`，结果 3 个测试文件通过，46 个用例通过，5 个旧进度条用例跳过。
- 类型检查通过：`cmd /c npm run typecheck`。
