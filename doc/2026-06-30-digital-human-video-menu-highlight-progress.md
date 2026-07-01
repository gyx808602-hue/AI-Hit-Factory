# 2026-06-30 数字人视频任务菜单高亮修复进展

## 阶段 1：问题定位

- 现象：
  - 进入 `数字人视频任务` 页面时，左侧菜单错误高亮为 `数字人管理`
- 已排查链路：
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
  - `src/app/App.tsx`
  - `src/app/App.test.tsx`
- 根因确认：
  - `src/app/App.tsx` 中当前激活路由使用的是“按顺序 `find` 第一个 `matchPath` 命中”的策略
  - 当前静态路由顺序里：
    - `/digital-humans/:humanId`
    - `/digital-humans/videos`
  - 当访问 `/digital-humans/videos` 时，前者会先被误命中，把 `videos` 当成 `humanId`
  - 页面实际渲染仍由 React Router 负责，因此内容区还是“数字人视频任务”
  - 但菜单高亮使用了这套误判结果，所以选中了 `数字人管理`

## 阶段 2：修复策略

- 先补回归测试，复现：
  - `/digital-humans/videos` 应高亮 `数字人视频任务`
  - `数字人管理` 不应处于激活态
- 再把 `App.tsx` 的当前路由解析改为：
  - 使用 React Router 的正式路由匹配能力
  - 避免继续依赖“谁先写在前面谁先命中”的顺序匹配
- 最后执行：
  - 定向 Vitest
  - `npm run typecheck`

## 阶段 3：实现与验证

- 已新增回归测试：
  - `src/app/App.test.tsx`
  - 新增用例：`/digital-humans/videos` 页面必须高亮 `数字人视频任务`
- 已新增临时测试配置：
  - `vitest.app-route-highlight-temp.config.ts`
- 已修复代码：
  - `src/app/App.tsx`
  - 将当前激活路由解析从“顺序 `find + matchPath`”改为 React Router 的 `matchRoutes`
  - 这样会按路由优先级选择更精确的静态路径 `/digital-humans/videos`
  - 不会再被参数路由 `/digital-humans/:humanId` 抢先误匹配

## 验证结果

- 已通过定向回归：
  - `npx vitest run --config vitest.app-route-highlight-temp.config.ts -t "keeps the digital human video task menu selected on the list page"`
  - `npx vitest run --config vitest.app-route-highlight-temp.config.ts -t "keeps the task list menu selected when opening image video task detail"`
- 已通过类型检查：
  - `npm run typecheck`

## 结论

- 这次不是菜单文案或路由注册写错
- 是“当前活动路由识别逻辑”没有遵循 React Router 的优先级匹配规则
- 修复后：
  - `数字人视频任务` 列表页会正确高亮自身菜单
  - 原本依赖父菜单高亮的隐藏详情页语义没有被破坏
