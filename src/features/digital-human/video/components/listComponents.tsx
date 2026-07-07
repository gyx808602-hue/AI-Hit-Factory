import { Button, Empty, Input, Pagination, Radio } from "antd";
import { Clapperboard, ListTodo, RefreshCw, Search, Trash2 } from "lucide-react";
import type { DigitalPersonVideo } from "../../../../api/aigc/digital-person-videos/types";
import { MetricCard } from "../../../../shared/components/MetricCard";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { getDigitalHumanVideoStatusMeta } from "../status";

// 本文件承接数字人视频任务列表页中稳定的展示组件：指标卡、筛选条、任务列表和分页。
// 页面层继续负责查询参数、创建弹窗、删除确认、刷新 mutation 和跳转详情。
// 这些组件依赖数字人视频任务字段和领域文案，暂不提升到 shared。

export type DigitalHumanVideoStatusFilterValue = "all" | "1" | "2" | "4";

export interface DigitalHumanVideoMetrics {
  total: number;
  successCount: number;
  processingCount: number;
  failedCount: number;
}

export interface DigitalHumanVideoListText {
  totalLabel: string;
  processingLabel: string;
  successLabel: string;
  failedLabel: string;
  searchPlaceholder: string;
  allFilterLabel: string;
  processingFilterLabel: string;
  successFilterLabel: string;
  failedFilterLabel: string;
  loadingText: string;
  emptyText: string;
  progressLabel: string;
  personIdLabel: string;
  durationLabel: string;
  secondsSuffix: string;
  detailButtonText: string;
  refreshButtonText: string;
  deleteButtonText: string;
  detailAriaPrefix: string;
  refreshAriaPrefix: string;
  deleteAriaPrefix: string;
}

// 列表指标属于数字人视频领域规则，放在 feature 内，页面只负责传入任务数据。
function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

export function buildDigitalHumanVideoMetrics(
  tasks: DigitalPersonVideo[],
  total: number,
): DigitalHumanVideoMetrics {
  const successCount = countByState(tasks, (item) => Boolean(item.videoUrl));
  const processingCount = countByState(
    tasks,
    (item) => getDigitalHumanVideoStatusMeta(item).resultState === "processing",
  );
  const failedCount = countByState(
    tasks,
    (item) => getDigitalHumanVideoStatusMeta(item).resultState === "failed",
  );

  return {
    total,
    successCount,
    processingCount,
    failedCount,
  };
}

export function DigitalHumanVideoMetricsGrid({
  metrics,
  text,
}: {
  metrics: DigitalHumanVideoMetrics;
  text: DigitalHumanVideoListText;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <MetricCard
        label={text.totalLabel}
        value={metrics.total}
        color="#94A3B8"
        icon={ListTodo}
      />
      <MetricCard
        label={text.processingLabel}
        value={metrics.processingCount}
        color="#F97316"
        icon={RefreshCw}
      />
      <MetricCard
        label={text.successLabel}
        value={metrics.successCount}
        color="#4ADE80"
        icon={Clapperboard}
      />
      <MetricCard
        label={text.failedLabel}
        value={metrics.failedCount}
        color="#EF4444"
        icon={Trash2}
      />
    </div>
  );
}

export function DigitalHumanVideoTaskFilters({
  keyword,
  statusFilter,
  text,
  onKeywordChange,
  onStatusFilterChange,
}: {
  keyword: string;
  statusFilter: DigitalHumanVideoStatusFilterValue;
  text: DigitalHumanVideoListText;
  onKeywordChange: (keyword: string) => void;
  onStatusFilterChange: (status: DigitalHumanVideoStatusFilterValue) => void;
}) {
  return (
    <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        allowClear
        className="max-w-xs"
        prefix={<Search size={14} />}
        placeholder={text.searchPlaceholder}
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <Radio.Group
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
      >
        <Radio.Button value="all">{text.allFilterLabel}</Radio.Button>
        <Radio.Button value="1">{text.processingFilterLabel}</Radio.Button>
        <Radio.Button value="2">{text.successFilterLabel}</Radio.Button>
        <Radio.Button value="4">{text.failedFilterLabel}</Radio.Button>
      </Radio.Group>
    </div>
  );
}

export function DigitalHumanVideoTaskListSection({
  loading,
  tasks,
  total,
  currentPage,
  pageSize,
  text,
  onViewDetail,
  onRefresh,
  onDelete,
  onPageChange,
}: {
  loading: boolean;
  tasks: DigitalPersonVideo[];
  total: number;
  currentPage: number;
  pageSize: number;
  text: DigitalHumanVideoListText;
  onViewDetail: (task: DigitalPersonVideo) => void;
  onRefresh: (task: DigitalPersonVideo) => void;
  onDelete: (task: DigitalPersonVideo) => void;
  onPageChange: (page: number, pageSize: number) => void;
}) {
  // 列表区只处理 loading/empty/card/pagination 展示，刷新、删除、跳转仍由页面编排。
  if (loading) {
    return (
      <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">
        {text.loadingText}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <Empty description={text.emptyText} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {tasks.map((task) => {
          const statusMeta = getDigitalHumanVideoStatusMeta(task);

          return (
            <div
              key={task.id}
              className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold text-[var(--text-primary)]">
                    {task.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                    {text.progressLabel} {task.progress ?? 0}%
                  </div>
                </div>
                <StatusPill
                  label={statusMeta.label}
                  color={statusMeta.color}
                  background={statusMeta.background}
                  icon={statusMeta.icon}
                />
              </div>

              <div className="mb-4 space-y-2 text-[12px] text-[var(--text-secondary)]">
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">
                    {text.personIdLabel}
                  </span>
                  <span>{task.personId}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">
                    {text.durationLabel}
                  </span>
                  <span>
                    {typeof task.duration === "number"
                      ? `${task.duration} ${text.secondsSuffix}`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="small"
                  aria-label={`${text.detailAriaPrefix}-${task.id}`}
                  onClick={() => onViewDetail(task)}
                >
                  {text.detailButtonText}
                </Button>
                <Button
                  size="small"
                  icon={<RefreshCw size={12} />}
                  aria-label={`${text.refreshAriaPrefix}-${task.id}`}
                  onClick={() => onRefresh(task)}
                >
                  {text.refreshButtonText}
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<Trash2 size={12} />}
                  aria-label={`${text.deleteAriaPrefix}-${task.id}`}
                  onClick={() => onDelete(task)}
                >
                  {text.deleteButtonText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          defaultPageSize={20}
          total={total}
          onChange={onPageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
}
