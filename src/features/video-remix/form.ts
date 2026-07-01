import type { Id } from "../../api/shared/types";
import type { VideoRemixTask, VideoRemixTaskFormRequest } from "../../api/aigc/video-remix-tasks/types";

export interface VideoRemixTaskFormValues {
  name: string;
  remark: string;
  targetVideoModel: string;
  referenceVideoUrl: string;
  productImageUrlsText: string;
  characterImageUrlsText: string;
  audioUrl: string;
  productInfo: string;
  voiceoverScript: string;
  direction: string;
  editablePrompt: string;
  generationDuration?: number;
}

const DRAFT_KEY_PREFIX = "video-remix:draft:";
const DEFAULT_TARGET_VIDEO_MODEL = "seedance2.0";

function joinUrls(urls?: string[]) {
  return Array.isArray(urls) ? urls.join("\n") : "";
}

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function splitUrls(text: string) {
  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function mapTaskDetailToFormValues(task: Partial<VideoRemixTask>): VideoRemixTaskFormValues {
  const form = task.form;

  return {
    name: task.name ?? "",
    remark: task.remark ?? "",
    targetVideoModel: form?.targetVideoModel ?? task.targetVideoModel ?? DEFAULT_TARGET_VIDEO_MODEL,
    referenceVideoUrl: form?.referenceVideoUrl ?? task.referenceVideoUrl ?? "",
    productImageUrlsText: joinUrls(form?.productImageUrls),
    characterImageUrlsText: joinUrls(form?.characterImageUrls),
    audioUrl: form?.audioUrl ?? "",
    productInfo: form?.productInfo ?? "",
    voiceoverScript: form?.voiceoverScript ?? "",
    direction: form?.direction ?? "",
    // 当前后端没有独立的可编辑 prompt 保存字段，这里先承接本地编辑态。
    editablePrompt: task.generatedPrompt ?? "",
    generationDuration: form?.generationDuration ?? task.duration ?? 15,
  };
}

export function mapFormValuesToSavePayload(values: VideoRemixTaskFormValues): VideoRemixTaskFormRequest {
  const normalizedTargetVideoModel = normalizeText(values.targetVideoModel) || DEFAULT_TARGET_VIDEO_MODEL;

  return {
    name: normalizeText(values.name),
    remark: normalizeText(values.remark),
    targetVideoModel: normalizedTargetVideoModel,
    referenceVideoUrl: normalizeText(values.referenceVideoUrl),
    // 当前 UI 已移除视频摘要输入，保存时保持空字符串兼容现有接口。
    videoMetaSummary: "",
    productImageUrls: splitUrls(values.productImageUrlsText ?? ""),
    characterImageUrls: splitUrls(values.characterImageUrlsText ?? ""),
    audioUrl: normalizeText(values.audioUrl),
    productInfo: normalizeText(values.productInfo),
    voiceoverScript: normalizeText(values.voiceoverScript),
    direction: normalizeText(values.direction),
    generationDuration: values.generationDuration,
  };
}

export function writeVideoRemixTaskDraft(taskId: Id, values: Partial<VideoRemixTaskFormValues>) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(`${DRAFT_KEY_PREFIX}${taskId}`, JSON.stringify(values));
}

export function readVideoRemixTaskDraft(taskId: Id) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(`${DRAFT_KEY_PREFIX}${taskId}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Partial<VideoRemixTaskFormValues>;
  } catch {
    return null;
  }
}

export function clearVideoRemixTaskDraft(taskId: Id) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(`${DRAFT_KEY_PREFIX}${taskId}`);
}
