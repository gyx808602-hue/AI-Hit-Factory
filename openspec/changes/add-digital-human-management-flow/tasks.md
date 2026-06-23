## 1. OpenSpec 前置与接口契约整理

- [x] 1.1 阅读 `openspec/config.yaml`、`openspec/project.md`、本 change 的 `proposal.md`、`design.md`、`specs/digital-human-management-flow/spec.md`
- [x] 1.2 对照 `用户端.md` 梳理 `digital-persons` 的列表、创建、详情、删除、刷新五个接口字段与分页结构
- [x] 1.3 明确当前 `DigitalHumansPage.tsx` 中哪些字段是 Figma mock 语义，哪些字段能够真实映射到后端契约

## 2. API 模块与类型定义

- [x] 2.1 新增 `src/api/aigc/digital-persons/types.ts`，定义列表查询、详情、创建、删除、刷新所需类型
- [x] 2.2 新增 `src/api/aigc/digital-persons/index.ts`，实现列表查询、创建、详情、删除、刷新接口封装
- [x] 2.3 在 API 层处理 `records/total/current/size` 到前端稳定分页结构的适配，避免页面直接消费原始分页形态
- [x] 2.4 为数字人 API 模块补充接口层测试，覆盖 query 参数、`FormData` 创建和响应解析

## 3. 数字人领域支持层

- [x] 3.1 新增 `src/features/digital-human/status.ts`，集中维护状态文案、颜色、按钮可用性和结果展示兜底规则
- [x] 3.2 新增 `src/features/digital-human/form.ts`，实现创建弹窗默认值、互斥校验和请求体适配
- [x] 3.3 新增 `src/features/digital-human/hooks.ts`，封装列表、详情、创建、删除、刷新相关 React Query hooks
- [x] 3.4 复核数字人领域抽象边界，确保能力停留在 feature 内，不提前提升到 `shared`

## 4. 数字人列表页改造

- [x] 4.1 改造 `src/pages/DigitalHumansPage.tsx`，将数据源从本地 mock 切换为真实数字人列表查询
- [x] 4.2 将当前创建弹窗改为参考弹窗对应的真实创建表单，支持名称、本地上传 / 远程 URL 切换、素材 URL、本地文件上传、训练类型、语种和错误帧跳过等字段
- [x] 4.3 将卡片动作改为真实链路动作：查看详情、刷新状态、删除，并移除与后端契约不一致的本地“启用/停用”行为
- [x] 4.4 补充创建弹窗交互测试，覆盖训练素材切换、必填校验、字段映射和取消/提交行为
- [x] 4.5 补充列表页的加载态、空态、失败态与删除确认交互测试

## 5. 数字人详情页补齐

- [x] 5.1 新增 `src/pages/DigitalHumanDetailPage.tsx`，承接详情查询和页面刷新恢复
- [x] 5.2 在详情页展示训练状态、进度、预览图、预览视频、尺寸、4K 支持和失败原因
- [x] 5.3 在详情页接入“刷新状态”和“删除数字人”动作，并处理成功后的缓存同步与返回逻辑
- [x] 5.4 为详情页补充成功态、处理中、失败态和未知状态兜底测试

## 6. 路由与菜单接入

- [x] 6.1 修改 `src/app/router/routeTypes.ts`，新增数字人详情页 route key
- [x] 6.2 修改 `src/app/router/routeRegistry.tsx`，注册 `/digital-humans/:humanId` 并标记为隐藏菜单页
- [x] 6.3 复核 `src/app/router/dynamicRoutes.ts` 中数字人菜单映射，确保列表页入口与现有后端组件标识一致
- [x] 6.4 为数字人列表页与详情页补充路由注册和动态映射测试

## 7. 验证与文档

- [x] 7.1 运行数字人相关 API、feature、页面和路由定向测试
- [x] 7.2 运行 `npm run typecheck`
- [ ] 7.3 运行 `npm test`
- [x] 7.4 运行 `npm run build`
- [ ] 7.5 手工验证“列表查询 -> 创建数字人 -> 查看详情 -> 刷新状态 -> 删除数字人”主链路
- [x] 7.6 更新 `doc/progress.md`；若全局进展文档编码仍异常，则同步更新 `doc/2026-06-23-digital-human-management-progress.md`
