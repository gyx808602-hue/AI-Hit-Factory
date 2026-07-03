# 2026-07-02 音色页面开发进展

## 阶段 1：上下文调研

- 已确认项目技术栈为 `React 19 + TypeScript + Vite + React Router 7 + Ant Design + React Query`。
- 已确认进展文档目录沿用 `doc`，与仓库现有进展记录保持一致。
- 已定位音色接口文件：
  - `src/api/aigc/customised-audios/index.ts`
  - `src/api/aigc/customised-audios/types.ts`
- 已确认当前音色接口能力包含：
  - 分页查询 `getCustomisedAudioPage`
  - 新建 `createCustomisedAudio`
  - 详情 `getCustomisedAudioDetail`
  - 删除 `deleteCustomisedAudio`
  - 刷新 `refreshCustomisedAudio`
- 已确认当前项目中还没有独立的音色管理页面，但已经存在可复用模式：
  - `src/pages/DigitalHumansPage.tsx`：列表页 + 新建弹窗
  - `src/pages/DigitalHumanVideoTasksPage.tsx`：列表页 + 关联音色选择
- 已确认路由注册入口为：
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 风险点记录：
  - 当前接口未发现明显的“更新音色”接口，因此“编辑弹窗”需要进一步确认是调用新增接口复用弹窗，还是仅先完成弹窗交互骨架。
  - 路由需同时考虑静态注册和动态菜单映射，避免影响现有其他路由。

## 阶段 2：需求边界确认

- 用户已明确：暂时不把“缺少更新接口”作为阻塞项处理，先继续完成页面与路由方案设计。
- 用户已明确：请求地址保持现状，严格沿用当前已有接口地址与请求前缀，不修改请求路径拼接规则。
- 当前实现边界将优先聚焦：
  - 新增音色管理页面
  - 新增独立路由接入
  - 新建弹窗
  - 编辑弹窗交互形态与页面结构预留
- 设计目标保持不变：
  - 不影响现有其他路由
  - 尽量复用现有页面模式与查询缓存模式
  - 保持后续补充编辑接口时可平滑接入
  - 保持 `src/api/aigc/customised-audios/index.ts` 中现有请求地址不变，仅在页面、路由与 hooks 层扩展能力

## 阶段 3：接口约束固化

- 已确认音色接口当前地址策略应继续沿用现状：
  - 资源路径仍由 `CUSTOMISED_AUDIOS_BASE_URL = "/customised-audios"` 提供
  - 实际前缀仍交由现有请求客户端统一拼接
- 原理说明：
  - 这和前端统一请求拦截器的职责类似，页面层只关心“资源名”，不直接硬编码完整前缀。
  - 如果在单个模块里擅自改请求地址，容易出现前缀重复、模块行为不一致、联调环境偏差等问题。
- 后续实现承诺：
  - 不改 `customised-audios` 现有 API 文件中的请求地址
  - 仅新增页面、路由、表单和查询/变更 hooks

## 阶段 4：执行计划已落地

- 已新增实施计划文档：
  - `doc/2026-07-02-customised-audio-page-plan.md`
- 当前执行顺序已固定为：
  1. 先补测试，锁定页面和路由行为
  2. 再扩展音色 hooks
  3. 再实现页面与弹窗
  4. 最后执行类型检查与针对性测试
- 本阶段仍未修改任何请求地址、请求前缀和现有业务页面。

## 阶段 5：测试先行与核心实现完成

- 已先补失败测试，再补实现，符合本次 TDD 目标。
- 已新增页面文件：
  - `src/pages/CustomisedAudiosPage.tsx`
- 已扩展音色 hooks：
  - `src/features/digital-human/audio/hooks.ts`
- 已补充/更新测试文件：
  - `src/pages/CustomisedAudiosPage.test.tsx`
  - `src/features/digital-human/audio/hooks.test.ts`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
- 已完成路由接入：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`

## 阶段 6：实现结果说明

- 新增了独立的“音色管理”页面路由：
  - `/customised-audios`
- 页面能力已具备：
  - 音色列表展示
  - 关键指标卡片
  - 关键词搜索
  - 状态筛选
  - 分页
  - 新建弹窗
  - 编辑弹窗打开与数据回填
  - 刷新
  - 删除
- 请求层约束保持成立：
  - 未修改 `src/api/aigc/customised-audios/index.ts` 中的任何请求地址
  - 继续沿用现有请求客户端前缀拼接逻辑

## 阶段 7：验证结果

- 已通过：
  - `npx vitest run --config vite.request-test.config.ts src/features/digital-human/audio/hooks.test.ts`
  - `npx vitest run --config vite.request-test.config.ts src/pages/CustomisedAudiosPage.test.tsx`
  - `npx vitest run --config vite.request-test.config.ts src/app/router/routeRegistry.test.ts -t "registers customised audio management route"`
  - `npx vitest run --config vite.request-test.config.ts src/app/router/dynamicRoutes.test.ts -t "maps customised audio backend component into a route"`
  - `npm run typecheck`
- 说明：
  - 页面测试运行时出现 `getComputedStyle` 的 jsdom 提示，但不影响用例通过，属于测试环境兼容提示，不是业务失败。

## 当前遗留

- 编辑弹窗目前已完成入口与回填，但未真正提交更新，因为当前前端代码中尚未发现音色更新接口。
- 后续若补更新接口，可直接在当前编辑弹窗基础上接入，不需要重做页面和路由结构。
