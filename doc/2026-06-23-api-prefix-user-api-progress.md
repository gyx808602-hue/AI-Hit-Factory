# 2026-06-23 接口前缀切换进展

## 已完成

- 已扫描 `src/api` 下真实生产 API 模块，确认仍有 10 个文件使用旧前缀 `/api/v1`。
- 已将以下生产 API 模块中的请求路径统一切换为 `/user-api`：
  - `src/api/system/auth/index.ts`
  - `src/api/system/users/index.ts`
  - `src/api/system/configs/index.ts`
  - `src/api/system/depts/index.ts`
  - `src/api/system/dicts/index.ts`
  - `src/api/system/logs/index.ts`
  - `src/api/system/menus/index.ts`
  - `src/api/system/notices/index.ts`
  - `src/api/system/roles/index.ts`
  - `src/api/customer/text-image-video/index.ts`
- 已同步修正受影响测试：
  - `src/api/customer/text-image-video/index.test.ts`
- 已新增前缀守卫测试，避免后续生产 API 再写回旧前缀：
  - `src/api/api-prefix.test.ts`

## 当前判断

- 这次采用的是“直接修改 API client 路径常量”的方案，而不是只改 `baseURL` 或代理配置。
- 这样做的优点是源码表达和真实接口契约一致，后续排查请求地址时不会再出现“环境是新前缀，代码还是旧前缀”的混淆。
- 当前 `doc/progress.md` 文件存在编码异常，`apply_patch` 无法安全更新，因此本轮改为新增专项进展文档保留记录，避免破坏旧文档内容。

## 验证结果

- 已执行：
  - `npm test -- src/api/api-prefix.test.ts src/api/customer/text-image-video/index.test.ts`
  - 结果：通过，`2 passed, 3 tests passed`
- 已执行：
  - `npm run typecheck`
  - 结果：通过

## 下一步建议

1. 如果你希望文档契约也统一，我下一步可以继续把 `doc/`、`openspec/`、接口说明文档中的 `/api/v1` 描述批量更新为 `/user-api`。
2. 如果本地仍通过 `VITE_APP_BASE_API='/api-api'` 联调，建议继续核对最终请求地址是否会变成 `/api-api/user-api/...`，确认网关重写规则和新前缀一致。
