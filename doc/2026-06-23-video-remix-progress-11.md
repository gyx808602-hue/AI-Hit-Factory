# 2026-06-23 视频追爆进展 11

## 本轮完成

- 任务列表页右上角“新建追爆任务”已从页面跳转改为弹窗创建。
- 新建弹窗按参考图实现了最小创建表单：
  - 任务名称
  - 备注
  - 底部提示文案
  - 取消 / 创建任务
- 创建成功后仍然跳转到对应任务详情页继续补素材与文案。
- 任务详情页素材区新增回显与预览：
  - 参考视频支持直接预览
  - 商品图支持全部缩略图回显
  - 人物图支持全部缩略图回显
  - 图片点击后可新窗口查看原图

## 本轮代码变更

- `src/pages/VideoRemixTasksPage.tsx`
  - 接入任务创建弹窗
  - 接入创建任务 mutation
  - 将列表页“新建追爆任务”按钮改为打开弹窗
  - 增加表单校验异常兜底，避免未处理 Promise 抛出
- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 增加素材 URL 拆分 helper
  - 增加参考视频预览块
  - 增加商品图缩略图预览块
  - 增加人物图缩略图预览块
- `src/pages/VideoRemixTasksPage.test.tsx`
  - 新增“打开创建弹窗并创建任务后跳详情”的用例
- `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 新增“参考视频预览与图片素材回显”的用例

## 验证记录

- `npm test -- src/pages/VideoRemixTasksPage.test.tsx src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 2 个文件，11 条用例通过
- `npm test -- src/api/aigc/video-remix-tasks/index.test.ts src/pages/ViralRemixPage.test.tsx src/pages/VideoRemixTasksPage.test.tsx src/pages/VideoRemixTaskDetailPage.test.tsx src/features/video-remix/status.test.ts src/features/video-remix/form.test.ts src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
  - 8 个文件，34 条用例通过

## 备注

- 本轮保留了 `/viral-remix` 原入口页，没有删除原路由，只把列表页新建按钮切到弹窗创建。
- `vitest` 运行时仍会输出 `getComputedStyle` 的 jsdom 提示，但不影响断言结果。
