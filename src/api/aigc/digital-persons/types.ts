import type { Id, PageData, PageQuery } from "../../shared/types";

export interface DigitalPersonQuery extends PageQuery {
  status?: number;
  keyword?: string;
}

export interface DigitalPerson {
  id: Id;
  chanjingId?: number;
  name: string;
  chanjingPersonId?: string;
  audioManId?: string;
  status: number;
  statusLabel?: string;
  progress?: number;
  picUrl?: string;
  previewImageUrl?: string;
  previewUrl?: string;
  previewVideoUrl?: string;
  width?: number;
  height?: number;
  support4k?: boolean;
  errorMessage?: string;
  errReason?: string;
  createTime?: string;
  updateTime?: string;
}

export interface DigitalPersonPageResponse extends PageData<DigitalPerson> {
  pageNum?: number;
  pageSize?: number;
  pages?: number;
}

export type DigitalPersonTrainType = "both" | "figure" | "voice";

export type DigitalPersonLanguage = "cn" | "en";

export interface DigitalPersonCreateRequest {
  name: string;
  file?: File;
  fileUrl?: string;
  trainType?: DigitalPersonTrainType;
  language?: DigitalPersonLanguage;
  errorSkip?: boolean;
  callback?: string;
}

export interface DigitalPersonBackendPageResponse {
  records: DigitalPerson[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}
