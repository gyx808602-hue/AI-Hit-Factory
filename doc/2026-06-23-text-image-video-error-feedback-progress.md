# 2026-06-23 文图生视频接口报错提示与防抖修复

## 已完成
- 已补齐文图生视频任务链路的接口报错提示闭环：
  - 在 `src/app/App.tsx` 接入全局 `request:error` 事件监听
  - 使用 `antd` 的 `message.error` 统一展示请求层错误
- 已增加全局错误去重：
  - 同一条错误文案在短时间内只展示一次
  - 避免同接口连续失败时出现 message 刷屏
- 已补齐详情页“局部展示优先”的错误策略：
  - `src/pages/TextImageVideoTaskDetailPage.tsx` 的详情查询改为 `silentError: true`
  - 保留页面内 `Alert` 展示，避免全局 toast 与局部错误重复出现
- 已补齐列表页删除操作防抖/防重入：
  - `src/pages/TextImageVideoTasksPage.tsx` 在删除入口增加同步锁
  - 同一个任务删除进行中时，重复点击不会再次发起请求
  - 删除按钮会进入 loading/disabled 状态
- 已兼容文图生视频 API 封装的新旧调用方式：
  - `src/api/customer/text-image-video/index.ts`
  - 既支持直接传 `client`
  - 也支持传 `RequestConfig` 后再传 `client`
- 已顺手清理本次涉及页面中的部分历史乱码文案，避免继续干扰测试与 UI 展示

## 涉及文件
- `src/app/App.tsx`
- `src/api/customer/text-image-video/index.ts`
- `src/pages/TextImageVideoTasksPage.tsx`
- `src/pages/TextImageVideoTaskDetailPage.tsx`
- `src/app/App.test.tsx`
- `src/pages/TextImageVideoTasksPage.test.tsx`
- `src/pages/TextImageVideoTaskDetailPage.test.tsx`

## 验证结果
- 已执行：
  - `npm test -- src/app/App.test.tsx src/pages/TextImageVideoTasksPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/api/customer/text-image-video/index.test.ts`
  - 结果：`4 passed, 13 tests passed`
- 已执行：
  - `npm run typecheck`
  - 结果：通过

## 当前判断
- 这次修复没有把错误处理散落到每个页面里硬写，而是优先复用了统一请求层 + 根应用消息出口，这样后续别的页面也能复用。
- 防抖没有下沉到 axios 层，而是放在删除操作入口。原理上这更合理，因为它属于“用户交互防重复提交”，不是“网络传输能力”。
- 详情页采用“静默查询 + 局部 Alert”的组合，和列表页/操作页的全局 message 形成职责分层，避免同一错误双重提示。

## 下一步建议
1. 如果你希望统一到全站，我下一步可以把 `request:error` 的去重逻辑抽成独立工具，并补到其他任务页。
2. 如果你希望创建页也避免重复提交，我可以继续把 `ImageVideoPage` 的创建按钮入口也做同样的同步防重入检查。
