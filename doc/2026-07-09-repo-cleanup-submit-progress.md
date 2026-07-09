# 2026-07-09 仓库清理与提交前审计

## 已完成

- 已只读扫描当前 Git 状态，确认工作区存在请求层、登录页、App 全局弹窗与测试相关改动。
- 已扫描疑似临时文件，包括 `vitest.*-temp.config.ts`、`tmp-dev-server.log*`、`tmp-pages-migration-dev-server.*.log`、`tmp/` 下截图。
- 已确认这些疑似临时文件当前均为 Git 已跟踪文件，不是简单的未跟踪垃圾文件。
- 已通过引用搜索确认，多份 `doc/` 历史进展文档和 `openspec` 任务仍引用这些临时 Vitest 配置与 tmp 文件名。
- 已尝试更新 `doc/progress.md`，但该文件包含非 UTF-8 字节，补丁工具无法安全写入；本轮改为新增专题进展文档，避免破坏原文件内容。
- 已按用户确认执行受控清理，删除已跟踪的临时 Vitest 配置、临时日志和 `tmp/` 截图文件。
- 已更新 `.gitignore`，忽略后续新增的 `tmp/`、`tmp-*.log` 和 `vitest.*-temp.config.ts`。

## 当前判断

- 用户已确认这些已跟踪临时产物应从版本库删除，并通过后续提交与推送同步到远程。
- 当前未跟踪文件只有 `src/utils/requestAuthRefresh.ts`、`src/utils/requestCodes.ts`、`src/utils/requestNotify.ts`，它们是请求层拆分后的新增源码，不属于清理对象。
- 当前清理范围保持在临时配置、日志和截图，不扩大到历史文档引用内容，避免一次提交混入大范围文档重写。

## 下一步

1. 运行定向测试与类型检查。
2. 检查 Git diff，生成提交信息。
3. 暂存、提交，并在提交成功后推送到远程 `feature` 分支。

## 验证结果

- 已执行只读 Git 状态、文件列表、引用搜索与 diff 审计。
- 已执行 `git rm` 清理受控文件。
- 已执行 `cmd /c npm run typecheck`，通过。
- 已执行 `cmd /c npm test -- --config vite.request-test.config.ts src/utils/request.test.ts src/pages/auth/LoginPage.test.tsx`，2 个测试文件、25 个用例通过。
- 已执行 `cmd /c npm test -- --config vite.request-test.config.ts src/app/App.test.tsx -t "redirects to login after auth expired event|shows a required password change modal|shows global request success messages"`，1 个测试文件中 3 个相关用例通过，13 个用例按筛选跳过。
- 测试期间仍有 npm 全局配置提示与 jsdom `getComputedStyle` 伪元素提示，属于既有环境提示，不影响本轮断言结果。
