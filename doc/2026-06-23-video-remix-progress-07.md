# 2026-06-23 视频追爆实现第七阶段：接口前缀切换

## 本阶段完成

- 已将视频追爆任务 API 模块统一切换到客户侧前缀：
  - `GET /customer/aigc/video-remix-tasks`
  - `POST /customer/aigc/video-remix-tasks`
  - `GET /customer/aigc/video-remix-tasks/{id}`
  - `DELETE /customer/aigc/video-remix-tasks/{id}`
  - `PUT /customer/aigc/video-remix-tasks/{id}/form`
  - `POST /customer/aigc/video-remix-tasks/{id}/check-prompt`
  - `POST /customer/aigc/video-remix-tasks/{id}/generate-prompt`
  - `POST /customer/aigc/video-remix-tasks/{id}/generate-video`
  - `GET /customer/aigc/video-remix-tasks/{id}/refresh`
- 已先修改接口测试断言，再执行定向测试确认旧实现红灯，随后再修改生产代码回到绿灯。
- 已同步更新 OpenSpec 中视频追爆任务流相关文档，避免规格文档继续引用旧地址。

## 本阶段验证

- 执行命令：`npm test -- src/api/aigc/video-remix-tasks/index.test.ts`
- 验证结果：`2` 条用例全部通过

## 当前判断

- 前端运行时代码已经完成从 `/api/aigc/video-remix-tasks` 到 `/customer/aigc/video-remix-tasks` 的切换。
- `openspec/changes/add-video-remix-task-flow` 下的设计、规格、任务清单也已经同步到新前缀。

## 待跟进说明

- `用户端.md` 里仍然保留旧的 `/api/aigc/video-remix-tasks` 地址，当前更像是后端导出的参考文档，尚未在本阶段联动修改。
- 如果后续希望仓库内所有说明文档完全一致，建议下一步再统一清理 `doc/` 与 `用户端.md` 中残留的旧前缀引用。
