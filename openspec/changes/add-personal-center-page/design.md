## Context

当前项目是 Vite + React + TypeScript，UI 主要由 TailwindCSS 布局、Ant Design 处理复杂交互，图标使用 lucide-react。路由层已经有 `RouteKey` 联合类型和 `routeRegistry` 静态组件映射，动态菜单只负责决定哪些 routeKey 可见，不负责下发任意组件路径。

这次个人中心页面参考图片，是账号域下的登录后页面。它需要聚合用户资料、企业/会员标签、积分余额、使用统计、安全设置、偏好开关和邀请奖励。后端当前没有确认接口与字段，所以实现阶段必须先做“前端契约预留”：页面读取统一的 TypeScript 类型、API Client 和 React Query hook，真实接口未完成前由 Mock 数据或临时适配函数返回同形数据。

知识点拨：个人中心这种页面本质上是“聚合读模型”。类比前端组件，它不是每个小卡片都自己请求接口，而是由一个上层 hook 拿到页面需要的视图模型，再分发给子组件展示；后端也常用类似 BFF/聚合接口减少前端多次请求和字段拼装成本。

## Goals / Non-Goals

**Goals:**

- 新增个人中心页面 OpenSpec 任务，后续实现时可按图完成页面首屏。
- 预留个人资料、积分概览、使用统计、安全偏好、邀请奖励五类字段，允许后端字段后续映射到同一视图模型。
- 将页面接入现有动态路由体系，使用 `account.personalCenter` 作为 routeKey。
- 用 React Query 管理个人中心接口数据，不把积分、邮箱、手机号、统计数据复制进全局 store。
- 提供加载态、错误态、空字段兜底、敏感信息脱敏、开关乐观更新或提交中状态。
- 保持 UI 风格与当前暗色 SaaS 工作台一致，并参考图片的卡片比例、信息密度和紫蓝强调色。

**Non-Goals:**

- 不实现真实充值支付流程，只预留“积分充值”入口和点击行为。
- 不实现完整编辑资料表单，只预留编辑入口，后续可接弹窗或独立页面。
- 不实现真实邮箱/手机绑定流程，只展示绑定状态和入口。
- 不实现完整邀请关系追踪、邀请注册归因、奖励发放结算或分享渠道统计，只展示邀请码、复制入口和规则提示。
- 不定义后端数据库表结构，不要求后端立即完成接口。
- 不把个人中心抽象成跨项目通用组件；当前只服务本页面。

## Decisions

### Decision 1: 建立账号域 feature，而不是把页面逻辑都放在 `pages`

推荐实现时新增 `src/features/account/`，放置 `types.ts`、`api.ts`、`hooks.ts` 和必要的局部组件；`src/pages/PersonalCenterPage.tsx` 只负责页面级组合。

Why：个人中心属于账号域，后续可能继续承接编辑资料、手机号绑定、密码修改、账号安全等能力。把类型和请求放进 feature，有利于后续扩展；但不提前创建大量空目录，只有真实需要的文件才落地。页面层保持薄一些，能减少 JSX 和数据适配混在一起的维护成本。

备选方案是只新增一个 `PersonalCenterPage.tsx` 静态页面。它改动最少，但会把 Mock、字段兜底、开关提交、数据格式化都堆到页面文件里，后续接真实接口时容易重写。

### Decision 2: 使用聚合视图模型 `PersonalCenterOverview`

预留类型建议：

```ts
type PersonalCenterOverview = {
  profile: {
    displayName: string;
    avatarUrl?: string;
    organizationName?: string;
    membershipLabel?: string;
    joinedAt?: string;
    accountId: string;
    verificationStatus?: "unverified" | "personalVerified" | "enterpriseVerified";
  };
  points: {
    balance: number;
    unit: string;
    resetHint?: string;
    rechargeEnabled: boolean;
  };
  usage: {
    periodLabel: string;
    usedPoints: number;
    compareText?: string;
    compareTrend?: "up" | "down" | "flat";
    breakdown: Array<{ key: string; label: string; percent: number; color: string }>;
  };
  security: {
    email?: string;
    phone?: string;
    phoneBound: boolean;
    passwordUpdatedAt?: string;
    generationReminderEnabled: boolean;
  };
  invitation: {
    inviteCode: string;
    inviteLink?: string;
    inviterRewardPoints: number;
    friendBenefitText?: string;
    enabled: boolean;
  };
};
```

Why：真实后端字段未确定时，页面应该面向稳定的“视图模型”，而不是猜测数据库字段。后续后端返回 `userName`、`nickName`、`companyName` 或其他字段，都可以在 API 层适配到 `PersonalCenterOverview`，页面不需要跟着接口字段反复改。

### Decision 3: 请求路径先集中预留，页面禁止拼 URL

建议 API 层提供：

- `accountApi.getPersonalCenterOverview()`
- `accountApi.updateGenerationReminder(enabled: boolean)`
- `accountApi.copyInviteCode()` 可选预留；若只是使用浏览器剪贴板复制邀请码，不需要立即请求后端。

真实路径可先用常量预留，例如 `/account/personal-center` 和 `/account/personal-center/preferences/generation-reminder`；若后端最终路径不同，只改 API Client。

Why：接口路径是前后端契约，不应散落在页面点击事件里。React Query hook 负责 loading/error/cache/mutation，页面只关心“拿数据”和“切换开关”。

### Decision 4: 路由使用 `account.personalCenter`

在 `RouteKey` 中新增 `account.personalCenter`，在 `routeRegistry` 中新增 `/account/profile` 或 `/account/personal-center`。页面 meta 建议：

- `title: "个人中心"`
- `icon: "User2"`
- `requiresAuth: true`
- `cache: true`
- `permissionCode: "account:personal-center:view"` 可预留

Why：这符合现有动态路由模式。后端菜单后续只需要下发 routeKey 和权限码，前端通过静态 registry 映射到真实组件，避免后端下发组件路径带来的安全和构建不可控问题。

### Decision 5: UI 局部组件化，保持 KISS

页面可拆为局部组件：

- `ProfileSummaryCard`
- `PointsBalanceCard`
- `UsageStatsCard`
- `SecurityPreferencesPanel`
- `InvitationRewardCard`

这些组件先放在账号 feature 内或页面同文件附近，不直接上升到 `shared/components`。

Why：这些卡片都带强业务语义，当前没有跨模块复用证据。过早放进 shared 会让 shared 变成业务组件仓库，反而增加维护成本。

### Decision 7: 邀请奖励只展示轻量入口，结算逻辑留给后端

邀请奖励卡片展示“我的邀请码”、复制邀请码按钮、邀请人奖励积分和好友权益提示。前端复制优先使用浏览器 Clipboard API，成功后给出 toast/message 反馈；若浏览器不支持或复制失败，需要展示可理解的失败提示。

Why：邀请奖励看起来是一个小卡片，但真正复杂的是后端归因和结算：谁邀请了谁、是否完成注册、是否满足奖励条件、积分何时入账。这些不能由前端判断。前端只负责展示后端给出的邀请码和规则摘要，并把复制动作做得稳定。

### Decision 6: 敏感信息展示默认脱敏

邮箱和手机号展示必须脱敏，例如 `a***@example.com`、`138****5678`。若后端已经返回脱敏值，前端仍按字段语义处理；若后端返回原文，前端展示层必须脱敏。

Why：个人中心是高频入口，敏感信息裸露会增加截图、旁观、录屏泄漏风险。前端脱敏是体验层防护，后端仍应控制接口返回范围。

## Risks / Trade-offs

- [Risk] 后端最终字段与预留视图模型差异较大 → Mitigation：API 层做 adapter，页面只依赖 `PersonalCenterOverview`。
- [Risk] 当前项目存在历史中文编码显示问题 → Mitigation：新增文件使用 UTF-8 原始中文；触碰旧文件时只改必要行，避免大范围重写。
- [Risk] 充值、编辑、绑定、邀请明细入口没有真实流程 → Mitigation：本次只预留入口并给出可测试反馈，例如禁用态、提示“接口待接入”或跳转占位路由。
- [Risk] 前端误把邀请奖励规则写死 → Mitigation：奖励积分和好友权益提示从 `PersonalCenterOverview.invitation` 读取，Mock 只作为占位，后续由后端返回。
- [Risk] 积分统计未来数据量扩大 → Mitigation：本页只展示聚合摘要，不渲染流水长列表；流水明细后续应独立分页页面。

## Migration Plan

1. 创建账号域个人中心类型、Mock/API Client 和 React Query hook，包含邀请奖励字段。
2. 新增个人中心页面和局部卡片布局。
3. 接入 `RouteKey`、`routeRegistry` 和动态菜单过滤测试。
4. 添加页面渲染、字段兜底、脱敏、提醒开关和路由注册测试。
5. 等后端接口确定后，仅在 API adapter 层替换真实字段映射。

回滚策略：如果页面暂不上线，可从 routeRegistry 移除 `account.personalCenter`，保留 feature 类型和 API 预留不影响其他页面。

## Open Questions

- 真实接口路径和字段名尚未确定，本次仅预留前端契约。
- “积分充值”最终是跳转充值页、打开弹窗还是外部支付页，待积分体系接口确认。
- “编辑资料”“绑定手机”“修改密码”是否复用已有系统用户接口，待后续账号域 change 明确。
