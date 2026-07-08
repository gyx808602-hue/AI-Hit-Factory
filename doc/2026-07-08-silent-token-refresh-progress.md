# 2026-07-08 无感刷新与提示收敛进展

## 已完成

- 已扫描当前项目结构，确认技术栈为 Vite + React + TypeScript，UI 使用 Ant Design + TailwindCSS，请求层位于 `src/utils/request.ts`。
- 已定位认证存储与接口封装：`src/utils/auth.ts`、`src/api/system/auth/index.ts`、`src/api/system/auth/types.ts`。
- 已确认当前请求层已有 `A0230` access token 失效、`A0231` refresh token 失效、`A0301` 权限不足等基础分支，但尚未真正接入 refresh token 自动刷新与请求重放。
- 已确认刷新接口为 `POST /v1/auth/refresh`，参数名为 `refreshToken`。
- 已扫描页面提示使用点，发现 `window.confirm` 存在于内容任务、数字人、音色等页面；接口 catch 中也存在局部 `message.error`，需要与请求层全局错误提示去重。
- 已创建 OpenSpec change：`openspec/changes/add-silent-token-refresh/`。
- 已新增 OpenSpec 文档：
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - `specs/silent-token-refresh/spec.md`
  - `specs/request-error-feedback/spec.md`
  - `specs/component-confirm-feedback/spec.md`

## 当前判断

- 本需求属于跨请求层、认证 API、页面交互和测试的流程调整，应先走 OpenSpec，等待确认后再改业务代码。
- 推荐方案是请求层维护共享 refresh Promise：首个过期请求触发 `POST /v1/auth/refresh` 并携带 `refreshToken`，后续过期请求等待同一个刷新结果；刷新成功后统一重放，刷新失败则不重放并走登录过期。
- 错误提示去重应前移到请求封装层，`App.tsx` 现有全局事件监听继续兜底；页面层只保留本地校验或 silentError 场景下的提示。
- 删除确认应使用 Ant Design `Popconfirm` 或 `Modal.confirm`，不再使用浏览器原生 `window.confirm`。
- `doc/progress.md` 当前含历史非 UTF-8 字节，`apply_patch` 无法安全更新该文件；本次先新增专题进展文档，避免覆盖或破坏历史内容。

## 下一步

1. 等待用户确认“开始执行”后，按 `openspec/changes/add-silent-token-refresh/tasks.md` 分步实现。
2. 先补请求层测试锁定刷新队列行为，再实现 `request.ts` 与认证刷新 API。
3. 再处理页面重复错误提示和系统确认弹窗替换。
4. 最后运行定向测试、类型检查和 OpenSpec strict 校验。

## 验证结果

- 已完成只读扫描与 OpenSpec 文档创建。
- 尚未修改业务代码，尚未运行代码测试。
