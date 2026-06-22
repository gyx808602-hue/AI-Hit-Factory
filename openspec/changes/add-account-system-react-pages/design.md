## Context

仓库当前只有 `README.md` 与空的 OpenSpec 目录，尚未建立前端工程。产品文档《电商AI内容生产平台_账号体系功能设计文档_V1.0》明确账号体系不是单纯登录模块，而是平台身份、企业协作、积分计费、协议授权和风控审计的基础。

第一步目标是创建账号体系相关页面。页面视觉后续可通过 Figma MCP 扫描设计稿获取，但业务约束必须先由 OpenSpec 固化，避免页面只还原 UI 而遗漏认证、权限和合规链路。

## Goals / Non-Goals

**Goals:**

- 使用 React + TypeScript 作为账号体系前端实现方向。
- 建立页面级契约：登录注册、微信绑定手机号、个人中心、实名认证、企业认证、企业空间、成员管理、积分用量、协议签署与权限拦截。
- 建立前端状态模型：用户身份、账号状态、实名状态、企业认证状态、企业角色、协议签署状态、积分账户摘要。
- 明确与后端交互的 API 契约边界，支持 MVP 阶段先用 Mock 数据开发。
- 让 Figma MCP 扫描结果成为视觉输入，而不是业务规则来源。

**Non-Goals:**

- 不实现真实短信发送、微信 OAuth、实名认证供应商、支付充值、对象存储上传和后台审核服务。
- 不在 MVP 做完整可配置 RBAC；先按企业管理员、创作人员、观察人员三类角色实现权限分支。
- 不设计小程序完整端代码；仅保留 PC/小程序共用流程约束。
- 不保存身份证原文、证件图片长期存储策略和法务协议正文；页面只按契约展示和提交。

## Decisions

### Decision 1: 先建 React 页面骨架，再接 Figma 视觉细节

采用 React + TypeScript + 组件化页面结构。Figma MCP 扫描用于还原布局、组件尺寸、颜色和交互细节；页面业务流程与字段校验以 OpenSpec 和 PRD 约束为准。

备选方案是先完全按 Figma 生成静态页面，再补业务状态。该方案视觉进度快，但容易把权限、认证、协议弹窗做成“展示层假逻辑”，后续返工成本高。

### Decision 2: 前端采用显式身份上下文，而不是只读 `user_type`

前端状态应包含：

- `user`: 手机号、微信绑定、账号状态、用户类型。
- `realNameAuth`: 实名状态、失败原因、协议签署状态。
- `enterprise`: 企业认证状态、企业空间 ID、企业角色。
- `points`: 个人或企业积分余额、冻结状态。
- `agreements`: 场景维度的协议签署结果。

后端原理点拨：这类似前端路由守卫不能只看“是否登录”，还要看“是否拥有当前页面需要的上下文”。后端同理不能只依赖 `user_type`，企业资产应挂在 `organization/enterprise_space` 下，避免个人账号和企业空间耦合。

### Decision 3: 权限拦截前端可见，后端必须复核

前端需要隐藏不可用入口并展示引导弹窗，例如未实名用户访问真人爆款视频改编时提示去实名认证和签署《肖像权及素材授权承诺书》。但所有高风险功能调用仍必须由后端复核身份、实名、企业认证和协议签署状态。

备选方案是只在前端控制入口。该方案实现简单，但用户可绕过 UI 直接请求接口，不满足合规与风控要求。

### Decision 4: MVP 先做三类企业角色

企业空间内先支持：

- 企业管理员：成员、积分、作品、企业资料、数字人和素材管理。
- 创作人员：创建任务、上传素材、查看自己或企业授权范围内作品。
- 观察人员：默认只查看作品和用量，不具备创建/管理能力。

暂不做菜单级、按钮级、数据级全部可配置 RBAC。后续如进入 P1/P2，可扩展为角色-权限点模型。

### Decision 5: API 契约先行，页面可用 Mock 数据闭环

在真实后端完成前，前端应通过 API Client 或 Mock Service 暴露稳定契约，例如：

- `POST /auth/login/password`
- `POST /auth/login/sms`
- `POST /auth/wechat/bind-phone`
- `GET /account/profile`
- `POST /auth/real-name`
- `POST /enterprise/applications`
- `GET /enterprise/workspace`
- `POST /enterprise/members`
- `GET /points/usage`
- `POST /agreements/sign`

这样页面开发可以先闭环，后续切换真实后端时只替换数据源。

## Risks / Trade-offs

- [Risk] Figma 页面与 PRD 页面清单不一致 -> 以 PRD/OpenSpec 为业务范围，Figma 缺失页面用同一设计系统补齐。
- [Risk] 账号体系页面过早做复杂权限配置 -> MVP 固定三类企业角色，保留权限常量与守卫扩展点。
- [Risk] 敏感信息在前端过度展示 -> 证件号必须脱敏，证照材料只展示审核必要预览，页面文案提示法务确认。
- [Risk] Mock 数据与后端真实字段漂移 -> 在 spec 中固定字段语义，并在实现任务中要求集中维护 API 类型。
- [Risk] 微信、小程序、短信依赖外部服务导致首屏开发阻塞 -> 首阶段使用模拟状态机表达绑定流程，真实集成作为后续变更。

## Migration Plan

1. 补齐 OpenSpec 变更、PRD 补充和进展文档。
2. 在用户确认后初始化 React + TypeScript 前端工程。
3. 使用 Figma MCP 扫描首批页面节点，映射为页面布局和组件资产。
4. 实现 Mock API 与状态模型，完成账号体系页面闭环。
5. 后端接口可用后，将 Mock 数据源替换为真实 API Client。

## Open Questions

- Figma 链接中是否已覆盖全部账号体系页面，还是只覆盖登录/工作台的一部分？
- React 工程是否希望使用 Vite、Next.js，还是已有团队偏好的脚手架？
- UI 组件库是否指定 Ant Design、shadcn/ui、MUI，还是先自建轻量组件？
- 后端计划使用 Node.js、Java Spring Boot、Go，还是暂时只做前端 Mock？
