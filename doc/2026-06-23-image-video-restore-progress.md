# 2026-06-23 文图生成视频页面还原修复进展

## 阶段 1：现状排查

### 已完成
- 已扫描当前项目中文图生成视频页面相关实现：
  - `src/pages/ImageVideoPage.tsx`
  - `src/shared/components/PageShell.tsx`
  - `src/app/layouts/DashboardLayout.tsx`
  - `src/app/styles.css`
- 已读取 Figma Make 设计源码与页面入口：
  - `src/app/components/ImageVideo.tsx`
  - `src/app/App.tsx`
- 已确认当前“还原度不够”不是单点样式问题，而是两类问题叠加：
  1. 历史中文编码异常，导致页面文案和布局壳层出现乱码。
  2. 当前页面结构明显少于设计稿，缺失多个关键区块。

### 当前差异结论
- 当前 `ImageVideoPage.tsx` 仅保留了：
  - 输入方式
  - 输入文案
  - 图片上传
  - 生成按钮
  - 右侧简单预览占位
- Figma 设计稿中还包含但当前页面缺失的核心结构：
  - 视频主题输入
  - 视频风格选择
  - 输出方式卡片组
  - 自动配音 / 自动字幕 / 添加 BGM 开关
  - 右侧生成前 / 生成中 / 生成成功三态预览
  - 更贴近设计稿的分栏比例、卡片层级与按钮视觉
- 共享布局 `DashboardLayout.tsx` 中也存在历史乱码文案，会影响整站观感一致性。

### Why
- 从第一性原理看，设计还原不是“把按钮颜色调一下”，而是“信息架构 + 视觉层级 + 文案语义”三者同时对齐。
- 如果页面缺少设计稿中的结构层，哪怕颜色和间距接近，用户仍会感觉“不像”。
- 这和后端接口设计类似：不是只把 URL 对上就算完成，还要把请求字段、状态流转和返回语义一并对齐。

### 下一步
- 先修复共享布局与页面中的乱码文案。
- 再补齐 Figma 中缺失的页面结构，优先保持现有真实创建任务链路不被破坏。
- 最后通过测试和浏览器截图做一次对照验证。

## 阶段 2：页面修复与验证

### 已完成
- 已重写 `src/pages/ImageVideoPage.tsx`，在保留真实创建任务链路的前提下补齐 Figma 核心结构：
  - 输入方式
  - 视频主题
  - 输入文案
  - 图片上传
  - 视频风格
  - 输出方式卡片组
  - 自动配音 / 自动字幕 / 添加 BGM 开关
  - 右侧预览区三态展示
- 已修复 `src/pages/ImageVideoPage.tsx` 中的中文乱码文案。
- 已修复 `src/app/layouts/DashboardLayout.tsx` 中的共享乱码文案：
  - 品牌名
  - 副标题
  - 顶部通知
  - 侧边栏折叠按钮
  - 用户昵称
- 已同步更新测试文件：
  - `src/pages/ImageVideoPage.test.tsx`
  - `src/app/layouts/DashboardLayout.test.tsx`

### 验证结果
- 已执行：
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/app/layouts/DashboardLayout.test.tsx`
  - 结果：`2 passed, 5 tests passed`
- 已执行：
  - `npm run build`
  - 结果：构建通过
- 当前仅剩一个历史构建 warning：
  - `Circular chunk: vendor -> react-vendor -> vendor`
  - 该问题与本次页面还原修复无直接关系，未阻塞交付

### 当前判断
- 这轮修复已经把“页面不像”从结构层拉回到了接近设计稿的状态，而不是只做了表层样式修补。
- 当前实现选择的是“设计结构更像 + 业务链路不丢”的平衡方案：
  - 点击“开始生成视频”仍然走真实 `createTextImageVideoTask`
  - 右侧成功态只做创建成功反馈，不伪造最终视频结果

### 下一步
- 如需继续追求 1:1 视觉还原，建议下一轮做浏览器截图对照，重点检查：
  - 卡片边框和阴影强度
  - 分栏宽度
  - 按钮渐变与选中态颜色
  - 右侧预览区域高度与留白

## 阶段 3：文图生视频详情页菜单高亮修复

### 已完成
- 已确认问题根因不在侧边栏组件本身，而在 `App.tsx` 的隐藏路由高亮策略：
  - 之前隐藏详情页统一回退到“第一个可见菜单”
  - 所以 `/image-video/tasks/:taskId` 会错误高亮到“工作台”
- 已为隐藏详情路由补充显式父菜单映射：
  - `content.imageVideoTaskDetail -> content.imageVideoTasks`
  - `content.viralRemixTaskDetail -> content.viralRemixTasks`
  - `content.digitalHumanDetail -> content.digitalHumans`
  - `content.digitalHumanVideoTaskDetail -> content.digitalHumanVideoTasks`
- 已在 `src/app/router/routeTypes.ts` 中为路由元信息增加 `activeMenuKey`
- 已在 `src/app/App.tsx` 中新增隐藏路由的父菜单解析逻辑，替代原先“默认回第一个可见菜单”的兜底策略
- 已同步补充回归测试：
  - `src/app/App.test.tsx`

### 验证结果
- 已执行：
  - `npm test -- src/app/App.test.tsx src/app/router/routeRegistry.test.ts`
  - 结果：`2 passed, 13 tests passed`

### 当前判断
- 现在“文图生视频详情”虽然仍是隐藏页，但会正确归属到“文图生视频任务”目录高亮，符合你说的“任务目录下一级并隐藏”的语义。
- 这次修复不是写死某个路径判断，而是给路由系统加了通用的“隐藏详情页归属父菜单”能力，后续其他任务详情页也能沿用。
