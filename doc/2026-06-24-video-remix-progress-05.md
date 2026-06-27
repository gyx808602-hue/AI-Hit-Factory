# 2026-06-24 视频追爆任务进展 05

## 本阶段目标

- 在已注释目标模型展示代码的前提下，仅调整视频追爆任务的默认模型值。

## 本阶段完成内容

1. 将视频追爆详情表单默认模型改为 `seedance2.0`。
2. 将视频追爆创建入口写入草稿时的默认模型改为 `seedance2.0`。
3. 补充默认模型映射测试，确保后端未返回模型值时仍能落到 `seedance2.0`。

## 影响文件

- `src/features/video-remix/form.ts`
- `src/pages/ViralRemixPage.tsx`
- `src/features/video-remix/form.test.ts`

## 说明

- 当前目标模型的页面展示代码已被注释，本阶段未恢复该 UI，仅调整默认值行为。
- 详情页文件仍存在历史乱码内容，本阶段未继续清理，避免扩大改动范围。

## 本阶段验证

- 已通过：`npm run typecheck`
- 已通过：`npm run build`
