# 2026-06-30 图文页上传按钮与素材面板修正进展

## 本阶段目标
- 严格按最新截图修正图文页商品图上传区域
- 上传按钮必须是顶部独立按钮，并带真实 loading 效果
- 空态与已上传态都要对齐追爆素材面板的展示结构

## 本阶段修改
- 修改文件：
  - `src/pages/ImageVideoPage.tsx`

## 具体实现
- 将原先由上传容器承担按钮语义的结构，改为真实 `Button`
- 上传按钮文案固定为 `上传商品图`
- 上传中状态接入 `loading={uploadImageMutation.isPending}`
- 保留隐藏文件输入 `image-video-upload-input`，继续支持一次多图上传
- 空态改为独立虚线素材面板，并显示 `暂无商品图，请先上传素材。`
- 已上传态改为商品图卡片网格，保留蓝色标签与红色删除按钮
- 保持此前已修好的左右卡片顶部对齐与页面内部滚动结构
- 继续保留图文任务创建、文案生成和图片删除的原有业务链路

## 验证结果
- `npx vitest run --config vitest.image-video-upload-style-temp.config.ts src/pages/ImageVideoPage.upload-style-regression.test.tsx`
- 结果：`3 passed`
- `npm run typecheck`
- 结果：通过

## 阶段结论
- 图文页上传入口现在已经和截图一致，顶部是独立的 `上传商品图` 按钮
- 上传过程中按钮会显示真实 loading，而不是仅替换静态文案
- 上传前后展示形态已经分别对齐空态素材面板和已上传素材卡片面板
