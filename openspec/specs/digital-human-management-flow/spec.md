## Purpose
定义数字人管理能力从分页列表、创建提交流程、详情恢复、状态刷新到删除回收的长期主规格基线，作为数字人工作链路的稳定业务文档。

## Requirements

### Requirement: 用户必须能够查询数字人列表
系统 MUST 提供数字人管理页，并通过真实接口分页展示当前用户可访问的数字人列表，支持关键字搜索和状态筛选。

#### Scenario: 按关键字和状态筛选数字人
- **WHEN** 用户在数字人管理页输入关键字或选择状态筛选条件
- **THEN** 前端 MUST 使用对应的 `keyword` 和 `status` 参数调用 `GET /api/aigc/digital-persons`
- **THEN** 前端 MUST 仅显示符合条件的分页结果

#### Scenario: 切换分页
- **WHEN** 用户切换页码或每页条数
- **THEN** 前端 MUST 使用新的 `pageNum` 和 `pageSize` 重新请求 `GET /api/aigc/digital-persons`
- **THEN** 前端 MUST 渲染新的列表结果和总数信息

### Requirement: 用户必须能够创建数字人
系统 MUST 提供数字人创建入口，并按后端契约提交名称、训练素材、本地文件或远程地址以及训练参数。

#### Scenario: 打开创建入口
- **WHEN** 用户打开“新建数字人”入口
- **THEN** 前端 MUST 展示名称输入、训练素材来源切换、训练类型、语种和错误帧跳过等核心字段

#### Scenario: 使用本地文件创建
- **WHEN** 用户填写名称并选择本地训练素材文件后提交
- **THEN** 前端 MUST 使用 `multipart/form-data` 调用 `POST /api/aigc/digital-persons`
- **THEN** 前端 MUST 在创建成功后进入返回的数字人详情页

#### Scenario: 使用远程地址创建
- **WHEN** 用户填写名称并提供远程 `fileUrl` 后提交
- **THEN** 前端 MUST 调用 `POST /api/aigc/digital-persons`
- **THEN** 前端 MUST 确保本地文件与 `fileUrl` 不会同时作为有效训练输入提交

#### Scenario: 缺少必填字段
- **WHEN** 用户缺少名称，或既没有本地文件也没有 `fileUrl` 时尝试提交
- **THEN** 前端 MUST 阻止请求发送并显示明确的表单校验提示

### Requirement: 用户必须能够恢复查看数字人详情
系统 MUST 提供数字人详情页，并在页面刷新后仍能根据数字人标识恢复训练状态、预览结果和失败原因。

#### Scenario: 查看训练中的数字人
- **WHEN** 用户打开一个仍在训练中的数字人详情页
- **THEN** 前端 MUST 调用 `GET /api/aigc/digital-persons/{id}` 获取最新详情
- **THEN** 前端 MUST 渲染当前状态、进度和基础预览信息

#### Scenario: 查看训练成功的数字人
- **WHEN** 用户打开一个训练成功的数字人详情页
- **THEN** 前端 MUST 展示 `previewUrl`、`previewVideoUrl`、尺寸信息和可用能力摘要

#### Scenario: 查看训练失败的数字人
- **WHEN** 用户打开一个训练失败的数字人详情页
- **THEN** 前端 MUST 展示 `errReason` 或 `errorMessage`
- **THEN** 前端 MUST 保留该数字人的上下文信息，避免页面因失败状态而丢失

### Requirement: 用户必须能够刷新和删除数字人
系统 MUST 允许用户刷新单个数字人的最新状态，并删除不再需要的数字人。

#### Scenario: 刷新数字人状态
- **WHEN** 用户在列表页或详情页触发刷新状态动作
- **THEN** 前端 MUST 调用 `GET /api/aigc/digital-persons/{id}/refresh`
- **THEN** 前端 MUST 在刷新成功后更新对应列表项或详情页数据

#### Scenario: 删除数字人
- **WHEN** 用户确认删除某个数字人
- **THEN** 前端 MUST 调用 `DELETE /api/aigc/digital-persons/{id}`
- **THEN** 前端 MUST 在删除成功后刷新列表，或从详情页返回列表页

### Requirement: 数字人页面必须接入统一路由与权限体系
系统 MUST 将数字人列表页与详情页接入统一静态路由注册表、动态菜单映射和登录权限守卫体系。

#### Scenario: 从菜单进入数字人管理
- **WHEN** 用户通过工作台菜单访问数字人管理
- **THEN** 前端 MUST 正确命中 `/digital-humans` 路由并保持登录态校验行为一致

#### Scenario: 从列表进入数字人详情页
- **WHEN** 用户点击某个数字人的“查看详情”
- **THEN** 前端 MUST 跳转到 `/digital-humans/:humanId`
- **THEN** 前端 MUST 将详情页作为隐藏菜单路由处理，而不是依赖临时本地弹窗状态

### Requirement: 数字人状态展示必须具备一致兜底规则
系统 MUST 在数字人列表页和详情页使用一致的状态展示映射，并在未知状态码时保持页面可用。

#### Scenario: 已知状态码与标签
- **WHEN** 后端返回 `status` 与 `statusLabel`
- **THEN** 前端 MUST 在列表页和详情页显示一致的状态文案与视觉标记

#### Scenario: 未知状态码
- **WHEN** 后端返回前端未显式映射的状态码
- **THEN** 前端 MUST 继续渲染数字人信息
- **THEN** 前端 MUST 优先使用后端返回的 `statusLabel` 或通用兜底文案展示状态
