## 1. 前置扫描与范围确认

- [x] 1.1 读取 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md` 和 `specs/project-text-integrity/spec.md`，确认本次只处理乱码文本完整性。
- [x] 1.2 执行 `git status --short`，记录实施前已有未提交改动，避免覆盖无关文件。
- [x] 1.3 执行 `rg -n "闊|鏂|缂|鐠|閸|瀹|婢|褰|璇|鍙|閺|鏆|鍒|鎻|鍏|绠|妯|澶|宸|鈧|�|||" src doc openspec --glob '!doc/progress.md'`，输出并分类乱码命中。
- [x] 1.4 将命中项分为 `src` 源码/测试、活跃 OpenSpec、归档 OpenSpec、历史进展样例四类，并标记哪些可可靠还原。

## 2. 源码与测试乱码修复

- [x] 2.1 修复 `src/pages/auth/LoginPage.test.tsx` 中 C10001 mock 消息乱码，恢复为正常业务文案。
- [x] 2.2 复扫 `src`：`rg -n "闊|鏂|缂|鐠|閸|瀹|婢|褰|璇|鍙|閺|鏆|鍒|鎻|鍏|绠|妯|澶|宸|鈧|�|||" src --glob '*.{ts,tsx,css,html,json,md}'`，确保源码层无未解释残留。
- [x] 2.3 执行登录页相关定向测试，例如 `cmd /c npx vitest run --config vite.request-test.config.ts src/pages/auth/LoginPage.test.tsx` 或项目现有登录页临时配置，确认测试仍通过。

## 3. OpenSpec 与文档乱码修复

- [x] 3.1 修复活跃 OpenSpec change 中可可靠还原的乱码任务文案，优先处理 `openspec/changes/add-points-usage-statistics-page/tasks.md`。
- [x] 3.2 检查归档 OpenSpec 命中项，能从上下文可靠还原的再修复；不能可靠还原的保留并记录原因。
- [x] 3.3 检查 `doc` 命中项，区分历史乱码样例和真实文档污染；历史样例可保留，但必须在进展文档说明。
- [x] 3.4 执行 `cmd /c openspec validate fix-project-mojibake-text --strict`，确认本 change 文档可校验。

## 4. 验证与进展记录

- [x] 4.1 执行全项目乱码复扫：`rg -n "闊|鏂|缂|鐠|閸|瀹|婢|褰|璇|鍙|閺|鏆|鍒|鎻|鍏|绠|妯|澶|宸|鈧|�|||" src doc openspec --glob '!doc/progress.md'`，记录剩余命中及处理原因。
- [x] 4.2 执行必要的类型检查或定向测试，至少覆盖本次触碰的源码测试文件。
- [x] 4.3 执行 `git diff --stat` 和目标文件 diff，确认没有 API、路由、状态流、组件结构或依赖变更。
- [x] 4.4 更新 `doc/progress.md`，记录已完成、当前判断、下一步和验证结果。
- [x] 4.5 更新本 `tasks.md` 勾选已完成任务。
