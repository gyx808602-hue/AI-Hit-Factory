## Why

当前多个提交按钮虽然显示 loading，但快速连续点击仍可能在 React Query 状态更新前触发多次 `mutate` / `mutateAsync`，导致重复创建、重复刷新或重复删除请求。这个问题需要和 React Query 的失败重试区分：失败重试是同一次 mutation 内部的网络恢复策略，防重复提交是用户交互入口的并发保护。

## What Changes

- 新增“请求提交保护”能力，统一约束创建、删除、刷新、生成、上传等修改类动作在同一动作飞行中只允许触发一次。
- 优先在 React Query mutation hook 或稳定封装层增加轻量 guard，避免页面到处手写 `if (isPending) return`。
- 保留 React Query `retry` 的语义边界，不把失败后的自动重试当成重复点击，也不阻断 token refresh 对原请求的内部重放。
- 补充测试，覆盖快速重复触发只调用一次业务接口，以及失败后可以再次由用户主动提交。

## Capabilities

### New Capabilities

- `request-submission-guard`: 约束前端修改类接口的用户触发入口，防止同一动作在请求完成前被重复提交，并明确与 React Query retry、token refresh 重放的边界。

### Modified Capabilities

- 无。

## Impact

- 影响范围：`src/features/**/hooks.ts` 中的 React Query mutation hooks、少量页面内直接 `useMutation` 的提交入口、相关单元测试和 OpenSpec 文档。
- 不影响后端 API 契约，不新增依赖，不改变全局请求层的鉴权刷新、错误提示去重、业务 code 解包逻辑。
- 需要关注已有页面的 loading/disabled 视觉状态，确保 guard 与 Ant Design 按钮 loading 状态互相补位，而不是只依赖视觉层。
