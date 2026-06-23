import type { DigitalPerson } from "../../api/aigc/digital-persons/types";

export type DigitalHumanStatusTone = "default" | "processing" | "success" | "failed";
export type DigitalHumanResultState = "processing" | "success" | "failed";

export type DigitalHumanStatusMeta = {
  label: string;
  tone: DigitalHumanStatusTone;
  color: string;
  background: string;
  resultState: DigitalHumanResultState;
  canRefresh: boolean;
};

const tonePalette: Record<DigitalHumanStatusTone, Pick<DigitalHumanStatusMeta, "color" | "background">> = {
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

function inferTone(person: Partial<DigitalPerson>): DigitalHumanStatusTone {
  if (person.previewVideoUrl) {
    return "success";
  }

  if (person.errReason || person.errorMessage) {
    return "failed";
  }

  if (
    (typeof person.progress === "number" && person.progress > 0 && person.progress < 100) ||
    person.status === 0 ||
    person.status === 1
  ) {
    return "processing";
  }

  return "default";
}

function getFallbackLabel(person: Partial<DigitalPerson>) {
  if (person.previewVideoUrl) {
    return "训练成功";
  }

  if (person.errReason || person.errorMessage) {
    return "训练失败";
  }

  if (person.status === 0 || person.status === 1) {
    return "训练中";
  }

  return "状态未知";
}

export function getDigitalHumanStatusMeta(person: Partial<DigitalPerson>): DigitalHumanStatusMeta {
  const tone = inferTone(person);
  const resultState =
    tone === "success" ? "success" : tone === "failed" ? "failed" : "processing";

  return {
    label: person.statusLabel?.trim() || getFallbackLabel(person),
    tone,
    color: tonePalette[tone].color,
    background: tonePalette[tone].background,
    resultState,
    canRefresh: tone === "processing" || tone === "failed" || !person.previewVideoUrl,
  };
}
