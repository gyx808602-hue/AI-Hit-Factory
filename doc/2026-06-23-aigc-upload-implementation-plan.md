# AIGC 文件上传接口实现计划

> **目标**：按现有前端 `request.ts` 封装风格，接入音频、图片、视频上传接口，并保证 `FormData` 请求能够被正确发送到后端。

## 技术方案

### 方案一：新增独立上传模块，并补齐 `request.ts` 对 `FormData` 的兼容
- 新增 `src/api/aigc/uploads/types.ts`
- 新增 `src/api/aigc/uploads/index.ts`
- 在 `src/api/shared/utils.ts` 增加统一 `FormData` 构造工具
- 在 `src/utils/request.ts` 中处理 `FormData` 请求头

**优点**
- 结构清晰，后续页面复用成本最低
- 音频、图片、视频三类上传接口统一收口
- 修掉 `request.ts` 对上传场景的协议隐患，避免后续别的上传接口重复踩坑

**缺点**
- 比单文件硬写多改 2-3 个文件

### 方案二：把上传方法临时塞进现有业务模块
- 例如直接加到 `src/api/customer/text-image-video/index.ts`

**优点**
- 改动文件少

**缺点**
- 语义不准，上传能力不属于 `text-image-video` 业务本身
- 后面其他页面上传文件时还会继续复制粘贴
- `FormData` 兼容问题仍然要回头处理

## 结论
- 采用**方案一**。
- 这是当前最小且正确的做法，既不过度设计，也不把临时方案变成长期负债。

## 执行步骤
1. 先在测试中锁定 `FormData` 请求头和请求体行为
2. 再新增上传类型和上传 API 模块
3. 最后跑类型检查与定向测试

