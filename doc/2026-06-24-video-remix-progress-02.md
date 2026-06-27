# 2026-06-24 视频追爆进展 02

## 本轮完成

- 已为视频追爆详情页补齐素材编辑体验：
  - 商品图支持单张删除
  - 人物图支持单张删除
  - 删除后会同步更新表单里的 URL 列表，保存请求体也会同步变更
- 已为参考音频补齐预览能力：
  - 当 `audioUrl` 有值时，页面展示音频预览区
  - 支持直接播放，不再只显示只读 URL
- 已顺手把 `src/pages/VideoRemixTaskDetailPage.tsx` 与对应测试文件整理为干净 UTF-8 版本，去掉了影响维护与断言的历史乱码文本

## 本轮代码变更

- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 新增 `removeAssetUrl(...)`，用于从多行 URL 字段中删除单条素材
  - 商品图预览卡片增加“删除商品图”按钮
  - 人物图预览卡片增加“删除人物图”按钮
  - 参考音频区域新增 `<audio controls>` 预览
- `src/pages/VideoRemixTaskDetailPage.test.tsx`
  - 增补音频预览断言
  - 增补商品图/人物图删除后页面与保存 payload 同步变化的断言
  - 整理旧的乱码断言文本，改成稳定中文版本
- `vitest.video-remix-temp.config.ts`
  - 新增临时测试配置，用于绕过仓库当前 `vite.config.ts` 对常规测试目录的排除
- `vitest.video-remix-regression.config.ts`
  - 新增视频追爆回归专用临时测试配置

## 验证记录

- 已执行：
  - `npx vitest run -c vitest.video-remix-temp.config.ts`
  - 结果：`src/pages/VideoRemixTaskDetailPage.test.tsx`，8/8 用例通过
- 已执行：
  - `npm run typecheck`
  - 结果：通过
- 已执行：
  - `npm run build`
  - 结果：通过

## 当前遗留

- 仓库当前 `vite.config.ts` 仍把标准 `src/**/*.test.ts(x)` 排除在外，常规 `npm test -- <file>` 不能直接命中详情页测试
- 用 `vitest.video-remix-regression.config.ts` 跑 8 文件回归时，还存在与本轮无关的历史红灯：
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/pages/VideoRemixTasksPage.test.tsx`
- OpenSpec 中 `7.5 手动验证“创建 -> 详情 -> 保存 -> 生成 -> 刷新 -> 回看”主链路` 仍未完成
