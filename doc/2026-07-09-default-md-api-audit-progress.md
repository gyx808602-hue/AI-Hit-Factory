# 2026-07-09 default.md 接口全局审查进展

## 已完成

- 已识别根目录 `default.md`，确认该文档当前覆盖客户用户服务接口，HOST 为 `http://192.168.77.204:8081`，接口主前缀为 `/v1`。
- 已扫描当前项目实际接口封装，重点覆盖：
  - `src/api/system/auth`
  - `src/api/aigc/uploads`
  - `src/api/aigc/video-remix-tasks`
  - `src/api/aigc/customised-audios`
  - `src/api/aigc/digital-persons`
  - `src/api/aigc/digital-person-videos`
  - `src/api/customer/text-image-video`
  - `src/api/points/usage`
  - `src/api/system/*`
- 已确认当前开发环境通过 `VITE_APP_BASE_API='/api'` 配合 Vite proxy，把 `/api/...` 重写到后端 `/v1/...`。
- 已按用户确认修复第 1 条问题：刷新令牌接口从硬编码 `/v1/auth/refresh` 改为 `/auth/refresh`。
- 已同步更新请求层和认证 API 的回归测试断言，避免后续再次重复写入 `/v1` 前缀。

## 当前判断

- 客户侧核心 AIGC 接口大多采用“请求基址承载 `/v1`，业务封装只写资源路径”的方式，例如 `/customised-audios` 实际在开发环境转发为 `/v1/customised-audios`，这类不属于不一致。
- 已修复高风险不一致：`src/utils/request.ts` 和 `src/api/system/auth/index.ts` 中刷新令牌接口不再硬编码 `/v1/auth/refresh`，统一交给环境基址或代理补齐 `/v1`。
- 发现文档未覆盖但项目仍在使用的接口：
  - `src/api/points/usage/index.ts` 中 `/points/summary`、`/points/usage-records`
  - `src/api/system/*` 中 `/user-api/...`
  - `src/api/system/auth/index.ts` 中 `/auth/login/sms`、`/auth/sms/code`
- 上述文档未覆盖接口不能直接判定为错误，但不属于本次 `default.md` 已给出的接口。
- `default.md` 中存在但当前项目未对接的接口暂不处理，符合“md 里面会有多的接口可以先不进行对接”的要求。

## 下一步

1. 第 2-10 条按用户确认先保留、不清理、不新增对接。
2. 后续如要继续审查，可对 `/points/*`、`/user-api/*`、短信登录接口向后端确认是否属于其他服务文档或历史接口。

## 验证结果

- 已完成接口比对和第 1 条修复。
- 已执行：`cmd /c npm test -- --config vite.request-test.config.ts src/utils/request.test.ts src/api/system/auth/index.test.ts`
- 结果：通过，2 个测试文件、18 个测试用例全部通过。
- 已执行残留搜索：`rg -n "/v1/auth/refresh|/auth/refresh" src/utils/request.ts src/api/system/auth/index.ts src/utils/request.test.ts src/api/system/auth/index.test.ts`
- 结果：目标代码中仅保留 `/auth/refresh`，未发现 `/v1/auth/refresh` 残留。

## 备注

- `doc/progress.md` 当前存在非 UTF-8 字节，无法用安全补丁方式追加。本次先新增专题文档记录进展，避免覆盖或转码破坏历史内容。
