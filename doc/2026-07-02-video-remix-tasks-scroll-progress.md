# 2026-07-02 视频混剪任务列表滚动问题进展

## 阶段一：问题定位

### 已完成

- 已确认用户反馈页面为视频混剪任务列表页：
  - `src/pages/VideoRemixTasksPage.tsx`
- 已扫描外层布局与页面壳组件：
  - `src/app/layouts/DashboardLayout.tsx`
  - `src/shared/components/PageShell.tsx`
- 已对比项目内已有可滚动页面模式：
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.tsx`

### 当前判断

- 当前布局链路是：
  - `DashboardLayout` 的 `main` 使用 `overflow-hidden`
  - `PageShell` 根容器也使用 `overflow-hidden`
  - `VideoRemixTasksPage` 页面内部没有再补一个 `overflow-y-auto` 的滚动容器
- 这意味着当任务列表内容超出视口高度时，页面不会向下滚动，而是被外层直接裁掉。
- 本质原因不是“没有滚动条样式”，而是“缺少真实滚动容器”。

### 候选修复方向

- 方向一：只给 `VideoRemixTasksPage` 增加页面内部滚动容器
  - 优点：改动最小，风险最低，不影响其他页面
  - 缺点：如果后续还有别的列表页同类问题，需要逐页补
- 方向二：改 `PageShell` 为默认可滚动
  - 优点：一次性解决一类页面
  - 缺点：会影响很多现有页面，风险明显更高

### 下一步

- 先和用户确认期望滚动体验：
  - 整个页面内容区滚动
  - 还是只让表格区域内部滚动
- 确认后再补测试、改实现并回归验证

## 阶段二：方案确认

### 已完成

- 已和用户确认本轮优先级：
  - 先让**表格区域内部滚动**
  - 暂不改成整个页面内容区滚动

### 当前判断

- 这意味着本轮应采用“页面局部滚动”方案，而不是调整 `PageShell` / `DashboardLayout` 全局滚动策略。
- 参考项目内已有成熟模式：
  - `src/pages/DigitalHumanVideoTasksPage.tsx` 的弹窗内容区，使用 `maxHeight + overflowY: auto`
- 对当前任务列表页来说，更合适的是：
  - 给表格外层卡片建立 `min-h-0`
  - 给表格容器设置一个视口相关的最大高度
  - 让表格垂直区自己滚动，避免页面下半部分被裁掉

### 下一步

- 先在 `src/pages/VideoRemixTasksPage.test.tsx` 增加失败测试，约束列表页存在表格滚动容器。
- 再修改 `src/pages/VideoRemixTasksPage.tsx` 实现内部滚动。

## 阶段三：TDD 修复与验证

### 已完成

- 已在 `src/pages/VideoRemixTasksPage.test.tsx` 新增滚动回归测试：
  - 断言页面存在 `data-testid="video-remix-tasks-table-scroll-region"`
  - 断言该区域具备 `min-h-0`、`overflow-y-auto`
  - 断言其带有 `max-height` 样式
- 已完成红灯验证：
  - 初次运行时，新用例失败
  - 失败原因准确为：页面不存在表格滚动容器
- 已在 `src/pages/VideoRemixTasksPage.tsx` 完成最小实现：
  - 外层卡片改为 `flex min-h-0 flex-1 flex-col`
  - 为表格补充独立滚动容器
  - 滚动容器样式为 `min-h-0 flex-1 overflow-y-auto`
  - 当前最大高度设置为 `calc(100vh - 280px)`

### 验证结果

- 已执行：
  - `npx vitest run -c vitest.video-remix-regression.config.ts src/pages/VideoRemixTasksPage.test.tsx`
  - 结果：通过，`1` 个测试文件、`8` 个测试全部通过
- 已执行：
  - `npm run typecheck`
  - 结果：通过

### 当前结论

- 视频混剪任务列表页现在已经具备表格区域内部滚动能力。
- 当列表内容超出视口时，用户可以在表格区域内向下滚动查看后续任务，不会再被外层布局直接裁掉。
