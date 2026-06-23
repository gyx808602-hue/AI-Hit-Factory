import type { PageQuery } from "../../shared/types";

export interface NoticePageQuery extends PageQuery {
  keywords?: string;
  type?: number;
  publishStatus?: number;
}

export interface NoticePageItem {
  id: number;
  title: string;
  publishStatus: number;
  type: number;
  publisherName?: string;
  level?: string;
  publishTime?: string;
  isRead?: number;
  targetType?: number;
  createTime?: string;
  revokeTime?: string;
}

export interface NoticeForm {
  id?: number;
  title: string;
  content: string;
  type?: number;
  level?: string;
  targetType?: number;
  targetUserIds?: string[];
}

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  type?: number;
  publisherName?: string;
  level?: string;
  publishStatus?: number;
  publishTime?: string;
}
