## ADDED Requirements

### Requirement: 用户可以创建文图生视频任务

系统 SHALL 在文图生视频入口页允许已登录用户提交参考图、提示词和可选模型，并在创建成功后使用后端返回的任务 ID 进入可恢复的任务详情页。

#### Scenario: 创建任务成功
- **WHEN** 用户在文图生视频入口页填写提示词、上传参考图并提交创建
- **THEN** 系统 MUST 调用 `POST /api/v1/customer/text-image-video/tasks` 创建任务
- **THEN** 系统 MUST 使用返回的任务 ID 跳转到该任务的详情页

#### Scenario: 创建参数不完整
- **WHEN** 用户缺少必填提示词或缺少参考图时尝试提交
- **THEN** 系统 MUST 阻止请求发送
- **THEN** 系统 MUST 给出明确的表单校验提示

### Requirement: 用户可以查看自己的文图生视频任务列表

系统 SHALL 提供文图生视频任务列表页，支持分页查询、状态筛选、进入详情页和删除任务。

#### Scenario: 按状态筛选任务
- **WHEN** 用户在任务列表页选择任务状态筛选条件
- **THEN** 系统 MUST 使用选中的状态参数调用 `GET /api/v1/customer/text-image-video/tasks`
- **THEN** 系统 MUST 只展示符合筛选条件的任务列表结果

#### Scenario: 删除任务成功
- **WHEN** 用户在任务列表页确认删除某个任务
- **THEN** 系统 MUST 调用 `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- **THEN** 系统 MUST 在删除成功后刷新当前列表数据

### Requirement: 用户可以恢复查看任务详情和结果

系统 SHALL 提供文图生视频任务详情页，并在详情页展示任务输入信息、当前状态、处理进度、结果视频和失败原因。

#### Scenario: 查看处理中任务
- **WHEN** 用户打开一个仍在处理中或排队中的任务详情页
- **THEN** 系统 MUST 调用 `GET /api/v1/customer/text-image-video/tasks/{id}` 获取最新详情
- **THEN** 系统 MUST 展示当前状态文案和进度信息

#### Scenario: 查看已完成任务
- **WHEN** 用户打开一个已经完成的视频任务详情页
- **THEN** 系统 MUST 展示结果视频地址、封面地址和时长信息
- **THEN** 系统 MUST 允许用户回看该任务的原始提示词和参考图

#### Scenario: 查看失败任务
- **WHEN** 用户打开一个执行失败的任务详情页
- **THEN** 系统 MUST 展示失败原因或最近一次同步错误信息
- **THEN** 系统 MUST 保留任务输入信息，便于用户理解失败上下文

### Requirement: 文图生视频任务状态显示必须一致

系统 SHALL 在入口页、任务列表页和任务详情页使用一致的任务状态映射规则，且未知状态不得导致页面白屏或核心动作失效。

#### Scenario: 后端返回已知状态
- **WHEN** 后端返回带有 `status` 和 `statusLabel` 的任务状态
- **THEN** 系统 MUST 在列表和详情页使用一致的状态文案和视觉标记

#### Scenario: 后端返回未知状态码
- **WHEN** 后端返回前端未预置的状态码
- **THEN** 系统 MUST 继续渲染任务信息
- **THEN** 系统 MUST 使用后端返回的 `statusLabel` 或通用兜底文案展示状态

### Requirement: 文图生视频任务页面必须接入现有路由体系

系统 SHALL 将文图生视频任务入口页、任务列表页和任务详情页接入现有静态路由注册表与动态菜单映射体系。

#### Scenario: 从入口页进入详情页
- **WHEN** 用户在文图生视频入口页创建成功
- **THEN** 系统 MUST 通过已注册的详情页路由进入目标任务详情页

#### Scenario: 从菜单或任务页进入列表页
- **WHEN** 用户通过动态菜单映射或任务入口访问文图生视频任务列表页
- **THEN** 系统 MUST 正确命中静态路由注册表中的文图生视频任务列表路由
- **THEN** 系统 MUST 保持登录态和权限守卫行为与现有工作台页面一致
