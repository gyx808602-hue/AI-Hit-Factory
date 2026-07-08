## 1. 请求层刷新设计落地

- [ ] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md` 和 specs，确认实现范围不越界。
- [ ] 1.2 在 `src/api/system/auth/types.ts` 复用或补充 refresh token 响应类型，确保 token 字段类型明确。
- [ ] 1.3 将 `src/api/system/auth/index.ts` 的刷新接口调整为 `POST /v1/auth/refresh`，参数名固定为 `refreshToken`；优先按 JSON body `{ refreshToken }` 传参。
- [ ] 1.4 在 `src/utils/request.ts` 中实现 access token 失效时的共享 refresh Promise、请求等待和成功重放。
- [ ] 1.5 在 `src/utils/request.ts` 中处理 refresh 失败、无 refresh token、重复失效的分支，确保不重放失败请求并触发现有登录过期流程。

## 2. 错误提示去重与页面提示收敛

- [ ] 2.1 在请求封装默认通知处增加相同错误文案短时间去重，保留 `silentError` 跳过全局提示的能力。
- [ ] 2.2 扫描 `src` 中 `message.error`、`notification`、`Modal`、`window.confirm` 使用点，区分接口错误、局部校验错误和成功提示。
- [ ] 2.3 删除或调整页面 catch 中与请求层重复的 `message.error`，保留上传格式校验、表单校验等页面本地错误提示。
- [ ] 2.4 保持 `src/app/App.tsx` 的全局 `request:error` 监听兜底，必要时更新测试说明，避免重复去重逻辑互相冲突。

## 3. 组件化确认弹窗替换

- [ ] 3.1 将当前命中的 `window.confirm` 删除确认替换为 Ant Design `Popconfirm` 或 `Modal.confirm`。
- [ ] 3.2 为内容任务页、数字人相关页面、音色页等命中页面保留取消不删除、确认才删除的行为。
- [ ] 3.3 对异步删除动作补充 loading 或 disabled 防重复提交能力，优先使用现有组件状态，不新增全局状态。

## 4. 测试与验证

- [ ] 4.1 补充 `src/utils/request.test.ts`：刷新成功重放、并发只 refresh 一次、refresh 失败不重放、无 refresh token 不刷新、错误提示去重。
- [ ] 4.2 补充或更新页面定向测试，覆盖组件确认弹窗确认/取消行为和重复接口错误提示移除。
- [ ] 4.3 执行 `cmd /c npm test -- src/utils/request.test.ts` 和受影响页面定向测试。
- [ ] 4.4 执行 `cmd /c npm run typecheck`。
- [ ] 4.5 执行 `cmd /c openspec validate add-silent-token-refresh --strict`。
- [ ] 4.6 更新 `doc/progress.md`，记录已完成、当前判断、下一步和验证结果。
