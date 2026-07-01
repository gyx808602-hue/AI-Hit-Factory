# 全局请求报错弹窗改造实施计划

> 目标：把 `VideoRemixTasksPage` 中重复的页内错误 `Alert` 收敛到全局请求弹窗链路，保持最小改动、最小风险。

## 方案

### 方案 A：仅删除页面级重复 `Alert`，继续沿用现有 `request:error -> message.error`

- 优点：
  - 改动最小
  - 风险最低
  - 完全符合“错误走弹窗”的诉求
- 缺点：
  - 只覆盖当前页面，其他页面仍需后续按相同规则收口

### 方案 B：新增更复杂的全局错误 UI 容器并改造所有列表页

- 优点：
  - 一次性统一更多页面
- 缺点：
  - 改动范围大
  - 回归风险更高
  - 不符合本次最小修改目标

## 本次选择

- 采用方案 A。
- 改造范围仅限：
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/VideoRemixTasksPage.test.tsx`

## 执行步骤

1. 先补一个失败测试，证明“列表查询失败时页面不再渲染内联错误提示”。
2. 删除 `VideoRemixTasksPage.tsx` 里的：
   - `actionError` 状态
   - `listQuery.isError` 的 `Alert`
   - `actionError` 的 `Alert`
3. 保留请求层统一错误提示，不额外添加页面级红框。
4. 运行页面相关测试验证行为。
