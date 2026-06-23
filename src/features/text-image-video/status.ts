import { AlertCircle, CheckCircle2, Clock3, HelpCircle, LoaderCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TextImageVideoTask } from "../../api/customer/text-image-video/types";

export type TextImageVideoTaskTone = "success" | "processing" | "failed" | "unknown";
export type TextImageVideoTaskResultState = "success" | "processing" | "failed";

export type TextImageVideoTaskStatusMeta = {
  label: string;
  tone: TextImageVideoTaskTone;
  resultState: TextImageVideoTaskResultState;
  color: string;
  background: string;
  icon: LucideIcon;
};

const fallbackMetaByStatus: Record<number, Omit<TextImageVideoTaskStatusMeta, "label">> = {
  0: {
    tone: "processing",
    resultState: "processing",
    color: "#22D3EE",
    background: "rgba(34,211,238,0.12)",
    icon: Clock3,
  },
  1: {
    tone: "processing",
    resultState: "processing",
    color: "#F97316",
    background: "rgba(249,115,22,0.12)",
    icon: LoaderCircle,
  },
  2: {
    tone: "success",
    resultState: "success",
    color: "#4ADE80",
    background: "rgba(74,222,128,0.12)",
    icon: CheckCircle2,
  },
  3: {
    tone: "failed",
    resultState: "failed",
    color: "#EF4444",
    background: "rgba(239,68,68,0.12)",
    icon: AlertCircle,
  },
};

function getFallbackLabel(task: TextImageVideoTask) {
  if (task.videoUrl) {
    return "已完成";
  }

  if (task.errReason || task.syncError) {
    return "生成失败";
  }

  if (task.status === 0) {
    return "排队中";
  }

  if (task.status === 1) {
    return "生成中";
  }

  if (task.status === 2) {
    return "已完成";
  }

  if (task.status === 3) {
    return "生成失败";
  }

  return "状态未知";
}

export function getTextImageVideoTaskStatusMeta(task: TextImageVideoTask): TextImageVideoTaskStatusMeta {
  if (task.videoUrl) {
    return {
      label: task.statusLabel || "已完成",
      tone: "success",
      resultState: "success",
      color: "#4ADE80",
      background: "rgba(74,222,128,0.12)",
      icon: CheckCircle2,
    };
  }

  if (task.errReason || task.syncError) {
    return {
      label: task.statusLabel || "生成失败",
      tone: "failed",
      resultState: "failed",
      color: "#EF4444",
      background: "rgba(239,68,68,0.12)",
      icon: AlertCircle,
    };
  }

  const fallbackMeta = fallbackMetaByStatus[task.status];
  if (fallbackMeta) {
    return {
      label: task.statusLabel || getFallbackLabel(task),
      ...fallbackMeta,
    };
  }

  return {
    label: task.statusLabel || "状态未知",
    tone: "unknown",
    resultState: "processing",
    color: "#A1A1AA",
    background: "rgba(161,161,170,0.14)",
    icon: HelpCircle,
  };
}
