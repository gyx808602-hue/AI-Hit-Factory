# 2026-07-03 Git 分支策略建议整理

## 已完成

- 已检查当前仓库 Git 状态：当前位于 `main`，工作区干净，可安全切换到新的协作分支策略。
- 已检查远端分支：当前远端主要分支为 `origin/main`，另有历史协作分支 `origin/codex/upload-unified-experience` 可作为命名参考。
- 已确认当前目录不是 linked worktree，属于普通仓库工作目录。
- 已整理适合当前项目的三层分支模型：`main -> develop -> feature/*`。

## 当前判断

- 如果团队后续会持续并行开发多个需求，采用三层模型比“所有人直接从 `main` 拉功能分支”更稳，因为 `develop` 可以承担集成缓冲层。
- `main` 应只保留可发布、可回滚的稳定代码；`develop` 用于日常集成验证；`feature/*` 用于单需求开发。
- 当前仓库还比较适合继续保持轻量流程，因此不建议再额外引入过多长期分支，比如 `release/*`、`hotfix/*`，除非后面上线节奏和多人协作复杂度明显上升。
- 如果同一时间要并行处理多个互不相关需求，建议配合 `git worktree`，避免一个工作目录里频繁来回切分支。

## 下一步

1. 先在远端建立并保护 `develop` 分支。
2. 后续所有新需求统一从 `develop` 切 `feature/<scope>-<name>`。
3. 功能完成后先合回 `develop`，集成验证通过后再由 `develop` 合回 `main`。
4. 如果需要落地执行，再补一套可直接复制的命令模板。

## 验证结果

- 已执行：`git status --short --branch`
- 已执行：`git branch --all --verbose --no-abbrev`
- 已执行：`git rev-parse --git-dir`
- 已执行：`git rev-parse --git-common-dir`
