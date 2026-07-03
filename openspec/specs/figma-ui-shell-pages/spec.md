## Purpose
定义 AI-Hit-Factory 前端应用壳、静态路由注册、工作台导航结构和桌面窗口兼容性的长期主规格基线，作为后续页面接入和路由扩展的稳定依据。

## Requirements

### Requirement: 前端工程必须提供可运行的应用壳
系统 MUST 提供基于 Vite + React + TypeScript 的前端应用壳，且在本地开发与生产构建场景下都可正常启动。

#### Scenario: 本地开发启动成功
- **WHEN** 开发者安装依赖并启动前端开发服务
- **THEN** 系统 MUST 正常渲染 AI-Hit-Factory 应用壳，且不出现运行时白屏

#### Scenario: 生产构建成功
- **WHEN** 开发者执行生产构建命令
- **THEN** 系统 MUST 通过 TypeScript 编译与 Vite 构建

### Requirement: 应用壳必须提供工作台导航结构
系统 MUST 提供包含侧边导航、顶部区域和内容区域的工作台布局，并支持侧边栏折叠。

#### Scenario: 用户切换导航
- **WHEN** 用户点击侧边栏菜单项
- **THEN** 系统 MUST 渲染对应页面并高亮当前激活的菜单项

#### Scenario: 用户折叠侧边栏
- **WHEN** 用户触发侧边栏折叠操作
- **THEN** 系统 MUST 收缩侧边栏宽度，同时保留图标级导航能力

### Requirement: 前端必须维护静态路由注册表
系统 MUST 使用静态路由注册表维护 route key、路径、页面组件和路由元数据之间的映射，而不是依赖后端返回任意组件路径进行动态导入。

#### Scenario: 已注册路由正常渲染
- **WHEN** 应用命中一个已注册的 route key
- **THEN** 系统 MUST 渲染该 route key 对应的 React 页面组件

#### Scenario: 后续权限菜单接入静态映射
- **WHEN** 后端菜单返回 route key 或等价组件标识
- **THEN** 前端 MUST 基于静态注册表过滤可访问路由，而不是执行任意字符串形式的动态 import

### Requirement: 当前业务核心页面必须接入应用壳
系统 MUST 将当前仓库中已落地的核心业务页面接入统一应用壳与静态路由体系。

#### Scenario: 文图生视频任务页面可访问
- **WHEN** 用户访问 `/image-video`、`/image-video/tasks` 或 `/image-video/tasks/:taskId`
- **THEN** 系统 MUST 通过统一路由体系渲染入口页、任务列表页和任务详情页

#### Scenario: 追爆任务页面可访问
- **WHEN** 用户访问 `/viral-remix/tasks` 或 `/viral-remix/tasks/:taskId`
- **THEN** 系统 MUST 通过统一路由体系渲染任务列表页和任务详情页

#### Scenario: 数字人相关页面可访问
- **WHEN** 用户访问 `/digital-humans`、`/digital-humans/:humanId`、`/digital-humans/videos` 或 `/digital-humans/videos/:taskId`
- **THEN** 系统 MUST 通过统一路由体系渲染对应页面，并保持详情页为隐藏菜单路由

### Requirement: 桌面窗口兼容性必须可用
系统 MUST 在常见桌面浏览器窗口尺寸下保持应用壳和核心页面可用。

#### Scenario: 常见桌面尺寸可用
- **WHEN** 应用运行在 `1280x720`、`1366x768`、`1440x900`、`1536x864` 或 `1920x1080`
- **THEN** 系统 MUST 避免白屏、主要操作被裁切和不可恢复的布局重叠

#### Scenario: 较窄桌面宽度可用
- **WHEN** 应用运行在 `1024px` 到 `1279px` 宽度区间
- **THEN** 系统 MUST 通过折叠侧边栏、内部滚动或受控横向滚动保持主要导航与内容区可用
