import type { VideoRemixTask } from "../../api/aigc/video-remix-tasks/types";

export type VideoRemixStatusTone = "default" | "processing" | "success" | "failed";
export type VideoRemixResultState = "empty" | "processing" | "success" | "failed";

export type VideoRemixTaskStatusMeta = {
  label: string;
  tone: VideoRemixStatusTone;
  color: string;
  background: string;
  resultState: VideoRemixResultState;
  canRefresh: boolean;
  canCheckPrompt: boolean;
  canGeneratePrompt: boolean;
  canGenerateVideo: boolean;
};

export const videoRemixStatusOptions = Array.from({ length: 8 }, (_, index) => ({
  value: index,
  label: `状态 ${index}`,
}));

const tonePalette: Record<VideoRemixStatusTone, Pick<VideoRemixTaskStatusMeta, "color" | "background">> = {
  default: {
    color: "#A1A1B3",
    background: "rgba(161,161,179,0.12)",
  },
  processing: {
    color: "#F97316",
    background: "rgba(249,115,22,0.12)",
  },
  success: {
    color: "#4ADE80",
    background: "rgba(74,222,128,0.12)",
  },
  failed: {
    color: "#EF4444",
    background: "rgba(239,68,68,0.12)",
  },
};

function inferTone(task: Partial<VideoRemixTask>): VideoRemixStatusTone {
  const label = task.statusLabel ?? "";

  if (task.videoUrl) {
    return "success";
  }

  if (task.errReason || /失败|错误|异常|驳回/i.test(label)) {
    return "failed";
  }

  if (
    (typeof task.progress === "number" && task.progress > 0 && task.progress < 100) ||
    /处理中|生成中|排队|执行中|审核中|待处理/i.test(label)
  ) {
    return "processing";
  }

  return "default";
}

function inferResultState(task: Partial<VideoRemixTask>, tone: VideoRemixStatusTone): VideoRemixResultState {
  if (task.videoUrl) {
    return "success";
  }

  if (tone === "failed") {
    return "failed";
  }

  if (tone === "processing") {
    return "processing";
  }

  return "empty";
}

export function getVideoRemixTaskStatusMeta(task: Partial<VideoRemixTask>): VideoRemixTaskStatusMeta {
  const tone = inferTone(task);
  const resultState = inferResultState(task, tone);

  return {
    label: task.statusLabel?.trim() || `状态 ${task.status ?? "-"}`,
    tone,
    color: tonePalette[tone].color,
    background: tonePalette[tone].background,
    resultState,
    canRefresh: tone === "processing" || tone === "failed" || !task.videoUrl,
    canCheckPrompt: Boolean(task.generatedPrompt),
    canGeneratePrompt: !task.videoUrl,
    canGenerateVideo: Boolean(task.generatedPrompt) && !task.videoUrl,
  };
}
