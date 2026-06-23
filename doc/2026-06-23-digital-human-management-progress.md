# 2026-06-23 数字人管理任务进展

## 已完成

- 已先阅读 `用户端.md`，并确认数字人相关接口分为两组：
  - 数字人形象库：`/api/aigc/digital-persons`
  - 数字人视频任务：`/api/aigc/digital-person-videos`
- 已复核当前仓库的数字人入口页：
  - `src/pages/DigitalHumansPage.tsx`
  - 当前仍是 Figma 演示态，本地 mock 语义与真实后端契约不一致
- 已确认本次任务先聚焦“数字人形象管理”，不把数字人视频任务流塞进同一个 change
- 已创建并补齐 OpenSpec change：
  - `openspec/changes/add-digital-human-management-flow/`
  - `proposal.md`
  - `design.md`
  - `specs/digital-human-management-flow/spec.md`
  - `tasks.md`
- 已根据参考弹窗补强 OpenSpec，明确创建弹窗字段与交互要求：
  - 数字人名称
  - 本地上传 / 远程 URL 切换
  - 素材 URL 输入
  - 训练类型
  - 语种
  - 跳过错误帧
  - 取消 / 提交

## 第一阶段完成：API 与 feature 基础层

- 已新增：
  - `src/api/aigc/digital-persons/types.ts`
  - `src/api/aigc/digital-persons/index.ts`
  - `src/api/aigc/digital-persons/index.test.ts`
  - `src/features/digital-human/status.ts`
  - `src/features/digital-human/status.test.ts`
  - `src/features/digital-human/form.ts`
  - `src/features/digital-human/form.test.ts`
- 已完成的能力：
  - `digital-persons` 列表、详情、创建、删除、刷新接口封装
  - `records / total / current / size` 到稳定分页结构的适配
  - 本地文件模式与远程 URL 模式的创建请求映射
  - 状态展示兜底规则
  - 创建弹窗默认值、校验与 `file / fileUrl` 互斥映射
- 已完成验证：
  - `npm test -- src/api/aigc/digital-persons/index.test.ts`
  - `npm test -- src/features/digital-human/status.test.ts src/features/digital-human/form.test.ts`

## 第二阶段完成：hooks 层

- 已新增：
  - `src/features/digital-human/hooks.ts`
  - `src/features/digital-human/hooks.test.ts`
- 已完成的 hooks 能力：
  - `useDigitalHumanPage`
  - `useDigitalHumanDetail`
  - `useCreateDigitalHumanMutation`
  - `useDeleteDigitalHumanMutation`
  - `useRefreshDigitalHumanMutation`
- 已固定的缓存策略：
  - 创建成功后写入详情缓存，并失效数字人列表缓存
  - 删除成功后移除详情缓存，并失效数字人列表缓存
  - 刷新成功后同步更新详情缓存和当前已加载列表缓存
- 已确认领域边界：
  - 数字人查询 key、缓存策略和 mutation 逻辑都保持在 `src/features/digital-human/`
  - 当前没有提前抽到 `shared`，避免过早抽象
- 本阶段已通过验证：
  - `npm test -- src/features/digital-human/hooks.test.ts`

## 第三阶段完成：数字人列表页

- 已改造：
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/DigitalHumansPage.test.tsx`
- 已完成的页面能力：
  - 列表页从本地 mock 切换为真实数字人列表查询
  - 搜索词与状态筛选接入查询参数
  - 创建弹窗按参考结构重建：
    - 名称
    - 本地上传 / 远程 URL
    - 素材 URL
    - 本地文件上传
    - 训练类型
    - 语种
    - 跳过错误帧
  - 卡片动作已切换为：
    - 查看详情
    - 刷新状态
    - 删除
  - 已移除与后端契约不一致的本地“启用 / 停用”行为
  - 已补齐加载态、空态、失败态与删除确认链路
  - 已补齐基础分页显示
- 本阶段已通过验证：
  - `npm test -- src/pages/DigitalHumansPage.test.tsx`

## 第四阶段完成：详情页与路由

- 已新增：
  - `src/pages/DigitalHumanDetailPage.tsx`
  - `src/pages/DigitalHumanDetailPage.test.tsx`
- 已改造：
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
- 已补齐的能力：
  - 数字人详情查询承接
  - 详情页状态、进度、预览图、预览视频、尺寸、4K 支持与失败原因展示
  - 详情页“刷新状态”动作
  - 详情页“删除数字人”动作与返回列表逻辑
  - `/digital-humans/:humanId` 隐藏菜单路由注册
  - 数字人动态菜单映射测试
- 已补齐的测试：
  - 详情页成功态、失败态、处理中、加载失败
  - 路由注册测试
  - 动态路由映射测试
- 本阶段已通过验证：
  - `npm test -- src/pages/DigitalHumanDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`

## 第五阶段完成：最终验证

- 已通过的验证：
  - `npm test -- src/api/aigc/digital-persons/index.test.ts src/features/digital-human/status.test.ts src/features/digital-human/form.test.ts src/features/digital-human/hooks.test.ts src/pages/DigitalHumansPage.test.tsx src/pages/DigitalHumanDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
  - `npm run typecheck`
  - `npm run build`
- 当前未完全通过的验证：
  - `npm test`
- 当前全量测试失败原因：
  - 失败不在本次数字人改动链路
  - 当前仓库仍有既有测试 `src/pages/VideoRemixTaskDetailPage.test.tsx` 的 3 个断言与页面现状不一致
  - 失败点包括：
    - 缺少 `video-remix-basic-section` 等 `data-testid`
    - 断言文案仍查找“保存”“刷新详情”，但当前页面按钮文案为“保存表单”“刷新状态”
- 这说明：
  - 本次数字人管理功能自身链路已通过定向验证
  - 仓库全量测试还需要单独处理 `VideoRemixTaskDetailPage` 的既有测试问题

## 当前判断

- 当前最合理的边界仍然是先把 `/digital-humans` 从 mock 管理页改成真实数字人形象库页面
- 当前 mock 页面中的“启用 / 停用、性别、风格、音色”不是后端真实创建字段，后续实现必须以后端契约为准
- 当前创建弹窗已经在 OpenSpec 中被明确约束，不再回退为模糊的“支持创建数字人”
- `errorSkip` 仍保留一个谨慎点：
  - 参考弹窗看起来默认开启
  - 后端文档写的是默认 `false`
  - 当前实现仍以后端契约默认值为准，避免 UI 默认态与真实提交语义冲突

## OpenSpec 进度

- 当前已完成任务：
  - `1.1`
  - `1.2`
  - `1.3`
  - `2.1`
  - `2.2`
  - `2.3`
  - `2.4`
  - `3.1`
  - `3.2`
  - `3.3`
  - `3.4`
  - `4.1`
  - `4.2`
  - `4.3`
  - `4.4`
  - `4.5`
  - `5.1`
  - `5.2`
  - `5.3`
  - `5.4`
  - `6.1`
  - `6.2`
  - `6.3`
  - `6.4`
  - `7.1`
  - `7.2`
  - `7.4`
  - `7.6`

## 下一步

1. 若你希望我继续收尾，我下一步可以直接修复 `src/pages/VideoRemixTaskDetailPage.test.tsx` 对应的既有全量测试失败。
2. 之后再重新运行 `npm test`，争取把 `7.3` 一并勾掉。
3. 若需要，我也可以继续补 `7.5` 的手工验证记录说明。
