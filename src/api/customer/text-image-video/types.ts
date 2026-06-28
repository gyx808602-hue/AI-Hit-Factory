import type { Id, PageData, PageQuery } from "../../shared/types";

export type TextImageVideoPromptInputMode = "text" | "image" | "mixed";

export interface TextImageVideoTaskQuery extends PageQuery {
  status?: number;
}

export interface TextImageVideoCreateRequest {
  imageUrls: string[];
  prompt: string;
  model?: string;
}

export interface TextImageVideoPromptGenerateRequest {
  topic: string;
  imageUrls: string[];
  inputMode: TextImageVideoPromptInputMode;
}

export interface TextImageVideoPromptGenerateResponse {
  prompt: string;
}

export interface TextImageVideoTask {
  id: Id;
  remoteTaskId?: number;
  externalTaskId?: string;
  imageUrls: string[];
  prompt: string;
  model?: string;
  status: number;
  statusLabel?: string;
  progress?: number;
  videoUrl?: string;
  coverUrl?: string;
  duration?: number;
  errReason?: string;
  syncError?: string;
  createTime?: string;
  updateTime?: string;
}

export interface TextImageVideoTaskPageResponse extends PageData<TextImageVideoTask> {}
