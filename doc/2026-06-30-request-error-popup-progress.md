# 2026-06-30 全局请求报错弹窗改造进展

## 阶段 1：现状排查

- 用户诉求：列表页这类 `Alert` 形式的报错，改成弹窗/全局消息提示，最好收口到 `axios` 封装。
- 已确认 `src/utils/request.ts` 已具备统一错误派发能力：
  - 业务失败时会派发 `request:error`
  - 网络失败时会派发 `request:error`
  - 支持 `silentError`，可让局部请求静默失败
- 已确认 `src/app/App.tsx` 已监听 `request:error`，并统一调用 `message.error(...)` 做全局弹窗提示。

## 关键结论

- 当前问题的根因不是 `axios` 封装缺失，而是部分页面又额外渲染了页内 `Alert`，形成了“全局弹窗 + 页面红框”两套提示并存。
- 用户给出的这段 `listQuery.isError ? <Alert ... /> : null` 就属于页面层重复报错展示。
- 因此最小改法应当是：
  - 保留 `request.ts` 作为全局错误出口
  - 列表查询默认走全局弹窗
  - 删除列表页内重复的 `Alert`
  - 仅对确实需要页面内承载的错误场景保留 `Alert`（如详情页中的任务失败原因展示）

## 下一步计划

- 检查列表页是否存在手动 `onError/setActionError` 逻辑与全局提示重复。
- 优先改造用户提到的任务列表页。
- 补充测试，保证：
  - 请求失败时触发全局 `message.error`
  - 页面内不再渲染重复 `Alert`

## 阶段 2：VideoRemixTasksPage 实施完成

- 已改造文件：
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/VideoRemixTasksPage.test.tsx`
- 实施内容：
  - 删除页面内重复的列表错误 `Alert`
  - 删除页面内重复的操作错误 `Alert`
  - 删除仅用于页内报错展示的 `actionError` 状态
  - 保留请求层统一错误链路，不改动 `src/utils/request.ts` 与 `src/app/App.tsx`
- 这样做的原因：
  - 当前仓库已经有 `request:error -> message.error` 的全局提示链路
  - 本次目标是“改成弹窗形式”，最小改动就是删掉页面重复红框，而不是再造一套错误系统

## 测试验证

- 先按 TDD 增加了 2 个回归用例：
  - 列表请求失败时，不渲染页内 `任务列表加载失败`
  - 删除失败时，不渲染页内 `操作失败`
- 验证命令：
  - `npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTasksPage.test.tsx`
- 结果：
  - `1 passed`
  - `7 passed`

## 额外处理

- 由于原页面文件存在历史编码混杂，精确补丁容易失配，本次顺手把 `VideoRemixTasksPage.tsx` 和对应测试整理成了干净 UTF-8 文本。
- 这一步没有扩大业务范围，只是为了保证后续维护和补丁稳定性。

## 阶段 3：全项目同类提示扫描

- 已扫描 `src/pages` 中的 `Alert` 与列表查询错误分支。
- 已确认本轮应收口的对象：
  - `src/pages/DigitalHumansPage.tsx` 的列表加载失败 `Alert`
  - `src/pages/DigitalHumanVideoTasksPage.tsx` 的列表加载失败 `Alert`
  - `src/pages/ViralRemixPage.tsx` 的顶部创建失败 `Alert`（待进一步确认测试覆盖后再处理）
- 明确保留不动的对象：
  - 详情页里承载业务语义的失败信息，如 `errReason`、`errorMessage`
  - 登录页、详情页、表单页里不属于通用请求失败兜底的提示

## 本轮实施原则

- “请求失败兜底”统一走 `request:error -> message.error`
- “任务自身失败原因”继续保留页面内 `Alert`
- 先改有明确列表/操作失败模式的页面，不扩大到所有 `Alert`

## 阶段 4：继续收口数字人相关列表页

- 已完成页面：
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.tsx`
- 本轮处理方式：
  - 去掉列表查询失败时的页内 `Alert` 分支
  - 保留加载态、空态、列表内容本身不变
  - 不改详情页的 `errReason / errorMessage` 展示
- 新增回归测试：
  - `src/pages/DigitalHumansPage.alert-regression.test.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.alert-regression.test.tsx`
  - `vitest.request-error-popup-temp.config.ts`
- 验证命令：
  - `npx vitest run --config vitest.request-error-popup-temp.config.ts`
- 结果：
  - `2 passed`

## 阶段 5：图文页上传图片展示改成追爆风格

- 用户确认采用方案 B：
  - 上传前入口改成追爆页那种 `Upload.Dragger` 卡片风格
  - 上传后展示也改成追爆式状态卡片/管理卡片
- 改造范围：
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/ImageVideoPage.test.tsx`
- 实施原则：
  - 只改上传区视觉与展示结构
  - 不改图文任务创建参数与业务提交流程
  - 保留现有图片删除、批量上传、表单校验逻辑
