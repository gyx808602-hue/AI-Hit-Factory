# 2026-06-23 首登改密进展

## 已完成

- 登录请求已按客户侧契约切换为 `phone / password / captchaId / captchaCode`
- 验证码展示字段已统一使用 `captchaBase64 + captchaId`
- 请求层已兼容业务成功码 `200` 与 `00000`
- 请求层业务失败已支持抛出 `RequestBusinessError(code, message, data)`
- 登录页已支持首登改密分支：
  - 当登录接口返回 `code = C10001` 时，不再直接跳转
  - 页面会在 `LoginPage` 内切换为“重置密码表单”
  - 已兼容后端原始返回里的 `msg` 与请求层错误对象里的 `message`
- 改密成功后的前端收口已完成：
  - 调用 `/api/v1/customer/auth/change-password`
  - 清理本地 token
  - 清空改密态
  - 刷新验证码
  - 回到普通登录表单

## 本次验证结果

- 已通过：
  - `npm test -- src/pages/LoginPage.test.tsx src/utils/request.test.ts`
- 结果：
  - `2` 个测试文件通过
  - `11` 条测试全部通过

## 当前遗留

- `npm run typecheck` 仍未全绿，但剩余报错不属于本次首登改密链路
- 当前阻塞主要来自仓库其他功能分支：
  - 缺失 `TextImageVideoTasksPage` / `TextImageVideoTaskDetailPage`
  - `video-remix` 相关表单测试类型未同步
  - `ViralRemixPage` / `VideoRemixTasksPage` 的 `useMutation` 类型签名问题

## 结论

- 首登改密主链路已经打通，并有定向测试覆盖
- 如果下一步要继续收口，可以单独处理仓库里与本需求无关的全量 `typecheck` 历史问题

## 2026-06-23 补充排查

- `App.tsx` 启动时报 `routeRegistry.tsx 500` 的根因已定位
- 不是 `LoginPage` 本身运行时异常，而是 `routeRegistry.tsx` 里注册了两个当前不存在的页面模块：
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.tsx`
- 目前仓库中只有对应测试文件存在：
  - `src/pages/TextImageVideoTasksPage.test.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.test.tsx`
- 因为 Vite 在解析懒加载 `import("../../pages/TextImageVideoTasksPage")` 时找不到源文件，所以会在浏览器里表现为模块请求 `500`

## 2026-06-23 登录页中文乱码修复

- 已定位：不是浏览器字体问题，也不是接口返回问题
- 根因是 `src/pages/LoginPage.tsx` 和对应测试文件中的中文文本曾被错误编码后写入源码
- 已处理：
  - 重建 `src/pages/LoginPage.tsx` 为干净 UTF-8 文本
  - 重建 `src/pages/LoginPage.test.tsx`，改为正确中文断言
  - 保留首登改密逻辑不变，只修复文案与注释
- 已验证：
  - `npm test -- src/pages/LoginPage.test.tsx` 通过

## 2026-06-23 验证码参数名切换

- 按最新联调要求，登录请求参数已从 `captchaId` 切换为 `captchaKey`
- 已同步修改：
  - `src/api/system/auth/types.ts`
  - `src/pages/LoginPage.tsx`
  - `src/pages/LoginPage.test.tsx`
- 当前策略：
  - 登录请求统一发送 `captchaKey`
  - 验证码响应仍兼容 `captchaKey` 和旧字段 `captchaId`
  - 这样可以避免联调期间后端新旧字段切换造成前端阻塞
- 已验证：
  - `npm test -- src/pages/LoginPage.test.tsx` 通过

## 2026-06-23 动态菜单接口临时关闭

- 当前先不对接 `/api/v1/menus/routes`
- 已采用开关方案，而不是删除功能代码：
  - `src/app/router/useCurrentUserRoutes.ts`
  - `src/vite-env.d.ts`
  - `.env.development`
- 当前开发环境默认配置：
  - `VITE_ENABLE_MENU_ROUTES='false'`
- 当前行为：
  - 有 token 时也不会自动请求 `/api/v1/menus/routes`
  - `App.tsx` 继续使用本地 fallback 静态路由与菜单
  - 后续要重新接回真实动态菜单时，只需把开关改成 `true`
- 已验证：
  - `npm test -- src/app/App.test.tsx` 通过

## 2026-06-23 请求头补充

- 已在统一请求层补充客户端来源头：
  - `X-Source: customer`
- 修改位置：
  - `src/utils/request.ts`
- 当前策略：
  - 无论是公开接口还是带 token 的鉴权接口，都会统一附带该请求头
  - 不需要每个 API 模块单独手写
- 已补充回归测试：
  - `src/utils/request.test.ts`
- 已验证：
  - `npm test -- src/utils/request.test.ts` 通过
