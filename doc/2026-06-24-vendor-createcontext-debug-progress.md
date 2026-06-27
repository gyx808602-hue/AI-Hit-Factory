# 2026-06-24 vendor createContext 报错排查记录

## 问题现象

- 浏览器报错：`vendor-47vKf1fm.js:1 Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')`
- 报错文件位于生产构建产物 `dist/assets/vendor-47vKf1fm.js`

## 排查结论

这不是业务页面里直接把 `React.createContext` 写错了，而是一个 **打包分包导致的运行时循环依赖问题**。

当前 `vite.config.ts` 使用了自定义 `manualChunks`：

- `react`、`react-dom`、`react-router`、`react-router-dom` 被拆到 `react-vendor`
- 其它三方依赖被拆到 `vendor`

但构建产物里出现了以下依赖环：

1. `vendor-47vKf1fm.js` 先从 `react-vendor-DMy9DHGi.js` 导入 React 相关导出
2. `react-vendor-DMy9DHGi.js` 又反向从 `vendor-47vKf1fm.js` 导入内容

这样在模块初始化顺序不完整时，`vendor` 里拿到的 React 命名空间对象会是 `undefined`，随后一旦执行到 `undefined.createContext`，就会报现在这个错。

## 关键证据

- `dist/assets/vendor-47vKf1fm.js` 顶部直接导入了 `./react-vendor-DMy9DHGi.js`
- `dist/assets/react-vendor-DMy9DHGi.js` 顶部又反向导入了 `./vendor-47vKf1fm.js`

这说明问题核心是 **chunk 之间互相引用**，不是单纯版本不兼容。

## 初步判断的高概率触发点

高概率是 `scheduler` 这类被 `react-dom` 间接依赖的包没有被一起归入 `react-vendor`，导致：

- `react-vendor` 依赖 `vendor`
- 同时 `vendor` 中像 `@tanstack/react-query` 这类 React 生态包又依赖 `react-vendor`

最终形成环。

## 后续修复方向

可选修复方案：

1. 调整 `manualChunks`，把 `scheduler` 等 React 运行时相关包一起归到 `react-vendor`
2. 更稳妥的做法是先移除这段手写分包规则，回退到 Vite/Rollup 默认分包，先保证运行正确，再按需优化体积

## 优化方案对比

### 方案 A：保留手写分包，补齐 React 运行时依赖

- 做法：
  - 保留现有 `react-vendor`、`antd-vendor`、`icon-vendor`、`vendor` 分组
  - 将 `scheduler` 以及必要的 React 运行时关联包一并归入 `react-vendor`
  - 增加一个构建级回归测试，校验 `vendor` 与 `react-vendor` 不再互相循环导入
- 优点：
  - 对当前产物结构影响最小
  - 仍然保留现有按库拆包收益
  - 更符合当前项目已经有的构建优化方向
- 风险：
  - 依赖名单需要维护
  - 后续如果继续引入新的 React 运行时关联包，仍需关注是否再次形成环

### 方案 B：移除手写 `manualChunks`，回退默认分包

- 做法：
  - 去掉 `vite.config.ts` 中的自定义 `manualChunks`
  - 交给 Vite/Rollup 默认策略处理依赖拆分
- 优点：
  - 最稳
  - 维护成本最低
  - 基本能直接消除这类人为 chunk 环问题
- 风险：
  - chunk 命名和颗粒度会变化
  - 可能失去当前对 `antd`、图标包的显式拆分控制

## 推荐方案

推荐优先采用 **方案 A**：

- 当前问题已经明确高概率与 `scheduler` 被拆到 `vendor` 有关
- 项目本身已经有明确的分包意图，直接全部撤掉略显保守
- 先做最小改动修复运行时错误，再观察产物和加载表现，更符合 KISS

如果方案 A 修复后仍存在 chunk 环，再退回方案 B。

## 当前阶段结论

本阶段只完成根因定位，暂未修改业务代码和打包配置。

## 2026-06-24 执行前收敛

- 已确认修复策略进入执行阶段，并选择 **方案 A：保留手写分包，补齐 React 运行时依赖**
- 已进一步收敛测试落点：
  - 不直接用页面测试验证该问题
  - 先把 `manualChunks` 逻辑抽为可单测函数
  - 用失败测试证明 `scheduler` 当前被错误分到 `vendor`
- 这样做的原因：
  - 该问题本质是构建配置问题
  - 直接跑页面联调成本高，且无法稳定表达“chunk 归类是否正确”
  - 把分包规则下沉为纯函数后，可以做最小回归测试，后续维护成本更低

## 下一步执行顺序

1. 新增 `manualChunks` 纯函数及失败测试
2. 运行定向测试，确认当前测试先失败
3. 修改分包规则，把 `scheduler` 归入 `react-vendor`
4. 回跑测试与构建，确认错误消失

## 2026-06-24 执行结果

### 已完成

- 已新增可测试的分包规则模块：
  - `src/build/manualChunks.ts`
- 已新增构建级回归测试：
  - `src/build/manualChunks.test.ts`
- 已先按 TDD 跑出失败用例，确认根因：
  - 当前规则确实把 `scheduler` 错分到了 `vendor`
- 已完成最小修复：
  - 将 `scheduler` 归入 `react-vendor`
  - `vite.config.ts` 改为直接复用 `getManualChunkName`

### 验证结果

- 已执行：
  - `npm test -- src/build/manualChunks.test.ts`
  - 结果：`5 passed`
- 已执行：
  - `npm run typecheck`
  - 结果：通过
- 已执行：
  - `npm run build`
  - 结果：通过
- 关键结果：
  - 之前的 `Circular chunk: vendor -> react-vendor -> vendor` warning 已不再出现

### 当前结论

本次修复已经把构建层的循环依赖告警清掉，高概率也同步消除了生产环境里 `vendor-*.js` 的 `createContext` 运行时报错来源。

### 后续建议

1. 如果你要更稳，可以再补一条构建产物检查测试，直接断言 `vendor` 和 `react-vendor` 不互相 `import`
2. 如果后面继续手写分包规则，新增 React 运行时相关包时要优先考虑是否应归入 `react-vendor`
