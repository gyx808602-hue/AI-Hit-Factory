# 2026-06-23 视频追爆实现第九阶段：用户端1.0.0文档对齐预案

## 本阶段完成
- 已读取 `用户端1.0.0.md` 中“客户-视频追爆”全部 9 个接口定义。
- 已完成当前实现与文档的第一轮差异扫描，重点比对了：
  - 接口前缀
  - 列表分页参数
  - 创建/详情/删除/保存表单/动作接口路径
  - 表单请求体字段
  - 列表分页返回结构与任务详情返回结构
- 已确认当前最明显差异为接口前缀：
  - 文档：`/user-api/aigc/video-remix-tasks`
  - 当前代码：`/customer/aigc/video-remix-tasks`

## 当前判断
- 从 `用户端1.0.0.md` 看，视频追爆这组接口的字段模型与当前前端已实现的 `VideoRemixTask / VideoRemixTaskFormRequest / PageResponse` 基本一致。
- 当前更像是“接口前缀切换 + 封装层顺手收口优化”，而不是一次彻底重写接口模型。
- 也就是说，这次最值得做的不是大改页面，而是把 API 封装层做得更稳：
  - 统一 base url
  - 统一动作路径拼接
  - 让分页响应适配更显式
  - 为后续再次改文档保留更低成本的调整点

## 建议方向

### 方案一：最小改动对齐文档
- 将 `src/api/aigc/video-remix-tasks/index.ts` 中前缀切到 `/user-api/aigc/video-remix-tasks`
- 更新 `index.test.ts` 断言
- 保持当前 `types.ts` 结构不变

优点：
- 成本最低
- 风险最小
- 页面层基本无感

缺点：
- 封装层仍然偏“能用”，后面再遇到文档变更时还得继续补

### 方案二：对齐文档同时优化封装
- 切换到 `/user-api/aigc/video-remix-tasks`
- 提炼任务详情返回类型、分页返回类型、路径构造函数
- 保留页面当前消费的稳定领域类型，对外不扩散后端文档细节

优点：
- 更符合“接口适配层隔离”的做法
- 后续再改 URL 或分页结构时只动 API 层
- 测试更聚焦

缺点：
- 比方案一多一点类型与适配代码

## 当前建议
- 推荐执行“方案二”。
- 原因：
  - 这次已经明确是“拿文档反向校准前端封装”
  - 既然要动接口层，顺手把最脆弱的路径拼接和分页适配收口，性价比最高
  - 页面层可以继续保持不动，符合 KISS

## 本阶段状态
- 已按 `用户端1.0.0.md` 将视频追爆接口前缀切换为 `/user-api/aigc/video-remix-tasks`
- 已先修改 `src/api/aigc/video-remix-tasks/index.test.ts` 让断言红灯，再修改 `src/api/aigc/video-remix-tasks/index.ts` 完成切换
- 已执行定向验证：
  - `npm test -- src/api/aigc/video-remix-tasks/index.test.ts`
  - 结果：`2` 个用例全部通过
- 已再次对照 `用户端1.0.0.md` 核验 9 个视频追爆接口地址，确认当前 URL 改动来源就是该文档
