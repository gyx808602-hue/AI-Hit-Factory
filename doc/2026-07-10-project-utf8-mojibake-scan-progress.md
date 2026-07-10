# 2026-07-10 项目中文 UTF-8 与乱码扫描修复

## 已完成

- 已扫描整体项目结构，确认当前技术栈为 Vite + React + TypeScript + Ant Design。
- 已对 `src`、`doc`、`openspec` 中的文本文件做 UTF-8 解码与中文乱码关键词扫描。
- 已修复源码中的中文乱码文案：
  - `src/utils/request.ts`：`缃戠粶杩炴帴澶辫触` 修复为 `网络连接失败`。
  - `src/utils/request.ts`：`璇锋眰澶辫触` 修复为 `请求失败`。
  - `src/utils/request.ts`：`鏉冮檺涓嶈冻` 修复为 `权限不足`。
  - `src/features/video-remix/status.test.ts`：`浠诲姟` 修复为 `任务`。
- 已移除 3 个源码文件开头的 UTF-8 BOM：
  - `src/features/video-remix/components/detailComponents.tsx`
  - `src/pages/digital-human/CustomisedAudiosPage.test.tsx`
  - `src/pages/digital-human/DigitalHumansPage.test.tsx`

## 当前判断

- `src` 目录源码层已满足“中文以原始 UTF-8 存储，不出现 `璇锋眰澶辫触` 这类乱码”的要求。
- 当前仓库存在历史文档污染：`doc/progress.md` 内仍有较多旧阶段乱码片段。
- 另外 4 个文档/OpenSpec 文件无法按 UTF-8 严格解码：
  - `doc/2026-06-23-digital-human-video-task-progress.md`
  - `doc/2026-06-23-first-login-change-password-plan.md`
  - `doc/2026-06-27-video-remix-stepflow-progress.md`
  - `openspec/changes/add-silent-token-refresh/tasks.md`
- 这些历史文档不影响当前源码构建，但会影响后续检索、审计和进展阅读；建议单独开“历史文档编码修复”任务处理，避免在源码修复里大面积改写历史记录。

## 下一步

1. 如需继续彻底清理文档层乱码，先对上述 4 个非 UTF-8 文件判断原始编码来源，再决定是转码修复还是保留并补充说明。
2. 对 `doc/progress.md` 中旧的乱码段落，建议按专题逐段重写，不建议盲目批量替换，避免误改历史上下文。

## 验证结果

- 已执行源码乱码扫描：`rg -n "璇锋眰|澶辫触|缃戠粶|浠诲姟|鏉冮檺|..." src --glob "*.{ts,tsx,css,html,json,md}"`，源码无命中。
- 已执行 UTF-8 校验：`src` 下 169 个文本文件均可按 UTF-8 解码，且无 UTF-8 BOM。
- 已执行定向测试：`npm test -- --config vite.request-test.config.ts src/utils/request.test.ts src/features/video-remix/status.test.ts`，2 个测试文件、26 条用例全部通过。
- 测试过程仍出现既有 npm 全局配置警告：`store-dir`、`global-bin-dir`，不影响本次验证结果。
