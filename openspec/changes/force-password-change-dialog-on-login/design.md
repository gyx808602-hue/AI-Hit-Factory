## Context

当前项目是 Vite + React + TypeScript，登录页集中在 `src/pages/LoginPage.tsx`，接口封装在 `src/api/system/auth`，统一请求层 `src/utils/request.ts` 会自动从 `AuthStorage.getAccessToken()` 读取 token 并注入 `Authorization: Bearer <token>`。

现有代码已经能识别 `C10001`，但当前交互更接近“登录区域切换成改密表单”，且改密接口仍是 `/auth/change-password`。最新需求要求登录页在 `C10001` 时展示弹窗，调用 `/auth/password`，并且该请求必须携带登录接口返回的 token。改密成功后不能直接进入系统，而是提示用户重新登录。

知识点拨：这个流程类似前端路由守卫里的“中间态”。用户通过了账号密码校验，所以后端给一个临时可用 token；但用户还没满足安全策略，所以前端不能放行到业务页面，只能用这个 token 完成改密动作。后端中间件会看 token 判断“你是谁”，再看密码策略判断“你能不能继续进入系统”。

## Goals / Non-Goals

**Goals:**

- 在登录接口返回 `C10001` 时阻断普通登录跳转，并打开强制修改密码弹窗。
- 使用 `C10001` 返回的 token 发起 `/auth/password` 请求，保证后端能识别当前账号。
- 弹窗内校验旧密码、新密码、确认密码；提交字段严格为 `oldPassword`、`newPassword`、`confirmPassword`。
- 改密成功后清理本地 token 和用户信息，提示用户重新登录。
- 使用 Ant Design Modal/Form/Input.Password/Button/message 完成交互，保持当前登录页风格与依赖边界。
- 增加定向测试覆盖触发弹窗、接口请求、token 鉴权、成功后清理登录态和提示重新登录。

**Non-Goals:**

- 不实现个人中心主动修改密码。
- 不改造完整登录页视觉，不新增全局状态库。
- 不实现 refresh-token 自动续期。
- 不改变后端 `C10001` 的返回结构，只按当前请求层抛出的 `RequestBusinessError` 读取 `code/message/data`。
- 不处理真实密码强度策略以外的复杂规则；若后端有更严格规则，由接口错误信息反馈。

## Decisions

### Decision 1: `C10001` 分支使用弹窗，而不是替换整个登录表单

推荐实现：保留登录表单作为背景态，`passwordResetContext` 存储账号、token 和提示文案，使用 Ant Design `Modal` 承载改密表单。弹窗不可点击遮罩关闭，取消按钮默认不展示或只允许“返回登录并清理状态”。

Why：弹窗更符合“登录流程中的阻断步骤”，用户能明确知道自己仍处于登录页。相比直接替换登录表单，弹窗更容易表达“必须先完成此动作”，也能减少页面布局大改。

备选方案是继续使用条件渲染切换整块表单。优点是改动少，但用户感知像进入了另一个页面状态，不符合“增加弹窗”的明确需求，也容易遗漏弹窗关闭和重复登录的边界。

### Decision 2: 收到 `C10001` 后临时写入 token，再调用 `/auth/password`

推荐实现：登录接口抛出 `C10001` 且 `data.accessToken` 存在时，调用 `AuthStorage.setTokenPair(error.data)`，再打开弹窗。`changePassword()` 不传 `noAuth()`，依赖请求层自动加 `Authorization`。

Why：`/auth/password` 需要带 token，说明后端要把“改谁的密码”绑定到当前登录身份，而不是只相信前端传用户名。这样可以避免用户在前端篡改账号参数。前端里这相当于先拿到一个只用于完成安全动作的会话上下文。

备选方案是在 API 函数里显式传 token header。优点是局部明确，但会绕开当前 `request` 统一鉴权模式，增加重复逻辑。当前项目已有统一 token 注入，优先复用。

### Decision 3: 改密接口路径改为 `/auth/password`

`src/api/system/auth/index.ts` 的 `changePassword` 必须从 `request.post<void>("/auth/change-password", data)` 改为 `request.post<void>("/auth/password", data)`。

Why：接口路径是前后端契约，不应在页面层拼接或临时覆盖。把路径收在 API Client 中，页面只表达“我要修改密码”，不关心具体 URL，后续接口路径再变也只改 API 层。

### Decision 4: 改密成功后清理登录态并提示重新登录

改密成功后调用 `AuthStorage.clear()`，关闭弹窗，重置改密表单，清空登录表单密码和验证码，刷新验证码，并通过 `message.success("密码修改成功，请重新登录")` 给用户反馈。

Why：强制改密 token 是登录过程中的临时状态，改密后继续复用它进入系统会让会话安全语义变混乱。让用户重新登录可以重新走完整认证链路，后端也能基于新密码签发干净的新 token。

### Decision 5: 不新增抽象组件，先把弹窗逻辑留在登录页

本次弹窗只服务登录页强制改密一个场景，暂不提升到 `shared/components`。如果后续个人中心、管理员重置密码、首次登录等多个场景共用，再抽成领域组件。

Why：KISS。过早把一次性 UI 抽成通用组件，会制造 props 复杂度和维护成本。当前更重要的是让登录安全链路可读、可测、可闭环。

## Risks / Trade-offs

- [Risk] 后端 `C10001` 返回 token 字段不完整 → Mitigation：类型守卫必须校验 `accessToken` 和 `refreshToken`，缺失时按普通登录错误处理并刷新验证码。
- [Risk] 临时 token 写入 localStorage 后用户关闭页面 → Mitigation：打开弹窗前写入 token 是必要动作；弹窗取消或改密成功必须清理。后端也应限制该 token 的权限范围和有效期。
- [Risk] `/auth/password` 返回成功但验证码刷新失败 → Mitigation：成功提示和清理登录态优先完成，验证码刷新失败可回退本地验证码，不阻塞用户重新登录。
- [Risk] 页面现有中文内容存在历史编码问题 → Mitigation：本次实现只触碰改密相关文案时使用 UTF-8 中文，不扩大重写登录页文案范围。
- [Risk] 全量 `npm run typecheck` 可能受历史无关问题影响 → Mitigation：优先跑 `src/pages/LoginPage.test.tsx`、`src/utils/request.test.ts` 和新增 API 定向测试；全量检查失败时记录无关失败。

## Migration Plan

1. 更新 API 层 `changePassword` 路径为 `/auth/password`。
2. 调整 `LoginPage` 的 `C10001` 分支：保存临时 token、打开强制改密弹窗、不跳转。
3. 使用 Modal/Form 实现改密弹窗，提交调用 `changePassword`。
4. 改密成功后清理 token、关闭弹窗、提示重新登录并刷新验证码。
5. 补充测试并运行定向验证。
6. 若上线后发现接口路径或返回结构不一致，回滚 API 路径与弹窗分支即可，不影响普通登录主流程。

## 2026-07-03 Contract Adjustment

The backend-confirmed forced password response can be `{ code: "C10001", data: null, msg: "请先修改初始密码" }`.

Decision update:

- `C10001` is the authoritative business signal for opening the forced password change dialog.
- `data` is optional context. When it contains a valid token pair, the frontend stores it temporarily so the existing request interceptor can attach `Authorization`.
- When `data` is `null`, the frontend still opens the dialog and MUST NOT fabricate token data. Whether `/auth/password` can succeed without a freshly returned token is a backend/session-contract concern.
- This keeps the UI behavior aligned with the real response shape while preserving compatibility with older or future responses that include token data.
## 2026-07-03 Active Contract Decision

The proposed adjustment for `{ code: "C10001", data: null }` is paused per product direction.

Active decision:

- `C10001` opens the forced password change dialog only when the response includes a usable token pair.
- When the response lacks a usable `accessToken`, the login page treats it as a login failure and refreshes the captcha.
- `/auth/password` remains a token-authenticated request through the existing request interceptor.