## Purpose
定义后端菜单路由接入、静态组件白名单映射、登录跳转、403/404 和受保护页面初始化恢复逻辑的长期主规格基线，约束动态路由的安全边界。

## Requirements

### Requirement: 动态菜单路由必须通过统一接口获取
系统 MUST 通过 `GET /api/v1/menus/routes` 获取已认证用户的菜单路由元数据。

#### Scenario: 接口返回合法路由树
- **WHEN** 已认证用户请求当前菜单路由
- **THEN** 前端 MUST 接收包含 `path`、`component`、`redirect`、`name`、`meta` 和可选 `children` 的路由树结构

#### Scenario: children 结构异常
- **WHEN** 某个路由节点的 `children` 不是数组
- **THEN** 前端 MUST 将其规范化为空数组，而不是导致初始化失败

### Requirement: 后端组件标识必须走白名单映射
系统 MUST 通过显式白名单，将后端返回的 `component` 标识映射为前端静态注册的 `RouteKey`。

#### Scenario: 已知组件标识
- **WHEN** 后端返回的 `component` 命中白名单
- **THEN** 前端 MUST 将其映射到对应的 `RouteKey` 并渲染静态注册页面

#### Scenario: 未知组件标识
- **WHEN** 后端返回未收录的 `component`
- **THEN** 前端 MUST 过滤该节点，并且 MUST NOT 对该字符串执行动态 import

### Requirement: 动态菜单元数据必须被转换为前端路由与菜单模型
系统 MUST 将后端返回的 `meta` 信息转换为前端菜单树、可访问路由集合和外链菜单项。

#### Scenario: 隐藏菜单项
- **WHEN** 节点 `meta.hidden` 为 `true`
- **THEN** 前端 MUST 在侧边栏隐藏该节点，但若其映射到合法路由则仍保留直接访问能力

#### Scenario: KeepAlive 元数据
- **WHEN** 节点 `meta.keepAlive` 为 `true`
- **THEN** 前端 MUST 将其映射到路由缓存相关元数据

#### Scenario: 外部跳转地址
- **WHEN** 节点 `redirect` 为 `http` 或 `https` URL
- **THEN** 前端 MUST 将其识别为外链导航项，而不是 React Router 内部路由

### Requirement: 受保护页面渲染前必须完成动态路由初始化
系统 MUST 在渲染已认证业务页面前先完成动态菜单加载和路由转换。

#### Scenario: 刷新受保护页面
- **WHEN** 已认证用户刷新某个受保护业务路由
- **THEN** 前端 MUST 先加载动态菜单并恢复可访问路由，再渲染目标页面，而不是直接落到 404

#### Scenario: 菜单仍在加载
- **WHEN** 动态菜单尚未完成加载
- **THEN** 前端 MUST 展示加载态或骨架态，而不是提前渲染 403 或 404

#### Scenario: 菜单因认证过期加载失败
- **WHEN** 动态菜单请求因登录态失效而失败
- **THEN** 前端 MUST 清理会话状态并跳转到登录流程

### Requirement: 登录跳转与错误页行为必须一致
系统 MUST 统一处理未登录跳转、登录后回跳、403、404 和登录失效回跳。

#### Scenario: 未登录访问受保护路由
- **WHEN** 未登录用户访问 `requiresAuth: true` 的路由
- **THEN** 前端 MUST 跳转到 `/login?redirect=<当前路径>` 并保留登录后回跳目标

#### Scenario: 登录失效事件发生
- **WHEN** 前端识别到登录已失效
- **THEN** 系统 MUST 清理会话状态并跳转到登录页，同时保留来源路径用于恢复

#### Scenario: 命中无权限或不存在页面
- **WHEN** 用户访问已知但无权限的路由
- **THEN** 系统 MUST 渲染 403 页面
- **THEN** 系统 MUST 在访问不存在路由时渲染 404 页面
