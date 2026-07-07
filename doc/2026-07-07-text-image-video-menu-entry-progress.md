# 2026-07-07 文图生视频菜单入口调整进展

## 阶段 1：范围调研

### 已完成

- 已扫描文图生视频相关路由、动态菜单、高亮逻辑和任务页入口。
- 已确认当前静态路由中：
  - `content.imageVideo` 对应 `/image-video`，目前仍是可见菜单。
  - `content.imageVideoTasks` 对应 `/image-video/tasks`，是文图生视频任务菜单。
  - `content.imageVideoTaskDetail` 对应 `/image-video/tasks/:taskId`，已通过 `activeMenuKey: "content.imageVideoTasks"` 保持任务菜单选中。
- 已确认 `App.tsx` 的隐藏路由高亮机制已经存在：隐藏路由配置 `activeMenuKey` 后，会把菜单选中态回落到目标父菜单。
- 已确认 `TextImageVideoTasksPage.tsx` 当前只有筛选和任务列表，尚未提供“新增”按钮。

### 当前判断

- 本次最小改动不需要新增菜单组件能力。
- 只需要把 `/image-video` 配置为隐藏菜单，并设置 `activeMenuKey: "content.imageVideoTasks"`。
- 在文图生视频任务页标题区增加“新增”按钮，点击跳转 `/image-video`。
- 需要补充路由注册测试和应用级菜单高亮测试，防止创建页再次变成独立菜单或高亮错误。

### 下一步

1. 等待确认后修改 `src/app/router/routeRegistry.tsx`。
2. 修改 `src/pages/TextImageVideoTasksPage.tsx` 增加新增入口。
3. 补充 `routeRegistry` 与 `App` 定向测试。
4. 运行定向验证并回写本进展文档。

### 验证结果

- 阶段 1 仅调研，尚未执行代码修改和测试。

## 阶段 2：菜单隐藏与新增入口实现

### 已完成

- 已将 `/image-video` 对应的 `content.imageVideo` 路由设为隐藏菜单：
  - `hideInMenu: true`
  - `activeMenuKey: "content.imageVideoTasks"`
- 已在文图生视频任务页标题区增加“新增”按钮：
  - 按钮点击后跳转 `/image-video`
  - 页面进入创建页后，侧边栏仍保持“文图生视频任务”选中态
- 已补充回归测试：
  - 路由注册测试覆盖创建页隐藏与父菜单选中关系
  - 任务页测试覆盖“新增”按钮跳转
  - App 级测试覆盖访问创建页时任务菜单仍高亮

### 当前判断

- 本次改动复用现有隐藏路由高亮机制，不需要改 `DashboardLayout`。
- 创建页仍保持可直接访问，只是不再作为独立菜单展示。
- “新增”入口放在任务页 header actions 中，符合当前页面壳层设计。

### 验证结果

- `npx vitest run -c vitest.route-registry-temp.config.ts -t "text-image-video"`：通过，1 个用例通过。
- `npx vitest run -c vitest.text-image-video-temp.config.ts src/pages/TextImageVideoTasksPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx`：通过，2 个测试文件 / 12 个用例通过。
- `npx vitest run -c vitest.app-route-highlight-temp.config.ts src/app/App.test.tsx -t "keeps image video tasks selected"`：通过，1 个用例通过。
- `npm run typecheck`：通过。
- `npx vitest run -c vitest.app-route-highlight-temp.config.ts`：未全量通过，失败点为历史测试仍期待已注释或不存在的 dashboard、workspace tasks、assets 路由，以及旧中文文本断言；本次新增的创建页菜单高亮用例已通过。

### 下一步

1. 如需收口历史测试，可单独整理 App 路由测试中已失效的 dashboard / workspace 断言。
2. 如需手验，可从“文图生视频任务”页点击“新增”，确认进入创建页且左侧菜单仍高亮任务菜单。
