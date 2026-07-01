# 2026-06-30 图文页上传展示与顶部对齐进展

## 本阶段目标

- 将图文页上传图片的展示形式调整为类似追爆页的风格
- 让左侧内容卡片与右侧预览卡片顶部对齐
- 顺手收干净此前全局弹窗改造里遗留的页内 `Alert` 残分支，保证类型检查通过

## 已完成改动

- 修改文件：
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/DigitalHumanVideoTasksPage.tsx`
- 新增验证文件：
  - `src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - `vitest.image-video-upload-style-temp.config.ts`

## 具体实现

- 图文页上传入口改为 `Upload.Dragger` 卡片式拖拽上传
- 上传成功后的图片展示改为统一管理卡片，展示文件名、上传完成状态、删除按钮
- 外层双栏布局改为 `grid items-start`
- 右侧预览区改为 `aside self-start`
- 预览标题收进右侧卡片内部，保证视觉起点与左侧卡片一致
- 删除 `DigitalHumansPage` 与 `DigitalHumanVideoTasksPage` 中遗留的死分支 `Alert`，避免阻塞 `typecheck`

## 验证结果

- 类型检查：
  - `npm run typecheck`
  - 结果：通过
- 图文页上传样式回归：
  - `npx vitest run --config vitest.image-video-upload-style-temp.config.ts`
  - 结果：`2 passed`
- 全局弹窗替代页内报错回归：
  - `npx vitest run --config vitest.request-error-popup-temp.config.ts`
  - 结果：`2 passed`

## 阶段补充：页面超出无法滚动的审查与修复

- 根因结论：
  - `ImageVideoPage` 运行在 `PageShell` 的固定高度 + `overflow-hidden` 布局链中
  - 页面自身没有补内部滚动容器，内容超出视口后会被父容器裁掉，表现为“页面超出无法滚动”
- 修复方式：
  - 在 `ImageVideoPage` 主内容区补齐 `flex min-h-0 flex-1 overflow-hidden`
  - 将双栏主容器改为 `grid min-h-0 flex-1 overflow-y-auto`
  - 保持上传样式与双卡片顶部对齐不变
- 新增回归验证：
  - `src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - 新增“存在专属内部滚动容器”的断言
- 修复后验证：
  - `npx vitest run --config vitest.image-video-upload-style-temp.config.ts src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - 结果：`3 passed`

## 阶段补充：图片上传区结构误判与修正

- 复审结论：
  - 问题核心不是滚动，而是图文页上传区没有完全对齐追爆页的状态切换模型
  - 追爆式正确形态应为：
    - 未上传时显示整块拖拽上传卡片
    - 上传后切换为已上传素材管理卡片
- 修正内容：
  - 重写 `src/pages/ImageVideoPage.tsx` 为干净 UTF-8 版本
  - 上传区改为“未上传显示 `Upload.Dragger`，上传后切换为卡片列表”
  - 补回 `image-video-upload-input` 测试入口
  - 保留双卡片顶部对齐与内部滚动链
- 回归验证：
  - `npx vitest run --config vitest.image-video-upload-style-temp.config.ts src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - 结果：`3 passed`
  - `npm run typecheck`
  - 结果：通过
- 额外说明：
  - 仓库默认 Vitest 配置会排除普通页面测试，所以 `npx vitest run src/pages/ImageVideoPage.test.tsx` 显示 `No test files found`，这不是失败，是项目测试配置行为

## 阶段补充：参考对象修正为编辑追爆上传图片形式

- 最终对齐目标：
  - 不是追爆首页的大块上传卡片
  - 而是 `src/pages/ViralRemixPage.tsx` 中 `replace-product` 的编辑态上传形式
- 本轮调整：
  - 图文页上传区改为紧凑 `Upload.Dragger`
  - 上传框在上传后继续保留
  - 已上传图片在下方以文件条目形式展示
  - 每个条目右侧保留删除按钮
  - 保留多图上传能力，不缩成单图
- 验证：
  - `npx vitest run --config vitest.image-video-upload-style-temp.config.ts src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - 结果：`3 passed`
  - `npm run typecheck`
  - 结果：通过

## 阶段补充：展示效果对齐新建追爆素材面板

- 最终收口方案：
  - 上传入口参考“编辑追爆”
  - 上传后展示效果参考“新建追爆”的素材面板
- 本轮实现：
  - 保留紧凑上传按钮样式
  - 上传后展示改为大图卡片网格
  - 每张图显示 `商品图 1 / 商品图 2 ...` 标签
  - 每张图卡片右上角保留删除动作
  - 卡片主体为大图预览，和新建追爆素材面板一致
- 验证：
  - `npx vitest run --config vitest.image-video-upload-style-temp.config.ts src/pages/ImageVideoPage.upload-style-regression.test.tsx`
  - 结果：`3 passed`
  - `npm run typecheck`
  - 结果：通过

## 结论

- 图文页上传区域已经切到类似追爆页的展示风格
- 左右两个内容卡片已经按顶部对齐
- 页面内容超出时现在可以正常滚动
- 这轮改动已通过类型检查与针对性回归验证
