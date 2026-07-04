## 1. Context Review

- [x] 1.1 Read `openspec/config.yaml`, `openspec/project.md`, and all artifacts under `openspec/changes/force-password-change-dialog-on-login/`.
- [x] 1.2 Review `src/pages/LoginPage.tsx`, `src/pages/LoginPage.test.tsx`, `src/api/system/auth/index.ts`, `src/api/system/auth/types.ts`, `src/utils/request.ts`, and `src/utils/request.test.ts`.
- [x] 1.3 Confirm current login response error shape still exposes `code`, `message/msg`, and `data` through `RequestBusinessError`.

## 2. API Contract

- [x] 2.1 Update `src/api/system/auth/index.ts` so `changePassword(data)` calls `POST /auth/password`.
- [x] 2.2 Keep `ChangePasswordRequest` fields as `oldPassword`, `newPassword`, and `confirmPassword`; do not add username, phone, captcha, or redirect fields.
- [x] 2.3 Ensure `changePassword` does not use `noAuth()`, so request interception attaches `Authorization: Bearer <accessToken>`.
- [x] 2.4 Add or adjust API/request tests to assert `/auth/password` receives the bearer token.

## 3. Login Page Forced Password Change Dialog

- [x] 3.1 Update the `C10001` branch in `src/pages/LoginPage.tsx` to store the returned token pair, keep the user on the login page, and open a forced password change dialog.
- [x] 3.2 Replace the current inline forced password reset UI with an Ant Design `Modal` that contains old password, new password, and confirm password fields.
- [x] 3.3 Configure the dialog as a blocking login step: no protected-route navigation, no accidental mask close, and a clear path to return to normal login only after clearing temporary auth state.
- [x] 3.4 Preserve existing login form behavior for normal success, non-`C10001` failures, captcha refresh, remember-me, and redirect handling.
- [x] 3.5 On successful password change, call `AuthStorage.clear()`, close the dialog, reset password fields, refresh captcha, and show “密码修改成功，请重新登录” or equivalent Chinese success message.

## 4. Tests

- [x] 4.1 Update `src/pages/LoginPage.test.tsx` to verify `C10001` opens the forced password change dialog and does not navigate.
- [x] 4.2 Add a login page test verifying dialog validation blocks submit when required fields are missing or confirm password differs.
- [x] 4.3 Add a login page test verifying successful forced password change calls `changePassword` with `oldPassword`, `newPassword`, and `confirmPassword`.
- [x] 4.4 Add a login page test verifying successful forced password change clears auth state and shows the user they must log in again.
- [x] 4.5 Add a regression test verifying normal login success still stores tokens and redirects.

## 5. Verification

- [x] 5.1 Run `npm test -- src/pages/LoginPage.test.tsx src/utils/request.test.ts`.
- [x] 5.2 Run `npm run typecheck`; if unrelated historical failures remain, record the exact failing files and confirm forced password change tests still pass.
- [x] 5.3 Run `cmd /c openspec validate force-password-change-dialog-on-login --strict` or the project-supported OpenSpec validation command.
- [x] 5.4 Update `doc/progress.md` with completed implementation steps, current judgment, next step, and verification result.
