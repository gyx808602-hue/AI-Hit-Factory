# 2026-06-24 测试文件过滤进展

## 已完成
- 已扫描当前仓库测试体系，确认项目使用 `Vitest`：
  - `package.json`
  - `vite.config.ts`
- 已识别当前 `src` 目录下共有 `41` 个测试文件，主要为：
  - 页面集成测试
  - 路由测试
  - API 测试
  - feature 层单元测试
- 已按“先过滤、后确认是否删除”的安全策略调整配置：
  - `vite.config.ts`
  - `tsconfig.app.json`

## 本轮变更
- `vite.config.ts`
  - 将 `include` 指向空白占位路径，确保默认不发现任何业务测试文件
  - 排除 `src/**/*.test.ts`
  - 排除 `src/**/*.test.tsx`
  - 排除 `src/**/*.spec.ts`
  - 排除 `src/**/*.spec.tsx`
  - 补回 `node_modules`、`dist` 等默认排除范围，避免误跑依赖包自带测试
  - 开启 `passWithNoTests: true`，避免默认测试集为空时命令报错
- `tsconfig.app.json`
  - 将测试文件与 `src/test/**` 排除出应用编译上下文

## 当前判断
- 这次处理只会把测试文件从“默认执行链路”和“应用类型检查上下文”中摘掉，不会删除磁盘里的任何测试文件。
- 这样做的好处是先稳定主链路，避免后续：
  - `npm test` 被历史测试阻塞
  - `npm run typecheck` 继续被测试代码噪音干扰
- 中途发现一个配置细节：
  - 如果直接覆盖 `vitest.exclude`，会把它默认的 `node_modules` 排除规则一并抹掉
  - 结果就是 `npm test` 可能错误扫描到依赖包里的测试文件
  - 本轮已一并修正
- 删除测试文件属于第二阶段动作，必须等你确认后再继续。

## 验证结果
- 已执行：
  - `npm test`
  - 结果：通过，`No test files found, exiting with code 0`
- 已执行：
  - `npm run typecheck`
  - 结果：通过

## 删除前置判断
- 目前“过滤”目标已经完成，仓库默认不会再执行这些测试文件。
- 如果继续“删除”，需要分两类看：
  - 可以优先考虑删除：`src/**/*.test.ts`、`src/**/*.test.tsx`
  - 不能直接删：`src/test/setup.ts`
- 原因是 `src/test/setup.ts` 仍被 `vite.config.ts` 的 `setupFiles` 引用。
- 如果后续确定彻底停用 Vitest，还需要把这些依赖一并摘掉：
  - `package.json` 中的 `test`、`test:watch`
  - `vite.config.ts` 中的 `test` 配置
  - `tsconfig.app.json` 中的 `vitest` / `jest-dom` 类型声明
  - `package.json` / `package-lock.json` 中的测试依赖

## 待确认删除候选
- 当前可疑“非业务必需测试资产”包括：
  - `src/**/*.test.ts`
  - `src/**/*.test.tsx`
  - `src/test/setup.ts`
- 但其中是否“没用”，还要看两件事：
  - 是否仍被 `vitest` 配置引用
  - 是否仍承担历史回归保护价值

## 下一步
1. 如果你只想“先别让测试干扰开发”，到这里已经够了。
2. 如果你要继续删文件，我会先按最小风险方案只删 `src/**/*.test.ts(x)`，不碰 `src/test/setup.ts`。
3. 如果你要彻底移除测试体系，我会再做第三阶段，把 `Vitest` 相关脚本、配置和依赖一起摘掉。
