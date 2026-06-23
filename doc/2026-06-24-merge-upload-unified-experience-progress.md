# 2026-06-24 合并 `codex/upload-unified-experience` 到 `main`

## 已完成

- 已确认当前分支为 `main`，目标分支为 `codex/upload-unified-experience`。
- 已用 `git stash push --include-untracked -m "codex-before-merge-upload-unified-experience"` 临时保存合并前本地改动：
  - `.gitignore`
  - `doc/progress.md`
- 已定位合并阻塞原因：本地 `tmp-dev-server.log` 正被本仓库 Vite 开发服务占用。
- 已停止对应本地开发服务进程，并把原本的本地日志改名保留为：
  - `tmp-dev-server.log.local-backup`
- 已执行快进合并：
  - `git merge --ff-only codex/upload-unified-experience`
- 合并成功后，`main` 已更新到：
  - `3530d76 feat: unify upload detail experience and restore workspace routes`

## 当前判断

- 本次合并没有代码冲突，属于 Fast-forward 合并。
- 目标分支本身新增并跟踪了 `tmp-dev-server.log` 和 `tmp/` 下截图文件，所以此前单独忽略 `tmp-dev-server.log` 不能再作为最终处理方案。
- 本地备份文件 `tmp-dev-server.log.local-backup` 仍保留，未删除任何磁盘内容。
- 合并前 stash 仍保留，可用于回查合并前本地改动。
- `doc/progress.md` 存在历史编码混杂问题，终端读取时可能显示乱码，因此本次额外新增此 UTF-8 专项进展文档，避免记录不可读。

## 验证结果

- 已执行：
  - `npm run typecheck`
  - 结果：通过。
- 已执行：
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts src/app/router/dynamicRoutes.test.ts src/app/App.test.tsx`
  - 结果：通过，`8` 个测试文件、`47` 个测试全部通过。

## 收尾状态

- 当前 `main` 已领先 `origin/main` 两个提交。
- 当前未提交改动包括：
  - `doc/progress.md`
  - `doc/2026-06-24-merge-upload-unified-experience-progress.md`
  - `tmp-dev-server.log.local-backup`
- `stash@{0}` 仍保留合并前本地改动快照，暂未删除。

