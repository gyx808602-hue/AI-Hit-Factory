# 2026-06-23 用户端 1.0.0 接口审计

## 已完成
- 已按 `用户端1.0.0.md` 核对当前仓库的用户端接口实现，重点检查：
  - `src/api/system/auth/index.ts`
  - `src/api/aigc/uploads/index.ts`
  - `src/api/aigc/video-remix-tasks/index.ts`
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/aigc/digital-persons/index.ts`
  - `src/api/aigc/digital-person-videos/index.ts`
- 已确认文档中的以下接口当前已基本对齐：
  - 客户认证：`captcha`、`login`、`change-password`
  - 文件上传：`/user-api/aigc/uploads/audio|image|video`
  - 视频追爆：列表、创建、详情、删除、校验 prompt、保存表单、生成 prompt、生成视频、刷新
  - 文图生视频：列表、创建、详情、删除
- 已确认当前仓库存在两类明确问题：
  - 部分 AIGC 模块仍在使用旧前缀 `/api/...`，而文档要求是 `/user-api/...`
  - `用户端1.0.0.md` 中存在的部分业务接口还没有在 `src/api` 中落地
- 已识别出一处测试与生产代码不一致：
  - `src/api/aigc/uploads/index.ts` 已改成 `/user-api/aigc/uploads/...`
  - 但 `src/api/aigc/uploads/index.test.ts` 断言仍写的是 `/api/aigc/uploads/...`

## 当前判断
- 结论不是“项目接口都正确了”，而是“只完成了一部分核心用户端接口，且还有前缀迁移没收口”。
- 接口路径前缀本身就是契约的一部分。哪怕字段类型是对的，只要前缀错了，联调时也会直接 404 或走错网关。
- 当前最明显的风险点有三个：
  - `digital-persons` 代码走的是 `/api/aigc/digital-persons`，与用户端文档的 `/user-api/...` 风格不一致
  - `digital-person-videos` 代码走的是 `/api/aigc/digital-person-videos`，而文档明确写的是 `/user-api/aigc/digital-person-videos`
  - `customised-audios` 整组接口在文档里存在，但仓库里还没有对应 `src/api/aigc/customised-audios` 模块
- 认证接口里也有一处契约边界需要留意：
  - 文档把 `logout` 和 `refresh-token` 的 `refreshToken` 放在请求体
  - 当前 `refreshToken()` 实现把它放在 query params；`logout()` 直接没有传 `refreshToken`
  - 这不一定必错，但至少和文档不完全一致，联调时需要以后端实际实现再确认

## 下一步
1. 先修正已存在模块的前缀一致性：
   - `digital-persons`
   - `digital-person-videos`
   - 以及对应测试断言
2. 再补齐 `customised-audios` 用户端 API 模块与类型定义。
3. 然后复核 `logout` / `refresh-token` 是否需要改为 body 传参。
