# 2026-06-27 追爆任务详情页滚动恢复进展

## 当前阶段
- 已定位本轮“内容不能滑动、外层也没有滚动条”的直接原因：
  - `DashboardLayout main`、`PageShell`、详情卡片都使用了 `overflow-hidden`
  - 详情页中间的 `Form` 没有承接 `height/flex`，导致内部主卡片拿不到真实剩余高度
  - 最终 `video-remix-step-scroll-body` 虽然声明了 `overflow-y-auto`，但没有形成有效滚动上下文

## 已完成修改
- `src/shared/components/PageShell.tsx`
  - 子内容承接层改为 `flex min-h-0 flex-1 flex-col`
  - 让页面子节点可以继续向下传递可计算高度
- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 为详情页 `Form` 增加 `flex h-full min-h-0 flex-col`
  - 主卡片改为 `flex min-h-0 flex-1 flex-col ... lg:min-h-[720px]`
  - 保留桌面端最低高度观感，同时优先保证内容区可滚
- `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 补充高度链测试，约束 `Form -> detail panel -> scroll body` 的滚动承接关系
  - 补充“口播文案 + 复刻方向”响应式横向双列布局测试
- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 将“口播文案”和“复刻方向”收敛为同一行双列布局
  - 保持移动端单列回落，桌面端使用 `xl` 断点并排展示
  - 修复多文件上传时同一批素材被重复触发的问题
  - 为参考视频、商品图、人物图、音频上传按钮补充 loading 状态
  - 移除页面顶部常驻成功/错误提示，改为 `message` 弹窗反馈

## 预期效果
- 标题区保持在上方
- 主卡片吃满工作区可用高度
- 中间步骤内容区可以内部滚动
- 桌面大屏仍保留较舒展的最小高度视觉

## 待验证
- 运行追爆任务详情页回归测试
- 运行整体回归测试
- 运行类型检查
