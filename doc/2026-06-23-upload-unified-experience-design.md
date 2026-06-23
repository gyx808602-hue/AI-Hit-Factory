# 2026-06-23 上传与详情统一体验设计

## 1. 目标

本轮目标是统一项目内与图片/视频资源相关的用户体验，包括：

- 上传入口风格统一
- 上传结果展示统一
- 删除交互统一
- 详情页图片/视频回显统一
- 下载入口统一

本轮**不追求**一次性统一所有页面的底层状态结构，也不强制抽出一个全局万能上传组件。

## 2. 设计原则

### 2.1 用户体验优先统一

用户能感知到的交互必须像同一套系统：

- 都使用 `ant.design Upload / Upload.Dragger`
- 都有一致的上传提示、格式说明、上传中反馈
- 都支持删除已上传资源
- 都优先展示图片缩略图、视频预览
- 都提供清晰的下载入口

### 2.2 业务值结构保持稳定

不同页面继续保留各自原有的业务值模型：

- `string[]`
- 单个 `string`
- `{ name, url }[]`
- 多行 URL 文本

页面内部新增适配逻辑，将 `UploadFile[]` 和业务值互相转换，避免牵动接口 payload。

### 2.3 KISS

优先页面内适配，不做超前抽象。

只有当至少 2 到 3 个页面形成稳定共性后，再考虑抽取共享 helper 或共享组件。

## 3. 范围

### 3.1 本轮纳入统一的页面

- `src/pages/ImageVideoPage.tsx`
- `src/pages/ProductVideoPage.tsx`
- `src/pages/ViralRemixPage.tsx`
- `src/pages/DigitalHumanVideoTasksPage.tsx`
- `src/pages/VideoRemixTaskDetailPage.tsx`
- `src/pages/TextImageVideoTaskDetailPage.tsx`
- `src/pages/DigitalHumanVideoTaskDetailPage.tsx`

### 3.2 本轮不做的事

- 不修改后端接口
- 不删除旧目录或旧文件
- 不强行统一成单一上传状态模型
- 不一次性重构所有视频上传场景

## 4. 统一后的体验基线

### 4.1 上传入口

图片上传统一改为 `Upload` 或 `Upload.Dragger`：

- 单图场景显示单文件卡片
- 多图场景显示缩略图列表
- 支持格式文案统一放在上传区下方
- 上传中使用统一 loading 文案

### 4.2 上传结果

上传成功后统一展示：

- 缩略图
- 文件名
- 删除操作

删除时需要同步两层状态：

- `Upload` 的 `fileList`
- 页面真实业务值

### 4.3 详情回显

详情页遵循以下优先级：

- 图片：优先缩略图预览
- 视频：优先 `video controls` 预览
- 字幕：保留文件链接和下载入口
- 文本 URL：仅作辅助信息展示

### 4.4 下载入口

统一提供明确动作按钮：

- 下载图片
- 下载封面
- 下载视频
- 下载字幕

命名尽量一致，优先放在资源预览区域附近。

## 5. 技术方案

## 5.1 稳妥统一方案（推荐）

做法：

- 每个页面内部自己维护 `UploadFile[]`
- 在页面内部完成 `UploadFile[] <-> 业务值` 转换
- 复用 `uploadImage` / `uploadVideo` / `uploadAudio`
- 复用现有接口，不改 payload 结构

优点：

- 风险低
- 容易逐页回归验证
- 不会影响后端联调
- 容易先拿到统一体验效果

缺点：

- 页面内会有少量重复适配逻辑

## 5.2 激进统一方案（本轮不推荐）

做法：

- 抽公共上传组件
- 抽统一 upload adapter
- 所有页面统一到一套内部状态协议

优点：

- 后续维护想象上更整齐

缺点：

- 回归面大
- 状态语义不一致，容易误伤
- 需要一次性改大量测试和页面逻辑

## 6. 文件改造方向

### 6.1 页面层

- `src/pages/ImageVideoPage.tsx`
  - 改为 `Upload`
  - 支持多图删除
  - 为详情页回显结构做统一准备

- `src/pages/ProductVideoPage.tsx`
  - 改为统一的图片上传列表展示
  - 增加删除操作

- `src/pages/ViralRemixPage.tsx`
  - 保留 `Upload.Dragger` 方向
  - 清理手动隐藏 input 的混合实现
  - 统一上传结果展示与删除

- `src/pages/DigitalHumanVideoTasksPage.tsx`
  - 背景图上传接入统一样式
  - 增加删除背景图能力

- `src/pages/VideoRemixTaskDetailPage.tsx`
  - 商品图 / 人物图上传统一为 `Upload`
  - 保留页面内部 URL 文本值结构
  - 增加删除单张图能力

### 6.2 详情页

- `src/pages/TextImageVideoTaskDetailPage.tsx`
  - 参考图改为缩略图预览
  - 封面和视频补下载按钮

- `src/pages/DigitalHumanVideoTaskDetailPage.tsx`
  - 封面图、视频、字幕统一为预览 + 下载

## 6.3 测试层

- `src/pages/ImageVideoPage.test.tsx`
- `src/pages/upload-integration.test.tsx`
- 相关详情页测试

测试重点：

- 上传成功后正确回填
- 删除后 UI 与业务值同步
- 详情页回显正确
- 下载入口存在且链接正确

## 7. 风险控制

### 7.1 控制改动顺序

按下面顺序推进：

1. 先改图片上传页面
2. 再改详情页预览与下载
3. 最后补测试和统一微调

### 7.2 控制抽象层级

本轮只允许抽 helper，不强制抽完整公共组件。

允许抽出的内容：

- `UploadFile[]` 与业务值互转 helper
- 下载按钮小工具
- 详情资源展示小片段

### 7.3 注释要求

关键适配逻辑增加中文注释，重点说明：

- 为什么既维护 `fileList` 又维护业务值
- 删除时为什么要双向同步
- 为什么某些页面仍保留 URL 文本结构

## 8. 验证策略

### 8.1 测试优先

先补失败测试，再做实现。

### 8.2 验证命令

- `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx`
- `npm test -- 相关详情页测试文件`
- `npm run typecheck`

## 9. 结论

本轮采用“稳妥统一方案”：

- 统一用户体验层
- 保持业务值结构稳定
- 用页面内适配换取低风险落地

这条路线最符合当前仓库状态，也最适合边改边验证。
