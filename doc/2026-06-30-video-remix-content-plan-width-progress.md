# 2026-06-30 追爆内容方案输入框宽度调整进展

## 当前阶段

- 已定位到“新建追爆 / 追爆详情”页面的“内容方向 / 内容方案”区域
- 对应文件：`src/pages/VideoRemixTaskDetailPage.tsx`
- 当前关注的 3 个输入区域：
  - `productInfo`
  - `voiceoverScript`
  - `direction`

## 定位结论

- 这次不是 `Input.TextArea` 组件自身宽度不够
- 真正限制宽度的是外层布局容器
- 当前结构是：
  - `productInfo` 单独占一行
  - `voiceoverScript` 与 `direction` 共用一个横向容器 `video-remix-direction-horizontal-fields`

## 方案对比

### 方案 A：直接改输入框自身宽度

- 做法：给 3 个 `TextArea` 单独加 `className="w-full"` 或更大的固定宽度
- 优点：改动表面最小
- 缺点：父容器不放开时，子元素单独加宽效果有限，还容易撑坏布局

### 方案 B：调整外层布局容器

- 做法：放宽“内容方向 / 内容方案”区域的父级布局，让 3 个输入框在大屏下占用更多水平空间
- 优点：解决根因，三个输入框会自然变宽，布局更稳定
- 缺点：会动到一点点容器 class

## 推荐方案

- 推荐采用 **方案 B**
- 原因：这是更稳、更符合当前页面结构的改法，避免后续继续出现“子输入框想加宽但被父容器卡住”的问题

## 下一步

1. 已按布局调整方案修改 `src/pages/VideoRemixTaskDetailPage.tsx`
2. 已补充追爆详情页最小回归断言
3. 已完成定向验证与类型验证
4. 本文档已更新实施结果

## 本轮实施结果

### 已修改文件

- `src/pages/VideoRemixTaskDetailPage.tsx`
- `src/pages/VideoRemixTaskDetailPage.test.tsx`

### 实际改动

- 将 `video-remix-direction-horizontal-fields` 从无布局 class 的普通容器，调整为：
  - `grid`
  - `w-full`
  - `gap-6`
  - `xl:grid-cols-2`
- 为左右两个子块补充 `min-w-0`

### 改动效果

- “口播文案”和“复刻方向”两个输入区域在大屏下会按双列更宽展示
- 它们不再被原先过于保守的容器宽度压缩
- 页面在窄屏下仍保持单列，不会破坏响应式布局

## 验证结果

- 定向测试：
  - 命令：`npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：`1` 个测试文件通过，`24` 条测试全部通过
- 类型检查：
  - 命令：`npm run typecheck`
  - 结果：通过

## 当前结论

- 本轮已经从布局层解决了“内容方案输入框太窄”的主因
- 如果你后面还想再宽一点，下一步最合适的是继续调：
  - 这一区块与页面整体内容列的间距
  - 或者把 `productInfo` 也做成更强的横向铺满样式

## 追加调整：AI 按钮与标题同行

### 已完成

- 已将 `口播文案` 的 `AI 自动生成` 按钮并入 `Form.Item label`
- 已将 `产品信息` 的 `AI 自动生成` 按钮并入 `Form.Item label`

### 调整效果

- 按钮不再单独占据标题上方一行
- 现在视觉结构为：
  - 标题在左
  - `AI 自动生成` 按钮在右
  - 输入框在下一行

### 本轮验证

- 命令：`npm run typecheck`
- 结果：通过

### 当前遗留说明

- 追爆详情页定向测试里，有 1 条我临时补的“按钮与标题同行”断言还需要改成更稳的结构断言
- 这个问题不影响当前页面代码可编译，也不影响你这次要的 UI 效果

## 追加调整：左右输入框顶部对齐

### 根因

- 左侧 `口播文案` 的标题行里包含 `AI 自动生成` 按钮
- 右侧 `复刻方向` 只有普通标题文本
- 两边标题区高度不一致，所以输入框起始线看起来没有对齐

### 解决方式

- 没有去硬调输入框的 `margin-top`
- 而是把右侧 `复刻方向` 也改成和左侧同结构的 `label`
- 右侧标题行补了一个与按钮同尺寸的占位块：
  - `h-[32px]`
  - `w-[108px]`

### 结果

- `口播文案` 与 `复刻方向` 的输入框顶部现在会按同一条基线起始
- 后续即使保留左侧按钮，也不会再出现一边高一边低的错位感

### 本轮验证

- 定向测试：
  - 命令：`npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：`1` 个测试文件通过，`25` 条测试全部通过
- 类型检查：
  - 命令：`npm run typecheck`
  - 结果：通过

## 追加调整：口播文案与复刻方向输入框等高

### 调整原因

- 当前左右两列的标题行已经对齐
- 但如果继续看输入区域本体，`口播文案` 和 `复刻方向` 两个 `TextArea` 仍然需要显式统一高度
- 这样做的好处是后续无论内容是否为空，两个输入框的视觉块都会更整齐

### 实施方式

- 在 `src/pages/VideoRemixTaskDetailPage.tsx` 中提取统一样式常量：
  - `directionTextareaClassName = 'h-[132px] resize-none'`
- 将这套样式同时应用到：
  - `voiceoverScript`
  - `direction`
- 这次没有去改整列容器高度，也没有动下方说明文案，只控制输入框本体高度一致

### 测试补充

- 在 `src/pages/VideoRemixTaskDetailPage.test.tsx` 中新增结构断言
- 校验 `voiceover script` 与 `direction summary` 两个 textarea 都带有：
  - `h-[132px]`
  - `resize-none`

### 本轮验证

- 定向测试：
  - 命令：`npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：`1` 个测试文件通过，`26` 条测试全部通过
- 类型检查：
  - 命令：`npm run typecheck`
  - 结果：通过

### 当前结论

- `口播文案` 与 `复刻方向` 两个输入框现在已经是完全一致的输入区高度
- 同时保留了之前已经做好的：
  - 标题行按钮同排
  - 左右标题区占位对齐
  - 大屏双列更宽展示

## 追加调整：顶部页头收进内容区

### 本轮目标

- 去掉页面外层重复的任务标题展示
- 保留 `返回列表` 按钮
- 让顶部真正承担“操作入口 + 状态展示 + 步骤引导”的作用
- `任务名称` 与 `备注` 继续留在 `基础信息` 区域中编辑，不再和顶部重复

### 实施方案

- 在 `src/shared/components/PageShell.tsx` 中补充可选页头能力
  - 允许 `title`、`description` 不传
  - 只有在存在标题、描述或 actions 时才渲染外层页头
- 在 `src/pages/VideoRemixTaskDetailPage.tsx` 中移除外层 `PageShell` 标题和按钮
- 在详情卡片顶部新增内部头部区，结构调整为：
  - 左侧：`返回列表` + 页面说明
  - 右侧：`刷新详情` + 状态标签
  - 下方：步骤导航卡片

### 调整结果

- 页面首屏不再出现“顶部大标题一份、基础信息里任务名称再一份”的重复问题
- `返回列表` 仍然保留，而且已经移动到内容卡片顶部左侧
- 顶部头部区和步骤区被合并成一整块，首屏视觉高度更充分，层次也更完整
- `任务名称` 和 `备注` 继续在基础信息里编辑，交互路径保持清晰

### 测试补充

- 在 `src/pages/VideoRemixTaskDetailPage.test.tsx` 中新增结构断言
- 校验：
  - 外层不再出现 `追爆任务详情`
  - 内容卡片中包含 `返回列表`
  - 内容卡片中包含 `刷新详情`
  - 内容卡片中仍包含 `编辑视频追爆任务`

### 本轮验证

- 定向测试：
  - 命令：`npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：`1` 个测试文件通过，`27` 条测试全部通过
- 类型检查：
  - 命令：`npm run typecheck`
  - 结果：通过

## 追加调整：顶部头部收薄

### 问题判断

- 上一版虽然把外层页头收进了内容卡片
- 但顶部同时承载了：
  - 返回按钮
  - 刷新按钮
  - 状态标签
  - 标题说明
  - 步骤导航
- 这一整块叠在一起后，首屏头部显得偏高

### 本轮处理

- 在 `src/pages/VideoRemixTaskDetailPage.tsx` 中继续保留原有结构，不改交互层级
- 只对顶部视觉密度做轻量压缩：
  - 头部外壳由 `px-4 py-4 / lg:px-5 lg:py-5` 调整为 `px-3 py-3 / lg:px-4 lg:py-4`
  - 头部外层 `mb-6` 调整为 `mb-4`
  - 标题字号从 `text-[20px] / lg:text-[22px]` 调整为 `text-[18px] / lg:text-[20px]`
  - 说明文案缩短为单行短提示：`任务名称和备注在下方基础信息中填写`
  - 步骤卡片从 `p-4` 调整为 `px-4 py-3`
  - 步骤编号与说明的上下间距进一步压缩

### 测试同步

- 新增顶部头部紧凑样式断言，校验头部外壳包含：
  - `px-3`
  - `py-3`
- 顺手修稳了一个与本次布局无关、但在整组回归里偶发抖动的旧测试：
  - 将商品图预览初始断言从同步 `getAllByTestId` 调整为等待型 `findAllByTestId`

### 本轮验证

- 定向测试：
  - 命令：`npx vitest run --config vitest.video-remix-regression.config.ts src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 结果：`1` 个测试文件通过，`27` 条测试全部通过
- 类型检查：
  - 命令：`npm run typecheck`
  - 结果：通过

### 当前结论

- 顶部头部现在比上一版明显更薄
- 同时保留了：
  - 内容区顶部返回按钮
  - 刷新和状态
  - 步骤导航仍在头部区域
  - 任务名称与备注继续留在基础信息中编辑
