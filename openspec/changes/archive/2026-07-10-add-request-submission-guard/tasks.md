## 1. 上下文复核

- [x] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md` 和 `specs/request-submission-guard/spec.md`，确认实现范围只覆盖前端提交保护。
- [x] 1.2 使用 `rg "useMutation|mutateAsync|\\.mutate\\(" src` 建立 mutation 入口清单，按创建、删除、生成、上传、刷新动作标注优先级。
- [x] 1.3 复核 `src/utils/request.ts` 与 `src/utils/requestAuthRefresh.ts`，确认本次不修改 retry、token refresh、错误提示去重语义。

## 2. 提交保护能力实现

- [x] 2.1 先补红灯测试，选择至少一个 feature hook 场景证明快速重复触发会导致业务函数被调用多次。
- [x] 2.2 新增轻量提交保护 hook 或工具函数，优先放在 `src/shared/hooks` 或 `src/shared/utils`，保持 API 简单、类型明确。
- [x] 2.3 将数字人、定制音色、数字人视频等 feature mutation hooks 接入提交保护，覆盖创建、删除、刷新动作。
- [x] 2.4 将页面内直接 `useMutation` 的高风险入口接入提交保护，优先覆盖图文生视频、爆款改编、任务详情生成/保存动作。
- [x] 2.5 对上传类 mutation 做单独判断：若同一上传入口不允许并发，接入 guard；若业务允许批量并发上传，保留原并发语义并在代码注释中说明原因。

## 3. UI 状态与交互补位

- [x] 3.1 检查接入 guard 的按钮、Modal 确认、上传触发器是否保留 `loading` 或 `disabled` 反馈。
- [x] 3.2 对仍只依赖视觉 loading 的高风险按钮补充同步逻辑保护，避免 React 状态更新前重复触发。
- [x] 3.3 不新增通用 Button 封装；如发现重复模式，优先复用轻量 hook，而不是改造 UI 组件体系。

## 4. 测试与验证

- [x] 4.1 补充 hook 单元测试：重复触发只调用一次业务函数，失败 settle 后允许再次提交。
- [x] 4.2 补充页面定向测试：快速点击创建/生成按钮只触发一次 mutation，pending 时按钮有 loading 或 disabled。
- [x] 4.3 执行 `cmd /c npm test -- --config vite.request-test.config.ts src/utils/request.test.ts`，确认请求层 retry/refresh 语义未被影响。
- [x] 4.4 执行受影响 feature/page 的定向测试。
- [x] 4.5 执行 `cmd /c npm run typecheck`。
- [x] 4.6 执行 `cmd /c openspec validate add-request-submission-guard --strict`。
- [x] 4.7 更新 `doc/progress.md` 或专题进展文档，记录已完成、当前判断、下一步和验证结果。
