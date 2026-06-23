# 2026-06-23 路由注册恢复进展

## 第一阶段完成：路由注册现状调研

### 已完成
- 已扫描以下文件：
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/routeGuards.ts`
  - `src/app/router/dynamicRoutes.ts`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/routeGuards.test.ts`
- 已确认当前被注释的两条路由是：
  - `workspace.tasks` -> `/tasks`
  - `workspace.assets` -> `/assets`
- 已确认 `dynamicRoutes.ts` 中仍然保留了后端组件映射：
  - `workspace/tasks/index` -> `workspace.tasks`
  - `workspace/assets/index` -> `workspace.assets`
- 已确认 `routeRegistry.tsx` 中虽然把这两条路由注释掉了，但对应页面的 `lazy import` 还保留着：
  - `TaskRecordsPage`
  - `AssetLibraryPage`

### 当前判断
- 这不是单纯的“菜单隐藏”状态，而是“动态映射已声明、静态注册缺失”的状态。
- 如果后端菜单真的返回 `workspace/tasks/index` 或 `workspace/assets/index`，`dynamicRoutes.ts` 会调用 `getRouteByKey()`，但当前注册表里没有对应 key，会直接抛出 `Unknown route key`。
- 也就是说，现在的风险不是“用户看不到入口”，而是“后端一旦放开这两个菜单，前端运行时可能直接报错”。
- 当前测试只覆盖了现有核心路由，没有覆盖这两个被注释路由，也没有对动态映射一致性做保护。

### 推荐方向
- 推荐走“稳妥恢复”：
  1. 先补测试，锁定 `workspace.tasks` 和 `workspace.assets` 的注册行为
  2. 再恢复 `routeRegistry.tsx` 中这两条路由
  3. 回归验证 `routeRegistry` / `routeGuards` 相关测试
- 暂不建议直接只改 `dynamicRoutes.ts` 去绕过异常，因为那会掩盖注册表和动态映射不一致的问题。

### 下一步
1. 确认是要“直接恢复这两个路由”，还是要“恢复但继续隐藏菜单入口”。
2. 先补失败测试，再做最小实现。

## 第二阶段完成：工作区路由恢复 TDD 闭环

### 已完成
- 已在 `src/app/router/routeRegistry.test.ts` 补充失败测试：
  - 校验 `workspace.tasks` 注册到 `/tasks`
  - 校验 `workspace.assets` 注册到 `/assets`
- 已执行红灯验证：
  - `npm test -- src/app/router/routeRegistry.test.ts`
  - 失败原因符合预期：`Unknown route key: workspace.tasks`
- 已在 `src/app/router/routeRegistry.tsx` 恢复两条工作区路由：
  - `workspace.tasks`
  - `workspace.assets`
- 本轮没有改动：
  - `routeGuards.ts`
  - `dynamicRoutes.ts`
  - 后端菜单映射策略

### 验证结果
- 已执行：
  - `npm test -- src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts`
- 结果：
  - `2 passed`
  - `14 tests passed`

### 当前判断
- 现在静态注册表和 `dynamicRoutes.ts` 的后端组件映射重新一致了。
- 即使后端开始返回 `workspace/tasks/index` 或 `workspace/assets/index`，前端也不会再因为缺少 route key 直接抛错。
- 这一轮属于低风险恢复，只补齐了已有页面入口，没有改守卫判定逻辑。

### 下一步
1. 视需要补一层 `dynamicRoutes.ts` 的一致性测试，防止以后再出现“有映射、没注册”的回归。
2. 如果你要继续放开菜单展示，再检查这两个页面在真实导航中的排序和显示文案。

## 第三阶段完成：动态映射与应用入口回归保护

### 已完成
- 已在 `src/app/router/dynamicRoutes.test.ts` 补充 `workspace.tasks` 的动态映射测试：
  - 校验后端组件 `workspace/tasks/index`
  - 能正确映射到 `workspace.tasks`
  - 同时能生成对应菜单项
- 已在 `src/app/App.test.tsx` 补充 `/tasks` 的应用级路由入口测试：
  - 在关闭动态菜单路由时
  - 仍能通过 fallback route 正常进入任务记录页

### 验证结果
- 已执行：
  - `npm test -- src/app/router/dynamicRoutes.test.ts`
  - `npm test -- src/app/App.test.tsx`
- 结果：
  - `dynamicRoutes.test.ts`: `1 passed, 9 tests passed`
  - `App.test.tsx`: `1 passed, 7 tests passed`

### 当前判断
- 现在这块路由恢复不只是“代码能跑”，而是已经有三层保护：
  - 静态注册表测试
  - 动态菜单映射测试
  - 应用入口级测试
- 后续如果有人再次注释掉 `workspace.tasks` 或改坏 `dynamicRoutes` 映射，测试会第一时间暴露问题。

### 下一步
1. 这块路由恢复工作已经可以收口。
2. 如果继续做，只建议处理菜单排序、文案统一或权限码精细化，不建议再扩大改动面。

## 第四阶段完成：提交前联动回归准备

### 已完成
- 已确认本轮准备提交时，路由恢复相关代码本身没有新增失败点。
- 已把联动回归范围明确到以下模块：
  - `routeRegistry`
  - `routeGuards`
  - `dynamicRoutes`
  - `App` 路由入口
  - 图文视频上传与详情页相关测试
- 已将本轮提交策略收敛为“一次提交当前本地已完成改动”，前提是整组回归通过。

### 当前判断
- 路由恢复这块已经具备单测和入口测试保护，当前更关键的是提交前做一次横向回归，确保没有被上传体验改造连带影响。

### 下一步
1. 执行整组提交前回归测试。
2. 通过后统一暂存并提交当前本地改动。
