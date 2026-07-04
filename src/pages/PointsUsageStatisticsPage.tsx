import {
  Alert,
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import {
  CircleDollarSign,
  Clock,
  Coins,
  FileSearch,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  PointsBusinessType,
  PointsDirection,
  PointsUsageRecord,
  PointsUsageRecordQuery,
  PointsUsageStatus,
} from "../api/points/usage";
import {
  usePointsSummary,
  usePointsUsageRecordDetail,
  usePointsUsageRecords,
} from "../features/points/hooks";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

const { RangePicker } = DatePicker;

const numberFormatter = new Intl.NumberFormat("zh-CN");

const businessTypeOptions: Array<{ label: string; value: PointsBusinessType | "all" }> = [
  { label: "全部业务", value: "all" },
  { label: "积分充值", value: "recharge" },
  { label: "文图生视频", value: "image_video" },
  { label: "爆款改编", value: "viral_remix" },
  { label: "数字人", value: "digital_human" },
  { label: "退款退回", value: "refund" },
  { label: "系统调整", value: "system_adjustment" },
];

const directionOptions: Array<{ label: string; value: PointsDirection | "all" }> = [
  { label: "全部方向", value: "all" },
  { label: "收入", value: "income" },
  { label: "支出", value: "expense" },
  { label: "退款", value: "refund" },
  { label: "冻结", value: "freeze" },
];

const statusOptions: Array<{ label: string; value: PointsUsageStatus | "all" }> = [
  { label: "全部状态", value: "all" },
  { label: "成功", value: "success" },
  { label: "处理中", value: "processing" },
  { label: "失败", value: "failed" },
  { label: "已取消", value: "cancelled" },
];

const directionView: Record<
  PointsDirection,
  { label: string; color: string; tagColor: string; prefix: string }
> = {
  income: { label: "收入", color: "#4ADE80", tagColor: "green", prefix: "+" },
  expense: { label: "支出", color: "#F97316", tagColor: "orange", prefix: "-" },
  refund: { label: "退款", color: "#22D3EE", tagColor: "cyan", prefix: "+" },
  freeze: { label: "冻结", color: "#A78BFA", tagColor: "purple", prefix: "-" },
};

const statusView: Record<
  PointsUsageStatus,
  { label: string; color: string; background: string }
> = {
  success: { label: "成功", color: "#4ADE80", background: "rgba(74,222,128,0.1)" },
  processing: { label: "处理中", color: "#F97316", background: "rgba(249,115,22,0.1)" },
  failed: { label: "失败", color: "#EF4444", background: "rgba(239,68,68,0.1)" },
  cancelled: { label: "已取消", color: "#6B6C80", background: "rgba(107,108,128,0.1)" },
};

const initialQuery: Required<Pick<PointsUsageRecordQuery, "pageNum" | "pageSize">> &
  Omit<PointsUsageRecordQuery, "pageNum" | "pageSize"> = {
  pageNum: 1,
  pageSize: 10,
  keyword: "",
  businessType: "all",
  direction: "all",
  status: "all",
};

function formatPoints(value: number) {
  return numberFormatter.format(value);
}

function formatDirectionPoints(record: PointsUsageRecord) {
  const view = directionView[record.direction];
  return `${view.prefix}${formatPoints(record.points)}`;
}

export function PointsUsageStatisticsPage() {
  const [query, setQuery] = useState<PointsUsageRecordQuery>(initialQuery);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const summaryQuery = usePointsSummary();
  const recordsQuery = usePointsUsageRecords(query);
  const detailQuery = usePointsUsageRecordDetail(selectedRecordId);

  const summary = summaryQuery.data;
  const pageData = recordsQuery.data ?? {
    list: [],
    total: 0,
    pageNum: query.pageNum ?? 1,
    pageSize: query.pageSize ?? 10,
    pages: 0,
  };

  const businessStats = useMemo(() => {
    const records = pageData.list;
    const totalExpense = records
      .filter((record) => record.direction === "expense")
      .reduce((total, record) => total + record.points, 0);

    return {
      totalExpense,
      activeRecords: records.filter(
        (record) => record.status === "processing" || record.direction === "freeze",
      ).length,
    };
  }, [pageData.list]);

  function updateQuery(nextQuery: Partial<PointsUsageRecordQuery>) {
    setQuery((current) => ({
      ...current,
      ...nextQuery,
      pageNum: nextQuery.pageNum ?? 1,
    }));
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    setQuery((current) => ({
      ...current,
      pageNum: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? current.pageSize,
    }));
  }

  const columns: ColumnsType<PointsUsageRecord> = [
    {
      title: "流水号",
      dataIndex: "serialNo",
      width: 170,
      render: (value: string, record) => (
        <div className="min-w-0">
          <div className="text-[13px] text-[var(--text-primary)]">{value}</div>
          <div className="mt-1 text-[11px] text-[var(--text-muted)]">{record.occurredAt}</div>
        </div>
      ),
    },
    {
      title: "业务类型",
      dataIndex: "businessName",
      width: 130,
      render: (value: string, record) => (
        <div>
          <Tag color="purple">{value}</Tag>
          {record.relatedBizName ? (
            <div className="mt-1 max-w-[180px] truncate text-[11px] text-[var(--text-muted)]">
              {record.relatedBizName}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: "变动方向",
      dataIndex: "direction",
      width: 110,
      render: (value: PointsDirection) => (
        <Tag color={directionView[value].tagColor}>{directionView[value].label}</Tag>
      ),
    },
    {
      title: "积分变动",
      dataIndex: "points",
      width: 120,
      align: "right",
      render: (_, record) => (
        <span style={{ color: directionView[record.direction].color }}>
          {formatDirectionPoints(record)}
        </span>
      ),
    },
    {
      title: "余额快照",
      dataIndex: "balanceAfter",
      width: 120,
      align: "right",
      render: (value: number) => formatPoints(value),
    },
    {
      title: "操作人",
      dataIndex: "operatorName",
      width: 120,
      render: (value?: string) => value || "-",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 110,
      render: (value: PointsUsageStatus) => (
        <StatusPill
          label={statusView[value].label}
          color={statusView[value].color}
          background={statusView[value].background}
        />
      ),
    },
    {
      title: "操作",
      width: 90,
      fixed: "right",
      render: (_, record) => (
        <Button
          size="small"
          aria-label="详情"
          onClick={() => setSelectedRecordId(String(record.id))}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <PageShell
      title="积分统计"
      description="查看积分余额、消耗概览和每一笔积分使用记录"
    >
      {summaryQuery.isError ? (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="积分摘要加载失败"
          description="请稍后重试，或联系管理员确认积分账户状态。"
          action={
            <Button size="small" icon={<RefreshCw size={12} />} onClick={() => void summaryQuery.refetch()}>
              重新加载
            </Button>
          }
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={summary?.accountName ?? "当前账户"}
          value={summary ? formatPoints(summary.availablePoints) : "--"}
          change={summary?.expiringAt ? `${summary.expiringAt} 到期` : undefined}
          color="#E8E9F0"
          icon={WalletCards}
        />
        <MetricCard
          label="累计获得"
          value={summary ? formatPoints(summary.totalEarned) : "--"}
          color="#4ADE80"
          icon={Coins}
        />
        <MetricCard
          label="累计消耗"
          value={summary ? formatPoints(summary.totalUsed) : "--"}
          color="#F97316"
          icon={CircleDollarSign}
        />
        <MetricCard
          label="冻结 / 待处理"
          value={summary ? formatPoints(summary.frozenPoints) : "--"}
          change={`${businessStats.activeRecords} 笔处理中`}
          color="#22D3EE"
          icon={Clock}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)]">
            <FileSearch size={15} />
            使用统计
          </div>
          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">当前列表消耗</span>
              <span className="text-[var(--text-primary)]">{formatPoints(businessStats.totalExpense)} 分</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">即将到期</span>
              <span className="text-[var(--text-primary)]">{formatPoints(summary?.expiringPoints ?? 0)} 分</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">最近更新</span>
              <span className="text-[var(--text-primary)]">{summary?.updatedAt ?? "--"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <Input
              allowClear
              className="max-w-xs"
              prefix={<Search size={14} />}
              placeholder="搜索流水号、任务或操作人"
              value={query.keyword}
              onChange={(event) => updateQuery({ keyword: event.target.value })}
            />
            <Space className="flex-wrap" size={[8, 8]}>
              <Select
                className="w-[130px]"
                size="middle"
                value={query.businessType ?? "all"}
                options={businessTypeOptions}
                onChange={(value) => updateQuery({ businessType: value })}
              />
              <Select
                className="w-[110px]"
                size="middle"
                value={query.direction ?? "all"}
                options={directionOptions}
                onChange={(value) => updateQuery({ direction: value })}
              />
              <Select
                className="w-[110px]"
                size="middle"
                value={query.status ?? "all"}
                options={statusOptions}
                onChange={(value) => updateQuery({ status: value })}
              />
              <RangePicker
                className="w-[240px]"
                value={
                  query.dateRange
                    ? [dayjs(query.dateRange[0]), dayjs(query.dateRange[1])]
                    : undefined
                }
                onChange={(_, dateStrings) => {
                  updateQuery({
                    dateRange:
                      dateStrings[0] && dateStrings[1]
                        ? [dateStrings[0], dateStrings[1]]
                        : undefined,
                  });
                }}
              />
            </Space>
          </div>

          <Table
            rowKey="id"
            size="middle"
            columns={columns}
            dataSource={pageData.list}
            loading={recordsQuery.isLoading}
            locale={{
              emptyText: recordsQuery.isError ? "积分记录加载失败" : <Empty description="暂无积分使用记录" />,
            }}
            pagination={{
              current: pageData.pageNum ?? query.pageNum,
              pageSize: pageData.pageSize ?? query.pageSize,
              total: pageData.total,
              showSizeChanger: true,
            }}
            scroll={{ x: 1040 }}
            onChange={handleTableChange}
          />
        </div>
      </div>

      <Drawer
        width={520}
        title="积分记录详情"
        open={Boolean(selectedRecordId)}
        onClose={() => setSelectedRecordId(undefined)}
      >
        {detailQuery.isError ? (
          <Alert type="error" showIcon message="详情加载失败" />
        ) : (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="流水号">
              {detailQuery.data?.serialNo ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="业务类型">
              {detailQuery.data?.businessName ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="积分变动">
              {detailQuery.data ? formatDirectionPoints(detailQuery.data) : "--"}
            </Descriptions.Item>
            <Descriptions.Item label="余额快照">
              {detailQuery.data ? formatPoints(detailQuery.data.balanceAfter) : "--"}
            </Descriptions.Item>
            <Descriptions.Item label="关联业务">
              {detailQuery.data?.relatedBizName ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {detailQuery.data?.operatorName ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="扣费规则">
              {detailQuery.data?.ruleName ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="退款状态">
              {detailQuery.data?.refundStatus ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="审计编号">
              {detailQuery.data?.auditTraceId ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              {detailQuery.data?.remark ?? "--"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageShell>
  );
}
