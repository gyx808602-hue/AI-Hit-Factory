# 2026-06-23 前端 token 判断临时放开进展

## 已完成

- 已将“放开 token 判断”实现为**可逆的环境开关**，没有写死到业务逻辑里。
- 已新增环境变量声明：
  - `VITE_BYPASS_TOKEN_CHECK`
- 已在开发环境开启该开关：
  - `.env.development`
  - 当前值：`VITE_BYPASS_TOKEN_CHECK='true'`
- 已修改前端路由鉴权判断：
  - `src/app/router/routeGuards.ts`
  - 当 `bypassTokenCheck=true` 时，即使没有 `accessToken`，前端也允许进入 `requiresAuth` 页面
- 已修改应用层路由组合逻辑：
  - `src/app/App.tsx`
  - 当开关开启时，受保护路由会正常参与渲染与匹配，不再被前端直接重定向到登录页
- 已补充并更新测试：
  - `src/app/router/routeGuards.test.ts`
  - `src/app/App.test.tsx`

## 当前判断

- 这次只放开了**前端页面准入判断**，没有伪造 token，也没有改后端真实鉴权。
- 也就是说，现在页面可以先进，但如果后端接口本身要求 `Authorization`，仍然会返回真实的 `401/403`。
- 这种做法适合当前联调阶段，优点是后续恢复非常简单：只要把 `VITE_BYPASS_TOKEN_CHECK` 改回 `false` 或删除即可，不需要反向改代码。

## 验证结果

- 已执行：
  - `npm test -- src/app/router/routeGuards.test.ts src/app/App.test.tsx`
  - 结果：通过，`2 passed, 11 tests passed`
- 已执行：
  - `npm run typecheck`
  - 结果：通过

## 恢复方式

1. 将 `.env.development` 中的 `VITE_BYPASS_TOKEN_CHECK='true'` 改为 `false`
2. 或直接删除这一行环境变量
3. 重启前端开发服务，让 Vite 重新加载环境变量

## 下一步建议

1. 如果你接下来还想继续“无 token 联调接口”，那就不是只放开页面准入了，而是要进一步决定是否临时跳过请求头、401 跳登录或后端网关校验。
2. 如果你只是想先看页面和路由，这一轮已经够用了，建议先用当前状态继续联调页面流程。
