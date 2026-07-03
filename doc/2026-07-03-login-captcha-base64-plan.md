# Login Captcha Base64 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让登录页验证码同时兼容 `captchaBase64`、`base64PNG` 以及纯 Base64 PNG 字符串。

**Architecture:** 保持修复范围在登录页消费端，不改后端契约，也不改全局请求层。通过一个小型归一化函数把后端返回的不同字段和不同格式统一转换成浏览器可识别的图片 URL。

**Tech Stack:** React 19、TypeScript、Ant Design、Vitest、Testing Library

---

### Task 1: 补验证码图片地址归一化回归测试

**Files:**
- Modify: `src/pages/LoginPage.test.tsx`
- Test: `src/pages/LoginPage.test.tsx`

- [ ] **Step 1: 写失败测试，覆盖 `captchaBase64` Data URL 场景**

目标：
- 当接口返回 `captchaBase64` 且值已经是完整 Data URL 时，页面应直接渲染该值到验证码图片 `src`。

- [ ] **Step 2: 运行单测，确认当前实现失败**

Run: `npm test -- src/pages/LoginPage.test.tsx`

Expected:
- 至少有一个与验证码图片 `src` 相关的断言失败。

- [ ] **Step 3: 追加失败测试，覆盖纯 Base64 PNG 场景**

目标：
- 当接口返回 `base64PNG` 且值为纯 Base64 字符串时，页面应自动补齐 `data:image/png;base64,` 前缀。

- [ ] **Step 4: 再次运行单测，确认新增场景仍失败**

Run: `npm test -- src/pages/LoginPage.test.tsx`

Expected:
- 纯 Base64 场景断言失败，证明当前实现未兼容真实返回值。

### Task 2: 在登录页实现最小归一化逻辑

**Files:**
- Modify: `src/pages/LoginPage.tsx`

- [ ] **Step 1: 新增验证码图片 URL 归一化函数**

目标：
- 优先从 `base64PNG` / `captchaBase64` 里取值。
- 如果值以 `data:` 开头，直接返回。
- 如果是纯 Base64，补齐 `data:image/png;base64,`。
- 如果没有值，回退空字符串。

- [ ] **Step 2: 将验证码 `<img>` 改为使用归一化后的 `src`**

目标：
- 只改验证码显示处，不扩大改动面。

### Task 3: 回归验证与进展记录

**Files:**
- Modify: `doc/2026-07-03-login-captcha-base64-progress.md`

- [ ] **Step 1: 运行登录页相关测试**

Run: `npm test -- src/pages/LoginPage.test.tsx`

Expected:
- 全部通过。

- [ ] **Step 2: 如有必要，运行类型检查验证**

Run: `npm run typecheck`

Expected:
- 无新增类型错误。

- [ ] **Step 3: 更新进展文档**

记录：
- 根因
- 采用方案
- 修改文件
- 测试命令与结果
