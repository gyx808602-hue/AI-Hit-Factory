## Purpose
定义视频追爆任务从入口创建、服务端持久化编辑、提示词与视频生成动作流到结果回看的长期主规格基线，约束任务态页面的核心行为。

## Requirements

### Requirement: 视频追爆入口必须先创建持久化任务
系统 MUST 将视频追爆入口页作为任务创建入口，并在用户继续编辑和生成前先创建持久化任务。

#### Scenario: 用户从入口页创建任务
- **WHEN** 已登录用户在视频追爆入口页提交基础创建动作
- **THEN** 前端 MUST 调用 `POST /customer/aigc/video-remix-tasks` 创建任务
- **THEN** 前端 MUST 使用返回的任务 `id` 跳转到 `/viral-remix/tasks/:taskId`

#### Scenario: 创建失败
- **WHEN** 任务创建请求失败
- **THEN** 前端 MUST 保持用户停留在入口页，并显示可操作的错误提示

### Requirement: 用户必须能够查询视频追爆任务列表
系统 MUST 提供视频追爆任务列表页，支持查询、筛选、回看详情和删除。

#### Scenario: 查询任务列表
- **WHEN** 用户打开视频追爆任务列表页
- **THEN** 前端 MUST 调用 `GET /customer/aigc/video-remix-tasks` 加载分页任务数据
- **THEN** 前端 MUST 渲染任务名称、状态、进度、结果摘要和更新时间

#### Scenario: 删除任务
- **WHEN** 用户确认删除某个追爆任务
- **THEN** 前端 MUST 调用 `DELETE /customer/aigc/video-remix-tasks/{id}` 并在成功后更新列表状态

### Requirement: 任务详情页必须支持服务端草稿恢复与保存
系统 MUST 提供任务详情页，并将可编辑表单作为服务端任务状态的一部分进行恢复与保存。

#### Scenario: 打开已有任务详情页
- **WHEN** 用户访问 `/viral-remix/tasks/:taskId`
- **THEN** 前端 MUST 调用 `GET /customer/aigc/video-remix-tasks/{id}` 恢复任务状态字段与已保存的表单字段

#### Scenario: 保存表单
- **WHEN** 用户在详情页执行保存操作
- **THEN** 前端 MUST 调用 `PUT /customer/aigc/video-remix-tasks/{id}/form`
- **THEN** 前端 MUST 使用最新服务端响应更新本地详情视图

### Requirement: 任务详情页必须支持服务端定义的生成动作流
系统 MUST 支持提示词检查、提示词生成、视频生成和状态刷新动作，并保持详情页状态同步。

#### Scenario: 检查提示词
- **WHEN** 用户触发提示词检查
- **THEN** 前端 MUST 调用 `POST /customer/aigc/video-remix-tasks/{id}/check-prompt` 并在同页显示结果

#### Scenario: 生成提示词
- **WHEN** 用户触发提示词生成
- **THEN** 前端 MUST 调用 `POST /customer/aigc/video-remix-tasks/{id}/generate-prompt`
- **THEN** 前端 MUST 更新 `generatedPrompt`、提示词来源与相关时间字段

#### Scenario: 生成视频
- **WHEN** 用户触发视频生成
- **THEN** 前端 MUST 调用 `POST /customer/aigc/video-remix-tasks/{id}/generate-video`
- **THEN** 前端 MUST 保持详情页与服务端返回的最新任务状态同步

#### Scenario: 手动刷新状态
- **WHEN** 用户触发任务刷新
- **THEN** 前端 MUST 调用 `GET /customer/aigc/video-remix-tasks/{id}/refresh`
- **THEN** 前端 MUST 更新状态、进度、失败原因和结果字段

### Requirement: 结果与失败信息必须直接来源于任务持久化状态
系统 MUST 基于服务端持久化任务状态渲染任务进度、生成结果和失败原因，而不是仅依赖本地临时 UI 假设。

#### Scenario: 任务成功
- **WHEN** 任务详情中包含 `videoUrl`、`coverUrl` 或 `duration` 等结果字段
- **THEN** 前端 MUST 渲染生成结果区域并提供回看能力

#### Scenario: 任务失败
- **WHEN** 任务详情中包含失败状态与 `errReason`
- **THEN** 前端 MUST 显示失败原因，并保留任务以便后续刷新或再次进入

### Requirement: 视频追爆任务页面必须接入统一路由模型
系统 MUST 将视频追爆任务列表页与详情页接入静态路由注册表与动态菜单映射模型。

#### Scenario: 注册任务列表与详情页
- **WHEN** 前端注册视频追爆任务页面
- **THEN** 系统 MUST 为任务列表页和详情页定义明确的 route key，而不是使用临时未注册路由

#### Scenario: 详情页保持隐藏菜单
- **WHEN** 详情页被注册
- **THEN** 系统 MUST 将其标记为隐藏菜单路由，同时保留直接导航与 activeMenuKey 行为
