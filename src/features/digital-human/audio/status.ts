import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { CustomisedAudio } from "../../../api/aigc/customised-audios/types";

export type CustomisedAudioResultState =
  | "success"
  | "failed"
  | "processing"
  | "queued";

export interface CustomisedAudioStatusMeta {
  label: string;
  color: string;
  background: string;
  icon: LucideIcon;
  resultState: CustomisedAudioResultState;
}

export function getCustomisedAudioStatusMeta(
  audio: CustomisedAudio,
): CustomisedAudioStatusMeta {
  if (audio.status === 2) {
    return {
      label: audio.statusLabel ?? "已完成",
      color: "#166534",
      background: "#DCFCE7",
      icon: CheckCircle2,
      resultState: "success",
    };
  }

  if (audio.status === 3) {
    return {
      label: audio.statusLabel ?? "失败",
      color: "#B91C1C",
      background: "#FEE2E2",
      icon: AlertCircle,
      resultState: "failed",
    };
  }

  if (audio.status === 1) {
    return {
      label: audio.statusLabel ?? "训练中",
      color: "#C2410C",
      background: "#FFEDD5",
      icon: RefreshCw,
      resultState: "processing",
    };
  }

  return {
    label: audio.statusLabel ?? "排队中",
    color: "#475569",
    background: "#E2E8F0",
    icon: Clock3,
    resultState: "queued",
  };
}
