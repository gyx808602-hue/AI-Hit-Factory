# 2026-06-23 `/user-api/menus/routes` 报错排查记录

## 已完成

- 已检查前端菜单路由请求入口：
  - `src/api/system/menus/index.ts`
  - 当前请求路径：`/user-api/menus/routes`
- 已检查动态菜单开关：
  - `src/app/router/useCurrentUserRoutes.ts`
  - 当前 `VITE_ENABLE_MENU_ROUTES='true'` 时，会在有 token 的情况下请求菜单路由接口
- 已检查本地开发代理：
  - `.env.development` 中 `VITE_APP_BASE_API='/api-api'`
  - `vite.config.ts` 中 `/api-api -> http://192.168.110.145:8000`
  - 代理会把前端请求 `/api-api/user-api/menus/routes` 转发为后端请求 `/user-api/menus/routes`

## 当前判断

- 报错 `No static resource user-api/menus/routes for request '/user-api/menus/routes'` 说明请求已经到达后端。
- 这个报错不像前端 Vite 静态资源报错，更像是后端（常见于 Spring Boot）在找不到对应 Controller 映射时，把请求落到了静态资源处理器，然后返回“没有这个静态资源”。
- 也就是说，问题核心不是“前端没发出去”，而是“后端当前没有成功接住 `/user-api/menus/routes` 这个接口”。

## 高概率根因

1. 前端把原来的 `/api/v1/menus/routes` 改成了 `/user-api/menus/routes`，但后端真实接口路径并没有同步改。
2. 或者后端本来就没有实现这个动态菜单接口。
3. 由于 `VITE_ENABLE_MENU_ROUTES='true'`，应用启动后开始主动请求该接口，所以报错暴露出来了。

## 建议处理顺序

1. 先确认后端真实菜单接口路径到底是：
   - `/api/v1/menus/routes`
   - 还是 `/user-api/menus/routes`
2. 如果后端真实仍是 `/api/v1/menus/routes`，则前端 `src/api/system/menus/index.ts` 这里不能跟着统一替换，需要单独改回去。
3. 如果后端暂时没有这个接口，联调阶段先把 `.env.development` 中 `VITE_ENABLE_MENU_ROUTES` 改回 `false`，避免应用启动时反复请求它。

## 下一步建议

1. 优先确认后端 Swagger / 网关 / Controller 上菜单路由接口的真实地址。
2. 在未确认前，不建议继续盲目把所有 `/api/v1` 都认为应该改成 `/user-api`，因为菜单接口很可能是这次统一替换里的例外项。

## 当前处理

- 由于当前阶段你明确“不需要动态路由接口”，已将开发环境中的动态路由开关关闭：
  - `.env.development`
  - 当前值：`VITE_ENABLE_MENU_ROUTES='false'`
- 关闭后，前端启动时不会再主动请求 `GET /menus/routes`，因此这条动态路由接口报错也会一起消失。

## 后续恢复方式

1. 如果后面要重新接动态路由，把 `.env.development` 中的 `VITE_ENABLE_MENU_ROUTES` 改回 `true`
2. 重启前端开发服务，让 Vite 重新加载环境变量
3. 再继续确认动态路由接口真实地址是 `/api/v1/menus/routes` 还是 `/user-api/menus/routes`
