import type { TaskStatus } from "./types";

export const taskStatusLabels: Record<TaskStatus, string> = {
  success: "生成成功",
  processing: "生成中",
  queued: "排队中",
  failed: "生成失败",
  cancelled: "已取消",
};
