## Context

项目当前是 Vite + React + TypeScript，接口访问主要遵循 `request` 基础层、业务 API Client、React Query hooks 三层结构。已有 `src/utils/request.ts` 处理 token 注入、业务 code 解包、错误提示、access token refresh 与原请求重放；这些能力解决的是请求生命周期内部问题，不解决用户在按钮上快速重复触发多次 mutation 的问题。

当前风险主要出现在两类入口：

- feature hook 中导出的 `useCreate*Mutation`、`useDelete*Mutation`、`useRefresh*Mutation`。
- 页面内直接 `useMutation` 的创建、生成、上传动作，例如图文生视频、爆款改编、任务详情操作等。

知识点拨：React Query 的 `retry` 类似后端 HTTP Client 对“同一次请求失败”的自动恢复；本次要做的提交保护更像后端接口里的“幂等入口锁”或前端表单里的“提交锁”。两者不是一层逻辑：retry 不代表用户点了两次，重复点击也不该交给 retry 处理。

## Goals / Non-Goals

**Goals:**

- 同一个用户动作在 mutation 未完成前，重复触发 SHALL 只进入一次业务 mutationFn。
- mutation 失败或成功结束后，用户 MUST 能再次主动触发同一动作。
- React Query 的失败 retry、axios access token refresh 重放 MUST 保持原语义，不被提交保护误判为重复点击。
- 尽量把保护沉淀到 hook 或轻量工具函数，减少页面重复手写 `isPending` 判断。
- 按项目现有测试习惯补充定向测试，优先覆盖高风险创建、删除、生成、刷新动作。

**Non-Goals:**

- 不新增后端幂等 key、分布式锁或数据库唯一约束；这些属于服务端最终一致性防线，可后续由后端补充。
- 不改变 React Query 全局 `retry` 配置。
- 不重构全部页面 UI，不把所有按钮封装为新的通用 Button。
- 不改变 request 层的 token refresh、错误提示去重、业务错误处理逻辑。

## Decisions

### 1. 推荐方案：在 mutation 触发层增加“飞行中提交保护”

新增轻量 hook 或工具，例如 `useGuardedMutation` / `createGuardedMutationFn`，内部用 `useRef` 记录当前 mutation 是否正在执行。触发时如果已有同一动作进行中，直接返回当前 Promise 或忽略重复触发；原 mutation 完成后在 `finally` 中释放锁。

推荐原因：

- 最贴近问题源头：重复点击发生在 `mutate/mutateAsync` 入口，不是 axios request 内部。
- 与 React Query retry 边界清晰：guard 包住的是“用户触发一次 mutation”，retry 发生在该 mutation 内部。
- 不依赖 React state 更新时机：`isPending` 是渲染状态，快速连续同步点击可能早于下一次渲染；`useRef` 同步写入更适合作为提交锁。
- 复用成本低：现有 feature hooks 可以逐步接入，页面内直接 mutation 可按风险排序补齐。

备选方案 A：只在每个按钮 `onClick` 中判断 `mutation.isPending`。优点是改动直观；缺点是分散、容易漏，且 `isPending` 状态存在渲染时机窗口。

备选方案 B：在 axios request 层按 method+url+body 去重。优点是全局覆盖；缺点是会混淆用户动作、React Query retry、token refresh 重放与真实并发请求，也可能误伤合法的并发上传或批量请求。

### 2. guard 只约束修改类动作，不覆盖查询类 useQuery

创建、删除、刷新、生成、上传等 mutation 默认接入提交保护；普通 `useQuery` 查询仍交给 React Query 的 query key、缓存和请求合并能力处理。

为什么：查询类重复请求通常依赖 query key 与缓存策略解决，修改类接口才最容易造成重复写入、重复扣费、重复创建任务。把两者混在一起会让缓存策略和提交锁职责不清。

### 3. 视觉 loading 与逻辑 guard 互为补充

Ant Design Button 的 `loading` / `disabled` 继续保留，用于用户反馈和可访问性；逻辑 guard 负责兜住 React 状态更新前的同步重复触发。

这意味着验收时不能只看按钮是否转圈，还要用测试证明 mutationFn 没有被调用多次。

### 4. 不把本能力提升成复杂 shared 组件体系

若实现工具稳定且被 2 个以上模块复用，可放在 `src/shared/hooks` 或 `src/shared/utils`；如果先从单个业务域验证，则放在邻近 feature。考虑当前重复触发横跨多个模块，推荐新增一个很小的共享 hook，而不是封装一套通用提交按钮。

## Risks / Trade-offs

- [Risk] 忽略重复触发后调用方等待不到 Promise → 对 `mutateAsync` 场景优先返回当前进行中的 Promise，避免调用方悬空。
- [Risk] 不同 payload 的合法并发被误拦截 → 默认按同一 mutation hook 实例加锁；对于批量上传这类允许并发的场景需要显式跳过或按 key 加锁。
- [Risk] guard 包装后影响 React Query 回调执行 → 保持 `useMutation` 的 `mutationFn/onSuccess/onError/onSettled` 仍由 React Query 管理，guard 只控制外层触发函数或 mutationFn 入口。
- [Risk] 页面内直接 `useMutation` 分散较多，首轮可能漏掉 → 先用 `rg "useMutation|mutateAsync|mutate"` 建清单，按创建/删除/生成/上传高风险优先覆盖。

## Migration Plan

1. 先补测试：选择一个 feature hook 和一个页面内直接 mutation 场景，证明重复触发会造成多次调用。
2. 新增轻量提交保护工具，并接入数字人、音色、数字人视频、图文生视频等高风险 mutation。
3. 保留按钮 loading/disabled，并在必要页面补充 `disabled={mutation.isPending}`。
4. 执行定向测试、请求层测试和类型检查。
5. 更新 `doc/progress.md`，记录实现范围、验证结果与未覆盖风险。

## Open Questions

- 无。当前先做前端提交入口保护；后端幂等 key 可作为后续更强一致性的独立需求。
