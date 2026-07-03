# 2026-07-01 仓库清理候选排查进展

## 已完成
- 已按“不直接删除”的原则完成仓库扫描，重点检查了根目录临时文件、`tmp/` 截图目录、`.kilo/` 目录，以及多份 `vitest.*.config.ts` 文件。
- 已确认当前 Git 未跟踪内容只有 `.kilo/` 目录；其余大部分候选文件已经被仓库跟踪。
- 已核对 `package.json`、`.gitignore`、`doc/` 历史进展文档和 Git 跟踪状态，避免把仍在使用或仍需追溯的文件误删。

## 当前判断
- `.kilo/` 更像本地工具目录，不属于业务运行主链路；但其下存在 `kilo.json` 与 Figma MCP 相关配置，是否可删取决于后续是否还要在当前仓库继续使用 Kilo / Figma 工作流。
- `tmp-dev-server.log`、`tmp/` 下截图文件，以及多份 `vitest.*-temp.config.ts` 虽然命名上偏“临时”，但当前都已经被 Git 跟踪，且被 `doc/` 中多份历史进展文档引用，现阶段更适合视为“历史排查留档”而不是纯垃圾文件。
- `vitest.video-remix-regression.config.ts` 不建议归入清理范围。它不是临时排障副产物，而是被多轮回归验证反复使用的回归配置文件。
- `tmp-dev-server.log.local-backup` 当前未被 Git 跟踪，且只作为本地备份留存；从风险角度看，它是最接近“可安全清理”的候选项，但本轮仍未执行删除。

## 建议清理分层

### 可优先确认是否清理
- `.kilo/`
- `tmp-dev-server.log.local-backup`

### 建议暂缓清理
- `tmp-dev-server.log`
- `tmp/current-captcha.png`
- `tmp/login-page.png`
- `tmp/text-image-video-test.png`
- `vitest.app-route-highlight-temp.config.ts`
- `vitest.digital-human-video-temp.config.ts`
- `vitest.digital-humans-local-upload-temp.config.ts`
- `vitest.global-scrollbar-temp.config.ts`
- `vitest.image-video-upload-style-temp.config.ts`
- `vitest.request-error-popup-temp.config.ts`
- `vitest.text-image-video-temp.config.ts`
- `vitest.video-remix-form-temp.config.ts`
- `vitest.video-remix-temp.config.ts`
- `vitest.video-remix-regression.config.ts`

## 补充说明
- 现有 `doc/progress.md` 在当前环境下读取为非 UTF-8 内容，直接追加存在破坏历史文档的风险，所以本轮改为新增独立进展文档，不覆盖原文件。

## 下一步
1. 由用户确认是否执行“仅删本地工具/备份类文件”这一档。
2. 若要继续做深度清理，建议下一轮先把“历史留档文件”和“当前仍有回归价值的测试配置”拆开，再逐个判断是否迁移到 `docs/` 或统一收编。

## 第二轮细分审计

### 三类判断

#### 1. 真实本地工具/备份类
- `.kilo/`
- `tmp-dev-server.log.local-backup`

判断依据：
- `.kilo/` 当前仅为未跟踪本地目录，仓库代码与文档没有业务依赖。
- `tmp-dev-server.log.local-backup` 未被 Git 跟踪，只是本地日志备份。

#### 2. 历史留档类
- `tmp-dev-server.log`
- `tmp/current-captcha.png`
- `tmp/login-page.png`
- `tmp/text-image-video-test.png`

判断依据：
- 这些文件已经被 Git 跟踪。
- `doc/` 中已有进展文档明确引用它们作为排查记录的一部分。
- 更适合后续单独做“留档收编”，不适合当前直接删。

#### 3. 仍有回归价值的测试配置类
- `vitest.app-route-highlight-temp.config.ts`
- `vitest.digital-human-video-temp.config.ts`
- `vitest.digital-humans-local-upload-temp.config.ts`
- `vitest.global-scrollbar-temp.config.ts`
- `vitest.image-video-upload-style-temp.config.ts`
- `vitest.request-error-popup-temp.config.ts`
- `vitest.text-image-video-temp.config.ts`
- `vitest.video-remix-form-temp.config.ts`
- `vitest.video-remix-temp.config.ts`
- `vitest.video-remix-regression.config.ts`

判断依据：
- 虽然命名包含 `temp`，但它们被多份阶段性进展文档反复引用，并实际承担定向回归入口职责。
- `vitest.video-remix-regression.config.ts` 明显属于持续回归配置，不建议纳入废弃文件范围。

## OpenSpec 归档排查

### 环境现状
- 当前工作区未安装可直接调用的 `openspec` CLI，标准 `openspec list --json` / `openspec status --change ...` 流程无法执行。
- 当前仓库也不存在 `openspec/specs/` 主规格目录，因此标准归档技能里的“delta spec 对比主 spec 同步状态”暂时无法自动核验。
- `openspec/changes/archive/` 目录当前不存在，说明尚未有已归档 change 目录。

### 基于 tasks.md 的人工审计结果
- `add-figma-ui-shell-pages`：`41` 个完成，`0` 个未完成，属于优先归档候选。
- `add-text-image-video-task-flow`：`24` 个完成，`0` 个未完成，属于优先归档候选。
- `add-digital-human-management-flow`：`28` 个完成，`2` 个未完成，暂不建议归档。
- `add-video-remix-task-flow`：`27` 个完成，`2` 个未完成，暂不建议归档。
- `add-account-system-react-pages`：`0` 个完成，`29` 个未完成，不能归档。
- `connect-dynamic-menu-routes`：`6` 个完成，`25` 个未完成，不能归档。
- `redesign-video-remix-step-flow`：`4` 个完成，`21` 个未完成，不能归档。

### 当前建议
1. 若要执行 OpenSpec 归档，优先考虑：
   - `add-figma-ui-shell-pages`
   - `add-text-image-video-task-flow`
2. 其余 changes 先保留，避免把仍有未完成任务的变更过早归档。
