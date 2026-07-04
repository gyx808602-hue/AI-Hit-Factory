import type { Id, PageQuery } from "../../shared/types";

export type PointsDirection = "income" | "expense" | "refund" | "freeze";

export type PointsUsageStatus = "success" | "processing" | "failed" | "cancelled";

export type PointsBusinessType =
  | "recharge"
  | "image_video"
  | "viral_remix"
  | "digital_human"
  | "refund"
  | "system_adjustment";

export interface PointsSummary {
  accountName: string;
  availablePoints: number;
  totalEarned: number;
  totalUsed: number;
  frozenPoints: number;
  expiringPoints: number;
  expiringAt?: string;
  updatedAt?: string;
}

export interface PointsUsageRecord {
  id: Id;
  serialNo: string;
  businessType: PointsBusinessType;
  businessName: string;
  direction: PointsDirection;
  points: number;
  balanceAfter: number;
  relatedBizId?: Id;
  relatedBizName?: string;
  operatorName?: string;
  workspaceName?: string;
  status: PointsUsageStatus;
  occurredAt: string;
  remark?: string;
}

export interface PointsUsageRecordDetail extends PointsUsageRecord {
  ruleName?: string;
  refundStatus?: "none" | "pending" | "refunded" | "failed";
  failReason?: string;
  sourceOrderNo?: string;
  auditTraceId?: string;
}

export interface PointsUsageRecordQuery extends PageQuery {
  keyword?: string;
  businessType?: PointsBusinessType | "all";
  direction?: PointsDirection | "all";
  status?: PointsUsageStatus | "all";
  dateRange?: [string, string];
}

export interface PointsUsageRecordRequestQuery extends PageQuery {
  keyword?: string;
  businessType?: PointsBusinessType;
  direction?: PointsDirection;
  status?: PointsUsageStatus;
  startDate?: string;
  endDate?: string;
}

export interface PointsUsageRecordPageResponse {
  records: PointsUsageRecord[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

export interface PointsUsageRecordPageData {
  list: PointsUsageRecord[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  pages?: number;
}
