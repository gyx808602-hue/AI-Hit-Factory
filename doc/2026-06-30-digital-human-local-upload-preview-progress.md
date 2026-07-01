# 2026-06-30 新建数字人本地上传回显进展

## 第一阶段完成：需求定位与改动边界确认

### 已完成
- 已定位目标页面为 `src/pages/DigitalHumansPage.tsx` 的“新建数字人”弹窗。
- 已确认当前“本地上传”只有单个文件输入，且仅展示文件名，没有图片或视频回显。
- 已确认当前创建接口仍是单文件契约：前端提交字段为 `file` 或 `fileUrl`，本轮不改后端 API。
- 已确认仓库 `doc/` 目录可正常新增进展文档，本轮不更新 `doc/progress.md`，避免触发该仓库已知编码问题。

### 当前判断
- 这是一个前端交互补全问题，不需要扩大到接口改造。
- 最小可行方案是：
  - 保留原有单文件上传和提交逻辑；
  - 将本地上传的 `accept` 扩展为兼容图片与视频；
  - 在弹窗内根据文件类型回显 `<img>` 或 `<video>`；
  - 使用 `URL.createObjectURL()` 生成临时预览地址，并在切换文件或关闭弹窗时释放。

### 下一步
- 先补测试，锁定图片和视频文件选择后的回显行为。
- 再修改 `DigitalHumansPage.tsx` 实现预览与资源释放逻辑。

## 第二阶段完成：红灯测试补充与根因确认

### 已完成
- 已在 `src/pages/DigitalHumansPage.test.tsx` 补充两条回归测试：
  - 上传图片文件后显示图片预览；
  - 上传视频文件后显示视频预览。
- 已对 `URL.createObjectURL` 与 `URL.revokeObjectURL` 做测试桩，确保本地 blob 预览行为可验证。
- 已尝试执行定向测试命令：
  - `npx vitest run src/pages/DigitalHumansPage.test.tsx --config vitest.digital-human-video-temp.config.ts`

### 根因确认
- 本次失败不是实现逻辑错误，而是测试配置未包含 `DigitalHumansPage.test.tsx`。
- 现有 `vitest.digital-human-video-temp.config.ts` 只加载：
  - `src/pages/DigitalHumanVideoTasksPage.test.tsx`
  - `src/features/digital-human/video/canvas.test.ts`
- 因此返回 `No test files found`，这属于仓库测试发现范围问题，不是功能绿灯。

### 下一步
- 新增本轮专用临时测试配置，仅包含 `src/pages/DigitalHumansPage.test.tsx`。
- 跑出真正的红灯结果后，再修改页面实现进入绿灯。

## 第三阶段完成：本地上传回显实现与验证通过

### 已完成
- 已新增本轮专用测试配置：
  - `vitest.digital-humans-local-upload-temp.config.ts`
- 已整理并稳定化 `src/pages/DigitalHumansPage.test.tsx`，补齐本轮相关测试：
  - 本地上传图片后显示图片预览；
  - 本地上传视频后显示视频预览；
  - 原有创建、远程 URL、操作按钮与状态场景继续覆盖。
- 已在 `src/pages/DigitalHumansPage.tsx` 完成本轮最小实现：
  - 上传输入从仅支持 `video/*` 扩展为支持 `image/*,video/*`；
  - 使用 `URL.createObjectURL()` 生成本地预览地址；
  - 根据文件 MIME 类型区分渲染 `<img>` 或 `<video>`；
  - 在切换文件、关闭弹窗、创建成功后清理并重置预览状态。

### 验证结果
- 已执行：
  - `npx vitest run --config vitest.digital-humans-local-upload-temp.config.ts`
- 结果：
  - `1 passed`
  - `7 tests passed`

### 当前判断
- “新建数字人”弹窗中的“本地上传”现在已经支持图片、视频上传后即时回显。
- 本轮未改后端接口，仍保持原有单文件创建契约，风险边界可控。

### 下一步
- 再执行一次 `npm run typecheck`，确认本轮改动没有类型回归。
