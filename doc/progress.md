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

## 2026-06-23 环境变量排查补充

### 已完成
- 扫描仓库根目录与环境变量文件模式，当前项目内未发现任何 `.env`、`.env.local`、`.env.development`、`.env.production` 文件。
- 确认 `VITE_APP_BASE_API` 的使用位置：
  - `src/utils/request.ts`
  - `src/pages/LoginPage.tsx`
  - `src/vite-env.d.ts`
- 确认当前代码对 `VITE_APP_BASE_API` 采用“可选兜底”策略：
  - `request.ts` 中未配置时会回退为空字符串。
  - `LoginPage.tsx` 中未配置时验证码会走本地 fallback。

### 当前判断
- 现在不是“找不到某个现成 env 文件”，而是这个仓库目前就还没有创建环境变量文件。
- 这是 Vite 项目，环境变量文件应该放在仓库根目录 `F:\AAA_AI_aisperce\AI-Hit-Factory\`。
- 如果你要本地开发联调接口，通常优先新建 `.env.development` 或 `.env.local`，并补上 `VITE_APP_BASE_API=...`。

### 下一步
1. 根据你的运行场景决定新建 `.env.development` 还是 `.env.local`。
2. 在文件中配置 `VITE_APP_BASE_API` 指向后端网关或 API 基础地址。
3. 重启 Vite 开发服务，确认 `import.meta.env.VITE_APP_BASE_API` 已生效。
---

## 2026-06-23 本地后端联调环境补充

### 已完成
- 已按当前 Vite 项目结构，在仓库根目录新增本地开发环境文件：
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.development`
- 已补充环境变量：
  - `VITE_APP_BASE_API=http://127.0.0.1:8080`
- 已确认当前仓库中没有其他后端端口约定或 dev proxy 配置，因此本次采用本地联调最常见的直连方式。

### 当前判断
- 现有前端 API 路径统一使用 `/api/v1/...`，配上 `VITE_APP_BASE_API` 后，会直接请求到 `http://127.0.0.1:8080/api/v1/...`。
- 这种方式最简单，适合当前阶段直接联调；原理上就是把 axios 的 `baseURL` 当作“统一网关前缀”，类似前端请求拦截器里统一补域名，避免每个接口手写完整地址。
- 如果你的后端实际运行端口不是 `8080`，后续只需要改这一行即可，不需要动接口代码。

### 下一步
1. 启动或重启前端 dev server，让 Vite 重新加载 `.env.development`。
2. 启动后端服务，确认它实际监听地址是否为 `http://127.0.0.1:8080`。
3. 用登录页或任一真实接口验证联调是否成功；如果失败，优先检查端口、跨域和后端网关前缀。
---

## 2026-06-23 多环境变量补齐

### 已完成
- 保留并规范化开发环境文件：
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.development`
  - 当前值：`VITE_APP_BASE_API=http://192.168.110.145:3000`
- 新增测试环境文件：
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.test`
  - 当前值：`VITE_APP_BASE_API=http://127.0.0.1:8080`
- 新增生产环境文件：
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.production`
  - 当前值：`VITE_APP_BASE_API=/`

### 当前判断
- `development` 环境使用局域网后端地址，适合你现在前端连接内网机器联调。
- `test` 环境保留本机地址，适合本地测试或 CI 场景下连接本机测试服务。
- `production` 环境使用 `/` 而不是写死域名，原理是让前端请求默认走“当前站点同域”：
  - 如果线上是 `https://your-domain.com`，那么 `/api/v1/...` 会自动请求到 `https://your-domain.com/api/v1/...`
  - 这样能避免把生产域名硬编码进前端包里，也更利于 Nginx / 网关转发和多环境发布。

### 下一步
1. 开发联调时继续使用 `npm run dev`，会自动读取 `.env.development`。
2. 如果后续需要专门的预发环境，建议再补一个 `.env.staging`，不要复用 `production`。
3. 上线前确认部署网关是否把 `/api/` 正确转发到后端服务。
---

## 2026-06-23 暂存区状态核查

### 已完成
- 已执行暂存区检查：
  - `git diff --cached --stat`
  - `git diff --cached --name-status`
  - `git status --short`
- 已确认当前暂存区为空，暂无任何已 `git add` 的变更。
- 已识别当前仍停留在工作区的文件包括：
  - 已修改：`.gitignore`、`doc/progress.md`、`openspec/changes/connect-dynamic-menu-routes/tasks.md`、`package.json`、`package-lock.json`、`src/app/App.tsx` 等
  - 未跟踪：`.env.development`、`.env.test`、`.env.production`、`src/app/router/dynamicRoutes.ts` 等

### 当前判断
- 你现在要的“暂存区提交代码详细描述”在严格意义上还不存在，因为暂存区里没有内容。
- 当前仓库里有不少“工作区变更”，但它们还没有进入暂存区，所以不能当作本次待提交内容来精确描述。

### 下一步
1. 如果你要我描述“准备提交的代码”，先把目标文件 `git add` 到暂存区。
2. 或者我也可以直接基于当前工作区变更，先给你一份“未暂存代码变更说明”。
---

## 2026-06-23 工作区变更说明整理

### 已完成
- 已基于当前工作区改动整理提交说明素材，覆盖动态菜单路由接入、React Query 初始化、多环境变量补齐和测试补充。
- 已确认本轮说明基于“当前工作区变更”而非暂存区，因为暂存区仍为空。

### 当前判断
- 当前这批改动已经具备一版完整的中文提交说明条件，适合直接用于 commit message 扩展描述、PR 描述或变更汇报。

### 下一步
1. 若你执行 `git add`，可再生成一版严格对应暂存区的提交说明。
2. 若你需要英文版或 Conventional Commits 风格，我可以继续补。
---

## 2026-06-23 提交规范补充

### 已完成
- 已整理当前项目适合采用的规范化 Git 提交格式，准备输出可直接复用的 commit message 模板与本次改动示例。

### 当前判断
- 当前这批改动更适合使用 `Conventional Commits` 风格，便于后续做日志归类、PR 阅读和版本发布。

### 下一步
1. 优先按 `type(scope): subject` 结构提交。
2. 若改动较大，可补充 body，说明“做了什么”“为什么这么做”“影响范围”。
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

---

## 2026-06-22 UI 底座实现阶段进展

### 已完成

- 开始执行 OpenSpec change：`add-figma-ui-shell-pages`。
- 创建 Vite + React + TypeScript 工程骨架：
  - `package.json`
  - `index.html`
  - `vite.config.ts`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `src/app/main.tsx`
  - `src/app/App.tsx`
  - `src/app/styles.css`
- 建立应用目录与基础边界：
  - `src/app/router`
  - `src/app/layouts`
  - `src/pages`
  - `src/features/workspace`
  - `src/shared/components`
  - `src/test`
- 建立静态路由注册表与路由守卫预留：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/routeGuards.ts`
- 建立首批 Mock 类型与 Mock 数据过滤：
  - `src/features/workspace/types.ts`
  - `src/features/workspace/status.ts`
  - `src/features/workspace/mockData.ts`
- 建立基础测试文件：
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/routeGuards.test.ts`
  - `src/features/workspace/mockData.test.ts`
- 实现 Ant Design + TailwindCSS 应用壳：
  - 暗色主题 token
  - 侧边栏
  - 顶部栏
  - 内容滚动区域
  - 侧边栏折叠
  - 窗口兼容基础布局
- 实现首批页面：
  - 工作台
  - 商品视频生成
  - 图文生成视频
  - 爆款视频改编 / 追爆
  - 数字人管理
  - 任务记录
  - 素材库
  - 403 / 404 预留页
- 更新 `openspec/changes/add-figma-ui-shell-pages/tasks.md`，标记已完成的工程骨架、主题路由、Mock 边界、公共页面和演示页面任务。

### 当前阻塞

- `npm install` 需要联网安装依赖，但升级权限请求被审批服务拒绝，返回 `503 Service Unavailable`。
- 因依赖未安装，以下验证命令当前无法通过：
  - `npm run typecheck`：`tsc` 未安装。
  - `npm test`：`vitest` 未安装。
  - `npm run build`：`tsc` / `vite` 未安装。

### 当前判断

- 代码主体已经按 UI 底座任务落地，但还不能声明构建通过或测试通过。
- 下一步必须先完成依赖安装，才能做 TypeScript、Vitest、Vite build 和浏览器窗口矩阵验证。
- 当前实现没有接入真实后端、账号体系、积分扣费或真实视频生成，仍是 UI + Mock 演示闭环。

### 下一步

1. 等待用户明确批准或审批服务恢复后，执行 `npm install`。
2. 安装成功后运行：
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
3. 启动本地开发服务器，执行浏览器窗口矩阵检查。
4. 修复验证中发现的类型、构建或布局问题。

### 2026-06-22 依赖安装再次尝试

- 用户已明确允许本次任务执行依赖安装和验证命令。
- 再次执行 `npm install` 时，权限审批服务仍返回 `503 Service Unavailable`，命令未能真正进入 npm 安装阶段。
- 当前不能绕过审批链路安装依赖，因此 TypeScript、Vitest、Vite build 和浏览器验证仍暂时阻塞。

---

## 2026-06-22 npm EBUSY 安装阻塞排查

### 已完成

- 已读取 npm 失败日志，确认错误发生在 npm `reify` 阶段：npm 正在把旧依赖目录重命名为临时退休目录时被 Windows 文件锁阻塞。
- 第一次锁定点为 `node_modules/@ant-design/icons-svg/es/asn/AndroidFilled.js`，重新执行 `npm install` 后锁定点变化为 `node_modules/@rc-component/pagination`，说明不是单个文件损坏，而是当前 `node_modules` 处于半安装/被占用状态。
- 已检查命令行中与当前项目路径相关的 Node/Vite/npm 进程，未发现明确指向 `F:\AAA_AI_aisperce\AI-Hit-Factory` 的运行进程。
- 已执行 `npm install --package-lock-only --no-audit --no-fund` 并成功生成 `package-lock.json`，说明依赖解析和网络链路可用。
- 已执行 `npm ls --depth=0`，结果显示根依赖仍为 `UNMET DEPENDENCY`，说明实体依赖尚未安装成功，现有 `node_modules` 不可用于类型检查、测试或构建。

### 当前判断

- 根因集中在 Windows 对旧 `node_modules` 的文件/目录锁，而不是依赖版本冲突或 npm 网络失败。
- 下一步采用不删除文件的方式处理：将当前半安装的 `node_modules` 重命名为备份目录，再执行一次干净安装。

---

## 2026-06-22 依赖删除重装与自动化验证

### 已完成

- 根据用户明确授权，删除当前项目根目录下损坏的 `node_modules`，并清理本次半搬迁产生的 `node_modules.ebusy-backup-*` 残留目录。
- 重新执行 `npm install` 成功，安装结果为 `added 268 packages`，后续补充 `jsdom` 后依赖总量恢复正常。
- 新增测试环境依赖 `jsdom`，用于 Vitest 的 `jsdom` environment。
- 修复 `vite.config.ts` 的类型入口：将 `defineConfig` 从 `vitest/config` 导入，使 TypeScript 正确认识 `test` 配置字段。
- 更新 `.gitignore`，忽略 `node_modules`、`dist` 和 `*.tsbuildinfo`。
- 已完成并通过以下验证：
  - `npm ls --depth=0`
  - `npm run typecheck`
  - `npm run lint`
  - `npm test`：3 个测试文件、8 个测试通过
  - `npm run build`
- 已更新 `openspec/changes/add-figma-ui-shell-pages/tasks.md`，勾选依赖安装、类型检查、lint 和生产构建任务。

### 当前判断

- 依赖安装阻塞已解除，项目现在可以进入浏览器运行与窗口兼容性验证阶段。
- `npm run build` 有 Vite chunk size warning，原因是首期页面与 Ant Design 依赖被打进同一个入口包；当前不影响运行，后续可通过路由懒加载和 manual chunks 优化。
- `npm audit` 提示 1 个 low severity vulnerability，当前不阻塞 UI 验收；后续可单独执行 `npm audit` 判断是否需要升级。

### 下一步

1. 启动本地开发服务并打开页面。
2. 按窗口矩阵检查 `1280x720`、`1366x768`、`1440x900`、`1536x864`、`1920x1080`。
3. 补充检查紧凑桌面 `1024px - 1279px` 和窄屏兜底 `<1024px`。
4. 完成浏览器验证后继续更新任务清单与进展文档。

---

## 2026-06-22 浏览器路由与窗口兼容性验证

### 已完成

- 将应用从本地 state 切页改为 `BrowserRouter + Routes`，直接访问 `/product-video`、`/image-video`、`/viral-remix`、`/digital-humans`、`/tasks`、`/assets` 均可显示对应页面。
- 保留现有侧边栏交互，点击导航时通过路由跳转，后续可承接后端动态菜单和权限映射。
- 修复 Ant Design 6 兼容性警告：`Alert` 使用 `title` 替代已弃用的 `message`。
- 浏览器验证结果：
  - 所有首批页面直达 URL 均显示对应页面内容。
  - 新标签页控制台错误为 0。
  - `1280x720`、`1366x768`、`1440x900`、`1536x864`、`1920x1080` 窗口矩阵无全局横向溢出。
  - `1024x720` 紧凑桌面与 `900x720` 窄屏兜底无白屏、无全局横向溢出。
  - 数字人弹窗在 `1280x720` 下可打开，关闭按钮可见，弹窗区域无横向溢出。
- 自动化验证再次通过：
  - `npm run typecheck`
  - `npm test`：3 个测试文件、8 个测试通过
  - `npm run build`
- 已执行 `openspec status --change add-figma-ui-shell-pages`，结果为 4/4 artifacts complete。
- 已确认 `openspec/changes/add-figma-ui-shell-pages/tasks.md` 无未勾选任务项。

### 当前判断

- `add-figma-ui-shell-pages` 的 UI 底座、首批页面、路由直达、依赖安装和基础窗口兼容性已达到本阶段验收标准。
- 构建仍有 Vite chunk size warning，属于首期未做路由级懒加载导致的包体提示，不影响本地运行和当前 UI 验收。
- 当前页面仍为 Mock 演示闭环，未接入真实账号体系、积分扣费、视频生成后端或素材上传后端。

### 下一步

1. 后续可开始一期任务 1：账号体系，建议拆成登录注册、实名认证/企业认证、企业空间/子账号权限、积分/协议/风控审计几个子任务。
2. 后续演示任务 2-4 可以分别基于当前 UI 页面继续接 mock 流程、API 契约和真实交互。
3. 构建包体优化可作为后续技术债任务，用路由懒加载拆分 Ant Design 相关 chunk。

---

## 2026-06-22 路由懒加载与构建拆包优化

### 已完成

- 将 `routeRegistry` 的页面组件改为 `React.lazy` 动态导入，路由页面会独立生成 chunk。
- 在 `App.tsx` 中增加 `Suspense` 路由加载兜底，避免页面切换期间出现空白。
- 在 `vite.config.ts` 中增加 `manualChunks`：
  - `react-vendor`：React、React DOM、React Router。
  - `antd-vendor`：Ant Design、Ant Design icons、rc-component 相关依赖。
  - `icon-vendor`：lucide-react。
  - `vendor`：其他第三方依赖。
- 增加 `LazyImage` 组件，统一图片缩略图的 `loading="lazy"` 与 `decoding="async"`。
- 素材库图片类素材增加 mock 缩略图，并使用 `LazyImage` 渲染；非图片素材仍使用图标占位。
- 增加测试覆盖：
  - 路由注册表必须使用 lazy 页面组件。
  - `LazyImage` 必须输出浏览器级懒加载属性。

### 当前判断

- 首页入口 chunk 已明显缩小，页面内容被拆为 `DashboardPage`、`ProductVideoPage`、`ImageVideoPage` 等独立 chunk。
- Ant Design 仍是最大 vendor chunk，这是组件库体量导致，已通过 `manualChunks` 独立隔离，后续可继续做组件级按需策略或替换重型组件。

### 下一步

1. 若继续优化首屏，可进一步把部分 Ant Design 重型组件按页面边界隔离。
2. 后续接真实素材库时，`thumbnailUrl` 可以替换成后端/CDN 返回地址，继续沿用 `LazyImage`。

---

## 2026-06-23 接口层封装与模块化 API

### 已完成
- 根据系统管理 Swagger 文档识别接口分组，先完成接口层实现，不改动页面业务逻辑。
- 新增 axios 请求封装：`src/utils/request.ts`，包含基础 `baseURL`、超时、数组参数序列化、Bearer Token 注入、`no-auth` 跳过鉴权、统一 Result 解包、二进制下载直返、登录过期事件预留。
- 新增认证存储工具：`src/utils/auth.ts`，集中管理 access token、refresh token 和登录过期清理。
- 按模块拆分 API 文件夹：`system/auth`、`system/users`、`system/roles`、`system/menus`、`system/depts`、`system/dicts`、`system/configs`、`system/notices`、`system/logs`、`customer/text-image-video`。
- 提取公共类型与公共方法：`src/api/shared/types.ts`、`src/api/shared/utils.ts`，统一分页类型、选项类型、ID 批量序列化、公开接口标记和下载配置。
- 为请求封装补充 TDD 测试：`src/utils/request.test.ts`，覆盖 token 注入、`no-auth` 移除、业务成功解包、二进制响应直返和业务失败提示。
- 根据要求给关键接口层内容补充中文注释，重点解释公共方法、认证接口和请求拦截器的设计意图。
- 新增依赖：`axios`、`qs`、`@types/qs`。

### 当前判断
- 接口层现在已经具备接入真实后端的基础能力；页面后续只需要从对应模块 import API 函数，不需要直接关心 axios 细节。
- Token 自动刷新当前只预留了过期事件和一次重试保护，真正 refresh-token 串联需要等登录状态模块落地后再补，避免现在过度设计。
- Swagger 中文描述在终端中存在编码显示问题，但接口路径、operation 和 schema 字段可以正常读取，当前实现以路径和字段名为准。

### 验证结果
- `npm run typecheck` 通过。
- `npm test` 通过：5 个测试文件、14 个测试。
- `npm run build` 通过。

### 下一步
1. 接入登录页时，把 `login` 返回的 token 写入 `AuthStorage`。
2. 接入动态菜单时，使用 `menuApi.getCurrentUserRoutes()` 映射到现有静态 route registry。
3. 接入文图生视频真实流程时，优先使用 `customerTextImageVideoApi` 替换当前 mock 数据源。
---

## 2026-06-23 动态菜单路由 OpenSpec 创建

### 已完成
- 已检查 `/api/v1/menus/routes`：当前前端 API 层已有 `src/api/system/menus/index.ts` 中的 `getCurrentUserRoutes()`，请求路径为 `GET /api/v1/menus/routes`。
- 当前仓库主要是前端工程，未发现后端 Controller/Service 对该接口的实现文件；本次先固定前端对接契约和任务。
- 已根据用户提供的返回结构确认接口是偏 Youlai/Vue 风格动态路由结构，核心字段包括 `path`、`component`、`redirect`、`name`、`meta.title`、`meta.icon`、`meta.hidden`、`meta.keepAlive`、`meta.alwaysShow`、`meta.params`、`children`。
- 已创建 OpenSpec change：`openspec/changes/connect-dynamic-menu-routes/`。
- 已补齐并通过 OpenSpec 状态检查：
  - `proposal.md`
  - `design.md`
  - `specs/dynamic-menu-routes/spec.md`
  - `tasks.md`
- 已明确关键安全边界：后端返回的 `component: "system/user/index"` 只能作为前端白名单映射线索，不能让 React 前端直接按该字符串动态 import 组件。

### 当前判断
- `/api/v1/menus/routes` 在前端“已有调用入口”，但还没有完成动态菜单、动态路由和刷新恢复的应用级接入。
- 动态路由对接应采用“后端菜单元数据 + 前端静态 RouteKey/component 注册表”的模型，避免后端字符串直接控制前端组件加载。
- 后端示例里的 `children` 为 `"string"`，真实接入时前端转换器必须做容错归一化，避免接口字段异常导致白屏。
- 该 change 已经具备进入实现阶段的前置文档条件。

### 下一步
1. 用户确认后，可开始执行 `connect-dynamic-menu-routes`。
2. 实现时优先修正 `src/api/system/menus/types.ts` 动态路由类型。
3. 新增后端 `component` 到前端 `RouteKey` 的白名单映射和动态路由转换器。
4. 用 React Query 接管 `/api/v1/menus/routes`，并接入应用初始化、侧边栏菜单和刷新恢复。
5. 补充转换器与刷新恢复测试，最后运行 `npm run typecheck`、`npm test`、`npm run build`。

---

## 2026-06-23 路由守卫与登录跳转排查

### 已完成
- 已检查路由守卫实现：`src/app/router/routeGuards.ts`。
- 已检查路由注册表和登录页：`src/app/router/routeRegistry.tsx`、`src/pages/LoginPage.tsx`。
- 已检查应用路由入口：`src/app/App.tsx`。
- 已检查登录失效处理：`src/utils/auth.ts`、`src/utils/request.ts`。
- 已运行针对性测试：
  - `npm test -- src/app/router/routeGuards.test.ts src/pages/LoginPage.test.tsx`
  - 测试结果 2 个测试文件、6 个测试全部通过。

### 当前判断
- 当前代码里“未登录”会在 `resolveRouteAccess()` 中返回 `unauthenticated`，但 `App.tsx` 没有消费这个结果，所以受保护页面并不会因为未登录自动跳转到 `/login`。
- 当前代码里“登录失效”会调用 `redirectToLogin()`，该函数只会清空 token 并派发 `auth:expired` 事件；当前仓库内没有发现监听该事件并执行 `navigate('/login')` 的逻辑，因此登录失效后也不会自动跳转到登录页。
- 也就是说：目前项目已经有登录页、受保护路由元数据和登录失效事件，但“守卫判定 -> 真实跳转”这段链路还没有接上。

### 下一步
1. 在 `App.tsx` 或单独的受保护路由入口中接入 `resolveRouteAccess()`。
2. 未登录访问 `requiresAuth: true` 路由时，跳转到 `/login?redirect=<当前路径>`。
3. 监听 `auth:expired` 事件，收到后跳转到登录页并保留来源路径。
4. 补充路由跳转级测试，覆盖未登录访问、登录后回跳、登录失效跳转三个场景。

### 本轮补充
- 已将“未登录访问受保护页跳转登录页”“登录失效统一跳转登录页”“登录后按 redirect 回跳”补入 `openspec/changes/connect-dynamic-menu-routes/tasks.md`。
- 已同步把对应的测试验证任务补入 OpenSpec，避免后续实现时只修逻辑、不补跳转测试。

---

## 2026-06-23 登录页参考实现与本项目适配

### 已完成
- 已读取参考项目登录页目录：`F:\AAA_AI_aisperce\ai-spase\ai-application\application-digital-human\vue3-element-admin\src\views\login`。
- 已提取参考登录页核心交互结构：品牌区、登录卡片、账号密码、验证码、记住我、忘记密码、扫码登录、统一认证入口。
- 已按本项目技术栈重建登录页：`src/pages/LoginPage.tsx`，使用 React + TypeScript + Ant Design + TailwindCSS + lucide-react。
- 登录页视觉已适配 AI-Hit-Factory 暗色 SaaS 工作台风格，保留紫橙品牌色、AI 内容生产平台文案和合规/权限/AI 生产卖点。
- 已接入现有认证 API：`getCaptcha()`、`login()`，登录成功后由页面调用 `AuthStorage.setTokenPair()` 写入 token。
- 已补充验证码服务不可用时的本地演示验证码兜底，避免无后端环境下登录页空白。
- 已新增 `/login` 路由，并通过 `hideInMenu` 让登录页独立全屏展示，不进入工作台侧边栏菜单。
- 已修正请求客户端默认导出类型，使 `request.get<T>()`、`request.post<T>()` 在 TypeScript 中表现为业务数据解包后的 `Promise<T>`。
- 已新增登录页测试：`src/pages/LoginPage.test.tsx`。
- 已补充测试环境 `window.matchMedia` mock，兼容 Ant Design 在 jsdom 下的响应式能力。

### 当前判断
- 本次没有照搬 Vue + Element Plus 代码，而是复用其成熟登录体验结构，并按当前 React 项目重新实现。
- 登录页当前完成的是账号密码登录基础闭环；短信登录、注册、忘记密码真实流程、扫码登录和统一认证仍是后续扩展入口。
- 登录接口层只负责请求，token 写入放在页面/会话边界处理，这样能避免 API Client 暗中修改全局状态，后续接用户状态和动态菜单时更清晰。

### 验证结果
- TDD RED：`npm test -- src/pages/LoginPage.test.tsx` 首次失败，原因是 `LoginPage` 尚不存在。
- 登录页单测通过：`npm test -- src/pages/LoginPage.test.tsx`。
- 路由与登录页相关测试通过：`npm test -- src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts src/pages/LoginPage.test.tsx`。
- 类型检查通过：`npm run typecheck`。
- 全量测试通过：`npm test`，6 个测试文件、15 个测试。
- 浏览器视觉检查通过：`http://127.0.0.1:5173/login` 在桌面视口独立全屏展示，无工作台侧边栏包裹。
- 移动端视口检查通过：`390x844` 下表单在首屏下半部可见，无文字遮挡、按钮重叠或白屏问题。
- 生产构建通过：`npm run build`。

### 下一步
1. 启动本地 dev server，浏览器检查 `/login` 在常见窗口尺寸下的视觉效果。
2. 后续接入真实后端后，确认验证码返回字段与统一 Result 解包是否完全一致。
3. 在账号体系 change 中继续拆分注册、忘记密码、短信登录和微信/扫码登录真实流程。

---

## 2026-06-23 数字人任务创建与文图生视频接口对接调研

### 已完成
- 已确认本次改动基于当前前端工程：`React 19 + Vite + TypeScript + Ant Design + React Query + Axios`。
- 已扫描现有相关页面与模块：
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/ImageVideoPage.tsx`
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
- 已确认仓库内已经存在“文图生视频”基础接口封装，当前能力包括：
  - 任务分页查询 `getTextImageVideoTaskPage`
  - 创建任务 `createTextImageVideoTask`
  - 任务详情 `getTextImageVideoTaskDetail`
  - 删除任务 `deleteTextImageVideoTask`
- 已通过浏览器访问用户端 Swagger 页面，并定位到“文图生视频”接口分组入口；当前已确认 Swagger 可访问，后续将继续展开具体 operation、请求体与返回体字段。
- 已识别当前页面现状：
  - `ImageVideoPage` 仍以本地交互假数据为主，尚未接入真实创建任务/轮询结果/任务记录联动。
  - `DigitalHumansPage` 当前是纯前端 mock 管理页，尚未与真实“数字人任务创建”业务链路打通。
  - 公共任务能力（创建、轮询、状态展示、结果预览、错误处理）尚未抽离为可复用模块。

### 当前判断
- 本次需求本质不是“只接一个按钮”，而是“文图生视频任务创建链路 + 任务状态流转 + 页面补全 + 公共能力抽取”的组合任务。
- 现有 `text-image-video` API 封装只是第一层请求函数，距离页面可用还缺少：
  - 面向表单的请求参数适配层
  - 创建后任务状态刷新/轮询机制
  - 任务列表与详情展示的公共状态映射
  - 上传图片、预览、异常提示、空状态等页面级体验补全
- 如果数字人页面最终也要复用“创建异步任务 -> 查询进度 -> 展示结果”的模式，应该抽公共 hook / status helper，而不是在单页里重复写一套。

### 下一步
1. 继续在 Swagger 中展开“文图生视频”具体接口，核对真实请求字段、返回字段与当前 `types.ts` 是否一致。
2. 对照现有页面，梳理最小可落地业务闭环：创建任务、查询任务、结果展示、任务记录跳转。
3. 输出 1-2 套前端对接方案对比，并向用户确认关键业务分歧点后再进入实现。

## 2026-06-23 动态菜单路由接入第一阶段

### 已完成
- 开始执行 OpenSpec change：`connect-dynamic-menu-routes`，并按任务清单推进实现。
- 确认前端已存在 `/api/v1/menus/routes` 调用入口：`src/api/system/menus/index.ts#getCurrentUserRoutes()`。
- 修正动态路由返回类型：`src/api/system/menus/types.ts` 里的 `children` 现在兼容数组、空值和异常值，避免接口异常时直接打崩前端。
- 新增动态路由转换层：`src/app/router/dynamicRoutes.ts`。
  - 建立后端 `component` 到前端 `RouteKey` 的白名单映射。
  - 递归归一化 `children`。
  - 过滤未知组件，避免基于后端字符串做任意动态 import。
  - 处理 `meta.hidden`、`meta.keepAlive`、`meta.alwaysShow`、`meta.params`、`redirect`。
  - 识别外链 `redirect`，并从 React Router 内部路由注册中排除。
- 扩展前端导航类型：`src/app/router/routeTypes.ts` 新增动态菜单/外链菜单状态模型。
- 新增 React Query hook：`src/app/router/useCurrentUserRoutes.ts`，通过 Query 统一加载并转换当前用户菜单路由。
- 应用入口接入动态路由初始化：
  - `src/app/main.tsx` 接入 `QueryClientProvider`。
  - `src/app/App.tsx` 接入登录态判断、动态菜单加载、未登录跳转、登录失效监听、403/404 渲染和受保护路由刷新恢复。
- 侧边栏菜单改为消费动态菜单结果：`src/app/layouts/DashboardLayout.tsx` 不再直接依赖静态 `routeRegistry` 生成菜单。
- 更新 `.gitignore`，新增忽略 `.playwright-mcp/`，避免浏览器调试临时文件进入提交。
- 按 TDD 完成并跑通针对性测试：
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/app/App.test.tsx`

### 当前判断
- 现在已经打通了“登录后加载动态菜单”和“未登录/登录失效跳登录页”的主链路。
- 当前仍保留静态 `routeRegistry` 作为安全白名单与 fallback，符合这次 change 的设计边界。
- `tasks.md` 中与“类型、转换器、初始化、登录跳转、针对性测试”直接相关的小项已更新为完成。

### 验证结果
- `npm test -- src/app/router/dynamicRoutes.test.ts src/app/App.test.tsx` 通过。

### 下一步
1. 跑完整 `npm run typecheck`、`npm test`、`npm run build`。
2. 补做浏览器/手动验证：动态菜单渲染、刷新恢复、未登录跳登录、登录失效跳登录、403/404、隐藏菜单、外链跳转。
3. 继续完成剩余 OpenSpec 任务，尤其是查询失效策略和浏览器验证记录。

### 本阶段补充验证
- `npm run typecheck` 通过。
- `npm test` 通过，当前共 8 个测试文件、23 个测试全部通过。
- `npm run build` 通过。
- 当前构建存在 Vite 警告：`vendor -> react-vendor -> vendor` 循环 chunk 提示；这不是构建失败，但后续可以单独优化 `manualChunks` 规则。

## 2026-06-23 App 路由初始化备注补充

### 已完成
- 在 `src/app/App.tsx` 中为动态路由初始化关键节点补充了中文备注。
- 重点说明了：
  - `publicRoutes` 使用 `useMemo` 固定引用的原因。
  - `fallbackRouteState` 作为动态菜单失败/未返回时的守卫兜底作用。
  - `candidateRoutes` 和 `availableRoutes` 分离的原因，避免未登录访问受保护页时误判成 404。
  - `auth:expired` 事件跳转时为什么要保留 `redirect`。
  - 隐藏路由命中时为什么侧边栏高亮要回退到可见路由。

### 当前判断
- 这次补的是“决策注释”，不是表面描述，后面你再看 `useMemo` 和候选路由判断时会更顺。
