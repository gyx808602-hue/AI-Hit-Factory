import type { Id, PageQuery } from "../../shared/types";

export interface DigitalPersonVideoQuery extends PageQuery {
  status?: number;
  keyword?: string;
}

export type DigitalPersonVideoType = "tts" | "audio";
export type DigitalPersonVideoLanguage = "cn" | "en";

export interface DigitalPersonVideoBackground {
  src_url: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface DigitalPersonVideoSubtitleConfig {
  show?: boolean;
  font_size?: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface DigitalPersonVideoCreateRequest {
  name: string;
  personId: string;
  type: DigitalPersonVideoType;
  text?: string;
  customAudioId?: string;
  audioManId?: string;
  wavUrl?: string;
  fileId?: string;
  bg?: DigitalPersonVideoBackground;
  bgColor?: string;
  screenWidth?: number;
  screenHeight?: number;
  x?: number;
  y?: number;
  personWidth?: number;
  personHeight?: number;
  rgbaMode?: boolean;
  speed?: number;
  pitch?: number;
  volume?: number;
  language?: DigitalPersonVideoLanguage;
  model?: number;
  subtitleConfig?: DigitalPersonVideoSubtitleConfig;
  callback?: string;
  addComplianceWatermark?: boolean;
  complianceWatermarkPosition?: number;
  resolutionRate?: number;
}

export interface DigitalPersonVideo {
  id: Id;
  personId: string;
  customAudioId?: string;
  chanjingId?: number;
  name: string;
  chanjingVideoId?: string;
  audioManId?: string;
  status: number;
  statusLabel?: string;
  progress?: number;
  videoUrl?: string;
  coverUrl?: string;
  subtitleUrl?: string;
  duration?: number;
  errorMessage?: string;
  errReason?: string;
  createTime?: string;
  updateTime?: string;
}

export interface DigitalPersonVideoBackendPageResponse {
  records: DigitalPersonVideo[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

export interface DigitalPersonVideoPageData {
  list: DigitalPersonVideo[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  pages?: number;
}
