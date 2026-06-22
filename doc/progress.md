# 项目进展记录

## 2026-06-22

### 已完成

- 扫描项目结构：当前仓库只有 `README.md` 与 `openspec/`，尚未创建 React 前端工程。
- 读取账号体系设计文档：已提取注册登录、微信绑定、实名认证、企业认证、企业空间、子账号、角色权限、积分、协议、风控日志、后台审核、页面清单、数据表和验收标准。
- 补充 OpenSpec 项目级约束：
  - `openspec/config.yaml`
  - `openspec/project.md`
- 补充前端工程全局约束：代码规范、全局状态管理、请求二次封装、React Query、TailwindCSS + Ant Design UI 布局原则。
- 补充组件化合理化约束：组件拆分必须服务真实复用、职责边界和可测试性，禁止过度封装、过深层级和复杂配置式组件。
- 补充 SaaS 动态路由约束：后端返回菜单/权限元数据，前端使用静态路由注册表映射组件，并覆盖登录、403、404、刷新恢复和权限变化。
- 补充大数据展示性能与页面缓存约束：长列表/表格/素材墙按数据类型优化，页面缓存由路由 meta 与权限配置共同控制。
- 补充推荐项目目录结构：采用 app 基础设施、features 领域模块、shared 通用能力的分层方式，禁止提前创建大量空目录。
- 创建 OpenSpec 变更：`openspec/changes/add-account-system-react-pages/`。
- 补充 OpenSpec 文件：
  - `proposal.md`
  - `design.md`
  - `specs/account-system-pages/spec.md`
  - `tasks.md`
- 补充 PRD 与项目约束文档：`doc/account-system-prd-supplement.md`。

### 当前判断

- 第一阶段应先完成账号体系 React 页面骨架与状态/API 契约，不应直接只按 Figma 做静态页面。
- React 技术方向已写入约束，默认建议使用 Vite + React + TypeScript，除非团队指定 Next.js 或其他框架。
- Figma MCP 应作为视觉输入；OpenSpec/PRD 负责业务规则、权限和验收边界。
- 项目级约束应放在 `openspec/config.yaml` 和 `openspec/project.md`；`openspec/changes/*` 只放具体变更的增量内容。
- 技术栈和组件创建规范已进入全局约束；后续新增 change 时应自动复用这些规范。
- 动态路由属于 SaaS 平台基础能力，但必须采用“后端菜单权限 + 前端静态组件映射”的安全模型。
- 性能优化和页面缓存属于全局约束；具体列表/表格/素材页的实现方式应在对应 change 的 design/tasks 中细化。
- 目录结构采用按领域 feature 切分，shared 只放稳定复用能力，避免过度分层。
- `openspec/project.md` 已经开始变长，后续若继续补充细则，应把详细工程规范拆到 `doc/`，project 只保留摘要和链接。

### 下一步

1. 用户提供 Figma 链接或节点链接。
2. 使用 Figma MCP 扫描首批页面设计。
3. 确认 React 脚手架、UI 组件库和路由方案。
4. 执行 `/opsx:apply` 或直接要求开始实现账号体系页面。

---

## 2026-06-22 Figma UI 任务拆解补充

### 已完成

- 读取用户提供的 Figma Make 链接：`geZIsRVZyxDNNiSHQMj8pi`。
- 使用 Figma MCP 获取原型源码上下文。
- 已识别 Figma 原型页面：
  - 应用壳与顶部栏：`App.tsx`
  - 左侧导航：`Sidebar.tsx`
  - 工作台：`Dashboard.tsx`
  - 商品视频生成：`ProductVideo.tsx`
  - 图文生成视频：`ImageVideo.tsx`
  - 爆款视频改编 / 追爆：`ViralRemix.tsx`
  - 数字人管理：`DigitalHumans.tsx`
  - 任务记录：`TaskRecords.tsx`
  - 素材库：`AssetLibrary.tsx`
- 新增一期 UI 页面任务拆解文档：`doc/phase-one-ui-task-breakdown.md`。

### 当前判断

- Figma 当前覆盖的是内容生产平台 UI 原型，重点在工作台、视频生成、追爆、图文生视频、数字人、任务记录和素材库。
- 账号体系页面尚未在本次 Figma Make 原型中出现，应按 PRD/OpenSpec 单独作为高复杂度任务细化。
- 一期任务建议拆为：
  - 任务 0：Figma UI 页面底座。
  - 任务 1：账号体系。
  - 任务 2：图文生视频演示。
  - 任务 3：追爆演示。
  - 任务 4：数字人演示。
- 图文生视频、追爆、数字人复杂度中等，可以作为独立任务推进；账号体系复杂度高，必须再拆子任务。

### 下一步

1. 用户确认是否先执行任务 0：Figma UI 页面底座。
2. 确认前端工程是否使用 Vite + React + TypeScript。
3. 确认 UI 组件策略：沿用 Figma 原型的 shadcn/Radix 风格，还是按既有 OpenSpec 约束使用 Ant Design + TailwindCSS。
4. 确认商品视频生成是否纳入一期 UI 交付。
5. 确认账号体系是否需要补 Figma 页面，还是先按 PRD/OpenSpec 实现业务页面。

---

## 2026-06-22 UI 底座 OpenSpec 创建补充

### 已完成

- 确认一期 UI 工程方案使用 Ant Design + TailwindCSS。
- 更新 `doc/phase-one-ui-task-breakdown.md`，固化 Ant Design + TailwindCSS 方案，并说明不采用 shadcn/Radix 作为一期主栈的原因。
- 创建新的 OpenSpec change：`openspec/changes/add-figma-ui-shell-pages/`。
- 补齐 UI 底座 change artifacts：
  - `proposal.md`
  - `design.md`
  - `specs/figma-ui-shell-pages/spec.md`
  - `tasks.md`
- 运行 `openspec status --change add-figma-ui-shell-pages`，确认 4/4 artifacts complete。

### 当前判断

- `add-figma-ui-shell-pages` 已经可以进入实现阶段。
- 该 change 只负责 Figma UI 底座和首批页面还原，不包含真实账号体系、真实积分扣费、真实视频生成后端和协议签署。
- 账号体系仍保留为独立高复杂度任务：`add-account-system-react-pages`。
- 商品视频生成已被纳入 UI 底座页面范围，因为 Figma 已提供完整页面；后续真实商品视频生成业务仍可单独细化。

### 下一步

1. 用户确认后开始执行 `add-figma-ui-shell-pages`。
2. 实现前先读取该 change 的 `tasks.md` 并按任务顺序推进。
3. 若安装依赖需要联网或写入受限目录，按权限规则请求用户批准。
4. 每完成一个小阶段后继续更新 `doc/progress.md` 并中文汇报。

---

## 2026-06-22 窗口兼容性补充

### 已完成

- 根据用户要求，为 UI 底座任务补充窗口兼容性要求。
- 更新 `doc/phase-one-ui-task-breakdown.md`，新增“窗口兼容性要求”。
- 更新 `openspec/changes/add-figma-ui-shell-pages/design.md`，补充 PC 优先、紧凑桌面、窄屏兜底、表格横向滚动、弹窗最大高度等设计决策。
- 更新 `openspec/changes/add-figma-ui-shell-pages/specs/figma-ui-shell-pages/spec.md`，新增 Browser window compatibility 验收要求。
- 更新 `openspec/changes/add-figma-ui-shell-pages/tasks.md`，新增窗口矩阵验证任务。

### 当前判断

- 一期 UI 仍以 PC SaaS 工作台为主，不承诺完整移动端/小程序同等体验。
- 必须覆盖常见桌面窗口：`1280x720`、`1366x768`、`1440x900`、`1536x864`、`1920x1080`。
- `1024px - 1279px` 作为紧凑桌面处理；小于 `1024px` 做安全兜底，确保不白屏、不遮挡、不出现不可关闭弹窗。

### 下一步

1. 实现阶段按窗口矩阵做浏览器检查。
2. 对任务记录、素材库、弹窗、步骤页重点检查横向溢出、按钮遮挡和低高度滚动问题。
