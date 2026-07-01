import type { Id, PageQuery } from "../../shared/types";

export interface VideoRemixTaskQuery extends PageQuery {
  status?: number;
  keyword?: string;
}

export interface VideoRemixTaskCreateRequest {
  name: string;
  remark?: string;
}

export interface VideoRemixTaskForm {
  targetVideoModel?: string;
  referenceVideoUrl?: string;
  videoMetaSummary?: string;
  productImageUrls?: string[];
  characterImageUrls?: string[];
  audioUrl?: string;
  productInfo?: string;
  voiceoverScript?: string;
  direction?: string;
  generationDuration?: number;
}

export interface VideoRemixTaskFormRequest extends VideoRemixTaskForm {
  name?: string;
  remark?: string;
}

export interface VideoRemixTask {
  id: Id;
  chanjingId?: number;
  name: string;
  remark?: string;
  status: number;
  statusLabel?: string;
  progress?: number;
  errReason?: string;
  targetVideoModel?: string;
  referenceVideoUrl?: string;
  generatedPrompt?: string;
  promptProvider?: string;
  promptModel?: string;
  promptGeneratedAt?: string;
  promptCheckPass?: boolean;
  promptCheckReason?: string;
  promptCheckedAt?: string;
  videoProvider?: string;
  videoModel?: string;
  externalTaskId?: string;
  videoUrl?: string;
  coverUrl?: string;
  duration?: number;
  form?: VideoRemixTaskForm;
  createTime?: string;
  updateTime?: string;
}

export interface VideoRemixTaskPageResponse {
  records: VideoRemixTask[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

export interface VideoRemixTaskPageData {
  list: VideoRemixTask[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  pages?: number;
}
