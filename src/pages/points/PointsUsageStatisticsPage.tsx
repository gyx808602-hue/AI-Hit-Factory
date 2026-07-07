import { Alert, Button } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointsUsageRecordQuery } from "../../api/points/usage";
import {
  buildPointsBusinessStats,
  emptyPointsUsagePage,
  pointsInitialQuery,
  PointsSummaryMetrics,
  PointsUsageDetailDrawer,
  PointsUsageOverview,
  PointsUsageRecordsPanel,
} from "../../features/points/components";
import {
  usePointsSummary,
  usePointsUsageRecordDetail,
  usePointsUsageRecords,
} from "../../features/points/hooks";
import { PageShell } from "../../shared/components/PageShell";

export function PointsUsageStatisticsPage() {
  const [query, setQuery] = useState<PointsUsageRecordQuery>(pointsInitialQuery);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();

  const summaryQuery = usePointsSummary();
  const recordsQuery = usePointsUsageRecords(query);
  const detailQuery = usePointsUsageRecordDetail(selectedRecordId);

  const summary = summaryQuery.data;
  const pageData = recordsQuery.data ?? {
    ...emptyPointsUsagePage,
    pageNum: query.pageNum ?? emptyPointsUsagePage.pageNum,
    pageSize: query.pageSize ?? emptyPointsUsagePage.pageSize,
  };

  const businessStats = useMemo(
    () => buildPointsBusinessStats(pageData.list),
    [pageData.list],
  );

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
            <Button
              size="small"
              icon={<RefreshCw size={12} />}
              onClick={() => void summaryQuery.refetch()}
            >
              重新加载
            </Button>
          }
        />
      ) : null}

      <PointsSummaryMetrics summary={summary} businessStats={businessStats} />

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PointsUsageOverview summary={summary} businessStats={businessStats} />
        <PointsUsageRecordsPanel
          query={query}
          pageData={pageData}
          loading={recordsQuery.isLoading}
          hasError={recordsQuery.isError}
          onQueryChange={updateQuery}
          onTableChange={handleTableChange}
          onOpenDetail={setSelectedRecordId}
        />
      </div>

      <PointsUsageDetailDrawer
        open={Boolean(selectedRecordId)}
        record={detailQuery.data}
        hasError={detailQuery.isError}
        onClose={() => setSelectedRecordId(undefined)}
      />
    </PageShell>
  );
}
