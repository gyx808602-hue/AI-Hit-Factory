## Why

当前请求层在访问令牌失效时只会触发登录过期流程，用户正在操作的接口会直接失败；并发接口同时失效时还可能产生多次错误提示。现在需要接入后端 `POST /v1/auth/refresh`，用参数 `refreshToken` 自动刷新访问令牌，让短期 access token 过期时自动重放原请求，同时统一收敛页面级错误提示和删除确认交互。

## What Changes

- 在统一请求封装中接入 refresh token 刷新流程：access token 失效时暂停当前失败请求及后续同类请求，刷新成功后重新请求，刷新失败则按原错误失败，不重放。
- 将刷新接口地址调整为 `POST /v1/auth/refresh`，请求参数为 `refreshToken`，并保持登录、退出等现有认证 API 契约不被破坏。
- 在请求封装层增加错误提示去重能力，避免并发失败或页面重复捕获同一错误时连续弹窗。
- 梳理页面中的接口错误提示：如果统一请求层已经弹出错误，页面不再重复 `message.error`。
- 将页面删除确认从 `window.confirm` 改为 Ant Design 组件弹窗或确认控件，避免系统原生弹窗。
- 保持现有 Ant Design + TailwindCSS 风格，不引入新的状态库或弹窗库。

## Capabilities

### New Capabilities
- `silent-token-refresh`: 访问令牌失效时自动刷新 token、排队等待并重放请求，以及刷新失败时的认证过期处理。
- `request-error-feedback`: 统一请求错误提示去重，并规范页面不重复提示接口层已处理的错误。
- `component-confirm-feedback`: 页面删除等危险操作使用 Ant Design 组件化确认，不再使用系统原生弹窗。

### Modified Capabilities
- 无。

## Impact

- 主要影响 `src/utils/request.ts`、`src/utils/auth.ts`、`src/api/system/auth/index.ts`、`src/api/system/auth/types.ts`。
- 需要补充 `src/utils/request.test.ts` 中 token 刷新、并发队列、刷新失败、错误提示去重等测试。
- 需要梳理已有页面中的 `window.confirm` 和重复 `message.error`，优先覆盖内容任务页、数字人页、音色页等当前命中位置。
- 不新增外部依赖；继续使用 axios、Ant Design、现有事件分发和本地 token 存储。
