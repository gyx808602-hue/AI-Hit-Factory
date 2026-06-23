# 2026-06-23 文图生视频详情页入口排查

## 本阶段结论

- `TextImageVideoTaskDetailPage` 不是废页，已经接入真实路由。
- 详情页路由是 `/image-video/tasks/:taskId`，并且被标记为 `hideInMenu: true`，所以不会出现在左侧菜单。
- 这个页面的职责是“任务详情页”，不是一级功能入口页；它依赖上游页面跳转进入。

## 链路确认

### 1. 路由已注册

- 文件：`src/app/router/routeRegistry.tsx`
- 列表页：`/image-video/tasks`
- 详情页：`/image-video/tasks/:taskId`

### 2. 创建任务后会自动跳转到详情页

- 文件：`src/pages/ImageVideoPage.tsx`
- 行为：创建成功后执行 `navigate(/image-video/tasks/${task.id})`

### 3. 任务列表页可以进入详情页

- 文件：`src/pages/TextImageVideoTasksPage.tsx`
- 行为：点击“查看详情”会跳到 `/image-video/tasks/${item.id}`

### 4. 还有一个间接入口

- 文件：`src/pages/TaskRecordsPage.tsx`
- 行为：页头按钮会跳到 `/image-video/tasks`

## 为什么会感觉“没接上”

- 根因不是没注册，而是详情页被故意隐藏在菜单之外。
- `App` 会把 `hideInMenu` 的受保护路由加入可访问路由集合，但不会把它放进侧边菜单。
- 所以通常只有两种进入方式：
  - 在 `ImageVideoPage` 创建任务成功后自动跳转
  - 先进入 `/image-video/tasks` 列表页，再点某条任务的“查看详情”

## 当前判断

- 详情页本身接线是通的。
- 你“找不到入口”的主要原因是产品入口暴露不明显，不是页面没有接入。
- 如果运行时左侧连“文图生视频任务”列表也没看到，那还要继续排查后端动态菜单是否返回了 `content/image-video/tasks/index`。

## 建议下一步

1. 给 `ImageVideoPage` 增加一个显式“查看任务列表”入口。
2. 给 `TextImageVideoTaskDetailPage` 增加“返回任务列表”按钮，补齐来回导航闭环。
3. 如果要继续查菜单权限，下一步核对 `/api/v1/menus/routes` 的返回值。

## 2026-06-23 第二阶段：入口补齐已完成

### 本阶段实现

- 已在 `src/pages/ImageVideoPage.tsx` 页头补充“查看任务列表”按钮。
- 已在 `src/pages/TextImageVideoTaskDetailPage.tsx` 页头补充“返回任务列表”按钮。
- 两个按钮都通过 `useNavigate` 直接跳转到 `/image-video/tasks`，没有引入额外状态和中间层。

### 为什么这样做

- 这是最小闭环方案。
- `ImageVideoPage` 解决“我想直接看任务”的入口问题。
- `TextImageVideoTaskDetailPage` 解决“进了详情页回不去”的单向导航问题。
- 从原理上说，这相当于把“创建页 -> 列表页 -> 详情页”三段链路补成双向可达，避免叶子页面变成死路。

### 顺手修正

- 这两个页面文件中的中文文案原先存在乱码，本阶段一并恢复为正常 UTF-8 中文，避免后续继续影响阅读、测试和维护。

### 测试验证

- 已执行：
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx`
- 结果：
  - `2 passed, 7 tests passed`
