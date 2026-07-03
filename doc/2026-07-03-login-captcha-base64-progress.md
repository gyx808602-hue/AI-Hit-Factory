# 2026-07-03 登录页验证码 Base64 适配进展

## 已完成

- 扫描项目技术栈，确认当前仓库为 `React 19 + Vite + TypeScript + Ant Design`。
- 确认阶段性记录文件统一放在 `doc/` 目录，本次问题单独新增进展文档跟踪。
- 定位登录验证码相关实现：
  - `src/pages/LoginPage.tsx`
  - `src/pages/LoginPage.test.tsx`
  - `src/api/system/auth/types.ts`
  - `src/api/system/auth/index.ts`
- 确认当前页面渲染逻辑直接使用 `captcha.base64PNG` 作为 `<img src>`。
- 确认类型定义同时兼容以下后端字段：
  - `captchaBase64`
  - `base64PNG`
- 确认现有测试桩默认返回的是 `captchaBase64`，而不是 `base64PNG`。
- 确认你当前提供的真实返回值是纯 PNG Base64 内容，未带 `data:image/png;base64,` 前缀。
- 已补充登录页验证码回归测试草稿，覆盖：
  - `captchaBase64` 已是完整 Data URL
  - `base64PNG` 为纯 Base64 PNG 字符串
- 执行默认命令 `npm test -- src/pages/LoginPage.test.tsx` 后，确认仓库当前默认 Vitest 配置不会执行该测试文件：
  - `vite.config.ts` 的 `test.include` 仅包含 `src/__tests_disabled__/**/*.test.ts(x)`
  - 同时 `exclude` 显式排除了 `src/**/*.test.ts(x)`

## 当前判断

- 当前问题的根因不是图片组件本身，而是“验证码图片地址归一化”缺失。
- 浏览器的 `img.src` 不能直接识别纯 Base64 文本，必须包装成 Data URL，例如：
  - `data:image/png;base64,iVBORw0K...`
- 登录页当前只读取 `base64PNG`，会导致两类兼容性风险：
  - 后端返回 `captchaBase64` 时，页面取不到值。
  - 后端返回纯 Base64 时，即使字段名正确，页面也无法正常展示。
- 除了业务兼容缺口，还存在一个验证入口问题：
  - 默认 `npm test` 无法覆盖登录页测试文件。
  - 需要新增一个临时 `vitest` 配置，像仓库中其他局部回归配置一样单独跑登录页测试。

## 建议方案候选

### 方案 A：页面层做最小兼容归一化

- 在 `LoginPage.tsx` 内新增一个小函数，统一从 `base64PNG` / `captchaBase64` 取值。
- 如果值已经是 `data:` 开头，则直接返回。
- 如果是纯 Base64，则自动补成 `data:image/png;base64,` 前缀。

优点：
- 改动最小，风险最低。
- 能立刻兼容当前后端返回。

缺点：
- 归一化逻辑只在登录页生效，未来别的页面若复用验证码数据，还要再次处理。

### 方案 B：在 API 返回层统一归一化

- 在验证码 API 对应的数据进入页面前，统一补齐图片字段和 Data URL。
- 页面层只消费一个稳定字段。

优点：
- 数据契约更稳定，复用更方便。

缺点：
- 本次问题只发生在登录页，直接上升到 API 层会稍重一些。

## 当前建议

- 优先采用方案 A。
- 原因：这是典型的页面展示兼容问题，先在消费端做轻量修正最符合当前项目的 KISS 原则。

## 下一步

- 新增登录页专用临时 `vitest` 配置。
- 用该配置运行登录页测试，确认新增验证码断言先失败。
- 在 `LoginPage.tsx` 中加入最小归一化函数后回归验证。
