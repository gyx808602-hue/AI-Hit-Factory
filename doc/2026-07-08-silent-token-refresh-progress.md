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

---

# 2026-07-09 请求层无感刷新实现阶段

## 已完成

- 已按 `add-silent-token-refresh` 读取 OpenSpec 上下文与任务，确认本次实现范围。
- 已在 `src/utils/request.test.ts` 补充请求层 TDD 用例，覆盖：
  - access token 失效后刷新并重放原请求。
  - 并发失效请求共享同一次 refresh。
  - refresh 失败时不重放原请求。
  - 无 refresh token 时不调用刷新接口。
  - 相同错误文案短时间内只通知一次。
- 已在 `src/utils/request.ts` 实现共享 refresh Promise、刷新成功写入 token、原请求重放、refresh 失败登录过期、重复失效防死循环、错误提示去重。
- 已在 `src/api/system/auth/index.ts` 将刷新接口调整为 `POST /v1/auth/refresh`，参数为 `{ refreshToken }`。
- 已更新 `openspec/changes/add-silent-token-refresh/tasks.md`，勾选请求层与测试相关任务。

## 当前判断

- 请求层行为已按 TDD 形成红绿闭环。
- refresh 请求通过 `skipAuthRefresh` 避免自身失败时递归触发认证过期，原业务请求统一负责触发一次登录过期流程。
- 页面层仍需继续处理重复 `message.error` 与 `window.confirm` 替换。

## 下一步

1. 扫描并分类页面中的 `message.error`、`window.confirm` 使用点。
2. 将删除确认改为 Ant Design `Popconfirm` 或 `Modal.confirm`。
3. 去掉接口 catch 中与请求层重复的错误提示，保留本地校验类提示。
4. 补充/更新页面定向测试。

## 验证结果

- 已执行：`cmd /c npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`
- 结果：通过，1 个测试文件、16 个测试用例全部通过。

---

# 2026-07-09 页面提示与组件确认阶段
## 已完成
- 已扫描页面中的 `message.error`、`notification.error`、`window.confirm`、`alert` 使用点。
- 已移除接口 catch 中与 request 统一错误提示重复的页面 `message.error`。
- 已保留本地校验提示：例如数字人训练素材文件类型校验仍由页面提示。
- 已将命中页面的原生 `window.confirm` 替换为 Ant Design `Modal.confirm`：
  - 数字人列表与详情页
  - 定制音色列表页
  - 数字人视频任务列表与详情页
  - 文图生视频任务页
  - 视频混剪任务页
- 已为详情页删除按钮补充 `loading` / `disabled`，避免重复删除提交。
- 已更新受影响页面测试：确认弹窗由 `Modal.confirm` mock 驱动，分页数据字段同步为 `records`。
- 已同步 OpenSpec tasks：2.2、2.3、2.4、3.1、3.2、3.3、4.2、4.3 已完成。

## 当前判断
- 业务页面中已无原生 `window.confirm`。
- 页面级重复错误弹窗已收敛到 request 层；页面仅保留本地校验提示和成功提示。
- `src/app/App.tsx` 的全局 `request:error` 监听继续作为兜底，不与 request 层去重冲突。

## 下一步
1. 执行 `cmd /c npm run typecheck`。
2. 执行 `cmd /c openspec validate add-silent-token-refresh --strict`。
3. 根据最终验证结果更新任务勾选与本进展文档。

## 验证结果
- 已执行：`cmd /c npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts src/pages/content/TextImageVideoTasksPage.test.tsx src/pages/content/VideoRemixTasksPage.test.tsx src/pages/digital-human/DigitalHumansPage.test.tsx src/pages/digital-human/CustomisedAudiosPage.test.tsx src/pages/digital-human/DigitalHumanVideoTasksPage.test.tsx src/pages/digital-human/DigitalHumanDetailPage.test.tsx src/pages/digital-human/DigitalHumanVideoTaskDetailPage.test.tsx src/pages/digital-human/DigitalHumanVideoTasksPage.alert-regression.test.tsx`
- 结果：通过，9 个测试文件、65 个测试用例全部通过。

---

# 2026-07-09 最终验证阶段
## 已完成
- 已修复类型检查暴露的分页类型过渡问题：分页 mapper 同时返回 `list` 和 `records`，兼容旧 hook 缓存合并与当前页面读取。
- 已修复 request 刷新调用的 TypeScript 类型，让 refresh 请求按统一 DataRequestClient 返回 token data。
- 已完成全部 OpenSpec 任务勾选。

## 当前判断
- 无感刷新、并发等待、刷新失败不重放、错误提示去重、页面重复错误提示收敛、组件确认删除均已形成代码与测试闭环。
- `doc/progress.md` 当前仍存在历史编码异常，本次继续使用专题进展文档记录，避免破坏既有内容。

## 下一步
- 可进入代码提交/上传流程。

## 验证结果
- 已执行：`cmd /c npm run typecheck`
- 结果：通过。
- 已执行：`cmd /c openspec validate add-silent-token-refresh --strict`
- 结果：通过，`Change 'add-silent-token-refresh' is valid`。

---

# 2026-07-10 C10040 触发码调整
## 已完成
- 已将普通业务请求 token 失效触发码调整为 `C10040`。
- 普通接口返回 `C10040` 时会先尝试 refresh token，并在刷新成功后重放原请求。
- 兼容 HTTP error 响应和 HTTP 200 业务响应两种 `C10040` 返回形式。
- refresh 接口自身返回错误或 token 失效时，不再尝试二次刷新，统一触发重新登录流程。
- 修复 `request.ts` 中历史乱码注释吞并代码导致的语法问题，并将登录过期提示抽为常量。

## 当前判断
- `C10040` 现在代表 access token 失效场景，会触发无感刷新。
- refresh 接口失败代表 refresh token 不可用或服务端拒绝刷新，此时必须重新登录，不能重放原请求。

## 下一步
- 若后端 refresh 地址确认必须带 `/v1` 且 baseURL 未包含 `/v1`，需要把 `/auth/refresh` 改为 `/v1/auth/refresh`。

## 验证结果
- 已执行：`cmd /c npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`
- 结果：通过，1 个测试文件、21 个测试用例全部通过。
- 已执行：`cmd /c npm run typecheck`
- 结果：通过。

---

# 2026-07-10 无感刷新健壮性复查
## 已完成
- 已复查无感刷新链路：普通接口 `C10040` 触发 refresh，refresh 成功后重放原请求。
- 已确认 refresh 请求使用 `silentError` 和 `skipAuthRefresh`，避免刷新接口失败时出现重复错误提示或递归刷新。
- 已新增登录过期通知去重：并发请求共享同一次失败 refresh 时，只触发一次 `auth:expired`。
- 已让对外暴露的 `refreshToken()` API 同样携带 `silentError` 和 `skipAuthRefresh`，防止直接调用刷新接口失败后反向进入无感刷新链路。
- 已补充测试覆盖并发 refresh 失败只触发一次重新登录、refresh API 配置完整性。

## 当前判断
- 当前实现对并发失效、刷新失败、refresh token 失效、二次重放失效、重复错误提示都有防护。
- refresh 地址仍走统一前缀策略：代码中为 `/auth/refresh`，最终是否为 `/v1/auth/refresh` 取决于 `VITE_APP_BASE_API` 或 dev proxy 配置。

## 下一步
- 如果生产环境 `VITE_APP_BASE_API` 不包含 `/v1`，需要统一调整 API 前缀配置，而不是只在 refresh 里单独拼 `/v1`。

## 验证结果
- 已执行：`cmd /c npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts src/api/system/auth/index.test.ts`
- 结果：通过，2 个测试文件、24 个测试用例全部通过。
- 已执行：`cmd /c npm run typecheck`
- 结果：通过。
