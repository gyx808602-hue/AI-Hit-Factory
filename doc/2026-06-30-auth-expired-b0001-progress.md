# 2026-06-30 登录失效码 B0001 兼容与测试残留清理进展

## 本阶段目标

- 在统一请求封装层补充业务码 `B0001`
- 让 `B0001` 与现有登录失效码走同一条退登链路
- 在不删除测试配置骨架的前提下，清理这次改动留下的测试相关残留引用

## 已完成内容

### 1. 统一请求层增加登录失效码兼容

- 文件：`src/utils/request.ts`
- 调整内容：
  - 新增 `ApiCode.accessTokenInvalidAlt = "B0001"`
  - 抽出 `isAccessTokenExpiredCode(code)` 判定函数
  - 将原本只识别 `A0230` 的逻辑，调整为统一识别 `A0230` 与 `B0001`

### 2. 补充回归测试

- 文件：`src/utils/request.test.ts`
- 新增用例：
  - 当接口返回业务码 `B0001` 时
  - 应触发 `onAuthExpired("登录已过期，请重新登录")`
  - 并按统一认证失效分支抛出 `Token Invalid`

### 3. 增加手动回归测试配置

- 文件：`vite.request-test.config.ts`
- 调整说明：
  - 当前仓库默认 `vite.config.ts` 已显式禁用 `src/**/*.test.ts(x)` 的测试发现
  - 为了完成这次需求的红绿验证，先新增了一份临时定向 Vitest 配置
  - 随后已收口为“手动回归入口”配置：默认不扫描业务测试文件，需要时通过 CLI 显式传入目标测试文件
  - 这样既不影响仓库当前默认测试策略，也不会留下只服务某一个测试文件的硬编码残留

## 验证记录

### 红灯验证

- 命令：`npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`
- 结果：
  - 初次补测后，`treats B0001 as an expired login code` 失败
  - 失败表现符合预期：当前实现把 `B0001` 当普通业务错误返回 `"登录已失效"`，没有进入统一退登逻辑

### 绿灯验证

- 命令：`npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`
- 结果：`1` 个测试文件通过，`9` 条测试全部通过

### 类型验证

- 命令：`npm run typecheck`
- 结果：通过

## 测试文件删除决策

### 已确认方案

- 你已确认采用“先删测试文件，暂时保留测试配置”的方案
- 按当前协作约束，我不直接执行物理删除文件，只提供删除范围与执行命令

### 本次待删范围

- 扫描结果：当前共 `41` 个测试文件
- 范围模式：
  - `src/**/*.test.ts`
  - `src/**/*.test.tsx`
  - `src/**/*.spec.ts`
  - `src/**/*.spec.tsx`

### 建议执行步骤

1. 先预览待删除文件：
   - `rg --files -g "src/**/*.test.ts" -g "src/**/*.test.tsx" -g "src/**/*.spec.ts" -g "src/**/*.spec.tsx"`
2. 确认后再执行删除：
   - `rg --files -g "src/**/*.test.ts" -g "src/**/*.test.tsx" -g "src/**/*.spec.ts" -g "src/**/*.spec.tsx" | ForEach-Object { Remove-Item -LiteralPath $_ }`

## 测试残留引用清理结果

### 已处理

- 将 `vite.request-test.config.ts` 从“只绑定 `src/utils/request.test.ts`”改为通用手动回归入口
- 后续若需要单独补测，可执行：
  - `npx vitest run --config vite.request-test.config.ts src/某个目标测试文件`

### 继续保留的测试骨架

- `package.json` 中的 `test` / `test:watch`
- `vite.config.ts` 中的 `test` 配置
- `src/test/setup.ts`
- `tsconfig.app.json` 中的 `vitest/globals` 与 `@testing-library/jest-dom`
- `vite.request-test.config.ts` 作为“手动回归入口”配置

### 保留原因

- 这些内容属于测试基础设施，不会影响业务运行
- 先保留它们，后续如果你又让我补自动化测试，不需要从零重搭整套配置

### 未清理项说明

- `doc/` 目录下大量历史进展文档仍会提到旧测试文件和旧测试命令
- 这些内容属于历史记录，不建议为了“清理测试残留引用”去批量改写，否则会破坏历史上下文

## 当前结论

- `B0001` 登录失效兼容已完成并验证通过
- 本轮已经把这次新增的测试配置收口为通用手动入口，避免留下单用途硬编码残留
- 如果后续你想继续精简，可以下一轮单独做“彻底移除测试体系”清理
