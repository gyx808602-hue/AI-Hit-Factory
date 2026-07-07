# 2026-07-07 文图生视频提示词长度调整进展

## 已完成

- 已确认本次不创建 OpenSpec 任务，只做最小代码修改与项目文档同步。
- 已定位图生视频、文生视频、图文混合共用 `src/pages/ImageVideoPage.tsx` 的提示词输入区。
- 已将提示词长度上限提升到 `1500`，并同步到文本域 `maxLength` 与字数计数展示。
- 已补充页面回归测试，防止长度限制从 `1500` 退回。
- 已同步更新专题文档 `doc/2026-06-28-text-image-video-optimization-progress.md`。

## 当前判断

- 这是前端输入边界调整，不涉及后端接口契约变化。
- 使用一个页面常量覆盖三种输入模式即可，不需要新增配置层或公共工具。
- `doc/progress.md` 当前存在非 UTF-8 历史字节，无法通过 `apply_patch` 安全追加；本次改为新增 UTF-8 专题进展文档记录。

## 下一步

1. 运行文图生视频创建页定向测试。
2. 运行 TypeScript 类型检查。
3. 根据验证结果补充最终验证记录。

## 验证结果

- `npx vitest run -c vitest.text-image-video-temp.config.ts src/pages/ImageVideoPage.test.tsx -t "limits the video prompt"`：通过，1 个用例通过。
- `npm run typecheck`：通过。
- `npx vitest run -c vitest.text-image-video-temp.config.ts src/pages/ImageVideoPage.test.tsx`：未全量通过，失败点为历史用例仍在查找已注释的“AI 生成文案”按钮，以及旧的 `input[name="file"]` 上传选择器；新增的 1500 字长度用例已通过。
