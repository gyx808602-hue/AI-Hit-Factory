# 2026-07-10 接口防重复提交进展

## 已完成

- 已扫描项目结构，确认当前技术栈为 Vite + React + TypeScript + Ant Design + TanStack Query。
- 已检查统一请求层 `src/utils/request.ts`、token refresh 逻辑、React Query mutation 使用点和部分高频页面。
- 已判断当前问题不是 React Query `retry`，而是用户点击入口缺少同步提交保护：loading 只负责视觉反馈，不能保证 mutation 触发函数不会被快速重复调用。
- 已创建 OpenSpec change：`openspec/changes/add-request-submission-guard/`。
- 已补充 OpenSpec 文档：
  - `proposal.md`
  - `design.md`
  - `specs/request-submission-guard/spec.md`
  - `tasks.md`
- 已新增共享提交保护 hook：`src/shared/hooks/useGuardedMutation.ts`。
- 已将数字人、定制音色、数字人视频、图文生视频、爆款改编、任务列表/详情等高风险 mutation 入口接入 guard。
- 已补充 hook 单元测试和页面级快速重复点击测试。
- 已将主规格同步到 `openspec/specs/request-submission-guard/spec.md`，便于归档后保留能力约束。
- 已归档 OpenSpec change 到 `openspec/changes/archive/2026-07-10-add-request-submission-guard/`。

## 当前判断

- 本次能力更准确地应命名为“提交保护 / 请求防重复触发”，而不是传统时间窗口防抖。
- 推荐在 React Query mutation 触发层做 pending 期间的同步 guard，避免页面到处手写 `if (isPending) return`。
- 不建议放在 axios request 层按 URL/body 全局去重，因为会混淆用户重复点击、React Query retry、access token refresh 重放和合法并发上传。
- `doc/progress.md` 当前存在非 UTF-8 字节，无法通过 `apply_patch` 安全追加；本轮改为新建专题进展文档，避免覆盖历史记录。
- 上传类 mutation 的处理边界是：同一次选择文件内部允许 `Promise.all` 并发上传，但同一个上传动作在 pending 期间不能被用户重复触发。

## 下一步

1. 后续若后端也需要最终一致性保护，可单独补充幂等 key 或服务端唯一约束方案。

## 验证结果

- `cmd /c npm test -- --config vite.request-test.config.ts src/features/digital-human/hooks.test.ts`：1 个文件、7 条用例通过。
- `cmd /c npm test -- --config vite.request-test.config.ts src/features/digital-human/audio/hooks.test.ts src/features/digital-human/video/hooks.test.ts src/features/digital-human-video/hooks.test.ts`：2 个文件、10 条用例通过。
- `cmd /c npm test -- --config vite.request-test.config.ts src/features/digital-human-video/hooks.test.ts`：1 个文件、5 条用例通过。
- `cmd /c npm test -- --config vite.request-test.config.ts src/utils/request.test.ts`：1 个文件、20 条用例通过。
- `cmd /c npm test -- --config vite.request-test.config.ts src/pages/content/ImageVideoPage.submission-guard.test.tsx src/pages/content/TextImageVideoTasksPage.test.tsx`：2 个文件、7 条用例通过。
- `cmd /c npm test -- --config vite.request-test.config.ts src/pages/content/ViralRemixPage.test.tsx src/pages/content/VideoRemixTasksPage.test.tsx src/pages/content/VideoRemixTaskDetailPage.test.tsx src/pages/content/TextImageVideoTasksPage.test.tsx`：4 个文件、51 条用例通过。
- `cmd /c npm run typecheck`：通过。
- `cmd /c openspec validate add-request-submission-guard --strict`：通过。
- `cmd /c openspec validate request-submission-guard --type spec --strict`：通过。
- `cmd /c openspec validate --specs --strict`：6 个 spec 全部通过。
