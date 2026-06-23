import { AlertCircle, CheckCircle2, HelpCircle, LoaderCircle, type LucideIcon } from "lucide-react";
import type { DigitalPersonVideo } from "../../../api/aigc/digital-person-videos/types";

export type DigitalHumanVideoStatusTone = "success" | "processing" | "failed" | "unknown";
export type DigitalHumanVideoResultState = "success" | "processing" | "failed";

export interface DigitalHumanVideoStatusMeta {
  label: string;
  tone: DigitalHumanVideoStatusTone;
  resultState: DigitalHumanVideoResultState;
  color: string;
  background: string;
  icon: LucideIcon;
  canRefresh: boolean;
}

const palette: Record<
  DigitalHumanVideoStatusTone,
  Pick<DigitalHumanVideoStatusMeta, "color" | "background" | "icon">
> = {
  success: {
    color: "#4ADE80",
    background: "rgba(74,222,128,0.12)",
    icon: CheckCircle2,
  },
  processing: {
    color: "#F97316",
    background: "rgba(249,115,22,0.12)",
    icon: LoaderCircle,
  },
  failed: {
    color: "#EF4444",
    background: "rgba(239,68,68,0.12)",
    icon: AlertCircle,
  },
  unknown: {
    color: "#A1A1AA",
    background: "rgba(161,161,170,0.14)",
    icon: HelpCircle,
  },
};

function inferTone(task: Partial<DigitalPersonVideo>): DigitalHumanVideoStatusTone {
  if (task.videoUrl) {
    return "success";
  }

  if (task.errReason || task.errorMessage) {
    return "failed";
  }

  if (
    (typeof task.progress === "number" && task.progress >= 0 && task.progress < 100) ||
    task.status === 1 ||
    task.status === 2
  ) {
    return "processing";
  }

  return "unknown";
}

function getFallbackLabel(task: Partial<DigitalPersonVideo>) {
  if (task.videoUrl) {
    return "已完成";
  }

  if (task.errReason || task.errorMessage) {
    return "生成失败";
  }

  if (task.status === 1 || task.status === 2) {
    return "生成中";
  }

  return "状态未知";
}

export function getDigitalHumanVideoStatusMeta(
  task: Partial<DigitalPersonVideo>,
): DigitalHumanVideoStatusMeta {
  const tone = inferTone(task);
  const resultState =
    tone === "success" ? "success" : tone === "failed" ? "failed" : "processing";

  return {
    label: task.statusLabel?.trim() || getFallbackLabel(task),
    tone,
    resultState,
    color: palette[tone].color,
    background: palette[tone].background,
    icon: palette[tone].icon,
    canRefresh: tone !== "success",
  };
}
