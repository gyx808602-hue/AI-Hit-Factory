## ADDED Requirements

### Requirement: 用户可以查看数字人形象分页列表
系统 SHALL 提供数字人形象管理页，并通过真实接口分页展示当前用户可访问的数字人形象列表，支持关键字搜索和状态筛选。

#### Scenario: 用户按关键字和状态筛选数字人
- **WHEN** 用户在数字人管理页输入关键字或选择状态筛选条件
- **THEN** 系统 MUST 使用对应的 `keyword` 和 `status` 参数调用 `GET /api/aigc/digital-persons`
- **THEN** 系统 MUST 仅展示符合条件的当前页数字人列表结果

#### Scenario: 用户切换分页
- **WHEN** 用户切换页码或每页条数
- **THEN** 系统 MUST 使用新的 `pageNum` 和 `pageSize` 重新请求 `GET /api/aigc/digital-persons`
- **THEN** 系统 MUST 在页面中展示新的分页结果和总数信息

### Requirement: 用户可以创建数字人形象
系统 SHALL 提供真实的数字人创建入口，并按照后端契约提交名称、训练素材文件或远程素材地址，以及相关训练参数。

#### Scenario: 创建弹窗字段与交互满足参考结构
- **WHEN** 用户打开“新建数字人”弹窗
- **THEN** 系统 MUST 展示数字人名称输入框
- **THEN** 系统 MUST 展示“本地上传 / 远程 URL”训练素材切换控件
- **THEN** 系统 MUST 展示训练类型下拉、语种下拉、跳过错误帧开关以及取消/提交操作

#### Scenario: 用户切换到远程 URL 模式
- **WHEN** 用户在训练素材区域切换到“远程 URL”
- **THEN** 系统 MUST 展示素材 URL 输入框
- **THEN** 系统 MUST 以远程 URL 模式作为当前有效训练素材输入来源

#### Scenario: 用户切换到本地上传模式
- **WHEN** 用户在训练素材区域切换到“本地上传”
- **THEN** 系统 MUST 展示本地文件选择或上传控件
- **THEN** 系统 MUST 不把远程 URL 作为当前有效训练素材输入来源

#### Scenario: 用户通过本地文件创建数字人
- **WHEN** 用户填写数字人名称并选择本地训练素材文件后提交创建
- **THEN** 系统 MUST 使用 `multipart/form-data` 调用 `POST /api/aigc/digital-persons`
- **THEN** 系统 MUST 在创建成功后使用返回的数字人本地 UUID 进入该数字人的详情页

#### Scenario: 用户通过远程文件地址创建数字人
- **WHEN** 用户填写数字人名称并提供远程 `fileUrl` 后提交创建
- **THEN** 系统 MUST 调用 `POST /api/aigc/digital-persons`
- **THEN** 系统 MUST 确保 `file` 与 `fileUrl` 不会同时作为有效创建输入提交

#### Scenario: 用户缺少必填字段
- **WHEN** 用户未填写名称，或既没有上传 `file` 也没有填写 `fileUrl` 时尝试提交
- **THEN** 系统 MUST 阻止请求发送
- **THEN** 系统 MUST 显示明确的表单校验提示

#### Scenario: 用户提交训练类型、语种和错误帧跳过参数
- **WHEN** 用户在创建弹窗中选择训练类型、语种并设置跳过错误帧开关后提交
- **THEN** 系统 MUST 将这些字段映射为 `trainType`、`language` 和 `errorSkip` 提交到创建接口

### Requirement: 用户可以查看并恢复数字人详情
系统 SHALL 提供数字人详情页，在页面刷新后仍可根据数字人本地 UUID 恢复查看训练状态、预览结果和失败原因。

#### Scenario: 用户查看训练中的数字人
- **WHEN** 用户打开一个仍在训练中或处理中状态的数字人详情页
- **THEN** 系统 MUST 调用 `GET /api/aigc/digital-persons/{id}` 获取最新详情
- **THEN** 系统 MUST 展示当前状态、进度和基础预览信息

#### Scenario: 用户查看训练成功的数字人
- **WHEN** 用户打开一个训练成功的数字人详情页
- **THEN** 系统 MUST 展示 `previewUrl`、`previewVideoUrl`、`width`、`height` 与 `support4k` 等结果信息
- **THEN** 系统 MUST 保留该数字人的原始基础信息，便于用户回看

#### Scenario: 用户查看训练失败的数字人
- **WHEN** 用户打开一个训练失败的数字人详情页
- **THEN** 系统 MUST 展示 `errReason` 或 `errorMessage`
- **THEN** 系统 MUST 不因失败状态而丢失数字人详情页上下文

### Requirement: 用户可以刷新和删除数字人形象
系统 SHALL 允许用户在数字人管理链路中刷新单个数字人的最新状态，并删除不再需要的数字人形象。

#### Scenario: 用户刷新数字人状态
- **WHEN** 用户在列表页或详情页触发刷新数字人状态动作
- **THEN** 系统 MUST 调用 `GET /api/aigc/digital-persons/{id}/refresh`
- **THEN** 系统 MUST 在刷新成功后更新对应列表项或详情数据

#### Scenario: 用户删除数字人
- **WHEN** 用户确认删除某个数字人
- **THEN** 系统 MUST 调用 `DELETE /api/aigc/digital-persons/{id}`
- **THEN** 系统 MUST 在删除成功后刷新当前列表，或在详情页删除成功后返回列表页

### Requirement: 数字人管理页必须接入现有路由与权限体系
系统 SHALL 将数字人管理列表页和详情页接入当前静态路由注册表与动态菜单映射体系，并保持与现有工作台页面一致的登录态和权限守卫行为。

#### Scenario: 用户从菜单进入数字人管理页
- **WHEN** 用户通过工作台菜单访问数字人管理
- **THEN** 系统 MUST 正确命中 `/digital-humans` 的静态路由注册项
- **THEN** 系统 MUST 保持现有需要登录的路由守卫行为一致

#### Scenario: 用户从列表进入数字人详情页
- **WHEN** 用户点击某个数字人的查看详情动作
- **THEN** 系统 MUST 跳转到 `/digital-humans/:humanId`
- **THEN** 系统 MUST 将详情页作为已注册但隐藏菜单的路由处理，而不是临时本地弹窗状态

### Requirement: 数字人状态展示必须具备一致兜底规则
系统 SHALL 在数字人列表页和详情页使用一致的状态展示规则，并在未知状态码下保持页面可用。

#### Scenario: 后端返回已知状态和标签
- **WHEN** 后端返回 `status` 与 `statusLabel`
- **THEN** 系统 MUST 在列表页和详情页展示一致的状态文案和视觉标记

#### Scenario: 后端返回前端未预置的状态码
- **WHEN** 后端返回前端未显式映射的状态码
- **THEN** 系统 MUST 继续渲染数字人信息
- **THEN** 系统 MUST 使用后端返回的 `statusLabel` 或通用兜底文案展示状态，而不能导致白屏或核心动作失效
