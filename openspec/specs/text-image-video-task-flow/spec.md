## Purpose
定义文图生视频任务从入口创建、分页列表、任务详情、状态显示到结果回看的长期主规格基线，作为该业务链路后续演进与回归验证的依据。

## Requirements

### Requirement: 用户必须能够创建文图生视频任务
系统 MUST 在文图生视频入口页允许已登录用户提交提示词与参考图，并在创建成功后进入可恢复的任务详情页。

#### Scenario: 创建任务成功
- **WHEN** 用户在文图生视频入口页填写提示词、上传参考图并提交创建
- **THEN** 前端 MUST 调用 `POST /api/v1/customer/text-image-video/tasks` 创建任务
- **THEN** 前端 MUST 使用返回的任务 `id` 跳转到对应详情页

#### Scenario: 创建参数不完整
- **WHEN** 用户缺少必填提示词或缺少参考图时尝试提交
- **THEN** 前端 MUST 阻止请求发送并显示明确的表单校验提示

### Requirement: 用户必须能够查询自己的文图生视频任务列表
系统 MUST 提供文图生视频任务列表页，支持分页、状态筛选、进入详情和删除任务。

#### Scenario: 按状态筛选任务
- **WHEN** 用户在任务列表页选择任务状态筛选条件
- **THEN** 前端 MUST 使用筛选参数调用 `GET /api/v1/customer/text-image-video/tasks`
- **THEN** 前端 MUST 仅渲染符合条件的分页结果

#### Scenario: 删除任务成功
- **WHEN** 用户确认删除某个任务
- **THEN** 前端 MUST 调用 `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- **THEN** 前端 MUST 在删除成功后刷新当前列表数据

### Requirement: 用户必须能够恢复查看任务详情与结果
系统 MUST 提供文图生视频任务详情页，并展示任务输入、当前状态、处理进度、结果视频和失败原因。

#### Scenario: 查看处理中任务
- **WHEN** 用户打开一个仍在处理中或排队中的任务详情页
- **THEN** 前端 MUST 调用 `GET /api/v1/customer/text-image-video/tasks/{id}` 获取最新任务详情
- **THEN** 前端 MUST 渲染状态文案与进度信息

#### Scenario: 查看已完成任务
- **WHEN** 用户打开一个已完成任务的详情页
- **THEN** 前端 MUST 展示结果视频、封面、时长以及原始输入信息

#### Scenario: 查看失败任务
- **WHEN** 用户打开一个失败任务的详情页
- **THEN** 前端 MUST 展示失败原因，并保留原始输入信息以便回看

### Requirement: 任务状态展示规则必须一致且有兜底
系统 MUST 在入口页、列表页和详情页使用一致的任务状态映射规则，并在未知状态码时保持页面可用。

#### Scenario: 已知状态码
- **WHEN** 后端返回已知的 `status` 与 `statusLabel`
- **THEN** 前端 MUST 在列表与详情页使用一致的状态文案与视觉标记

#### Scenario: 未知状态码
- **WHEN** 后端返回前端未预置的状态码
- **THEN** 前端 MUST 继续渲染任务信息，并优先使用后端返回的 `statusLabel` 或通用兜底文案

### Requirement: 文图生视频任务页面必须接入现有路由体系
系统 MUST 将文图生视频入口页、任务列表页和任务详情页接入统一静态路由注册表与动态菜单体系。

#### Scenario: 创建后进入详情页
- **WHEN** 用户在入口页创建任务成功
- **THEN** 前端 MUST 通过已注册的 `/image-video/tasks/:taskId` 路由进入任务详情页

#### Scenario: 从菜单进入任务列表
- **WHEN** 用户通过菜单或任务入口访问文图生视频任务列表页
- **THEN** 前端 MUST 正确命中 `/image-video/tasks` 路由，并保持登录态与权限守卫行为一致
