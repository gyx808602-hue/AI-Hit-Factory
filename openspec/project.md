# OpenSpec 项目级约束

本文件用于沉淀 AI-Hit-Factory 的长期项目上下文。后续新增任何 OpenSpec change，都应先读取本文件和 `openspec/config.yaml`，再编写具体变更。

## 1. 项目定位

AI-Hit-Factory / AI爆款工厂 是面向电商内容生产的 AI SaaS 平台。

平台核心能力包括：

- 账号、身份、企业协作和权限控制。
- 商品卖点提取、脚本生成、图文生成视频。
- 商品视频生成、混剪、爆款结构分析。
- 数字人、真人视频改编、换人物、换商品。
- 企业素材库、企业数字人库、企业任务记录。
- 积分账户、用量流水、生成任务扣费与退款。
- 协议签署、内容合规、风控限制和操作日志。

## 2. 产品文档来源

| 模块 | 文档路径 | 用途 |
| :--- | :--- | :--- |
| 账号体系 | `F:\AAA_AI_aisperce\产品说明-aispeace\1. 电商AI内容生产平台_账号体系功能设计文档_V1.0.docx` | 账号、认证、企业空间、权限、协议、日志 |
| 积分体系 | `F:\AAA_AI_aisperce\产品说明-aispeace\2. 电商AI内容生产平台_积分体系功能设计文档_V1.0.docx` | 积分账户、充值、扣费、流水、退款 |
| 商品视频生成 | `F:\AAA_AI_aisperce\产品说明-aispeace\3. 电商AI内容生产平台_商品视频生成模块功能设计文档_V1.0.docx` | 视频生成、任务状态、素材、结果 |

新增 change 时，如果涉及上述模块，必须先读取对应产品文档或已沉淀的 `doc/` 补充文档。

## 3. 技术栈约束

默认方向：

- Frontend：React + TypeScript。
- 默认脚手架：Vite + React + TypeScript。
- UI：TailwindCSS + Ant Design。
- 服务端状态：TanStack Query / React Query。
- 状态/API：先定义 TypeScript 类型、请求封装、API Client 契约和 React Query hooks，再实现页面。
- Mock：真实后端未完成前允许使用 Mock API，但 Mock 数据必须覆盖关键身份、状态和异常分支。
- Figma：通过 Figma MCP 扫描设计稿。Figma 是视觉输入，OpenSpec/PRD 是业务规则输入。

执行原则：

- 如果仓库已有前端工程，必须优先适配现有技术栈。
- 不为 MVP 过早引入大型复杂框架。
- 不把静态 UI 当成业务完成，关键状态和权限必须可验证。

### 3.1 代码规范

- 代码必须使用 TypeScript，避免无类型的 `any` 扩散。
- 变量、函数、组件、类型命名使用英文，语义要贴近业务。
- 组件文件保持职责单一：页面负责组合，业务组件负责领域交互，通用组件负责纯 UI。
- 复杂业务逻辑必须抽到 hooks、services、utils 或 domain 层，不要堆在 JSX 中。
- 关键业务逻辑必须写中文注释解释 Why，例如权限判断、积分扣减、协议签署、风控状态，不写“给变量赋值”这类无意义注释。
- 表单字段、接口字段、枚举状态必须集中定义类型，避免页面里散落字符串常量。
- 错误态、空态、加载态、禁用态必须作为组件验收的一部分。
- 代码风格以简洁、清晰、可维护为优先，不做过度抽象。

### 3.1.1 组件化合理化与简约化

组件化目标是降低理解和维护成本，不是追求文件数量或抽象层级。

可以抽组件的情况：

- 同一 UI/交互在 2 个以上真实场景复用。
- 组件内部包含稳定的复杂交互，例如上传、验证码倒计时、权限拦截弹窗。
- 组件代表明确业务概念，例如企业认证状态卡、积分余额摘要、成员角色选择。
- 抽离后能明显降低页面阅读成本。

不建议抽组件的情况：

- 只在一个页面使用，且 JSX 结构简单。
- 为了统一而创建只有一两行样式的 wrapper。
- 把 Ant Design 组件再包一层，但没有增加业务语义或稳定行为。
- 用复杂配置对象驱动简单 UI，导致阅读成本高于直接写 JSX。
- 过早创建 `BaseForm`、`BaseTable`、`FactoryModal` 这类大而全组件。

推荐拆分层级：

```text
页面 Page
  -> 业务区块 Section
    -> 业务组件 Feature Component
      -> 通用 UI Component
```

一般不要超过 4 层。若超过 4 层，需要说明抽象原因。

组件设计原则：

- 优先组合，不优先继承或大配置。
- 优先显式 props，不使用难理解的隐式上下文。
- 业务组件可以知道业务语义，通用组件不应该引用业务 API。
- 单个组件超过约 200 行时，需要检查是否职责过多；但不要为了行数机械拆分。
- 单个组件 props 超过约 8 个时，需要检查是否抽象错误或应该拆成更小的业务组件。
- 通用组件必须稳定后再上升到 `src/components`；不稳定的先留在 `features/<module>/components`。

建议目录边界：

```text
src/
  app/                 # 应用入口、Provider、全局路由装配
  features/            # 业务领域模块，例如 account、enterprise、points
  shared/              # 稳定复用的通用能力
  pages/               # 可选：仅放薄路由页，复杂业务仍回到 features
```

### 3.2 推荐项目目录结构

前端目录采用“app 基础设施 + features 领域模块 + shared 通用能力”的方式组织。

推荐结构：

```text
src/
  app/
    App.tsx
    main.tsx
    providers/
      AppProviders.tsx
      QueryProvider.tsx
      AntdProvider.tsx
    router/
      index.tsx
      routeRegistry.tsx
      routeGuards.tsx
      routeTypes.ts
    layouts/
      AuthLayout.tsx
      DashboardLayout.tsx
      BlankLayout.tsx

  features/
    account/
      api/
      hooks/
      pages/
      components/
      types.ts
      constants.ts
      utils.ts
    enterprise/
      api/
      hooks/
      pages/
      components/
      types.ts
      constants.ts
    points/
      api/
      hooks/
      pages/
      components/
      types.ts
    agreements/
    audit/

  shared/
    api/
      request.ts
      errors.ts
      types.ts
    components/
      AppPageHeader/
      PermissionFallback/
      StatusBadge/
    hooks/
    store/
    utils/
    constants/
    styles/

  assets/
  mocks/
  test/
```

目录职责：

| 目录 | 放什么 | 不放什么 |
| :--- | :--- | :--- |
| `app/` | 应用启动、Provider、路由装配、布局 | 具体业务表单和业务 API |
| `features/<module>/` | 某个业务领域的页面、组件、hooks、api、类型 | 跨模块通用 UI 和全局工具 |
| `shared/` | 稳定复用的通用组件、请求基础层、工具函数、全局 store | 还不稳定的业务组件 |
| `assets/` | 静态资源 | 业务上传素材 |
| `mocks/` | Mock 数据和 Mock Service | 真实业务逻辑 |
| `test/` | 测试工具、测试夹具 | 生产代码 |

放置规则：

- 新业务优先进入 `features/<module>`，不要一开始就放到 `shared`。
- 只有被 2 个以上真实业务模块复用，并且 API 稳定的组件，才提升到 `shared/components`。
- 页面文件只做路由级组合，复杂逻辑下沉到 feature hooks、components 或 utils。
- 请求基础层在 `shared/api`，业务 API 在各自 `features/<module>/api`。
- React Query hooks 放在对应 feature 的 `hooks` 或 `api` 邻近位置，避免散落。
- 全局 store 放 `shared/store`，但只保存客户端 UI/会话状态。
- 动态路由注册表放 `app/router/routeRegistry.tsx`，不要散落到各业务页面中。
- 不提前创建空目录；目录随真实功能增长。

命名建议：

- 页面：`LoginPage.tsx`、`EnterpriseWorkspacePage.tsx`。
- 业务组件：`EnterpriseStatusCard.tsx`、`MemberRoleSelect.tsx`。
- hooks：`useAccountProfile.ts`、`useEnterpriseMembers.ts`。
- API Client：`accountApi.ts`、`enterpriseApi.ts`。
- 类型：优先模块内 `types.ts`，跨模块稳定后再移到 `shared/api/types.ts`。

这种结构的 Why：

- `features` 让账号、企业、积分、协议等领域边界清晰。
- `shared` 只承载成熟复用能力，避免变成杂物间。
- `app` 只负责应用装配，降低业务和基础设施耦合。
- 对 SaaS 来说，路由、权限、菜单、布局是基础设施；认证、企业、积分是业务领域，二者分开放更容易维护。

### 3.3 路由与动态路由规范

SaaS 平台必须支持动态路由，但动态路由不等于让后端控制前端组件加载。

推荐模型：

```text
后端菜单/权限接口
  -> 菜单树、权限码、页面标识、路由路径、排序、图标标识
  -> 前端静态 route registry
  -> 过滤生成可访问路由和侧边栏菜单
```

核心原则：

- 前端维护静态路由注册表，明确 `routeKey -> component` 的映射。
- 后端只返回用户可访问的菜单、权限码、路由 key 和元数据。
- 禁止后端直接返回任意组件路径并由前端动态 import，避免安全风险和构建不可控。
- 动态路由生成必须在获取用户资料、企业空间、角色权限和菜单权限后执行。
- 刷新页面时必须能恢复路由，不应出现有权限页面刷新后 404。
- 未登录访问业务路由跳转登录页；无权限访问显示 403；不存在路由显示 404。
- 菜单显示权限、路由访问权限、按钮操作权限要分层处理，不要混成一个布尔值。
- 前端路由守卫只提升体验，所有后端接口仍必须按身份、企业空间、角色、协议和风控状态复核。

建议路由分类：

| 类型 | 示例 | 说明 |
| :--- | :--- | :--- |
| Public Route | 登录、注册、找回密码 | 不需要登录 |
| Auth Route | 工作台、个人中心 | 需要登录 |
| Enterprise Route | 企业空间、成员、积分 | 需要企业空间和企业角色 |
| Admin Route | 审核、协议、日志 | 需要平台管理员权限 |
| Risk Guarded Route | 真人改编、数字人创建 | 需要实名/企业认证和协议签署 |

推荐类型边界：

```ts
type RouteKey = 'account.profile' | 'enterprise.workspace' | 'enterprise.members';

type MenuItem = {
  key: RouteKey;
  path: string;
  title: string;
  icon?: string;
  permissionCode?: string;
  children?: MenuItem[];
};
```

动态路由验收必须覆盖：

- 登录后根据权限生成菜单。
- 刷新页面后恢复当前路由。
- 无权限路由显示 403。
- 未登录访问跳转登录。
- 企业角色切换后菜单和路由同步更新。
- 后端权限变化后，React Query 缓存失效并重新生成路由。

知识点拨：动态路由可以类比后端网关的路由表。后端可以告诉前端“这个用户能看到哪些菜单”，但不能把“加载哪个前端组件”的控制权完全交给后端；前端需要保留一张静态、安全、可构建的组件映射表。

### 3.4 全局状态管理

全局状态只保存客户端状态，不保存可由接口获取的服务端数据。

适合放全局状态：

- 登录态摘要，例如 token 是否存在、当前用户 ID。
- 当前企业空间 ID。
- 当前选择的工作台上下文。
- 主题、语言、侧边栏折叠状态。
- 跨页面短期 UI 状态。

不适合放全局状态：

- 用户详情。
- 企业详情。
- 积分余额。
- 成员列表。
- 任务列表。
- 协议记录。
- 任何接口可重新获取、需要缓存失效或后台同步的数据。

这些服务端数据必须由 React Query 管理。

默认建议：

- 若项目尚未确定状态库，优先使用轻量方案，例如 Zustand。
- 不使用 Redux 作为默认选择，除非后续出现复杂跨模块状态流、时间旅行调试或严格团队规范。
- 全局状态 store 必须小而明确，禁止变成“前端数据库”。

后端原理点拨：React Query 管接口数据，类似后端缓存层管理外部资源的新鲜度；Zustand 这类全局状态更像进程内上下文，只保存当前应用运行所需的少量状态。两者职责混用，会导致数据过期、刷新丢失和权限状态不一致。

### 3.5 请求接口二次封装与 React Query

接口访问必须分三层：

1. request 基础层：统一 baseURL、headers、token 注入、错误归一化、超时、响应解析。
2. API Client 层：按业务模块封装函数，例如 `accountApi.getProfile()`、`enterpriseApi.createMember()`。
3. React Query hooks 层：页面使用 `useAccountProfile()`、`useCreateEnterpriseApplication()`，不直接调用 API Client。

禁止事项：

- 页面或组件中直接写 `fetch` / `axios`。
- 在组件里拼接接口路径。
- 在组件里手写重复的 loading/error/success 状态。
- 把 React Query 已管理的数据再复制进全局 store。

React Query 使用原则：

- 查询类接口使用 `useQuery`，按业务实体设计 query key。
- 修改类接口使用 `useMutation`，成功后通过 `invalidateQueries` 或 `setQueryData` 更新缓存。
- 权限、认证、积分、协议等关键数据必须有清晰的缓存失效策略。
- Mock API 与真实 API 必须共用同一套类型和 API Client 函数。
- 错误对象必须归一化，页面只处理可展示的错误消息和错误码。

推荐 query key 形式：

```ts
['account', 'profile']
['enterprise', enterpriseId, 'workspace']
['enterprise', enterpriseId, 'members', filters]
['points', ownerType, ownerId, 'usage', filters]
['agreements', scene, 'signed-status']
```

### 3.6 大数据展示性能与页面缓存

大量数据页面必须先判断数据类型，再选择展示和缓存策略。

数据展示策略：

| 数据类型 | 示例 | 推荐策略 |
| :--- | :--- | :--- |
| 长列表 | 操作日志、任务流、消息流 | 虚拟列表、游标分页、增量加载 |
| 表格数据 | 成员、积分流水、审核列表 | 服务端分页、服务端筛选、服务端排序 |
| 卡片网格 | 素材库、数字人库、作品库 | 分页或瀑布流虚拟化、图片懒加载 |
| 媒体资源 | 图片、视频、封面、预览 | 缩略图、懒加载、按需预览、避免首屏加载原文件 |
| 树形数据 | 菜单、组织、分类 | 分层加载、展开时加载子节点 |
| 实时状态 | 生成任务进度 | 轮询间隔控制、可见时刷新、离开页面停止刷新 |

硬性原则：

- 禁止一次性渲染大量 DOM 节点。
- 长列表优先使用虚拟列表或分页，不直接 map 渲染全部数据。
- Ant Design Table 必须默认考虑服务端分页、筛选和排序；大数据量表格不得只依赖前端过滤。
- 图片、视频、素材类页面必须使用缩略图和懒加载，预览原文件必须按需触发。
- React Query 的 `staleTime`、`gcTime`、`refetchOnWindowFocus` 需要按数据实时性配置，不使用一套默认值套所有页面。
- 搜索框、筛选项和滚动加载必须做防抖或请求合并，避免频繁请求。
- 大列表的 item/card 组件必须保持轻量，避免每行创建复杂状态和重复请求。

页面缓存策略：

- 页面缓存必须由路由 meta 和权限/菜单配置共同决定。
- 动态路由元数据需要支持 `cache` 或 `keepAlive` 开关。
- 后端权限配置可以控制某页面是否允许缓存；例如审核、风控、权限配置页默认不缓存，普通工作台列表可按需缓存。
- 当用户角色、企业空间、菜单权限、账号状态或协议状态变化时，必须清理受影响页面缓存并重新拉取数据。
- 页面缓存只缓存 UI 状态和路由状态；接口数据仍由 React Query 管理。
- 缓存页面恢复时必须校验权限仍然有效，不能因为 keepAlive 绕过权限变化。

建议路由 meta：

```ts
type RouteMeta = {
  title: string;
  permissionCode?: string;
  requiresAuth?: boolean;
  requiresEnterprise?: boolean;
  cache?: boolean;
  cacheGroup?: 'workspace' | 'account' | 'enterprise' | 'admin';
};
```

验收要求：

- 千级列表滚动不卡顿。
- 大表格翻页、筛选、排序走服务端参数。
- 素材类页面首屏不加载原图或原视频。
- 权限关闭页面缓存后，返回页面必须重新请求数据。
- 切换企业空间或角色后，旧页面缓存不会泄漏到新权限上下文。
- 403/冻结/风控状态变化后，已缓存页面不能继续操作高风险功能。

知识点拨：虚拟列表的本质是“只渲染视口附近的 DOM”，类似后端分页只查询当前页数据；页面缓存的本质是保留前端 UI 上下文，但它不能替代权限校验，也不能替代接口缓存。

### 3.7 UI 实现：TailwindCSS + Ant Design

Ant Design 使用范围：

- 表单、输入框、验证码输入组合。
- 表格、分页、筛选。
- Modal、Drawer、Popover、Tooltip。
- Upload、Steps、Tabs、Menu。
- Message、Notification、Result、Empty、Skeleton。

TailwindCSS 使用范围：

- 页面整体布局。
- Grid/Flex 间距。
- 响应式断点。
- 容器宽度、留白、局部视觉微调。
- 与 Figma 对齐的非 Ant Design 标准布局。

布局原则：

- SaaS 后台和工作台页面应保持克制、清晰、可扫描，不做营销页式大 Hero。
- 页面优先服务高频操作，信息密度要合理，避免卡片套卡片。
- 表单页需要清晰分组、明确主次按钮、保留错误提示和帮助文案。
- 表格页需要支持加载态、空态、筛选态、分页态和权限不足态。
- 弹窗只承载短流程；复杂认证、企业申请、协议阅读应使用独立页面或分步骤布局。
- 移动端和小程序相关页面要考虑窄屏布局，但 PC SaaS 端优先保证工作台效率。

Ant Design 与 TailwindCSS 配合规则：

- 优先使用 Ant Design 的可访问交互和复杂组件能力。
- 不用 Tailwind 强行覆盖 Ant Design 内部复杂结构，必要时通过主题 token 或组件 props 调整。
- Tailwind 类名用于外层布局和业务容器，Ant Design 组件内部样式尽量保持稳定。
- 颜色、圆角、间距应形成统一设计 token，不在页面中随意散落魔法值。

## 4. 领域建模约束

### 4.1 账号与企业空间

账号体系必须支撑：

- 手机号注册/登录。
- 手机号验证码登录。
- 找回密码/重置密码。
- 微信扫码或小程序授权登录。
- 微信身份绑定手机号。
- 个人实名认证。
- 企业认证。
- 企业空间。
- 企业子账号。
- 平台管理员后台审核。

企业建模原则：

- 不要只用 `user.user_type` 表示企业身份。
- 企业资产、成员、积分、任务和素材必须挂到 `organization/enterprise_space`。
- 企业审核通过后创建企业空间。

### 4.2 权限模型

MVP 阶段使用固定角色：

- 企业管理员。
- 创作人员。
- 观察人员。

暂不做复杂 RBAC。后续如需要，再扩展为角色-菜单-操作权限模型。

权限拦截原则：

- 前端隐藏不可用入口并给出引导。
- 后端必须再次校验身份、认证、企业空间、角色、协议和账号状态。
- 高风险能力不能只依赖前端控制。

### 4.3 合规与协议

下列场景必须记录协议签署：

- 用户注册协议。
- 隐私政策。
- AI 内容生成服务协议。
- 肖像权及素材授权承诺书。
- 企业认证授权承诺。
- 内容合规承诺。

协议签署记录至少包含：

- 协议 ID。
- 协议版本。
- 用户 ID。
- 企业 ID，若适用。
- 签署时间。
- IP 地址。
- 设备信息。
- 内容快照或文件地址。

### 4.4 积分与用量

积分体系必须区分：

- 个人积分账户。
- 企业积分账户。
- 子账号企业积分消耗记录。

每次生成任务必须能追踪：

- 操作用户。
- 企业空间。
- 任务 ID。
- 功能类型。
- 积分消耗。
- 结果状态。
- 退款状态。
- 创建时间。

## 5. 页面建设约束

页面开发必须先对齐 PRD 页面清单，再对齐 Figma。

账号体系首批页面：

- 注册/登录页。
- 绑定手机号页。
- 个人中心。
- 实名认证页。
- 企业认证申请页。
- 企业空间首页。
- 成员管理页。
- 积分用量页。
- 协议弹窗/签署页。
- 权限拦截弹窗。

页面验收不能只看视觉，还要覆盖：

- 正常状态。
- 待审核状态。
- 驳回状态。
- 冻结/风控限制状态。
- 未绑定手机号状态。
- 未实名状态。
- 未签署协议状态。
- 企业角色无权限状态。

## 6. OpenSpec 工作流约束

新增功能或模块时：

1. 先读取 `openspec/config.yaml` 和 `openspec/project.md`。
2. 若有产品 Word 文档，先抽取需求。
3. 创建 OpenSpec change。
4. 编写 `proposal.md`，只描述本次变更的 why/what/impact。
5. 编写 `design.md`，描述技术方案、状态流、API 契约和取舍。
6. 编写 `specs/<capability>/spec.md`，描述可验收的 SHALL/MUST 需求。
7. 编写 `tasks.md`，拆成可执行原子任务。
8. 用户确认后进入实现。

约束放置规则：

- 全局长期规则：放 `openspec/config.yaml` 和 `openspec/project.md`。
- 具体模块 PRD 补充：放 `doc/`。
- 某个变更的一次性范围、设计和任务：放 `openspec/changes/<change-name>/`。

## 7. 进展文档规则

每完成一小阶段，必须更新：

- `doc/progress.md`

进展记录至少包含：

- 已完成内容。
- 当前判断。
- 下一步。
- 需要用户提供的信息。

## 8. 当前已知状态

- 当前仓库尚未创建 React 前端工程。
- 已创建账号体系页面建设 change：`openspec/changes/add-account-system-react-pages/`。
- 已创建账号体系 PRD 补充：`doc/account-system-prd-supplement.md`。
- 后续新增积分体系、商品视频生成等任务时，不应把全局约束写进各自 change，而应复用本文件。

## 9. Project 文档维护建议

当前 `openspec/project.md` 适合承载项目级摘要和关键规则，但不宜无限增长。

建议保留在本文件的内容：

- 产品定位。
- 技术栈硬约束。
- 跨模块领域建模原则。
- OpenSpec 工作流。
- 文档索引。

建议拆到 `doc/` 的内容：

- 前端工程详细规范。
- 后端接口规范。
- 数据库设计规范。
- 组件库详细规范。
- 各模块 PRD 补充。
- Figma 页面映射记录。

后续如果继续补充大量前端细则，建议新建：

- `doc/frontend-engineering-guidelines.md`
- `doc/api-guidelines.md`
- `doc/component-guidelines.md`

然后在 `openspec/project.md` 只保留摘要和链接，避免全局上下文过长影响每次 OpenSpec 指令的聚焦度。
