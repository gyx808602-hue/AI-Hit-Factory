# 2026-07-01 Axios 封装 B0001 不重登进展

## 阶段一：问题定位

### 已完成

- 已扫描项目结构，确认当前项目为 `Vite + React + TypeScript + Axios + Vitest`。
- 已定位 axios 二次封装核心文件：
  - `src/utils/request.ts`
  - `src/utils/request.test.ts`
- 已确认 `doc/` 目录存在历史进展文档，适合继续按现有协作习惯记录本轮进展。
- 已确认当前 `B0001` 处理现状：
  - 在 `src/utils/request.ts` 中，`B0001` 被定义为 `ApiCode.accessTokenInvalidAlt`
  - 响应拦截器通过 `isAccessTokenExpiredCode(code)` 将其归类为登录失效
  - 命中后会执行 `onAuthExpired("登录已过期，请重新登录")`

### 当前判断

- 这不是单纯的提示文案问题，而是错误码归类问题。
- 一旦进入 `onAuthExpired`，就会触发全局登录失效副作用，类似前端全局守卫或后端统一异常处理中间件。
- 现需求是把 `B0001` 从“认证失效”降级为“普通业务错误”。

### 下一步

- 先修改测试预期，验证当前实现与新需求不一致。
- 再修改请求封装，使 `B0001` 仅提示错误，不触发重新登录。

## 阶段二：红灯验证

### 已完成

- 已按新需求重写 `src/utils/request.test.ts` 里的 `B0001` 用例：
  - 期望抛出 `RequestBusinessError` 风格的业务错误
  - 期望调用 `notifyError("登录已失效")`
  - 期望 **不** 调用 `onAuthExpired`
- 已执行专项测试命令：
  - `npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`

### 红灯结果

- 当前结果为 `9` 个用例中 `1` 个失败，失败用例正是 `B0001` 新需求用例。
- 失败现象：
  - 实际仍抛出 `Error("Token Invalid")`
  - 说明 `B0001` 仍走认证失效分支

### 当前判断

- 红灯验证通过，且失败原因与需求完全一致。
- 下一步只需要修改 `src/utils/request.ts` 中对认证失效码的归类逻辑，不需要改页面层代码。
