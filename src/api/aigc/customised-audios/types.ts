import type { Id, PageData, PageQuery } from "../../shared/types";

export interface CustomisedAudioQuery extends PageQuery {
  status?: number;
  keyword?: string;
}

export interface CustomisedAudio {
  id: Id;
  chanjingAudioId?: string;
  name: string;
  modelType?: string;
  language?: string;
  url?: string;
  sourceUrl?: string;
  text?: string;
  previewText?: string;
  status: number;
  statusLabel?: string;
  progress?: number;
  audioPath?: string;
  errorMessage?: string;
  errReason?: string;
  createTime?: string;
  updateTime?: string;
}

export interface CustomisedAudioPageData extends PageData<CustomisedAudio> {
  pageNum?: number;
  pageSize?: number;
  pages?: number;
}

export interface CustomisedAudioCreateRequest {
  name: string;
  url: string;
  modelType?: string;
  language?: string;
  text?: string;
  callback?: string;
}

export interface CustomisedAudioBackendPageResponse {
  records: CustomisedAudio[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}
