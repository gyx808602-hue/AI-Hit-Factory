## Context

项目当前是 Vite + React + TypeScript，统一请求层位于 `src/utils/request.ts`，业务 API 通过 `src/api/**/index.ts` 调用该请求层。`AuthStorage` 已经保存 `accessToken` 与 `refreshToken`，`ApiCode.accessTokenInvalid` 为 `A0230`，`ApiCode.refreshTokenInvalid` 为 `A0231`。

当前实现的问题是：访问令牌失效后直接触发 `onAuthExpired`，没有真正调用刷新接口；多个接口并发失败时会各自报错或触发登录过期；页面层还存在 `window.confirm` 和局部 `message.error`，容易造成原生弹窗与重复错误提示。

知识点拨：后端里的 refresh token 类似前端里的“长生命周期会话凭证”，access token 像短期接口通行证。无感刷新本质是请求拦截器里的“会话续租中间件”：先阻断过期请求，拿 refresh token 换新 access token，再把被阻断的请求继续放行。

## Goals / Non-Goals

**Goals:**

- access token 失效时，只发起一次 refresh 请求，并让同时失效的业务请求等待同一个刷新结果。
- refresh 成功后写入新 token，并使用新 access token 重新请求原业务接口。
- refresh 失败或 refresh token 无效时，不重放业务请求，按登录过期流程清理会话并跳转登录。
- 请求层统一去重错误提示，页面不重复弹出接口层已经提示过的错误。
- 页面删除确认使用 Ant Design Modal/Popconfirm 等组件，不再使用 `window.confirm`。

**Non-Goals:**

- 不调整后端 token 签发策略、过期时间或 refresh token 轮换规则。
- 不新增全局状态库，不把接口数据放入全局 store。
- 不重构全部页面交互，只处理当前扫描命中的系统弹窗和重复接口错误提示。
- 不改变业务接口路径前缀策略；仅按需求新增/调整认证刷新接口为 `/v1/auth/refresh`。

## Decisions

### 1. 请求层使用共享 refresh Promise，而不是页面级重试

推荐在 `createRequestClient` 内部维护 `refreshTokenPromise: Promise<AuthenticationToken> | null`。当接口返回 `A0230` 时：

1. 判断原请求是否已经重试过，避免死循环。
2. 如果没有正在刷新，则用独立 axios 实例或跳过鉴权的内部请求调用 `POST /v1/auth/refresh`，参数为 `{ refreshToken }`。
3. 如果已经正在刷新，则当前请求等待同一个 Promise。
4. 刷新成功后写入 `AuthStorage.setTokenPair`，重新执行原请求。
5. 刷新失败后调用 `onAuthExpired`，并 reject 原错误或统一 token 失效错误。

为什么不用页面级重试：页面级重试会把认证细节泄漏到业务页面，类似让每个前端页面自己实现“请求拦截器”。统一放在请求层可以保持 API Client 简洁，也能集中处理并发和错误提示。

### 2. refresh 请求必须独立于普通响应拦截链

refresh 请求不能走会再次触发 `A0230` 重试的普通 client，否则 refresh 自身失败可能形成递归。实现上优先使用同一 baseURL 下的内部 axios 实例，或在请求配置中标记 `skipAuthRefresh`，让响应拦截器直接放过 refresh 失败。

取舍：内部 axios 实例代码更直观，配置标记更复用。考虑 KISS，优先使用内部 axios 实例完成 refresh，并共享同一 baseURL、headers、paramsSerializer、timeout 配置。

### 3. 错误提示去重放在请求封装层，App 事件监听继续兜底

请求层已有 `notifyError` 和 `request:error` 事件，`App.tsx` 也做了 1500ms 相同文案去重。本次在请求封装层增加更靠近源头的去重，例如默认 1500ms 内相同 message 只触发一次 `notifyError`。这样即使测试或局部 client 注入自定义 `notifyError`，也能避免重复报错。

页面层对接口错误只做状态恢复或字段级补充，不再对已由请求层处理的错误重复 `message.error`。如果页面确实需要本地兜底，则调用 API 时使用 `silentError()`，并由页面负责唯一提示。

### 4. 删除确认统一改为 Ant Design 组件确认

页面中的 `window.confirm` 改为 Ant Design `Modal.confirm`、`Popconfirm` 或按钮包裹式确认。列表行操作更适合 `Popconfirm`，详情页顶部按钮或复杂异步删除更适合 `Modal.confirm`。

为什么：原生 confirm 会阻塞浏览器线程，样式不可控，也绕开当前 Ant Design 深色主题；组件弹窗能继承主题、loading、禁用、键盘可访问性和统一文案。

## Risks / Trade-offs

- [Risk] 多个请求同时收到 `A0230` 可能重复刷新 → 使用共享 `refreshTokenPromise`，并在 finally 中清空。
- [Risk] 原请求重放后仍返回 `A0230` 导致无限循环 → 在 config 上标记已重试，第二次失效直接走登录过期。
- [Risk] refresh 接口返回结构与登录 token 类型不完全一致 → 复用 `AuthenticationToken` 类型，并在测试中覆盖 accessToken/refreshToken 写入；如后端字段不同，实施时补充兼容映射。
- [Risk] 页面去掉局部 `message.error` 后某些本地校验错误没有提示 → 只删除接口 catch 中重复提示，保留上传类型校验、表单校验等本地错误提示。
- [Risk] 批量替换 `window.confirm` 影响删除交互测试 → 每个命中页面补充或更新对应测试，确保确认后才调用删除接口，取消时不调用。

## Migration Plan

1. 先补请求层测试，锁定 refresh 成功重放、并发只刷新一次、refresh 失败不重放、错误提示去重。
2. 实现认证刷新 API 与请求层刷新队列。
3. 梳理页面重复错误提示和系统确认弹窗，改为 Ant Design 组件。
4. 跑定向测试、类型检查和 OpenSpec 校验。
5. 若联调发现 `/v1/auth/refresh` 的 `refreshToken` 参数位置不是 JSON body，仅在认证 API 层做兼容，不扩散到页面。

## Open Questions

- 无。刷新接口参数已确认是 `refreshToken`。
