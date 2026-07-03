# 2026-07-03 清理测试文件请求评估

## 已完成

- 已接收用户“在主分支删除测试文件和没用文件”的请求。
- 已根据仓库协作规则判断：该请求属于高风险磁盘操作，且删除范围尚不明确，不能直接执行。
- 已确认当前需要先输出清理流程、影响范围和确认点，再决定是否进入实际删除阶段。
- 已完成第一轮安全扫描，不执行删除，只输出测试文件和疑似无引用文件清单。
- 已确认当前仓库存在 48 个 `src` 下测试文件、13 个根目录 `vitest*.config.ts` 配置文件。
- 已确认默认 `vite.config.ts` 会排除 `src/**/*.test.*`，普通构建与默认测试流程不会自动跑这些测试。
- 已确认部分测试仍依赖手动配置运行：
  - `vite.request-test.config.ts`
  - 多个 `vitest.*temp.config.ts`
- 已确认存在一组高疑似未接入生产代码的候选：
  - `src/features/digital-human-video/*` 共 6 个文件
  - `src/api/system/{configs,depts,dicts,logs,notices,roles,users}/*` 共 14 个文件
  - `src/api/index.ts`

## 当前判断

- 不能直接在 `main` 上做“看起来没用就删”的清理，这类操作容易误删测试基线、构建保障文件和后续 OpenSpec 依赖文档。
- “测试文件”不一定等于“无用文件”。测试在前端里相当于回归保护网，删掉以后短期看起来更干净，但后续改功能时更容易把问题带进主分支。
- 正确做法应先分两层：
  1. 盘点候选删除文件；
  2. 逐项确认后再删除。
- 如果最终要执行，建议不要直接在 `main` 上删，而是先切一个清理分支，例如 `chore/cleanup-tests-and-unused-files`。

## 扫描结果

### 建议保留

- `src/test/setup.ts`
  - 原因：被 `vite.config.ts` 和 `vite.request-test.config.ts` 作为测试初始化入口引用。
- `vite.request-test.config.ts`
  - 原因：不是默认脚本入口，但被多份进展文档记录为手动回归命令配置，仍有实际用途。
- `src/api/system/auth/*`
  - 原因：登录页真实使用。
- `src/api/system/menus/*`
  - 原因：动态路由真实使用。
- `src` 下大部分页面/特性测试文件
  - 原因：虽然默认 `vite.config.ts` 排除了它们，但根目录保留了多份单测/回归专用 `vitest` 配置文件，用来按需点跑。

### 建议删除候选

- `src/features/digital-human-video/form.ts`
- `src/features/digital-human-video/hooks.ts`
- `src/features/digital-human-video/status.ts`
- `src/features/digital-human-video/form.test.ts`
- `src/features/digital-human-video/hooks.test.ts`
- `src/features/digital-human-video/status.test.ts`
  - 判断依据：当前生产页面实际使用的是 `src/features/digital-human/video/*`，这一整组旧目录未被生产入口链路引用，且检索不到真实页面导入。

### 需要你确认

- `src/api/index.ts`
  - 判断：当前未发现生产代码引用，像历史 barrel 文件。
- `src/api/system/configs/*`
- `src/api/system/depts/*`
- `src/api/system/dicts/*`
- `src/api/system/logs/*`
- `src/api/system/notices/*`
- `src/api/system/roles/*`
- `src/api/system/users/*`
  - 判断：当前主应用入口链路未接入，也未在非测试生产代码里检索到导入；但这些文件更像“后台能力预留接口”，不建议我替你擅自定义为垃圾文件。
- 根目录 `vitest.*temp.config.ts`
  - 判断：默认脚本不用，但被 `doc/` 多份历史进展文档引用，属于“手动回归入口”还是“历史临时配置”，需要你做策略判断。
- `tmp-dev-server.log`
- `tmp-dev-server.log.local-backup`
- `tmp/current-captcha.png`
- `tmp/login-page.png`
- `tmp/text-image-video-test.png`
  - 判断：从用途看偏临时产物，但当前部分文件已被 Git 跟踪或被历史文档提及，删除前建议单独确认。
- `.env.test`
  - 判断：当前不是默认开发入口，但属于标准环境文件命名，不建议只因为“暂时没用到”就直接删。
- `src` 下其余 48 个测试文件
  - 判断：默认流程不自动执行，不等于无用；如果你要做“主分支减重”，这批文件需要按“是否保留回归保障”来决定，而不是按名字一刀切。

## 下一步

1. 由你先确认上面三类中的删除范围。
2. 我只会按你点名确认的文件执行删除，不会扩大范围。
3. 删除前我会再次提示影响范围，并建议先切清理分支。

## 验证结果

- 尚未执行任何删除操作。
- 尚未修改任何业务代码。
- 已执行静态入口链路扫描：从 `src/app/main.tsx` 与 `vite.config.ts` 出发分析生产可达文件。
- 已执行仓库检索：确认 `vite.request-test.config.ts`、多份 `vitest.*temp.config.ts`、`tmp` 产物和若干候选模块的被引用情况。

## 2026-07-03 清理执行结果

### 已完成

- 已删除 `src` 下全部 `*.test.ts`、`*.test.tsx`、`*.spec.ts`、`*.spec.tsx` 测试文件。
- 已删除测试运行入口：
  - `src/test/setup.ts`
  - `vite.request-test.config.ts`
  - 根目录 `vitest*.config.ts`
- 已删除测试环境文件：
  - `.env.test`
- 已删除临时日志与截图产物：
  - `tmp-dev-server.log`
  - `tmp-dev-server.log.local-backup`
  - `tmp/current-captcha.png`
  - `tmp/login-page.png`
  - `tmp/text-image-video-test.png`
- 已删除未接入当前生产入口链路的候选模块：
  - `src/features/digital-human-video/*`
  - `src/api/index.ts`
  - `src/api/system/configs/*`
  - `src/api/system/depts/*`
  - `src/api/system/dicts/*`
  - `src/api/system/logs/*`
  - `src/api/system/notices/*`
  - `src/api/system/roles/*`
  - `src/api/system/users/*`
- 已更新 `.gitignore`，后续忽略：
  - `*.test.ts`
  - `*.test.tsx`
  - `*.spec.ts`
  - `*.spec.tsx`
  - `src/test/`
  - `vitest*.config.ts`
  - `vite.request-test.config.ts`
  - `.env.test`
  - `tmp/`
  - `tmp-*.log`
  - `tmp-*.log.*`
- 已移除 `package.json` 中测试脚本与测试依赖：
  - `test`
  - `test:watch`
  - `vitest`
  - `jsdom`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
- 已同步更新 `package-lock.json`。
- 已清理 `vite.config.ts` 中 Vitest 配置，并恢复为从 `vite` 导入 `defineConfig`。
- 已清理 `tsconfig.app.json` 中测试类型声明。
- 已补齐 `LoginRequest` 的 `captchaId` 可选字段，解决清理后暴露出的登录请求类型问题。

### 当前判断

- 当前项目已经从“保留手动回归测试入口”的状态，切换为“主分支不保留测试文件和临时测试配置”的状态。
- 后续如果重新引入测试，需要重新添加测试依赖、测试脚本和测试初始化配置。
- `main` 现在更轻，但回归保护也随之减少；后续建议至少保留构建校验作为合并前门槛。

### 验证结果

- 已执行：`npm install --package-lock-only --ignore-scripts`
- 已执行：`npm run typecheck`
- 已执行：`npm run build`
- 已执行：`git check-ignore -v ...`，确认测试文件、临时测试配置、`.env.test`、`tmp/`、`tmp-*.log` 均会被忽略。
- 已确认：`src` 下测试文件数量为 `0`。
- 构建结果：通过。
- 额外提示：`npm` 输出 1 个低危审计项，以及全局 npm 配置 `store-dir`、`global-bin-dir` 警告；Vite 输出 `antd-vendor` chunk 超过 900KB 的体积警告，均非本次清理阻塞项。
