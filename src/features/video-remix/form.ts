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
const DEFAULT_TARGET_VIDEO_MODEL = "dreamina-seedance-2-0";

export function getVideoRemixTaskPrompt(task: Partial<VideoRemixTask>) {
  return task.generatedPrompt ?? task.prompt ?? "";
}

function joinUrls(urls?: string[]) {
  return Array.isArray(urls) ? urls.join("\n") : "";
}

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function firstNonEmptyText(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim()) ?? "";
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
    targetVideoModel: DEFAULT_TARGET_VIDEO_MODEL,
    // targetVideoModel: form?.targetVideoModel ?? task.targetVideoModel ?? DEFAULT_TARGET_VIDEO_MODEL,
    referenceVideoUrl: form?.referenceVideoUrl ?? task.referenceVideoUrl ?? "",
    productImageUrlsText: joinUrls(form?.productImageUrls ?? task.productImageUrls),
    characterImageUrlsText: joinUrls(form?.characterImageUrls ?? task.characterImageUrls),
    audioUrl: form?.audioUrl ?? task.audioUrl ?? "",
    productInfo: firstNonEmptyText(form?.productInfo, task.productInfo),
    voiceoverScript: firstNonEmptyText(form?.voiceoverScript, task.voiceoverScript),
    direction: firstNonEmptyText(form?.direction, task.direction),
    // 后端使用 prompt 字段承接最终视频生成提示词，前端用 editablePrompt 保存本地编辑态。
    editablePrompt: getVideoRemixTaskPrompt(task),
    generationDuration: form?.generationDuration ?? task.duration ?? 15,
  };
}

export function mapFormValuesToSavePayload(values: VideoRemixTaskFormValues): VideoRemixTaskFormRequest {
  const normalizedTargetVideoModel = DEFAULT_TARGET_VIDEO_MODEL;
  // const normalizedTargetVideoModel = normalizeText(values.targetVideoModel) || DEFAULT_TARGET_VIDEO_MODEL;

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
    prompt: normalizeText(values.editablePrompt),
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
