## Why

当前项目已经具备登录、动态路由、工作台布局和多个业务页面，但缺少承接用户资料、积分余额、使用统计、安全偏好等信息的个人中心入口。参考提供的视觉图，需要先用 OpenSpec 固化页面范围、预留接口字段和验收标准，避免在后端接口未确定时直接把静态 UI 写死。

本次 change 与项目级账号体系、积分体系和动态路由约束相关，但只覆盖“个人中心页面”这一增量能力，不重复定义全局账号、企业、权限或积分计费规则。

## What Changes

- 新增个人中心页面能力，作为登录后可访问的账号类页面。
- 页面参考图片拆分为四个主要信息区：
  - 个人资料概览：头像、姓名、所属企业、会员/认证标签、加入时间、账号 ID、编辑资料入口。
  - 积分概览：当前积分余额、后续重置/有效期提示、积分充值入口。
  - 使用统计：本月消耗量、环比变化、视频生成/音频生成/脚本生成占比。
  - 安全与偏好：邮箱、手机绑定、密码修改、生成提醒开关等。
  - 邀请奖励：邀请码展示、复制邀请码入口、邀请奖励规则提示。
- 在没有真实接口和字段的前提下，先预留 TypeScript 类型、API Client、React Query hooks 和 Mock 数据结构。
- 邀请功能先预留邀请码、邀请奖励积分、好友权益提示、复制状态和后续分享链接字段，不在本次任务中实现完整邀请关系追踪或奖励结算。
- 注册前端静态路由映射和动态菜单 routeKey，后续由后端菜单权限下发时对接。
- 增加页面加载态、错误态、空字段兜底、敏感信息脱敏和基础交互验收。
- 不在本次 change 中实现真实充值支付、真实编辑资料表单、真实绑定手机号流程或后端接口。

## Capabilities

### New Capabilities

- `personal-center-page`: 约束个人中心页面的信息架构、预留接口字段、路由接入、状态展示和基础交互验收。

### Modified Capabilities

- 无。本次不改变现有 `dynamic-menu-routes`、`figma-ui-shell-pages` 或其他主规格的既有要求，只新增个人中心页面能力。

## Impact

- Frontend：
  - 预计新增 `src/features/account/` 下的类型、API、hooks、组件或页面组织。
  - 预计新增或调整 `src/pages/PersonalCenterPage.tsx`。
  - 预计调整 `src/app/router/routeRegistry.tsx`、`src/app/router/routeTypes.ts` 或相关动态路由测试，加入个人中心 routeKey。
- API：
  - 预留 `accountApi.getPersonalCenterOverview()`、`accountApi.updateGenerationReminder()` 等契约。
  - 个人中心聚合数据中预留邀请奖励字段；如后续需要记录复制/分享行为，可在账号域 API Client 中追加独立接口。
  - 后端未完成前使用 Mock 数据或本地适配函数，真实路径暂定为可替换常量，不让页面直接拼接 URL。
- Tests：
  - 增加个人中心页面渲染、接口字段兜底、提醒开关、路由注册和权限过滤相关测试。
- Docs：
  - 更新 `doc/progress.md` 记录本次 OpenSpec 创建和后续实现等待确认状态。
