# 2026-06-30 视频追爆任务提示词重生成进展
## 第一阶段完成：现状定位与根因确认

### 已完成
- 已检查目标文件：
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - `src/features/video-remix/status.ts`
  - `src/api/aigc/video-remix-tasks/index.ts`
  - `src/api/aigc/video-remix-tasks/types.ts`
- 已确认本次需求落点在“编辑视频追爆任务”详情页的第 2 步 `prompt` 阶段。
- 已确认当前“生成 Prompt / 重新生成 Prompt”调用的是既有接口：
  - `POST /user-api/aigc/video-remix-tasks/:id/generate-prompt`
- 已确认当前页面存在两个状态源混用问题：
  - 输入框是否可编辑，没有单独跟随“重新生成 Prompt”动作锁定；
  - 提示词进度条虽然展示 `task.progress`，但展示区块条件混入了页面总任务状态与本地输入态，语义不够纯。

### 根因判断
- 这不是接口问题，也不是步骤流本身问题，而是前端页面状态建模不够细：
  - “提示词生成中”应该视为一个独立的前端交互状态；
  - “提示词生成进度”应该只由生成提示词接口返回或后续刷新得到的任务进度驱动；
  - 不应该再由输入框里有没有内容来间接影响进度展示逻辑。

### 本轮最小改动边界
- 只修改：
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.test.tsx`
- 不修改：
  - 后端接口契约
  - 任务步骤结构
  - 第 3 步视频生成逻辑
  - 其他任务页面

### 下一步
- 先补回归测试，锁定两条行为：
  - 点击重新生成 Prompt 后，第 2 步输入框进入禁用态；
  - 提示词进度条根据提示词生成动作状态显示，而不是依据输入框内容显示。
- 再做页面实现修正并跑定向测试与类型检查。

## 第二阶段完成：实现修正与第三步参考视频根因补充

### 已完成
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 中补入“提示词生成态”本地状态：
  - 点击生成/重新生成 Prompt 后，`editablePrompt` 输入框进入禁用态；
  - 提示词进度条改为使用独立的提示词生成状态显示；
  - 提示词生成进行中时，详情页会按 `5000ms` 轮询详情接口，直到进度结束。
- 已将动作接口返回结果改为先与旧任务详情合并，再回写到缓存与表单：
  - 这样即使 `refresh` 或 `generate-prompt` 返回体里缺少 `form`，也不会把原来的表单字段冲掉。
- 已发现并移除第 3 步视频生成区域的调试残留：
  - 原区域存在裸输出 `{referenceVideoUrl}---`，属于无意义的调试痕迹。

### 新增根因判断
- 第 3 步“参考视频不回显”的高概率根因，不是预览组件本身，而是动作返回结果覆盖了原有表单态：
  - 页面第 3 步参考视频使用的是表单里的 `referenceVideoUrl`；
  - 但 `refresh / generate-*` 成功后，页面之前直接用接口返回值整体重建表单；
  - 一旦后端返回体未带完整 `form.referenceVideoUrl`，前端本地值会被清空；
  - 最终表现就是第 3 步参考视频预览消失。

### 当前待验证
- 还需要跑定向 `VideoRemixTaskDetailPage` 回归测试，确认：
  - 第 2 步旧断言与新 `data-testid` 是否全部对齐；
  - 第 3 步“刷新返回缺少 form 时仍保留参考视频”用例是否通过；
  - 类型检查无新增回归。

## 第三阶段开始：参考视频仍不回显的二次定位

### 已完成
- 已继续复盘当前实现与测试状态，确认第 2 步提示词生成态相关代码已基本落地。
- 已确认第 3 步仍有两个风险点：
  - 第 3 步参考视频只读取 `Form.useWatch('referenceVideoUrl', form)`，当表单 watch 短暂为空或被接口返回重建清空时，预览会消失；
  - 表单映射只读取 `task.form?.referenceVideoUrl`，如果后端详情把参考视频地址放在任务顶层 `referenceVideoUrl`，页面不会回显。

### 接下来处理
- 给任务类型与表单映射补上顶层 `referenceVideoUrl` 兜底。
- 详情查询返回时也与旧缓存合并，避免轮询详情缺少 `form` 时覆盖本地已有素材。
- 第 3 步预览改为“表单 watch 优先，任务详情 form 与顶层字段兜底”。
- 修正测试里旧的按钮文案与 Prompt 文案断言，保证回归测试能准确验证当前中文 UI。

## 第三阶段完成：参考视频回显修复与验证

### 已完成
- 已在 `src/api/aigc/video-remix-tasks/types.ts` 中给 `VideoRemixTask` 补充可选顶层字段：
  - `referenceVideoUrl?: string`
- 已在 `src/features/video-remix/form.ts` 中修正详情到表单的映射：
  - 优先读取 `form.referenceVideoUrl`；
  - 当 `form` 中缺失时，兜底读取任务顶层 `referenceVideoUrl`。
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 中增强详情查询与预览数据源：
  - 详情查询返回值会与旧缓存合并，避免轮询/刷新接口缺少 `form` 时冲掉原有素材；
  - 第 1 步与第 3 步参考视频预览统一使用稳定预览地址；
  - 第 3 步参考视频按“表单 watch 优先，详情 form 兜底，任务顶层字段再兜底”显示。
- 已在 `src/pages/VideoRemixTaskDetailPage.test.tsx` 中补充/修正回归测试：
  - 刷新返回缺少 `form` 时，第 3 步仍保留参考视频；
  - 详情只返回顶层 `referenceVideoUrl` 时，第 3 步也能回显参考视频；
  - 旧的 `Prompt`/乱码按钮文案断言已改为当前中文 UI。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "top-level task data"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "reference video"`：通过，5 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，31 个用例通过。
- `npm run typecheck`：通过。

### 结论
- 第 2 步“重新生成提示词后禁用输入框、进度条由生成提示词状态驱动”已有回归测试覆盖。
- 第 3 步“参考视频不回显”已针对两类真实接口返回形态做兜底：
  - 动作/刷新返回缺少 `form`；
  - 详情返回顶层 `referenceVideoUrl` 而不是 `form.referenceVideoUrl`。

## 第四阶段开始：只填写内容方向无法进入后续步骤

### 已定位
- 用户反馈：第 1 步只填写“内容方向”后，无法进入第 2 步或第 3 步。
- 当前根因在第 1 步校验范围过宽：
  - `materialsStepRequiredFields` 把 `referenceVideoUrl` 也当作进入下一步的必填字段；
  - 隐藏字段 `referenceVideoUrl` 自身也配置了必填校验；
  - 因此未上传参考视频时，即使 `productInfo / voiceoverScript / direction` 都已填写，步骤切换仍会被拦截。

### 修复方向
- 第 1 步进入后续步骤只校验“内容方向”的核心文本字段：
  - `productInfo`
  - `voiceoverScript`
  - `direction`
- 参考视频与图片/音频保持可选素材，不再阻止进入第 2 步或第 3 步。

## 第四阶段完成：参考视频必填规则恢复

### 已纠正
- 经过用户确认，`请上传参考视频` 是必填要求，不能作为可选素材处理。
- 已恢复 `src/pages/VideoRemixTaskDetailPage.tsx` 中的校验规则：
  - `materialsStepRequiredFields` 重新包含 `referenceVideoUrl`；
  - 隐藏字段 `referenceVideoUrl` 重新配置必填校验；
  - 第 1 步进入第 2 步/第 3 步时，必须同时满足参考视频、产品信息、口播文案、复刻方向。
- 已调整 `src/pages/VideoRemixTaskDetailPage.test.tsx` 回归测试：
  - 当参考视频为空时，即使内容方向三项已填写，也不能进入提示词步骤；
  - 页面应提示 `请先上传参考视频`。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "reference video is empty"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，32 个用例通过。
- `npm run typecheck`：通过。

### 结论
- 参考视频已恢复为必填项。
- 前面完成的参考视频回显兜底仍然保留，用于保证已上传或接口返回的参考视频可以稳定展示。

## 第五阶段完成：参考视频必填视觉提示

### 已完成
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 的“参考视频”标题前增加红色 `*`：
  - 使用 `data-testid="video-remix-reference-video-required-mark"` 覆盖回归测试；
  - 星号使用红色样式，明确表示必填。
- 已将未上传参考视频时的空状态文案调整为：
  - `参考视频为必填项，请先上传参考视频。`
- 已补充 `src/pages/VideoRemixTaskDetailPage.test.tsx` 回归测试：
  - 验证参考视频标题前展示必填星号；
  - 验证参考视频为空时展示必填提示文案。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "required marker"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，33 个用例通过。
- `npm run typecheck`：通过。

## 第六阶段完成：参考视频区域报错提示

### 已完成
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 中把隐藏字段 `referenceVideoUrl` 的校验错误同步显示到参考视频上传区域下方。
- 报错提示使用表单校验结果作为单一来源：
  - 字段校验仍由 `referenceVideoUrl` 的必填规则负责；
  - UI 区域通过 `form.getFieldError('referenceVideoUrl')` 展示错误；
  - 避免额外维护一套本地错误状态。
- 已补充 `src/pages/VideoRemixTaskDetailPage.test.tsx` 断言：
  - 参考视频为空时点击“下一步”；
  - `video-remix-reference-video-error` 区域应展示 `请先上传参考视频`。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "reference video is empty"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，33 个用例通过。
- `npm run typecheck`：通过。

## 第七阶段完成：提示词生成进度收尾与平滑推进

### 已完成
- 已修复提示词生成完成后的状态收尾：
  - 当详情/刷新返回 `progress >= 100` 或生成结果已完成时，清空 `promptGenerationState`；
  - 输入框会自动解除禁用；
  - `video-remix-prompt-progress` 进度条会自动消失。
- 已增加等待下一次接口状态期间的本地平滑推进：
  - 生成中每 `1200ms` 小幅增加 `1%`；
  - 本地推进最多到 `95%`，不会假装完成；
  - 后续接口/刷新返回真实进度后继续以接口状态为准。
- 已修正提示词空态测试选择器：
  - 当前空态文案位于输入框 placeholder，测试改用 placeholder 匹配。
- 已补充回归测试：
  - 进度可从生成接口返回的 `20%` 本地推进到 `21%`；
  - 刷新/轮询返回 `65%` 后进度条同步更新；
  - 刷新/轮询返回 `100%` 后输入框解禁且进度条消失。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，9 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，35 个用例通过。
- `npm run typecheck`：通过。

## 第八阶段完成：提示词进度条动画收尾体验

### 已完成
- 已将提示词生成进度状态扩展为三段体验：
  - 请求发起/接口处理中：进度条显示，并按本地节奏缓慢增加；
  - 等待接口状态期间：每 `1200ms` 增加 `1%`，最多推进到 `95%`；
  - 接口返回完成：进度快速补到 `100%`，短暂停留后自动消失。
- 已新增 `finishing` 收尾态：
  - 完成时 `active=false`，输入框立即解除禁用；
  - `progress=100` 继续展示约 `900ms`；
  - 定时结束后清空 `promptGenerationState`，进度条消失。
- 已更新回归测试：
  - 完成刷新后先断言显示 `100%`；
  - 再断言进度条自动消失。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "updates prompt progress"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，9 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，35 个用例通过。
- `npm run typecheck`：通过。

## 第十一阶段完成：100% 只允许在接口结束后出现

### 已确认
- 提示词生成接口未结束前，进度条只做本地模拟推进，不能到 `100%`。
- 当前实现规则：
  - 接口请求中：从 `0%` 慢慢增长；
  - 请求未结束前：最多增长到 `95%`；
  - 接口返回完成后：才进入 `finishing` 收尾态；
  - 收尾态再推进到 `100%` 并自动消失。

### 已完成
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 中增加 `PROMPT_PROGRESS_PENDING_MAX = 95` 常量。
- 本地请求中进度推进统一使用该常量封顶，避免未来误改成请求中到 `100%`。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，9 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，35 个用例通过。
- `npm run typecheck`：通过。

## 第九阶段完成：生成接口请求中进度不再停留 0%

### 已完成
- 已修复“点击生成提示词后接口未返回时进度一直是 0%”的问题。
- 调整点：
  - 在 `generate-prompt` 动作开始时立即设置 `promptGenerationState = { active: true, progress: 0 }`；
  - 这样本地进度定时器会立刻启动；
  - 即使生成提示词接口还没返回，进度也会从 `0%` 自动推进到 `1%`、`2%`。
- 接口返回后仍会用接口进度校准：
  - 如果接口返回 `20%`，前端进度同步到 `20%`；
  - 后续继续本地缓慢推进或等待刷新真实状态。
- 已更新回归测试：
  - 生成接口挂起时，先显示 `0%`；
  - 等待一小段时间后自动显示 `1%`；
  - 接口返回后同步到接口返回的 `20%`。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "smoothly advances prompt progress"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，9 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，35 个用例通过。
- `npm run typecheck`：通过。

## 第十阶段完成：完成后不再瞬间跳到 100%

### 已完成
- 已调整提示词生成完成后的收尾动画：
  - 接口返回完成态后，不再直接把进度设置为 `100%`；
  - 先保留当前进度进入 `finishing` 收尾态；
  - 收尾阶段每 `160ms` 增加 `8%`，快速但可见地推进到 `100%`；
  - 到 `100%` 后再短暂停留约 `500ms`，随后进度条消失。
- 已更新回归测试：
  - 完成接口返回后先确认进度条仍然未满 `100%`；
  - 随后等待它推进到 `100%`；
  - 最后确认进度条自动消失。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "updates prompt progress"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，9 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，35 个用例通过。
- `npm run typecheck`：通过。

## 第十二阶段完成：重新生成时旧提示词不再触发提前 100%

### 问题现象
- 用户反馈：点击重新生成提示词后，进度条一会儿就到 `100%`，随后又像重新执行了一次。
- 期望规则：只有生成提示词接口结束并返回明确完成状态后，进度条才进入 `100%` 收尾；接口请求中或仅返回旧提示词时不能提前完成。

### 根因定位
- `buildPromptGenerationState` 之前把 `generatedPrompt` 作为完成依据之一。
- 重新生成时任务详情里本来就可能存在旧的 `generatedPrompt`，但这只能说明“历史上生成过提示词”，不能说明“本次重新生成已完成”。
- 因此当接口或保存结果带着旧提示词返回、但还没有明确完成状态时，前端会误进入 `finishing`，表现为进度条提前冲到 `100%` 并解除输入框禁用。

### 已完成
- 已在 `src/pages/VideoRemixTaskDetailPage.tsx` 中收窄完成判定：
  - 保留 `progress >= 100` 作为完成依据；
  - 增加明确完成状态文案判断：`已完成`、`完成`、`成功`、`生成完成`；
  - 移除 `generatedPrompt` 对完成态的影响，避免旧提示词污染本次生成流程。
- 已在 `src/pages/VideoRemixTaskDetailPage.test.tsx` 中补充回归测试：
  - 当接口返回旧 `generatedPrompt`、`progress = 0` 且没有明确完成状态时；
  - 输入框仍保持禁用；
  - 进度条仍显示生成中，不进入 `100%` 收尾。

### 验证结果
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "old generated prompt"`：通过，1 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts -t "prompt"`：通过，10 个用例通过。
- `npx vitest run --config vitest.video-remix-temp.config.ts`：通过，36 个用例通过。
- `npm run typecheck`：通过。
