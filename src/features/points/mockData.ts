import type {
  PointsSummary,
  PointsUsageRecord,
  PointsUsageRecordDetail,
  PointsUsageRecordPageData,
  PointsUsageRecordQuery,
} from "../../api/points/usage";

export const mockPointsSummary: PointsSummary = {
  accountName: "默认企业空间",
  availablePoints: 12450,
  totalEarned: 36000,
  totalUsed: 23550,
  frozenPoints: 200,
  expiringPoints: 800,
  expiringAt: "2026-07-17",
  updatedAt: "2026-07-03 10:30:00",
};

export const mockPointsUsageRecords: PointsUsageRecordDetail[] = [
  {
    id: "points-1",
    serialNo: "PTS202607030001",
    businessType: "image_video",
    businessName: "文图生视频",
    direction: "expense",
    points: 120,
    balanceAfter: 12330,
    relatedBizId: "task-1",
    relatedBizName: "夏季新品视频生成",
    operatorName: "Robert",
    workspaceName: "默认企业空间",
    status: "success",
    occurredAt: "2026-07-03 10:30:00",
    remark: "生成任务扣费",
    ruleName: "文图生视频基础扣费",
    refundStatus: "none",
    auditTraceId: "AUDIT-1",
  },
  {
    id: "points-2",
    serialNo: "PTS202607030002",
    businessType: "recharge",
    businessName: "积分充值",
    direction: "income",
    points: 5000,
    balanceAfter: 12450,
    relatedBizId: "order-20260703",
    relatedBizName: "企业积分充值订单",
    operatorName: "Mary",
    workspaceName: "默认企业空间",
    status: "success",
    occurredAt: "2026-07-03 09:12:00",
    remark: "企业账户充值",
    ruleName: "充值到账",
    refundStatus: "none",
    auditTraceId: "AUDIT-2",
  },
  {
    id: "points-3",
    serialNo: "PTS202607020018",
    businessType: "viral_remix",
    businessName: "爆款改编",
    direction: "freeze",
    points: 300,
    balanceAfter: 7450,
    relatedBizId: "remix-18",
    relatedBizName: "口播视频改编任务",
    operatorName: "Robert",
    workspaceName: "默认企业空间",
    status: "processing",
    occurredAt: "2026-07-02 18:05:00",
    remark: "任务处理中预冻结",
    ruleName: "爆款改编预冻结",
    refundStatus: "none",
    auditTraceId: "AUDIT-3",
  },
  {
    id: "points-4",
    serialNo: "PTS202607020011",
    businessType: "refund",
    businessName: "任务失败退回",
    direction: "refund",
    points: 80,
    balanceAfter: 7750,
    relatedBizId: "task-9",
    relatedBizName: "失败的视频生成任务",
    operatorName: "System",
    workspaceName: "默认企业空间",
    status: "success",
    occurredAt: "2026-07-02 15:40:00",
    remark: "失败任务自动退回积分",
    ruleName: "失败退款",
    refundStatus: "refunded",
    auditTraceId: "AUDIT-4",
  },
  {
    id: "points-5",
    serialNo: "PTS202607010006",
    businessType: "digital_human",
    businessName: "数字人训练",
    direction: "expense",
    points: 600,
    balanceAfter: 7670,
    relatedBizId: "human-6",
    relatedBizName: "品牌主播数字人训练",
    operatorName: "Ava",
    workspaceName: "默认企业空间",
    status: "failed",
    occurredAt: "2026-07-01 11:20:00",
    remark: "训练失败，等待人工处理",
    ruleName: "数字人训练扣费",
    refundStatus: "pending",
    failReason: "训练素材不满足规则",
    auditTraceId: "AUDIT-5",
  },
];

const searchable = (record: PointsUsageRecord, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return true;
  }

  return [
    record.serialNo,
    record.businessName,
    record.relatedBizName,
    record.operatorName,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
};

export function getMockPointsUsageRecordPage(
  query: PointsUsageRecordQuery = {},
): PointsUsageRecordPageData {
  const pageNum = query.pageNum ?? 1;
  const pageSize = query.pageSize ?? 10;
  const filtered = mockPointsUsageRecords.filter((record) => {
    return (
      searchable(record, query.keyword ?? "") &&
      (!query.businessType || query.businessType === "all" || record.businessType === query.businessType) &&
      (!query.direction || query.direction === "all" || record.direction === query.direction) &&
      (!query.status || query.status === "all" || record.status === query.status)
    );
  });
  const start = (pageNum - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
    pageNum,
    pageSize,
    pages: Math.ceil(filtered.length / pageSize),
  };
}

export function getMockPointsUsageRecordDetail(id: string) {
  return mockPointsUsageRecords.find((record) => String(record.id) === id);
}
