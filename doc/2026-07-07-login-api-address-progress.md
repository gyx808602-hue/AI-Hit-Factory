# 2026-07-07 登录接口请求地址排查

## 已完成

- 扫描 `src/api/system/auth/index.ts`、`src/utils/request.ts`、`.env.development`、`.env.production`、`.env.test` 与 `vite.config.ts`。
- 确认账号密码登录接口代码路径为 `POST /auth/login`。
- 确认开发环境 `VITE_APP_BASE_API='/api'`，因此浏览器实际请求路径为 `/api/auth/login`。

## 当前判断

- 开发环境通过 Vite 代理把 `/api/auth/login` 转发到 `http://192.168.77.204:8081/v1/auth/login`。
- 生产环境 `VITE_APP_BASE_API='/api/v1'`，打包后登录请求路径为 `/api/v1/auth/login`。
- 测试环境 `VITE_APP_BASE_API=http://127.0.0.1:8080`，登录请求地址为 `http://127.0.0.1:8080/auth/login`。

## 下一步

- 如果需要在浏览器控制台打印请求地址，可以在请求拦截器中临时输出 `config.baseURL + config.url`，确认后再移除调试日志。

## 验证结果

- 本阶段只做代码与配置排查，未运行测试命令。
- `doc/progress.md` 当前不是合法 UTF-8，未做整文件转码，避免覆盖历史内容。
