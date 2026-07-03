# 2026-07-03 接口报错后再次请求逻辑排查进展

## 已完成

- 已定位请求封装核心文件：`src/utils/request.ts`。
- 已确认项目主入口 `src/app/main.tsx` 使用 `new QueryClient()`，未配置全局 `retry: false`。
- 已确认只有部分查询显式关闭重试，例如 `src/app/router/useCurrentUserRoutes.ts`。
- 已确认部分页面存在主动轮询逻辑：
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.tsx`
- 已确认 `src/utils/request.ts` 中对 `A0230` 的处理没有真正重放原请求，而是执行鉴权失效回调后直接拒绝。

## 当前判断

- “接口报错后又请求一次”更可能来自 React Query 默认重试。
- 如果页面处于任务处理中，还可能来自 `refetchInterval` 轮询。
- Axios 封装层当前没有实现完整的 refresh token 成功后自动补发原请求逻辑。

## 追爆任务列表专项结论

- 已确认“追爆任务列表”页面对应文件为 `src/pages/VideoRemixTasksPage.tsx`。
- 该页面列表请求使用 `useQuery`，但没有显式配置 `retry: false`。
- 项目真实入口 `src/app/main.tsx` 使用 `new QueryClient()`，没有关闭全局查询重试。
- 因此列表请求失败后，会由 React Query 默认策略再次请求，而不是 Axios 封装层主动重放。
- 对比发现测试文件 `src/pages/VideoRemixTasksPage.test.tsx` 中专门创建了带 `queries: { retry: false }` 的 `QueryClient`，所以测试环境下同样的失败场景只会调用一次。
