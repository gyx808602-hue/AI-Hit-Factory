## Why

当前登录页已经具备账号密码登录、验证码和 token 写入能力，但强制改密链路仍需要按最新后端契约收口：当登录接口返回 `code === "C10001"` 时，用户必须先在登录页完成改密，且改密接口改为带 token 请求 `/auth/password`。

这次变更的目标是把“强制修改密码”做成明确的登录态阻断流程，避免初始密码用户绕过安全要求进入系统，同时让前端、接口层和测试有统一验收标准。

## What Changes

- 登录接口业务失败返回 `C10001` 时，不进入系统首页，而是在登录页面展示强制修改密码弹窗。
- 弹窗内要求输入 `oldPassword`、`newPassword`、`confirmPassword`，并复用登录返回的 token 作为改密请求鉴权凭证。
- 改密接口统一调整为 `POST /auth/password`，请求体包含 `oldPassword`、`newPassword`、`confirmPassword`。
- 改密成功后清理本地登录态，提示用户“密码修改成功，请重新登录”，并关闭弹窗、回到普通登录表单。
- 保留登录验证码刷新、记住账号、登录错误反馈等既有登录体验。
- 增加针对 `C10001` 分支、改密接口路径、鉴权头和成功后重新登录提示的定向测试。

## Capabilities

### New Capabilities

- `force-password-change-login`: 约束登录返回 `C10001` 时的强制改密弹窗、改密接口契约、token 使用和重新登录收口。

### Modified Capabilities

- 无。当前 `openspec/specs/` 中尚无账号登录主规格，本次先以新增能力记录登录强制改密增量。

## Impact

- Frontend：影响 `src/pages/LoginPage.tsx` 的登录异常分支、强制改密弹窗状态、表单校验和成功提示。
- API：影响 `src/api/system/auth/index.ts`、`src/api/system/auth/types.ts` 中改密请求路径与类型契约。
- Request/Auth：依赖 `src/utils/request.ts` 的 token 注入逻辑；`/auth/password` 不应使用 `noAuth()`，必须携带 `Authorization: Bearer <token>`。
- Tests：需要补充或调整 `src/pages/LoginPage.test.tsx`、`src/utils/request.test.ts` 或 API 层测试，覆盖强制改密闭环。
