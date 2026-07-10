# 2026-07-10 测试套件瘦身整理

## 已完成

- 已扫描当前测试资产：`src` 下共有 58 个 `*.test.ts` / `*.test.tsx` 文件。
- 已读取测试入口配置：
  - `package.json`
  - `vite.config.ts`
  - `vite.request-test.config.ts`
  - `vitest.video-remix-regression.config.ts`
- 已确认当前默认 `npm test` 并不会运行源码旁边的测试文件：
  - `vite.config.ts` 的 `include` 指向 `src/__tests_disabled__/**/*.test.ts(x)`。
  - 同时 `exclude` 排除了 `src/**/*.test.ts(x)` 和 `src/**/*.spec.ts(x)`。
  - 因此当前测试文件主要依赖显式命令或专用 Vitest 配置运行。
- 已按测试价值初步分层：
  - 高价值保留：请求层、API 封装、路由守卫/动态路由、表单映射、状态纯函数。
  - 中价值保留或合并：关键页面主流程测试、上传/提交防抖等真实回归测试。
  - 候选瘦身：大体量页面细节测试、alert regression 单点测试、重复页面交互测试、已由更底层测试覆盖的页面测试。

## 当前判断

- 不建议删除全部测试文件。项目里仍有不少高价值测试能保护请求封装、API 契约、路由权限、表单映射和状态判断。
- 当前真正影响“整洁”的不是测试命令成本，而是大量页面级测试散在源码旁边，且默认脚本已经不运行它们，导致“看起来很多、实际不跑”的维护负担。
- 推荐采用“保留核心安全网 + 删除或迁移低价值页面回归”的瘦身方案。

## 建议保留范围

- 请求与错误处理：
  - `src/utils/request.test.ts`
  - `src/api/api-prefix.test.ts`
  - `src/api/system/auth/index.test.ts`
- API 封装契约：
  - `src/api/aigc/uploads/index.test.ts`
  - `src/api/aigc/video-remix-tasks/index.test.ts`
  - `src/api/aigc/customised-audios/index.test.ts`
  - `src/api/aigc/digital-persons/index.test.ts`
  - `src/api/aigc/digital-person-videos/index.test.ts`
  - `src/api/customer/text-image-video/index.test.ts`
  - `src/api/points/usage/index.test.ts`
- 路由与基础设施：
  - `src/app/router/routeGuards.test.ts`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/app/router/homeRoute.test.ts`
  - `src/app/router/KeepAliveOutlet.test.tsx`
  - `src/build/manualChunks.test.ts`
- 业务纯函数：
  - `src/features/video-remix/form.test.ts`
  - `src/features/video-remix/status.test.ts`
  - `src/features/text-image-video/form.test.ts`
  - `src/features/text-image-video/status.test.ts`
  - `src/features/digital-human/form.test.ts`
  - `src/features/digital-human/status.test.ts`
  - `src/features/digital-human-video/form.test.ts`
  - `src/features/digital-human-video/status.test.ts`
  - `src/features/digital-human/video/canvas.test.ts`
  - `src/features/ui-preferences/slice.test.ts`

## 候选瘦身范围

- 大体量页面测试优先拆薄或删除：
  - `src/pages/content/VideoRemixTaskDetailPage.test.tsx`：1555 行，42 条用例，是当前最大维护负担。
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.test.tsx`：603 行，15 条用例。
  - `src/pages/digital-human/DigitalHumansPage.test.tsx`：413 行，8 条用例。
  - `src/app/App.test.tsx`：386 行，16 条用例。
- 单点历史回归测试可合并或删除：
  - `src/pages/content/ImageVideoPage.upload-style-regression.test.tsx`
  - `src/pages/digital-human/DigitalHumansPage.alert-regression.test.tsx`
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.alert-regression.test.tsx`
- 简单展示型页面测试可删除或只保留冒烟：
  - `src/pages/workspace/TaskRecordsPage.test.tsx`
  - `src/shared/components/LazyImage.test.tsx`
  - `src/app/styles.scrollbar.test.ts`
  - `src/features/workspace/mockData.test.ts`

## 下一步

1. 等用户确认瘦身策略后，再进入实际删除或迁移。
2. 第一轮建议只处理候选瘦身范围，不动 API、请求、路由、表单、状态纯函数测试。
3. 如执行删除，必须先列出最终删除清单，确认后再删除磁盘文件。
4. 删除后同步更新 `vite.request-test.config.ts`、`vitest.video-remix-regression.config.ts` 中的测试引用。
5. 最后运行：
   - `npm run typecheck`
   - 保留测试的定向 Vitest 命令
   - `npm test`，确认默认禁用入口仍保持预期

## 验证结果

- 已执行测试资产扫描，统计到 58 个测试文件。
- 已执行 `npm test`，结果为未发现测试文件且退出码为 0；这是当前 `vite.config.ts` 配置预期行为。
- 曾尝试 `npm test -- --runInBand`，Vitest 4 不支持该 Jest 参数，命令失败；该失败不是项目测试失败。

---

## 第一轮执行结果

### 已完成

- 已按用户确认删除 11 个低价值/高维护成本测试文件：
  - `src/pages/content/VideoRemixTaskDetailPage.test.tsx`
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.test.tsx`
  - `src/pages/digital-human/DigitalHumansPage.test.tsx`
  - `src/app/App.test.tsx`
  - `src/pages/content/ImageVideoPage.upload-style-regression.test.tsx`
  - `src/pages/digital-human/DigitalHumansPage.alert-regression.test.tsx`
  - `src/pages/digital-human/DigitalHumanVideoTasksPage.alert-regression.test.tsx`
  - `src/pages/workspace/TaskRecordsPage.test.tsx`
  - `src/shared/components/LazyImage.test.tsx`
  - `src/app/styles.scrollbar.test.ts`
  - `src/features/workspace/mockData.test.ts`
- 已清理 `vitest.video-remix-regression.config.ts` 中已删除的 `VideoRemixTaskDetailPage.test.tsx` 引用。
- 已校准保留测试中的旧断言：
  - `src/app/router/routeRegistry.test.ts`：不再断言已禁用的 workspace 路由存在。
  - `src/app/router/dynamicRoutes.test.ts`：改用当前启用的内容路由作为成功样例，并覆盖禁用 workspace 组件被过滤。
  - `src/app/router/routeGuards.test.ts`：改用当前启用的 `content.viralRemixTasks` 路由。
  - `src/api/aigc/video-remix-tasks/index.test.ts`：接口断言对齐当前 `/video-remix-tasks` 封装。
- 已修复 `src/app/router/dynamicRoutes.ts` 中仍映射已禁用路由的问题，避免后端下发已禁用 workspace/product/viral-remix 创建入口组件时触发 `Unknown route key`。

### 当前判断

- 第一轮后测试文件数量从 58 个降到 47 个。
- 已删除的主要是默认测试入口不运行、且维护成本较高的页面级测试；核心 API、请求、路由、表单映射、状态纯函数测试仍保留。
- 留下来的专项回归配置现在可稳定运行，比删除前更符合“保留测试必须能跑”的目标。

### 验证结果

- 已执行 `npm run typecheck`：通过。
- 已执行 `npm test`：通过，仍按当前默认配置显示未发现测试文件并以 0 退出。
- 已执行 `npm test -- --config vitest.video-remix-regression.config.ts`：8 个测试文件、49 条用例通过。
- 已执行核心定向测试：
  - 命令：`npm test -- --config vite.request-test.config.ts src/utils/request.test.ts src/api/api-prefix.test.ts src/api/system/auth/index.test.ts src/app/router/routeGuards.test.ts src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts src/features/video-remix/form.test.ts src/features/video-remix/status.test.ts`
  - 结果：8 个测试文件、61 条用例通过。
- 验证过程仍有既有 npm 全局配置警告：`store-dir`、`global-bin-dir`；视频混剪专项测试仍有 jsdom `getComputedStyle` 伪元素提示，不影响测试结果。
