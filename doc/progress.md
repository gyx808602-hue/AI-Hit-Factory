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

## 2026-06-23 Git 提交失败排查

### 已完成
- 已检查 Git 用户配置，`user.name` 和 `user.email` 均已存在，不是身份信息缺失导致。
- 已检查 `.git/hooks`，当前只有 sample 文件，没有真实启用的提交钩子阻塞提交。
- 已执行：
  - `git commit --dry-run`
  - `git diff --cached --stat`
  - `git status --short`
- 已确认 Git 返回结果为：
  - `nothing to commit, working tree clean`

### 当前判断
- 当前不是“git 提交不上”，而是“当前仓库已经没有可提交的内容”。
- Git 视角下工作区和暂存区都为空，因此执行提交时会直接拒绝生成新提交。
- 同时当前分支状态为：`Your branch is ahead of 'origin/main' by 1 commit.`，说明你本地已经有一个尚未推送的提交。

### 下一步
1. 如果你以为自己改了代码，先确认文件是否真的保存到了当前仓库目录。
2. 如果改动已经被提交了，需要的是 `git push`，不是再次 `git commit`。
3. 如果你想强制制造一个空提交，只能显式执行 `git commit --allow-empty -m "..."`，但正常开发不建议这样做。
---

## 2026-06-23 文件上传接口接入调研

### 已完成
- 已扫描当前前端 API 封装模式：
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
  - `src/api/shared/types.ts`
  - `src/api/shared/utils.ts`
- 已确认项目当前统一使用 `request.get/post/delete` 风格封装接口，请求层已有统一 `baseURL`、鉴权和结果解包能力。
- 已检索仓库内上传相关实现，当前只有页面层 `Upload/Upload.Dragger` 交互占位，没有成型的“文件上传 API 封装”。
- 已尝试读取你提供的 Swagger 文档与 `api-docs`：
  - `http://192.168.110.145:8000/doc.html#/系统管理/08.AIGC-文件上传/uploadAudio`
  - `http://192.168.110.145:8000/v3/api-docs`
  - `http://192.168.110.145:8000/v2/api-docs`
- 当前上述远程文档访问均超时，尚未拿到 `uploadAudio` 的精确请求字段与返回结构。

### 当前判断
- 现在已经具备“按项目现有风格接入上传接口”的代码上下文，但还缺少最关键的后端接口契约。
- 如果不先确认 `uploadAudio` 的请求方式、表单字段名和返回 `data` 结构，就会把接口写成拍脑袋版本，后续联调成本反而更高。

### 下一步
1. 向用户确认 `uploadAudio` 的接口契约，至少拿到请求字段名和返回示例。
2. 基于契约给出 1-2 种前端封装方案并推荐最小实现。
3. 用户确认后再落地 API 文件、类型定义和必要的工具函数。
---

## 2026-06-23 AIGC 文件上传接口接入

### 已完成
- 已根据用户提供的 OpenAPI 契约确认 3 个上传接口：
  - `POST /api/aigc/uploads/audio`
  - `POST /api/aigc/uploads/image`
  - `POST /api/aigc/uploads/video`
- 已确认三者统一使用 `file` 作为上传字段名，统一返回 `url`、`objectKey`、`originalFilename`。
- 已新增上传 API 模块：
  - `src/api/aigc/uploads/index.ts`
  - `src/api/aigc/uploads/types.ts`
- 已新增上传 API 测试：
  - `src/api/aigc/uploads/index.test.ts`
- 已补充共享上传工具：
  - `src/api/shared/utils.ts`
  - 统一封装 `FormData`
  - 统一提供上传请求配置
- 已修正请求层对 `FormData` 的兼容：
  - `src/utils/request.ts`
  - 上传时移除默认 JSON `Content-Type`，交给浏览器自动补 multipart boundary
- 已补充请求层回归测试：
  - `src/utils/request.test.ts`

### 当前判断
- 现在页面层已经可以直接调用：
  - `uploadAudio(file)`
  - `uploadImage(file)`
  - `uploadVideo(file)`
- 这次实现保持了和现有 `system/auth`、`system/users` 一致的“直接导出函数”风格，没有额外引入新的 API 工厂模式。
- 请求层已经具备上传能力，后续别的上传接口也可以直接复用这套模式，不需要重复修 `FormData` 兼容。

### 验证结果
- `npm test -- src/utils/request.test.ts src/api/aigc/uploads/index.test.ts` 通过
- `npm run typecheck` 通过

### 下一步
1. 在具体页面接入 `Upload` / `Upload.Dragger` 时，上传成功后直接消费返回的 `url` 和 `objectKey`。
2. 如果后端后续补充文件大小、格式错误码约定，可以再把页面级错误提示细化。
3. 如需预览或回显，优先保存 `url` 用于展示，保存 `objectKey` 用于业务侧后续追踪或重查。
---

## 2026-06-23 上传接口页面接入

### 已完成
- 已扫描项目内真实需要上传接口的页面入口，确认优先接入范围为：
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/ProductVideoPage.tsx`
- 已在 `ViralRemixPage.tsx` 接入：
  - 爆款源视频上传 -> `uploadVideo`
  - 换商品模式商品图上传 -> `uploadImage`
- 已在 `ImageVideoPage.tsx` 接入：
  - 图片上传 -> `uploadImage`
  - 上传成功后回显已上传文件名
- 已在 `ProductVideoPage.tsx` 接入：
  - 商品图上传 -> `uploadImage`
  - 上传成功后回显已上传文件名
- 已补充页面集成测试：
  - `src/pages/upload-integration.test.tsx`
- 已补充测试环境 `ResizeObserver` mock：
  - `src/test/setup.ts`

### 当前判断
- 当前三处上传入口已经不是静态占位，而是能真正调用后端上传 API 的联调入口。
- 这次实现仍然保持“页面只关心上传结果”的边界，上传成功后先消费 `originalFilename/url` 做最小回显，没有提前把素材库归档、任务创建、结果预览等业务混进来。
- 这样做的好处是上传链路已经打通，但业务后续仍可继续分步接入，不会一次把页面状态复杂度拉爆。

### 验证结果
- `npm test -- src/pages/upload-integration.test.tsx` 通过
- `npm run typecheck` 通过

### 下一步
1. 把 `ImageVideoPage` 上传后的图片 `url` 真正接入 `createTextImageVideoTask`，完成“上传图片 -> 创建图文视频任务”闭环。
2. 为 `ViralRemixPage` 和 `ProductVideoPage` 增加上传失败提示与文件格式/大小前端预校验。
3. 若后续需要素材复用，再考虑把上传成功结果接入素材库或任务记录，而不是现在提前耦合。
---

## 2026-06-23 AIGC 文件上传接口实现

### 已完成
- 已根据你提供的 OpenAPI 契约确认 3 个上传接口：
  - `POST /api/aigc/uploads/audio`
  - `POST /api/aigc/uploads/image`
  - `POST /api/aigc/uploads/video`
- 已确认三类上传统一使用 `file` 作为表单字段名，返回统一 `UploadRespVO`：
  - `url`
  - `objectKey`
  - `originalFilename`
- 已补齐上传接口实现相关文件：
  - `src/api/aigc/uploads/index.ts`
  - `src/api/aigc/uploads/types.ts`
  - `src/api/aigc/uploads/index.test.ts`
- 已补充共享上传能力：
  - `src/api/shared/utils.ts` 增加 `FormData` 组装工具
- 已修正请求层上传兼容：
  - `src/utils/request.ts`
  - `src/utils/request.test.ts`
- 已补充 API 聚合导出：
  - `src/api/index.ts`

### 当前判断
- 当前接口层已经具备直接给页面接入的能力，页面只需要传入 `File` 即可，不需要再手写 `FormData`。
- 这次真正修掉的根因不是“少写了上传方法”，而是 `request.ts` 默认给 `post` 请求带 JSON 头，上传场景下会干扰 `multipart/form-data`。
- 现在请求层已经针对 `FormData` 做了兼容，避免上传请求错误落到 JSON 或 urlencoded 语义。

### 验证结果
- 定向测试通过：
  - `npm test -- src/utils/request.test.ts src/api/aigc/uploads/index.test.ts`
- 类型检查通过：
  - `npm run typecheck`

### 下一步
1. 在具体页面里接入 `uploadAudio`、`uploadImage`、`uploadVideo`。
2. 页面层补充格式、大小和上传失败提示，避免把后端校验压力全压到接口返回。
3. 如需图片/音频/视频上传进度条，可在后续给上传 API 增加 `onUploadProgress` 配置透传。
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

---

## 2026-06-23 基于用户端文档创建文图生视频 OpenSpec 任务

### 已完成
- 已读取 `用户端.md` 中“文图生视频”接口说明，并确认当前前端已有基础 API 模块：
  - `GET /api/v1/customer/text-image-video/tasks`
  - `POST /api/v1/customer/text-image-video/tasks`
  - `GET /api/v1/customer/text-image-video/tasks/{id}`
  - `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- 已检查现有页面与路由现状：
  - `src/pages/ImageVideoPage.tsx` 仍为演示态入口页
  - `src/pages/TaskRecordsPage.tsx` 仍为 mock 任务记录页
  - 当前缺少文图生视频专属任务列表页与详情页
- 已新建 OpenSpec change：`openspec/changes/add-text-image-video-task-flow/`
- 已补齐该 change 的完整 artifacts：
  - `proposal.md`
  - `design.md`
  - `specs/text-image-video-task-flow/spec.md`
  - `tasks.md`

### 当前判断
- 这次更适合单独创建 `add-text-image-video-task-flow`，而不是塞进已有的“爆款改编”或“动态路由” change。
- 文图生视频的核心不是单页表单，而是“异步任务闭环”，所以 OpenSpec 里已经按“入口页 + 列表页 + 详情页 + 最小公共能力抽取”的方向拆解。
- 当前 spec 没有过度扩张到数字人真实任务，只预留了后续复用状态映射和表单适配的空间，符合 KISS 原则。

### 下一步
1. 若你确认这个 OpenSpec 拆分方向没问题，我就可以继续按 `tasks.md` 直接进入实现。
2. 实现前会先核对现有 `text-image-video` 类型定义与 `用户端.md` 的分页/字段细节是否完全一致。
3. 每完成一个实现小阶段，我会继续更新 `doc/progress.md`。

### 本轮实现补充
- 已开始执行 `add-text-image-video-task-flow`。
- 已完成前置梳理任务 `1.1 ~ 1.3`，确认当前缺口主要在三处：
  - `ImageVideoPage` 仍是演示态
  - 缺少文图生视频任务列表页与详情页
  - `TaskRecordsPage` 还未接真实任务回看入口
- 已完成 API 与类型层任务 `2.1 ~ 2.4`：
  - 修正 `src/api/customer/text-image-video/types.ts`
  - 修正 `src/api/customer/text-image-video/index.ts`
  - 新增 `src/api/customer/text-image-video/index.test.ts`
- 当前接口层已对齐 `用户端.md` 中文图生视频的四个接口，并支持注入测试 client，和现有项目 API 模块风格保持一致。

### 当前判断
- 文图生视频接口当前的分页结构与共享 `PageData` 是兼容的，所以这一步不需要额外再造一层复杂分页适配。
- 真正的工作量会集中在页面层：任务创建后的跳转、任务列表、任务详情和状态展示，需要一并补上。

### 下一步
1. 新增 `src/features/text-image-video` 领域支撑层，先收敛状态映射和表单适配。
2. 用 TDD 改造 `ImageVideoPage`，把本地假生成替换成真实创建任务并跳详情。
3. 再补任务列表页、详情页和路由接入。

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
## 2026-06-23 登录页系统出错排查与降噪修复
### 已完成
- 已检查 `src/pages/LoginPage.tsx`、`src/api/system/auth/index.ts`、`src/utils/request.ts` 与 `.env.development`
- 已确认报错触发点是登录页加载阶段自动调用 `GET /api/v1/auth/captcha`
- 已直接验证 `VITE_APP_BASE_API=http://192.168.110.145:3000` 当前返回的不是后端 JSON，而是一个前端 HTML 页面
- 已确认“系统出错”的根因是请求层期望 `ApiResult`，但实际收到 HTML，导致响应拦截器拿不到业务 `code`
- 已完成前端最小降噪修复：
  - `src/utils/request.ts`：新增 `silentError` 配置并按请求粒度控制全局报错
  - `src/api/shared/utils.ts`：新增 `silentError()` 公共方法
  - `src/api/system/auth/index.ts`：让 `getCaptcha()` 静默失败并继续走登录页 fallback 验证码
  - `src/utils/request.test.ts`：新增静默错误测试

### 当前判断
- 这次代码修复解决的是“误导性全局报错噪音”，不是后端地址根因本身
- 当前登录页在验证码接口失败时，应继续显示本地 fallback 验证码，不再额外刷出“系统出错”
- 真正恢复联调，仍需要把 `.env.development` 中的 `VITE_APP_BASE_API` 改成真实后端网关地址
- 从当前证据看，`192.168.110.145:3000` 更像另一个前端开发服务，不像承载 `/api/v1/auth/captcha` 的后端服务

### 验证结果
- `npm test -- src/utils/request.test.ts` 通过
- `npm run typecheck` 通过

### 下一步
1. 确认真实后端网关地址或端口，修正 `.env.development` 中的 `VITE_APP_BASE_API`
2. 重新验证 `GET /api/v1/auth/captcha` 与 `POST //api/v1/customer/auth/login`
3. 如有需要，继续逐字段对齐后端真实返回结构与前端 `CaptchaInfo` / `AuthenticationToken` 类型

## 2026-06-23 数字人视频接口文档识别补充

### 已完成
- 已确认本次目标不是单纯“识别一个链接”，而是要从 Swagger 文档里找到“创建数字人视频任务”所需的真实请求字段。
- 已扫描当前前端相关文件：
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/DigitalHumansPage.tsx`
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
- 已确认当前前端 `TextImageVideoCreateRequest` 只有：
  - `imageUrls: string[]`
  - `prompt: string`
  - `model?: string`
- 已判断这份前端类型还没有覆盖你提到的“数字人视频下拉框”语义，因此不能直接按现有类型开做，否则大概率会把显示文案误当成真实提交值。

### 当前判断
- 这次真正关键的是先拿到 Swagger 页面里 create 接口的真实字段、字段类型、必填规则，以及“数字人视频”下拉框的枚举值。
- 只有拿到这个契约，前端才能决定是：
  - 扩展现有 `text-image-video` 请求类型；
  - 还是新增一个更贴近“数字人视频任务”的独立 API 封装。

### 下一步
1. 通过浏览器直接读取 Swagger 页里的 create 接口表单结构。
2. 核对“数字人视频”下拉框对应的字段名、枚举值和值类型。
3. 输出前端接入方案，再决定是否开始改代码。

## 2026-06-23 数字人视频文档访问阻塞补充

### 已完成
- 已验证内网目标 `192.168.110.145:8000` 的 TCP 8000 端口可连通，说明不是纯粹的端口不可达问题。
- 已分别尝试以下方式读取 Swagger/OpenAPI 文档：
  - PowerShell `Invoke-WebRequest` 访问 `doc.html`
  - `curl.exe` 访问 `doc.html`
  - 应用内浏览器直接打开 `doc.html#/系统管理/08.AIGC-数字人视频/create`
- 已确认当前环境下上述方式都没有成功拿到页面内容或接口定义，表现为超时或无法建立可用页面上下文。

### 当前判断
- 现在的阻塞点不是前端不会接，而是自动化环境暂时拿不到你内网 Swagger 页的真实 DOM / OpenAPI 数据。
- 在没有接口真实字段前，继续写代码风险很高，因为容易把：
  - 页面展示文案
  - 下拉框 label
  - 实际提交 value
  - 后端 DTO 字段名
  混成一套，最终导致请求体不对。

### 下一步
1. 优先让用户提供该 create 接口展开后的截图，特别是请求参数区和下拉框选项区。
2. 如果能提供 `curl` / 请求示例 / Swagger 的 Request URL 与 Request Body 示例，也可以直接反推出前端类型。
3. 拿到真实字段后，再输出“复用现有 `text-image-video`”还是“新增数字人视频 API 模块”的对接方案。

## 2026-06-23 Swagger 链接可访问性复核

### 已完成
- 已复核 `http://192.168.110.145:8000/doc.html#/系统管理/08.AIGC-数字人视频/create` 的基础可访问性。
- 已确认 `192.168.110.145:8000` 端口可连通：
  - `TcpTestSucceeded : True`
- 已确认 `doc.html` 能返回 HTTP 200。
- 已确认返回内容不是报错页，而是 Knife4j 前端壳页面，静态 HTML 大约 `1903` 字节，包含：
  - `webjars/js/app.c31badf5.js`
  - `webjars/js/chunk-vendors.d51cf6f8.js`
  - `div id=\"app\"`
- 已抓到页面主脚本 `webjars/js/app.c31badf5.js`，说明文档前端静态资源也能正常访问。

### 当前判断
- 现在可以明确说：这个 Swagger/Knife4j 链接“页面入口本身是可以访问的”。
- 但这还只证明“文档前端壳可打开”，不等于“具体接口数据已经成功渲染出来”。
- 如果后续要继续自动识别 `create` 接口里的字段，下一步应继续验证：
  - Knife4j 运行时实际请求的 `swagger-resources` / `api-docs` 地址；
  - 这些资源是否返回接口分组与 `08.AIGC-数字人视频/create` 的真实 schema。

### 下一步
1. 继续从 Knife4j 运行脚本中定位它实际使用的资源地址。
2. 读取对应 `swagger-resources` 或 `api-docs` 数据，确认 create 接口请求体。
3. 拿到 schema 后再回填前端 DTO 和表单提交逻辑。

## 2026-06-23 登录页验证码返回结构核对
### 已完成
- 已扫描登录页验证码链路：
  - `src/pages/LoginPage.tsx`
  - `src/api/system/auth/index.ts`
  - `src/api/system/auth/types.ts`
  - `src/utils/request.ts`
- 已确认当前页面展示层使用：
  - `captcha.captchaBase64` 作为 `<img src>`
  - `captcha.captchaId` 作为登录提交参数
- 已确认你刚提供的真实返回示例：
  - `captchaBase64: "data:image/png;base64,..."`
  - `captchaId: "6ee84d8a508343a5a69850b482c8eb7d"`
  与当前前端展示模型是兼容的
- 已复核本地接口文档 `用户端.md`，发现文档中仍存在历史命名：
  - 获取验证码返回字段写的是 `captchaId`
  - 登录请求字段也写的是 `captchaId`
- 已确认当前 `.env.development` 指向：
  - `VITE_APP_BASE_API='http://192.168.110.145:8000'`

### 当前判断
- 现在的核心矛盾已经不是“验证码图片怎么显示”，因为前端对 `data:image/png;base64,...` 这种格式天然兼容。
- 真正需要警惕的是“字段命名漂移”：
  - 真实后端现在看起来使用 `captchaId`
  - 本地文档残留的是 `captchaId`
  - 当前前端提交的是 `captchaId`
- 从第一性原理看，这就像前端表单字段名和后端 DTO 属性名不一致：页面能渲染，不代表登录请求一定能过。验证码本身只是展示资源，真正影响校验的是“后端生成验证码时发给你的标识”和“你登录时再回传的标识”是否完全同名同值。

### 下一步
1. 优先按“真实接口返回”对齐前端类型和登录提交流程，不再以旧文档里的 `captchaId` 作为准绳。
2. 最小改法是让前端兼容 `captchaId`，必要时额外兼容旧字段 `captchaId`，避免联调期间新旧后端不一致导致阻塞。
3. 在动代码前，先确认你希望采用“只对齐新接口”还是“新旧字段双兼容”方案。

## 2026-06-23 登录页验证码图片不显示根因排查
### 已完成
- 已直接请求真实接口 `GET http://192.168.110.145:8000/api/v1/auth/captcha`
- 已确认后端真实返回为：
  - `code: "00000"`
  - `data.captchaId`
  - `data.captchaBase64: "data:image/png;base64,..." `
- 已确认 `captchaBase64` 本身是完整的 Data URL，而不是裸 base64，因此从浏览器 `<img src>` 规则看可以直接渲染
- 已复核前端请求解包逻辑：
  - `src/utils/request.ts` 当前仅把 `code === "200"` 视为成功
  - 真实后端成功码是 `00000`
- 已复核登录页刷新逻辑：
  - `src/pages/LoginPage.tsx` 中 `refreshCaptcha()` 只有在 `getCaptcha()` resolve 时才会 `setCaptcha(nextCaptcha)`
  - 一旦请求层把 `00000` 判成失败，就会直接进入 `catch`，回退到本地 fallback 验证码

### 当前判断
- 这次现象不是“有数据但 `<img>` 不认”，而是“后端数据在请求层就被拦截成失败，所以页面根本没吃到那份数据”。
- 从调用链看：
  - 后端返回了真实验证码图片
  - `request.ts` 把 `00000` 误判成失败
  - `getCaptcha()` reject
  - `LoginPage.refreshCaptcha()` 进入 `catch`
  - 页面显示的是 fallback，而不是接口返回图
- 这和前端/后端协作里很常见的“业务成功码约定不一致”是同一类问题。类比前端组件通信，就是父组件明明把数据传下来了，但中间适配层把它当异常丢掉了，子组件自然拿不到。

### 下一步
1. 把请求层成功码从单一 `200` 调整为兼容当前后端的 `00000`
2. 同步补一条回归测试，覆盖 `ApiResult.code === "00000"` 的成功解包
3. 再回看登录接口是否也使用同一成功码，避免验证码修好但登录仍被误判失败

## 2026-06-23 验证码成功码兼容修复
### 已完成
- 已按 TDD 最小闭环补充请求层回归测试：
  - `src/utils/request.test.ts`
  - 新增用例覆盖 `code === "00000"` 时应正常解包 `data`
- 已先执行红灯验证，确认旧实现会把 `00000` 误判为失败
- 已最小修改请求层成功码判断：
  - `src/utils/request.ts`
  - 保留原有 `200`
  - 新增兼容 `00000`
  - 抽出 `isSuccessfulBusinessCode()`，避免后续散落硬编码

### 当前判断
- 现在登录页刷新验证码时，真实后端返回的 `captchaBase64` 已经可以穿过请求层，到达 `LoginPage` 的 `captcha` 状态。
- 这次修的是“统一响应适配层”，收益不只在验证码，凡是同样返回 `code: "00000"` 的接口都会一起受益。
- 从后端原理看，这一层就像前端的公共响应适配器；如果这里把成功码判错，下面所有页面组件都会表现得像“接口失败”，即使网络和数据本身都没问题。

### 验证结果
- `npm test -- src/utils/request.test.ts` 通过
- `npm run typecheck` 通过

### 下一步
1. 刷新登录页，确认真实验证码图片已经显示，不再回退到本地 fallback
2. 实测一次登录接口，确认它也使用 `00000` 成功码并能正常进入系统
3. 如有必要，再补一条 `LoginPage` 级别测试，验证验证码图片使用的是接口返回图而不是 fallback

## 2026-06-23 登录成功跳转行为确认
### 已完成
- 已复核登录页提交成功后的跳转链路：
  - `src/pages/LoginPage.tsx`
  - `src/app/App.tsx`
- 已确认登录成功后会执行本地路由跳转，而不是停留在登录页

### 当前判断
- 登录成功后，`handleSubmit()` 会先写入 token，再执行 `navigate(redirectPath, { replace: true })`
- `redirectPath` 的来源是：
  - 如果登录页 URL 上带有 `?redirect=...`，就跳回用户原本想访问的页面
  - 如果没有，就默认跳到 `/`
- 这属于前端路由跳转，原理上类似单页应用里 `router.push`，不会整页刷新

### 下一步
1. 如需进一步确认联调结果，可直接实测一次真实登录接口
2. 如需兜底验证，可补登录成功后的页面跳转测试

## 2026-06-23 首次登录改密需求识别
### 已完成
- 已扫描当前认证相关文件：
  - `src/pages/LoginPage.tsx`
  - `src/api/system/auth/index.ts`
  - `src/api/system/auth/types.ts`
- 已在 `用户端.md` 中确认存在用户端改密接口：
  - `POST /api/v1/customer/auth/change-password`
  - 契约语义：验证旧密码 + 重置密码 + token 失效
- 已在文档中识别到登录态返回字段里存在：
  - `needChangePassword`，语义为“是否需要改密：1=是，0=否”

### 当前判断
- 这次需求本质不是“再加一个改密页面”，而是给登录链路补一条“首次登录必须改密”的分支。
- 从第一性原理看，这是一条认证状态机分支：
  - 普通用户：登录成功 -> 写入 token -> 进入系统
  - 首登用户：登录成功但命中 `needChangePassword=1` -> 进入改密流程 -> 改密成功后 token 失效 -> 重新登录
- 当前代码里还没有承接这个状态的 UI、API 类型和 token 失效后的前端收口逻辑。

### 下一步
1. 先确定首登改密的交互形态与最小状态流转
2. 再给出 1-2 套接入方案对比
3. 待方案确认后再进入实现

## 2026-06-23 首登改密交互确认
### 已完成
- 已根据 `用户端.md` 复核两段关键契约：
  - 登录请求字段：`phone + password + captchaId + captchaCode`
  - 客户改密字段：`oldPassword + newPassword + confirmPassword`
- 已结合你给出的真实登录返回，确认需要新增一个特殊登录结果分支：
  - `code: "C10001"`
  - `msg: "请先修改初始密码"`
  - `data` 中仍然会带 `accessToken / refreshToken / tokenType / expiresIn`
- 已确认本次交互方案不是跳转独立页，而是：
  - 命中 `C10001` 后，将当前登录表单切换成重置密码表单

### 当前判断
- 这意味着登录接口不再只有“成功 / 失败”两态，而是三态：
  - 普通成功：进入系统
  - 首登待改密：切换表单
  - 普通失败：继续停留登录表单
- 从认证原理看，`C10001` 更像“受限成功”而不是彻底失败。后端已经给了 token，但业务上不允许直接进入系统，只允许继续完成改密。
- 前端最稳的做法不是把这类返回强行当异常抛掉，而是显式建一个“需要改密”的分支状态来承接。

### 下一步
1. 在认证请求层或 auth 模块识别 `C10001`
2. 在 `LoginPage` 中引入“登录表单 / 首登改密表单”双状态切换
3. 改密成功后主动清理 token，并回到普通登录态重新登录

## 2026-06-23 用户端接口文档纳入项目上下文
### 已完成
- 已确认仓库根目录新增接口文档：`F:\AAA_AI_aisperce\AI-Hit-Factory\用户端.md`
- 已将该文档识别为“用户端接口的 Markdown 汇总文档”，后续前端对接可以优先基于这份本地文档做字段检索
- 已初步识别文档覆盖的主要接口域：
  - 客户端认证：登录、退出、刷新 token、图形验证码
  - 文图生视频：任务列表、创建任务、任务详情、删除任务
  - AIGC 视频改编/爆款改写相关任务
- 已对照当前前端代码确认，直接相关的现有模块包括：
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/aigc/uploads/index.ts`
  - `src/pages/LoginPage.tsx`

### 当前判断
- 这份 `用户端.md` 已经可以作为后续“接口字段核对、类型补全、请求路径校验”的本地基线资料，能减少反复去远程 Swagger 页面检索的成本
- 目前在终端读取时存在明显中文乱码，说明文档编码和当前终端解码之间可能不一致；在正式依赖它逐字段对齐之前，最好先确认原文件是否为 UTF-8
- 从已识别内容看，`/api/v1/customer/text-image-video/tasks` 与当前前端已有封装基本是对齐的，下一步适合继续核对登录接口字段与现有认证模块是否完全一致

### 下一步
1. 如果后续开始做“用户端真实联调”，优先从 `用户端.md` 抽取明确接口契约，再同步到 `types.ts` 和页面表单
2. 如有需要，可继续把 `用户端.md` 中“登录 + 文图生视频”整理成前端可直接使用的接口对照清单
3. 如果你怀疑文档编码有问题，我可以下一步只做编码排查，不改文档内容
# 项目进展记录

## 2026-06-23 视频追爆任务范围调研
### 已完成
- 已定位 `用户端.md` 中 `08.AIGC-视频追爆` 相关接口，当前已识别到的核心能力包括：
  - 分页查询追爆任务列表：`GET /api/aigc/video-remix-tasks`
  - 创建追爆任务：`POST /api/aigc/video-remix-tasks`
  - 追爆任务详情
  - 删除追爆任务
  - 保存追爆表单
  - 刷新追爆任务状态
- 已扫描前端现状并确认“爆款视频改编”当前只落了演示页面：
  - 页面：`src/pages/ViralRemixPage.tsx`
  - 路由：`src/app/router/routeRegistry.tsx`
  - 通用任务页：`src/pages/TaskRecordsPage.tsx`
- 已确认当前仓库里还没有对应的“视频追爆任务” API 模块；`src/api` 现有 AIGC 相关封装只有上传接口和“图文生视频”接口。
- 已识别现有缺口主要不在 UI 骨架，而在业务闭环缺失：
  - 缺少视频追爆任务 API 封装与类型定义
  - 缺少追爆任务列表与筛选对接
  - 缺少追爆任务详情 / 表单回填能力
  - 缺少“保存表单”与“刷新状态”动作承接
  - 当前 `TaskRecordsPage` 仍是 mock 数据，不是追爆真实任务记录页

### 当前判断
- 这次“根据 `用户端.md` 创建对应任务”更适合先按“接口能力 -> 页面能力 -> 缺失页面/状态”做任务拆分，而不是直接在现有 `ViralRemixPage` 上零散加按钮。
- 从第一性原理看，`视频追爆` 本质是“异步任务系统”：
  - 创建任务像前端发起一次提交动作
  - 保存表单像草稿持久化
  - 刷新状态像前端轮询或手动刷新任务结果
  - 详情页负责把任务当前状态、表单快照和结果聚合展示
- 如果直接把这些逻辑全塞进 `ViralRemixPage.tsx`，文件会迅速膨胀，后续接真实接口和测试都不好维护；更稳妥的是拆成 API、页面容器、状态映射和复用组件四层。

### 下一步
1. 继续从 `用户端.md` 抽取视频追爆接口的字段级契约，补齐前端任务清单。
2. 输出“已有页面复用什么、缺失页面需要手动补哪些”的实施方案。
3. 待你确认后，再进入正式任务文档或直接开始补页面实现。

## 2026-06-23 视频追爆任务文档产出
### 已完成
- 已基于 `用户端.md` 的 `08.AIGC-视频追爆` 输出任务实施文档：
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\doc\2026-06-23-video-remix-task-plan.md`
- 已在文档中明确：
  - 推荐采用“三页闭环”方案，而不是继续把所有逻辑堆在 `ViralRemixPage.tsx`
  - 现有可复用页面：`src/pages/ViralRemixPage.tsx`
  - 需要手动补充的缺失页面：
    - `src/pages/VideoRemixTasksPage.tsx`
    - `src/pages/VideoRemixTaskDetailPage.tsx`
  - 需要新增的 API 模块：
    - `src/api/aigc/video-remix-tasks/types.ts`
    - `src/api/aigc/video-remix-tasks/index.ts`
  - 需要覆盖的任务动作：
    - 列表查询
    - 创建任务
    - 详情回填
    - 保存表单
    - 校验 Prompt
    - 生成 Prompt
    - 生成视频
    - 刷新状态
    - 删除任务
- 已补充文件级实施计划、分步任务清单、推荐顺序和验证步骤，后续可以直接按文档进入编码。

### 当前判断
- 现在“视频追爆”这块已经具备明确实施边界，下一步不需要再泛调研，可以直接进入实现阶段。
- 最关键的工程点不是 UI 造型，而是把“异步任务流”和“表单草稿流”分清楚；这会直接决定后续代码是否容易维护。

### 下一步
1. 按任务文档先补 `video-remix-tasks` API 与类型定义。
2. 再补追爆详情页，优先打通“创建 -> 详情 -> 保存 -> 生成 -> 刷新”主链路。
3. 最后补追爆任务列表页与路由菜单接入。

## 2026-06-23 视频追爆 OpenSpec 任务创建完成
### 已完成
- 已新建 OpenSpec change：
  - `openspec/changes/add-video-remix-task-flow/`
- 已补齐该 change 的完整四件套：
  - `proposal.md`
  - `design.md`
  - `specs/video-remix-task-flow/spec.md`
  - `tasks.md`
- 已将“普通任务文档”里的结论收敛为正式 OpenSpec 能力：
  - 能力名：`video-remix-task-flow`
  - 范围：视频追爆真实任务流、缺失页面补齐、路由接入、接口与页面测试
- 已通过 `openspec status --change add-video-remix-task-flow` 确认该变更 `4/4 artifacts complete`，达到可进入实现阶段的状态

### 当前判断
- 现在这件事已经不再是零散需求整理，而是一条完整、可执行的 OpenSpec change。
- 后续最合理的推进方式，就是直接基于 `add-video-remix-task-flow` 进入 `/opsx:apply` 或让我继续按任务实现。

### 下一步
1. 读取 `openspec/changes/add-video-remix-task-flow/tasks.md`，按顺序开始实现。
2. 优先补 `src/api/aigc/video-remix-tasks/*`，再补详情页主链路。
3. 最后补任务列表页、路由接入与测试验证。

## 2026-06-23 视频追爆实现第一阶段：API 契约层
### 已完成
- 已按 OpenSpec change `add-video-remix-task-flow` 开始实现，并完成第 1 组与第 2 组任务：
  - 已阅读 `openspec/config.yaml`、`openspec/project.md`、`proposal.md`、`design.md`、`spec.md`
  - 已对照 `用户端.md` 整理视频追爆 9 个接口
  - 已确认分页返回与现有共享类型存在差异：后端返回 `records/total/current/size`
- 已新增视频追爆 API 模块：
  - `src/api/aigc/video-remix-tasks/types.ts`
  - `src/api/aigc/video-remix-tasks/index.ts`
- 已完成的接口能力包括：
  - 列表查询
  - 创建任务
  - 任务详情
  - 删除任务
  - 保存表单
  - 校验 Prompt
  - 生成 Prompt
  - 生成视频
  - 刷新状态
- 已在 API 层完成分页适配，把 `records` 结构转换为前端更稳定的 `list/total/pageNum/pageSize/pages`
- 已新增接口层测试：
  - `src/api/aigc/video-remix-tasks/index.test.ts`
- 已验证本阶段定向测试通过：
  - `npm test -- src/api/aigc/video-remix-tasks/index.test.ts`

### 当前判断
- 当前可以确认：视频追爆的 API 契约层已经具备继续往页面实现推进的基础。
- 但在进入下一阶段 `src/features/video-remix/status.ts` 前，出现了一个明确缺口：
  - `用户端.md` 只写了 `status 0~7`，没有给出每个状态码的精确业务语义
  - 这会直接影响前端后续的状态颜色、按钮可用性、失败/处理中/可生成/可刷新判断
- 这一缺口对 API 层不是阻塞，但对下一阶段“状态映射和页面行为”是实质阻塞；如果继续硬写，会开始靠猜。

### 下一步
1. 等待用户补充 `status 0~7` 的状态语义说明，或提供后端枚举/截图。
2. 拿到状态定义后，再继续实现 `src/features/video-remix/status.ts`、详情页动作按钮和结果区行为。
3. 若用户同意以 `statusLabel` 为准做兜底实现，也可继续推进，但需要明确这是临时策略。
## 2026-06-23 视频追爆实现第二阶段：路由与入口页测试建桩
### 已完成
- 已补充视频追爆任务流第一批定向测试：
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/pages/ViralRemixPage.test.tsx`
- 已在类型层预留追爆任务列表页与详情页 route key，作为后续路由注册前置。
- 已执行定向测试命令：
  - `npm test -- src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts src/pages/ViralRemixPage.test.tsx`

### 当前判断
- 当前红灯结论符合预期，主要业务缺口明确为：
  - 追爆任务列表页 / 详情页尚未注册到路由表
  - 后端菜单组件到追爆任务列表页的映射尚未补齐
  - `ViralRemixPage` 尚未接入“创建追爆任务并跳转详情页”的真实行为
- 同时发现一个测试层问题：`ViralRemixPage.test.tsx` 初版 mock 触发了 Vitest hoist 限制。这个不是业务阻塞，已转入修正测试写法后重新验证。

### 下一步
1. 修正 `ViralRemixPage.test.tsx` 的 mock 写法并重新执行定向测试。
2. 在确认红灯纯净后，进入绿色实现阶段。
3. 继续补齐 feature helper、页面、路由与详情页主链路。

## 2026-06-23 视频追爆实现第三阶段：表单扩展与仓库缺口确认
### 已完成
- 已重新对齐 OpenSpec change `add-video-remix-task-flow` 的 `proposal.md`、`design.md`、`spec.md` 与 `tasks.md`，确认本轮目标是“基于现有页面扩展任务流，并按接口参数补齐新增/编辑表单”。
- 已复核当前视频追爆相关实现文件：
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/features/video-remix/form.ts`
  - `src/features/video-remix/status.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 已执行本轮定向测试：
  - `npm test -- src/pages/ViralRemixPage.test.tsx src/features/video-remix/status.test.ts src/features/video-remix/form.test.ts src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
- 已确认与本次视频追爆任务直接相关的红灯：
  - `src/features/video-remix/form.ts` 中 `mapFormValuesToSavePayload()` 对可选字符串字段直接调用 `.trim()`，导致新增/编辑表单映射测试失败。
- 已确认会阻断继续全量路由测试的仓库现存缺口：
  - `content.imageVideoTasks`
  - `content.imageVideoTaskDetail`
  - 对应 route registry 尚未注册，相关页面文件此前也未补齐，导致 `routeRegistry.test.ts` 与 `dynamicRoutes.test.ts` 中“文图生视频任务页”断言直接失败。

### 当前判断
- 现在不是只有“视频追爆表单扩展”一个问题，而是同时暴露出了“仓库现存的文图生视频任务路由缺口”。
- 如果继续按当前测试集推进，我无法把“本次新增问题”和“仓库已有缺口”干净分离，后续你看到的测试结果会混在一起。
- 按当前任务边界看，我可以继续只修视频追爆主链路本身，但如果要宣称这轮路由相关测试通过，必须先决定是否一并补 `imageVideoTasks` 这组历史缺口。

### 下一步
1. 等你确认是否允许我顺手补齐 `imageVideoTasks` / `imageVideoTaskDetail` 这组现存路由缺口。
2. 如果你希望严格只做视频追爆，我会只继续修：
   - `form.ts` 表单映射兜底
   - `ViralRemixPage.tsx` / `VideoRemixTasksPage.tsx` 的 mutation 签名
   - `routeRegistry.tsx` 中视频追爆页面真实注册
3. 确认范围后，我再继续写代码并回跑对应测试。

## 2026-06-23 工作台品牌乱码残留修复
- 已针对“页面中仍出现 `AI 鐖嗘宸ュ巶`”继续排查前端可见文案来源。
- 已确认根因位于 `src/app/layouts/DashboardLayout.tsx`，不是登录页，也不是接口返回，而是工作台壳层源码里仍残留错误编码后的中文。
- 已修复以下可见文案：
  - 品牌名：`AI 爆款工厂`
  - 副标题：`内容生产平台`
  - 折叠按钮：`展开侧边栏 / 收起侧边栏`
  - 顶部按钮：`通知`
  - 用户昵称：`商家用户`
- 已新增组件级回归测试：`src/app/layouts/DashboardLayout.test.tsx`
- 已执行定向验证：
  - `npm test -- src/app/layouts/DashboardLayout.test.tsx`
  - 结果：`1 passed, 2 tests passed`
- 已再次全文搜索当前这组乱码关键词，`src` 下未再发现同类残留。

### 当前判断
- 这次问题本质是布局壳层源码中仍存在历史乱码，而不是业务接口编码问题。
- 从原理上看，像这种“所有页面都包着的 Layout 文案”一旦有乱码，会让你误以为整个系统还有大量编码异常；实际应优先排查壳层组件，因为它像前端的全局导航，也像后端的统一中间件入口，会放大问题可见范围。

### 下一步
1. 你刷新当前页面后，侧栏品牌名应已恢复为 `AI 爆款工厂`。
2. 如果你还能看到其他乱码，我会继续按“可见页面 -> 对应源码组件 -> 最小测试兜底”的方式逐个清掉。

## 2026-06-23 文图生视频实现第二阶段：页面闭环与路由接入

### 已完成
- 已按 `用户端.md` 的文图生视频接口契约完成真实任务流页面闭环，对接接口包括：
  - `GET /api/v1/customer/text-image-video/tasks`
  - `POST /api/v1/customer/text-image-video/tasks`
  - `GET /api/v1/customer/text-image-video/tasks/{id}`
  - `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- 已补齐文图生视频领域最小公共能力：
  - `src/features/text-image-video/status.ts`
  - `src/features/text-image-video/form.ts`
- 已改造创建页，打通“上传参考图 -> 创建任务 -> 跳转详情”的真实链路：
  - `src/pages/ImageVideoPage.tsx`
- 已新增任务列表页与详情页，补齐任务回看能力：
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.tsx`
- 已完成路由接入与动态组件映射补齐：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 已补充定向测试并通过：
  - `src/features/text-image-video/status.test.ts`
  - `src/features/text-image-video/form.test.ts`
  - `src/pages/ImageVideoPage.test.tsx`
  - `src/pages/TextImageVideoTasksPage.test.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.test.tsx`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
- 已验证定向命令通过：
  - `npm test -- src/features/text-image-video/status.test.ts src/features/text-image-video/form.test.ts src/pages/ImageVideoPage.test.tsx src/pages/TextImageVideoTasksPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
  - 结果：`7 passed, 24 tests passed`

### 当前判断
- 文图生视频已经从单页 mock 演示，推进为“三页闭环”的真实异步任务流：
  - `/image-video`
  - `/image-video/tasks`
  - `/image-video/tasks/:taskId`
- 这次公共能力抽取保持在 feature 内最小范围，没有提前抽象成全站异步任务框架，符合当前仓库 KISS 原则。
- 接口状态展示采取“优先使用后端 `statusLabel`，再结合 `status / videoUrl / errReason / syncError` 前端兜底”的策略，可以降低后端状态枚举未完全公开带来的耦合风险。
- 为了不被仓库历史缺口卡住，这轮顺手补进了文图生视频任务路由 key 和动态映射；同时也补了追爆任务的占位路由映射，避免现有路由测试继续被历史问题阻断。

### 遗留与下一步
1. 继续做全量验证：
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
2. 评估 `openspec/changes/add-text-image-video-task-flow/tasks.md` 中 `5.4` 是否需要补 `TaskRecordsPage` 到真实文图生视频任务页的回跳入口。
3. 视全量验证结果，再决定是否顺手清理文图生视频页面源码中的历史乱码文案显示问题。

## 2026-06-23 文图生视频实现第三阶段：全量验证与回归收敛

### 已完成
- 已执行全量验证命令：
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- 已修复验证过程中暴露的回归问题：
  - `src/features/video-remix/form.ts`
  - `src/features/video-remix/form.test.ts`
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/upload-integration.test.tsx`
- 已确认验证结果：
  - `typecheck` 通过
  - `vitest` 全量通过：`21 passed, 64 tests passed`
  - `vite build` 通过

### 当前判断
- 当前文图生视频任务流的代码、测试与构建链路已经闭环，通过了从类型、单测到生产构建的完整校验。
- 这轮顺手修掉的是“新接入文图生视频后暴露出的仓库级类型/测试耦合点”，不是新增需求扩散：
  - `video-remix` 表单字段演进后，旧测试没有同步
  - `Segmented` 数字值与组件泛型推断不一致
  - `react-query` 的 `mutationFn` 不能直接引用带额外参数的 API 封装函数
  - 页面集成测试缺少 `Router + QueryClient` 上下文
- 构建输出里仍有一条非阻断 warning：
  - `Circular chunk: vendor -> react-vendor -> vendor`
  - 这属于现有 `vite` 手动分包策略的优化项，不影响本次任务交付

### 遗留与下一步
1. `openspec/changes/add-text-image-video-task-flow/tasks.md` 还剩：
   - `5.4`：是否补 `TaskRecordsPage` 深链入口
   - `6.5`：是否做一次真实浏览器手工主链路验证
2. 如果你希望我继续把这个 change 收到更完整，我下一步建议先做：
   - `TaskRecordsPage` 到 `/image-video/tasks` 的最小回跳入口
   - 再做一次浏览器主链路手验并补文档

## 2026-06-23 文图生视频实现第四阶段：任务记录入口补齐与浏览器手验

### 已完成
- 已为 `TaskRecordsPage` 补齐最小真实回跳入口：
  - 页面：`src/pages/TaskRecordsPage.tsx`
  - 测试：`src/pages/TaskRecordsPage.test.tsx`
- 已验证任务记录页按钮可跳转到真实文图生视频任务列表页：
  - `/tasks -> /image-video/tasks`
- 已启动本地前端开发服务并使用浏览器手工检查以下路由：
  - `/image-video`
  - `/image-video/tasks`
  - `/tasks`
- 已确认前端路由接入与页面壳层展示正常，文图生视频创建页、列表页和任务记录页入口都能正确进入。

### 当前判断
- `5.4` 已按最小范围闭合：当前不是把 `TaskRecordsPage` 重构为真实任务中心，而是先保证用户能从任务记录页回到真实文图生视频任务页。
- 浏览器手验显示，前端主链路已经通到“页面路由 + 入口跳转”这一层，但真实接口联调仍受当前开发环境限制：
  - 实际请求地址：`/api-api/api/v1/customer/text-image-video/tasks`
  - 浏览器网络结果：`401 Unauthorized`
- 这说明本次 `6.5` 的手工验证已完成“前端可达性与跳转验证”，但未完成“真实创建 -> 查看详情 -> 删除”的完整端到端验收，阻塞点不是前端路由逻辑，而是当前认证/联调环境不可用。

### 遗留与下一步
1. 如果要完成真实端到端手验，需要你提供至少一种可用联调条件：
   - 可登录的测试账号
   - 正确的 `VITE_APP_BASE_API`
   - 或可复用的本地鉴权 token
2. 拿到真实联调条件后，下一步我可以直接补完：
   - 创建任务
   - 打开详情
   - 返回列表
   - 删除任务
3. 当前非阻断技术遗留还有一条构建 warning：
   - `Circular chunk: vendor -> react-vendor -> vendor`
   - 属于 `vite` 手动分包优化项，不影响本次交付

## 2026-06-23 文图生视频联调补充：代理链路确认

### 已完成
- 已复核当前本地联调配置：
  - `.env.development` 中 `VITE_APP_BASE_API='/api-api'`
  - `vite.config.ts` 已配置 `/api-api -> http://192.168.110.145:8000` 反向代理，并会在转发前去掉 `/api-api`
- 已通过浏览器网络面板确认验证码接口已走到真实后端：
  - `GET /api-api/api/v1/customer/auth/captcha`
  - 返回结果：`200 OK`
- 已确认此前文图生视频任务列表页的 `401` 不再是“代理未生效”，而是“未登录状态访问受保护接口”的正常鉴权结果。

### 当前判断
- 现在前端到后端的网络链路已经通了，问题边界已经从“代理/跨域层”收敛到“认证凭证层”。
- 也就是说，文图生视频真实接口请求已经能到后端，只差一个有效登录态，就可以继续完成：
  - 创建任务
  - 查看详情
  - 返回列表
  - 删除任务

### 遗留与下一步
1. 继续真实联调只差一个可用测试账号，或现成 access token / refresh token。
2. 一旦拿到账号，我会直接继续浏览器主链路手验，并把最终结果补回 `openspec` 与 `doc/progress.md`。
## 2026-06-23 ��ͼ������Ƶҳ�滹ԭ�޸�

### �����
- ����ԡ�ͼ��������Ƶҳ�治����ԭ����������ɸ����Ų飬��ȷ�����ⲻ�ǵ�����ʽƫ����ǣ�
  - ҳ��͹������ִ�����ʷ��������
  - `ImageVideoPage` ȱ�� Figma �ؼ��ṹ����
- ����д `src/pages/ImageVideoPage.tsx`���ڱ�����ʵ���񴴽���·��ǰ���²�����ƽṹ��
  - ���뷽ʽ
  - ��Ƶ����
  - �����İ�
  - ͼƬ�ϴ�
  - ��Ƶ���
  - �����ʽ��Ƭ
  - �Զ����� / �Զ���Ļ / ���� BGM
  - �Ҳ���ƵԤ����̬
- ���޸� `src/app/layouts/DashboardLayout.tsx` �Ĺ��������İ���
  - Ʒ����
  - ������
  - ֪ͨ��ť
  - �۵���ť
  - �û��İ�
- ��ͬ�����»ع���ԣ�
  - `src/pages/ImageVideoPage.test.tsx`
  - `src/app/layouts/DashboardLayout.test.tsx`
- ������ר���չ�ĵ���
  - `doc/2026-06-23-image-video-restore-progress.md`

### ��ǰ�ж�
- �����޸����ص��ǡ���ҳ����Լ��������ֻ�� CSS��
- ��ǰҳ���Ѿ��ӡ�ֻ�л�����������������Ϊ�����ӽ� Figma ����������ҳ����ͬʱû���ƻ����� `createTextImageVideoTask` ����ʵ��ת��·��
- �Ҳ�Ԥ����Ŀǰ���õ��ǡ�����ǰ / ������ / �����ɹ��������Ĺ��ɷ�����û��α����ʵ��Ƭ��������������ϵ�ǰ��ʵҵ��״̬��

### ��֤���
- ��ִ�У�
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/app/layouts/DashboardLayout.test.tsx`
  - �����ͨ����`2 passed, 5 tests passed`
- ��ִ�У�
  - `npm run build`
  - �����ͨ��
- ��ǰ��ʣ��ʷ warning��
  - `Circular chunk: vendor -> react-vendor -> vendor`
  - ����������ҳ�滹ԭ����

### ��һ��
1. �������׷�� 1:1 ��ԭ��������һ��ֱ�����������ͼ���գ�΢����
   - ��������
   - ��Ƭ��Ӱ
   - ѡ��̬��ɫ
   - �Ҳ�Ԥ���߶�������
2. �����ϣ��������һ�����Լ����� `ProductVideoPage` �� `ViralRemixPage` Ҳ��ͬ����׼��һ�� Figma ��ԭ������
## 2026-06-23 ��ͼ����Ƶ����ҳ�˵������޸�

### �����
- ��ȷ����������ڲ����������������� `App.tsx` ������·�ɸ������ԣ�
  - ֮ǰ��������ҳͳһ���˵�����һ���ɼ��˵���
  - ���� `/image-video/tasks/:taskId` ����������������̨��
- ��Ϊ��������·�ɲ�����ʽ���˵�ӳ�䣺
  - `content.imageVideoTaskDetail -> content.imageVideoTasks`
  - `content.viralRemixTaskDetail -> content.viralRemixTasks`
  - `content.digitalHumanDetail -> content.digitalHumans`
  - `content.digitalHumanVideoTaskDetail -> content.digitalHumanVideoTasks`
- ���� `src/app/router/routeTypes.ts` ��Ϊ·��Ԫ��Ϣ���� `activeMenuKey`
- ���� `src/app/App.tsx` ����������·�ɵĸ��˵������߼������ԭ�ȡ�Ĭ�ϻص�һ���ɼ��˵����Ķ��ײ���
- ��ͬ������ع���ԣ�
  - `src/app/App.test.tsx`
  - `src/app/router/routeRegistry.tsx`

### ��ǰ�ж�
- ���ڡ���ͼ����Ƶ���顱��Ȼ��������ҳ��������ȷ����������ͼ����Ƶ����Ŀ¼���������ϡ�����Ŀ¼��һ�������ء������塣
- ����޸����Ǹ���һ·���򲹶������Ǹ�����·��ϵͳ����һ�㡰��������ҳ�������˵���������������׷����������������Ҳ��һ�����档

### ��֤���
- ��ִ�У�
  - `npm test -- src/app/App.test.tsx src/app/router/routeRegistry.test.ts`
  - �����ͨ����`2 passed, 13 tests passed`

## 2026-06-24 合并 `codex/upload-unified-experience` 到 `main`

### 已完成
- 已按合并前检查流程确认当前分支为 `main`，目标分支为 `codex/upload-unified-experience`。
- 已用 `git stash push --include-untracked -m "codex-before-merge-upload-unified-experience"` 临时保存合并前本地改动：
  - `.gitignore`
  - `doc/progress.md`
- 已确认合并阻塞点是本地 `tmp-dev-server.log` 被正在运行的 Vite 开发服务占用。
- 已停止本仓库对应的本地开发服务进程，随后把原本的本地日志改名为：
  - `tmp-dev-server.log.local-backup`
- 已执行快进合并：
  - `git merge --ff-only codex/upload-unified-experience`
- 合并结果为 Fast-forward，`main` 已更新到：
  - `3530d76 feat: unify upload detail experience and restore workspace routes`

### 当前判断
- 本次合并没有代码冲突，属于可快进合并。
- 目标分支本身新增并跟踪了 `tmp-dev-server.log` 和 `tmp/` 下的截图文件，所以此前单独在 `.gitignore` 里忽略 `tmp-dev-server.log` 已不再能解决该文件的版本管理问题。
- 当前仍保留本地备份文件 `tmp-dev-server.log.local-backup`，未删除任何磁盘内容。
- 合并前 stash 仍保留，可作为回查本地合并前记录的保险。

### 下一步
1. 运行合并后的类型检查与关键测试，确认主线状态。
2. 根据验证结果决定是否需要推送 `main`。
3. 若后续确认备份日志不再需要，再由用户确认是否清理。

### 验证结果
- 已执行：
  - `npm run typecheck`
  - 结果：通过。
- 已执行：
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts src/app/router/dynamicRoutes.test.ts src/app/App.test.tsx`
  - 结果：通过，`8` 个测试文件、`47` 个测试全部通过。

### 收尾状态
- 当前 `main` 已领先 `origin/main` 两个提交。
- 当前未提交改动只有本次追加的 `doc/progress.md` 记录，以及未跟踪备份文件 `tmp-dev-server.log.local-backup`。
- `stash@{0}` 仍保留合并前本地改动快照，暂未删除。

## 2026-06-27 ׷�������ϴ������ antd-vendor �Ż��տ�

### �����
- ����� `VideoRemixTaskDetailPage` �ϴ������տڣ������ز��ϴ����ͳһ��������ϴ�������
- ����ҳ��ǰͨ�� `antd Upload` ��װ�� `UploadTrigger` �������ο���Ƶ����Ʒͼ������ͼ����Ƶ�ϴ���
- �Ѳ��벢�����ϴ��ع���ԣ���������ֱ������ `Upload` ����ڲ��ļ����룬�����������ԭ�� input ���������Ϊ��
- �Ѳ��� `manualChunks` ���⣬��������֤�ְ�����

### ���ֶ� `antd-vendor` ���ж�
- `antd-vendor` ���ǵ��� bug�����������ṹ�����
- ����ʵ�ⷢ�֣��� `antd / @ant-design / rc-* / icons` ǿ��ɶ�� vendor chunk��������ѭ�� chunk ���棬���ʺϵ�ǰ��Ŀֱ�����ߡ�
- ��ǰ��������ȶ������ǣ�
  - `react / react-dom / react-router / scheduler` ������ `react-vendor`
  - `lucide-react` ������ `icon-vendor`
  - `antd / @ant-design / @rc-component / rc-*` ͳһ�� `antd-vendor`
- ��ȡ�Ӳ����� vendor �������ȣ�ԭ�����⼸��������ʱ���������߽���γ� chunk ��������

### ��֤���
- ��ִ�У�`npx vitest run -c vitest.video-remix-regression.config.ts`
  - �����ͨ����`9 passed, 53 tests passed`
- ��ִ�У�`npm run typecheck`
  - �����ͨ��
- ��ִ�У�`npm run build`
  - �����ͨ��
- ��ǰ����ʣ�������� warning�������б���ϸ�𷽰�������ѭ�� chunk warning��

### ��һ������
1. ��������Ż��װ���������ҳ�漶�����غ�����ҳ��ֶμ��ء�
2. �������ͳһ�ϴ����飬��һ�ֿ��԰� `ViralRemixPage.tsx` ��������ϴ���������һ�������������

## 2026-06-27 ׷����������ҳ�ڶ����Ż���������

### �����
- �Ѷ����û������� 5 ���Ż��㣬����ɵ�ǰ������״ɨ�裺
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/features/video-remix/form.ts`
- ��������������ĵ���
  - `doc/2026-06-27-video-remix-optimization-plan.md`

### ��ǰ�ж�
- ���ָ��ʺϲ��á���������������ҳ����ǿ�Ż����ķ�����������ֱ�ӽ��롰�༭̬ / ��Ʒ̬��˫ģʽ�ع���
- ��ǰ��ֵ���������ĸ���ص��ǣ�
  1. ��һ��ǰ�ȱ������
  2. �ο���Ƶ��Ϊ��׼����Ԥ��
  3. ��Ʒͼ / ����ͼ��Ϊ��ǿ��������ز�չʾ
  4. �ײ���������Ϊ���� sticky ����
- �б�ҳ���鿴��Ʒ������ͬ���Ż���������������Ƶ�ٴν�������ҳĬ��չʾ̬������Ȳ����뱾����ʵ�֡�

### ��һ��
1. ���û�ȷ�Ϸ�����ֱ�Ӱ������ĵ�����ʵ�֡�
2. ʵ��˳���飺���豣����· -> ��ƵԤ������ -> �زĿ�Ƭչʾ -> �б���Ʒ����Ż���

---

## 2026-07-03 OpenSpec 归档与旧任务修订判断

### 已完成
- 已扫描 `openspec/changes` 下的 7 个活动 change，并按 `tasks.md` 勾选状态初步判断归档候选。
- 已确认当前环境中 `openspec` CLI 不在 PATH，无法执行 `openspec list --json` 与 `openspec status --change ... --json`，本次判断以文件状态和当前代码实现为依据。
- 已对照当前 Vite + React + TypeScript 代码结构，核对路由、动态菜单、追爆任务、文图生视频、数字人管理相关页面、API、feature 层与测试文件。

### 可归档候选
- `add-figma-ui-shell-pages`：`tasks.md` 全部完成，代码中已存在基础应用壳、动态路由相关测试和页面结构，可作为优先归档候选。
- `add-text-image-video-task-flow`：`tasks.md` 全部完成，代码中已存在文图生视频 API、feature、列表页、详情页和测试，可作为优先归档候选。
- `connect-dynamic-menu-routes`：`tasks.md` 仍有大量未勾选，但当前代码已实现 `buildDynamicRouteState`、`useCurrentUserRoutes`、App 初始化接入、403/404、登录 redirect、动态路由测试等核心能力；建议先修正任务勾选与描述，再考虑归档。

### 不建议直接归档
- `add-account-system-react-pages`：29 个任务未完成，且当前代码主要是业务生产平台页面，不是账号体系完整页面，建议保留或重新评估范围。
- `add-digital-human-management-flow`：剩余 `npm test` 与手工主链路验证未勾选，代码实现基本存在，但应补验证记录后再归档。
- `add-video-remix-task-flow`：大部分完成，仅剩“是否需要局部组件/hooks”和手工主链路验证；其中 3.3 更像条件性任务，建议改成“无需新增 shared 抽象，保留页面局部实现”并勾选，手工验证后可归档。
- `redesign-video-remix-step-flow`：当前代码已出现 `Steps/currentStep/generatedPrompt/progress` 等三步流证据，说明实现进度高于任务勾选；但任务文件仍有 21 项未勾选，建议先系统更新任务状态，不建议现在归档。

### 需要修改的旧任务
- `connect-dynamic-menu-routes`：任务状态明显落后于代码，应把已实现的动态路由转换器、外链识别、隐藏菜单、App 接入、登录 redirect、403/404 和相关测试改为已完成；剩余只保留确实未验证或未完成的项。
- `redesign-video-remix-step-flow`：任务状态明显落后于代码，应重新核对 `VideoRemixTaskDetailPage.tsx`、`features/video-remix/*` 和对应测试，把三步导航、提示词编辑、进度反馈、视频对比等已实现项勾选；若仍有 UI 细节差异，再拆成更小的补充任务。
- `add-video-remix-task-flow`：3.3 是条件性任务，不应长期卡归档；若当前页面局部实现已经足够，应改写为“经评估无需新增 shared 抽象”，并勾选。
- 所有 change 的归档前都建议先补主规格目录或确认是否不需要 sync；当前仓库没有 `openspec/specs` 主规格目录，归档时要明确“仅归档变更，不同步主规格”还是先补齐主规格。

### 下一步
1. 先修正 `connect-dynamic-menu-routes` 与 `redesign-video-remix-step-flow` 的 `tasks.md` 勾选状态。
2. 对 `add-figma-ui-shell-pages` 与 `add-text-image-video-task-flow` 做归档前确认。
3. 如需真实归档，先让用户确认具体 change 名称；归档会移动目录到 `openspec/changes/archive/YYYY-MM-DD-<change-name>`，本次没有执行移动或删除。
---

## 2026-07-03 OpenSpec 当前未完成任务清单

当前 OpenSpec 未完成任务清单

- add-account-system-react-pages: 已完成 0，未完成 29
  - [ ] 1.1 Confirm React scaffold choice: Vite + React + TypeScript is the default unless the team requests Next.js or another framework.
  - [ ] 1.2 Initialize the frontend project structure and keep source code under a clear app directory.
  - [ ] 1.3 Add routing, linting, formatting, and TypeScript configuration.
  - [ ] 1.4 Define environment configuration for Mock API and future backend API base URL.
  - [ ] 2.1 Use Figma MCP to scan the provided account-system page nodes.
  - [ ] 2.2 Map Figma frames to the PRD page list: login/register, phone binding, profile, real-name auth, enterprise certification, enterprise workspace, members, points usage, agreement signing, permission modal.
  - [ ] 2.3 Identify missing Figma pages and create implementation placeholders using the same design system style.
  - [ ] 2.4 Extract reusable UI patterns: form layout, verification-code input, upload field, status badge, table, modal, empty state, and workspace summary card.
  - [ ] 3.1 Create TypeScript types for user, account status, real-name auth, enterprise, enterprise member, points account, agreement, permission result, and operation log context.
  - [ ] 3.2 Implement a centralized API Client interface for auth, account profile, real-name auth, enterprise application, enterprise members, points usage, and agreement signing.
  - [ ] 3.3 Add Mock API data that covers personal user, real-name user, enterprise admin, creator, observer, unbound WeChat user, frozen user, and rejected certification states.
  - [ ] 3.4 Add a small permission utility that evaluates identity, role, certification, account status, points status, and agreement status.
  - [ ] 4.1 Implement phone/password login, phone/SMS login, registration, and password reset pages.
  - [ ] 4.2 Implement WeChat phone-binding page for PC scan and mini-program authorization result states.
  - [ ] 4.3 Implement personal center page with phone, WeChat binding, identity type, account status, certification status, enterprise status, and agreement records.
  - [ ] 4.4 Implement real-name authentication page with submission, pending, approved, rejected, and frozen states.
  - [ ] 5.1 Implement enterprise certification application page with required fields, upload placeholders, contact phone verification, and agreement confirmation.
  - [ ] 5.2 Implement enterprise workspace home with enterprise information, points balance, member count, recent tasks, material entry, digital-human entry, and usage entry.
  - [ ] 5.3 Implement member management page with create member, role assignment, stop member, and role-limited access states.
  - [ ] 5.4 Implement points usage page with balance summary, member usage records, task/function type, cost, result status, refund status, and time filters.
  - [ ] 6.1 Implement agreement signing modal/page for registration, first AI generation, enterprise certification, high-risk鐪熶汉绱犳潗, and digital-human scenes.
  - [ ] 6.2 Implement permission interception modal for鏈疄鍚嶃€佹湭绛剧讲銆佷紒涓氭湭璁よ瘉銆佽鑹叉棤鏉冮檺銆佽处鍙峰喕缁撱€侀鎺ч檺鍒?and points unavailable states.
  - [ ] 6.3 Ensure high-risk features display the required guidance copy from the PRD.
  - [ ] 6.4 Ensure sensitive information such as ID card number is masked in all user-facing displays.
  - [ ] 7.1 Run TypeScript checks and linting.
  - [ ] 7.2 Run unit tests for permission utility and API Client mock state transitions.
  - [ ] 7.3 Use browser verification to test login, WeChat binding, real-name submission, enterprise certification, member management, points usage, agreement signing, and permission interception flows.
  - [ ] 7.4 Compare implemented pages against Figma MCP screenshots and fix layout mismatches.
  - [ ] 7.5 Run `openspec status --change add-account-system-react-pages` and confirm the change is apply-ready.

- add-digital-human-management-flow: 已完成 28，未完成 2
  - [ ] 7.3 杩愯 `npm test`
  - [ ] 7.5 鎵嬪伐楠岃瘉鈥滃垪琛ㄦ煡璇?-> 鍒涘缓鏁板瓧浜?-> 鏌ョ湅璇︽儏 -> 鍒锋柊鐘舵€?-> 鍒犻櫎鏁板瓧浜衡€濅富閾捐矾

- add-figma-ui-shell-pages: 已完成 41，未完成 0

- add-text-image-video-task-flow: 已完成 24，未完成 0

- add-video-remix-task-flow: 已完成 27，未完成 2
  - [ ] 3.3 濡傞〉闈㈢粍鍚堝鏉傚害杩囬珮锛屾柊澧炴渶灏忓繀瑕佺殑灞€閮ㄧ粍浠舵垨 hooks锛屼絾閬垮厤鎶婁竴娆℃€ч〉闈㈠潡杩囨棭鎻愬崌鍒?`shared`
  - [ ] 7.5 鎵嬪姩楠岃瘉鈥滃垱寤?-> 璇︽儏 -> 淇濆瓨 -> 鐢熸垚 -> 鍒锋柊 -> 鍥炵湅鈥濅富閾捐矾

- connect-dynamic-menu-routes: 已完成 6，未完成 0

- redesign-video-remix-step-flow: 已完成 4，未完成 21
  - [ ] 2.1 璋冩暣 `src/features/video-remix/form.ts`锛屼负鈥滅礌鏉愪笂浼犲拰閰嶇疆鈥濃€滄彁绀鸿瘝鈥濃€滆棰戠敓鎴愨€濅笁姝ラ噸鏂版⒊鐞嗗瓧娈垫槧灏勮竟鐣?
  - [ ] 2.2 淇濈暀鍐呴儴鍥剧墖 URL 鏂囨湰鏄犲皠鍏煎閫昏緫锛屼絾绉婚櫎 UI 瀵瑰晢鍝佸浘銆佷汉鐗╁浘 URL 鐩存帴杈撳叆鐨勪緷璧?
  - [ ] 2.3 鎵╁睍 `src/features/video-remix/status.ts`锛岃ˉ鍏呮彁绀鸿瘝鐢熸垚闃舵銆佽棰戠敓鎴愰樁娈电殑鎸夐挳鍙敤鎬с€佽繘搴﹀睍绀哄拰澶辫触鍙嶉鍒ゆ柇
  - [ ] 3.1 閲嶆瀯 `src/pages/VideoRemixTaskDetailPage.tsx`锛屽姞鍏ヤ笁姝ユ祦绋嬪鑸苟浠ラ〉闈㈠眬閮ㄧ姸鎬佹帶鍒跺綋鍓嶆楠?
  - [ ] 3.2 灏嗏€滅礌鏉愪笂浼犲拰閰嶇疆鈥濇敼涓虹涓€涓楠わ紝璋冩暣瀛楁椤哄簭涓衡€滅礌鏉愪笂浼犲湪鍓嶏紝鍐呭鏂瑰悜鍦ㄥ悗鈥?
  - [ ] 3.3 鍦ㄧ礌鏉愭楠や腑涓衡€滃鍒绘柟鍚戔€濆鍔犲娉ㄨ鏄庯紝骞朵负鈥滀骇鍝佷俊鎭€濃€滃彛鎾枃妗堚€濆鍔犫€淎I 鑷姩鐢熸垚鈥濇寜閽叆鍙?
  - [ ] 3.4 鍒犻櫎绱犳潗姝ラ涓殑鈥滆棰戞憳瑕佲€濊緭鍏ュ尯锛屽苟灏嗗晢鍝佸浘銆佷汉鐗╁浘浜や簰鏀逛负鈥滀笂浼?+ 棰勮 + 鍒犻櫎鈥?
  - [ ] 3.5 缂╁皬鍙傝€冭棰戦瑙堝竷灞€锛屽崰鐢ㄦ洿灏戦〉闈㈢┖闂翠絾淇濈暀棰勮鑳藉姏
  - [ ] 3.6 灏嗘彁绀鸿瘝鍖哄煙鏀归€犳垚鐙珛姝ラ锛屽睍绀哄綋鍓嶆彁绀鸿瘝銆佹敮鎸佹墜鍔ㄧ紪杈戙€佹敮鎸佽Е鍙戠敓鎴愭彁绀鸿瘝
  - [ ] 3.7 灏嗚棰戠敓鎴愬尯鍩熸敼閫犳垚鐙珛姝ラ锛屽姞鍏ュ弬鑰冭棰戜笌鐢熸垚瑙嗛鐨勫姣斿睍绀?
  - [ ] 3.8 鍦ㄦ彁绀鸿瘝鐢熸垚銆佽棰戠敓鎴愭楠や腑鍔犲叆姝ラ鍖哄唴鐨?loading銆佽繘搴︽潯銆佺姸鎬佹枃妗堝拰澶辫触鍘熷洜灞曠ず
  - [ ] 4.1 淇濇寔 `src/pages/VideoRemixTasksPage.tsx` 鐨勨€滃垱寤轰换鍔″悗杩涘叆璇︽儏椤碘€濋摼璺笉鍙橈紝蹇呰鏃惰皟鏁存彁绀烘枃妗堜互鍖归厤鏂版楠ゆ祦
  - [ ] 4.2 鏍稿 `src/pages/ViralRemixPage.tsx` 鏄惁浠嶉渶淇濈暀涓烘棫鍏ュ彛椤垫垨寮曞椤碉紝閬垮厤涓庡綋鍓嶄富閾捐矾浜х敓鍐茬獊
  - [ ] 4.3 纭 `src/app/router/routeRegistry.tsx`銆乣routeTypes.ts`銆佺浉鍏宠彍鍗曢珮浜€昏緫鏃犻渶鏂板瀛愯矾鐢憋紝浠呬繚鎸佺幇鏈変换鍔″垪琛ㄤ笌璇︽儏璺敱鍙敤
  - [ ] 5.1 鏇存柊 `src/pages/VideoRemixTaskDetailPage.test.tsx`锛岃鐩栨楠ゅ鑸€佸瓧娈甸『搴忋€佸垹闄よ棰戞憳瑕併€侀殣钘?URL 杈撳叆銆佹彁绀鸿瘝鍙紪杈戙€佽繘搴﹀弽棣堝拰瑙嗛瀵规瘮
  - [ ] 5.2 鏍规嵁瀹為檯鏀瑰姩鏇存柊 `src/pages/ViralRemixPage.test.tsx`銆乣src/pages/VideoRemixTasksPage.test.tsx` 鎴栫浉鍏宠矾鐢辨祴璇?
  - [ ] 5.3 鎵ц杩界垎浠诲姟鐩稿叧娴嬭瘯鍛戒护锛岀‘璁ら〉闈富娴佺▼鍥炲綊閫氳繃
  - [ ] 5.4 鎵ц绫诲瀷妫€鏌ユ垨鏋勫缓鍛戒护锛岀‘璁ゆ湰娆℃敼閫犳湭鐮村潖鐜版湁宸ョ▼
  - [ ] 6.1 瀹屾垚姣忎竴灏忛樁娈靛悗鏇存柊 `doc/progress.md`
  - [ ] 6.2 鍚屾鏇存柊 `doc/2026-06-27-video-remix-stepflow-progress.md`锛岃褰曟湰娆?OpenSpec 寤虹珛銆佹柟妗堝喅绛栧拰鍚庣画鎵ц鐘舵€?
  - [ ] 6.3 鍦ㄥ疄鐜板畬鎴愬悗锛岃ˉ鍏呮渶缁堥獙璇佺粨鏋滀笌鍓╀綑椋庨櫓璇存槑

---

## 2026-07-03 OpenSpec 未完成任务清单输出

### 已完成
- 已按当前 `openspec/changes/*/tasks.md` 再次整理未完成任务，并向用户输出。
- 已确认 `connect-dynamic-menu-routes/tasks.md` 存在编码串行问题，统计时需人工纠正，不能只看自动勾选汇总。

### 当前判断
- 当前未完成任务主要集中在 `add-account-system-react-pages`、`connect-dynamic-menu-routes`、`redesign-video-remix-step-flow`。
- `add-figma-ui-shell-pages` 与 `add-text-image-video-task-flow` 已无未完成项。
---

## 2026-07-03 OpenSpec 批量归档前检查

### 已完成
- 已完成 `openspec/changes` 批量归档前检查，本轮未执行任何移动操作。
- 已确认当前不存在 `openspec/changes/archive` 目录。
- 已确认以下 7 个 change 按 `2026-07-03-<change-name>` 命名归档时均不会重名。

### 当前判断
- 可以执行批量归档流程，但这会移动 change 目录到 archive 下。
- 当前环境缺少 `openspec` CLI，无法走标准 `openspec status` 归档检查，只能基于现有文件状态执行归档。
- 当前仓库也没有 `openspec/specs` 主规格目录，因此本次归档只能做“目录归档”，不会做主规格同步。
---

## 2026-07-03 OpenSpec 批量归档完成

### 已完成
- 已创建 `openspec/changes/archive/`。
- 已将以下 7 个活动 change 批量移动到归档目录：
  - `2026-07-03-add-account-system-react-pages`
  - `2026-07-03-add-digital-human-management-flow`
  - `2026-07-03-add-figma-ui-shell-pages`
  - `2026-07-03-add-text-image-video-task-flow`
  - `2026-07-03-add-video-remix-task-flow`
  - `2026-07-03-connect-dynamic-menu-routes`
  - `2026-07-03-redesign-video-remix-step-flow`
- 已复核 `openspec/changes`，当前活动区仅剩 `archive` 目录。

### 当前判断
- 本次归档是目录级归档，未执行主规格同步。
- 原因是当前环境缺少 `openspec` CLI，且仓库内不存在 `openspec/specs` 主规格目录。
- 由于部分 change 原本存在未完成任务，本次归档更偏向“历史收口”，适合后续按需要重新提炼新的 change，而不是继续沿用旧 change 状态。
---

## 2026-07-03 OpenSpec 触发约定整理

### 已完成
- 已整理“用户如何明确要求先识别再创建 OpenSpec 任务”的推荐话术。
- 已准备可直接放入 AGENTS.md 的长期约定文本。

### 当前判断
- 最稳妥的方式是让用户在需求里明确声明“先走 OpenSpec，只建任务不改代码”或在 AGENTS.md 中写成固定规则。
- 若用户希望默认自动建 OpenSpec，则应明确“哪些情况必须先建 change，哪些情况允许直接改代码”。
---

## 2026-07-03 AGENTS.md 规则落地

### 已完成
- 已在仓库根目录新增 `AGENTS.md`。
- 已整理并落地以下长期协作规则：
  - 简体中文沟通
  - 小阶段完成后同步更新进展文档
  - 删除/高风险磁盘操作前先确认
  - 默认先调研再实施
  - 新功能、重构、跨文件改动优先先走 OpenSpec
  - 收到“开始执行”后再正式改代码
- 已加入可直接触发 OpenSpec 的用户话术约定。

### 当前判断
- 后续你只要明确说“先走 OpenSpec”或“先在 openspec 里立任务”，就能稳定触发先建 change、再等确认、最后执行的流程。
- 当前仓库之前没有实际落地的 `AGENTS.md`，现在已经补齐为仓库级规则入口。
---

## 2026-07-03 OpenSpec 环境核对

### 已完成
- 已检查当前环境中的 `openspec` CLI 是否可用。
- 已检查仓库内是否存在 `openspec/specs` 主规格目录。
- 已确认仓库仅存在 `openspec/config.yaml`、`openspec/project.md` 与已归档的 `openspec/changes/archive/*`。

### 当前判断
- 当前环境里 `openspec` CLI 大概率没有安装，或至少没有进入当前 shell 的 PATH。
- `openspec/specs` 缺失不是 CLI 安装问题，而是仓库层面的主规格目录没有建立或没有同步出来。
- 也就是说：一个是“工具环境问题”，一个是“项目结构内容问题”，不能混为一类。
---

## 2026-07-03 OpenSpec CLI 修复与主规格基线建立

### 已完成
- 已通过 `npm install -g @fission-ai/openspec@latest` 安装 OpenSpec CLI。
- 已确认当前环境满足 OpenSpec 要求的 Node 版本，且 `openspec --version` 可正常输出 `1.5.0`。
- 已确认 `openspec list --json` 可以在当前仓库正常执行。
- 已创建 `openspec/specs/` 主规格目录，并补齐以下 5 个主规格能力：
  - `figma-ui-shell-pages`
  - `dynamic-menu-routes`
  - `text-image-video-task-flow`
  - `video-remix-task-flow`
  - `digital-human-management-flow`
- 已执行 `openspec validate --specs --json --no-interactive`，5 个 spec 全部校验通过。

### 当前判断
- 当前仓库已经从“只有 changes/ 没有主规格”的状态，补齐为“具备 CLI + 主规格基线”的可持续 OpenSpec 结构。
- 后续再新增需求时，可以直接先建 change，并在需要归档时把变更同步回 `openspec/specs/`。
- 之前归档的 change 中仍有部分内容只是历史方案或未完全落地实现，因此这次建立的是“当前核心能力主规格基线”，不是机械复制全部旧 change 状态。

### 下一步
1. 后续新需求直接按“先走 OpenSpec”创建新 change。
2. 对尚未沉淀主规格的能力（如数字人视频任务、定制音色等）再按实际代码情况逐步补 specs。
3. 如需，我可以继续帮你把历史 archive 中值得保留的能力继续补成主规格。

### 验证结果
- 已执行：`openspec --version`
- 已执行：`openspec list --json`
- 已执行：`openspec list --specs`
- 已执行：`openspec validate --specs --json --no-interactive`
- 结果：5 个 specs 全部通过校验。