import { Button, Empty, Input, Modal, Pagination, Radio, Select, Switch } from "antd";
import { ListTodo, RefreshCw, Search, Trash2, User2 } from "lucide-react";
import type { DigitalPerson } from "../../api/aigc/digital-persons/types";
import { MetricCard } from "../../shared/components/MetricCard";
import { StatusPill } from "../../shared/components/StatusPill";
import type { DigitalHumanFormErrors, DigitalHumanFormValues } from "./form";
import { getDigitalHumanStatusMeta } from "./status";

// 本文件承接数字人列表页中稳定的领域 UI：创建弹窗、指标卡、筛选区和列表区。
// 页面层继续负责路由跳转、React Query 调用、分页/筛选状态和删除等流程编排。
// 这些组件依赖数字人字段、状态文案和业务动作，暂不提升到 shared。

export type DigitalHumanStatusFilterValue = "all" | "0" | "1" | "2" | "3" | "4";

export interface DigitalHumanMetrics {
  total: number;
  successCount: number;
  processingCount: number;
  failedCount: number;
}

export function getLocalUploadPreviewKind(file: File | null) {
  if (!file) {
    return null;
  }

  if (file.type.startsWith("image/")) {
    return "image" as const;
  }

  if (file.type.startsWith("video/")) {
    return "video" as const;
  }

  return null;
}

function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

export function buildDigitalHumanMetrics(
  humans: DigitalPerson[],
  total: number,
): DigitalHumanMetrics {
  const successCount = countByState(humans, (item) => Boolean(item.previewVideoUrl));
  const processingCount = countByState(
    humans,
    (item) => getDigitalHumanStatusMeta(item).resultState === "processing",
  );
  const failedCount = countByState(
    humans,
    (item) => getDigitalHumanStatusMeta(item).resultState === "failed",
  );

  return {
    total,
    successCount,
    processingCount,
    failedCount,
  };
}

export function DigitalHumanCreateModal({
  open,
  values,
  errors,
  submitting,
  onCancel,
  onChange,
  onSubmit,
  uploadPreviewUrl,
}: {
  open: boolean;
  values: DigitalHumanFormValues;
  errors: DigitalHumanFormErrors;
  submitting: boolean;
  onCancel: () => void;
  onChange: (nextValues: DigitalHumanFormValues) => void;
  onSubmit: () => void;
  uploadPreviewUrl: string;
}) {
  const previewKind = getLocalUploadPreviewKind(values.file);

  return (
    <Modal
      title="新建数字人"
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitting}
      okText="提交创建"
      cancelText="取消"
      destroyOnHidden
    >
      <div className="space-y-4 pt-2">
        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
            数字人名称
          </div>
          <Input
            placeholder="请输入数字人名称"
            value={values.name}
            status={errors.name ? "error" : ""}
            onChange={(event) =>
              onChange({ ...values, name: event.target.value })
            }
          />
          {errors.name ? (
            <div className="mt-1 text-[12px] text-[#EF4444]">
              {errors.name}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
            训练素材
          </div>
          <Radio.Group
            value={values.materialMode}
            onChange={(event) =>
              onChange({
                ...values,
                materialMode: event.target.value,
              })
            }
          >
            <Radio value="upload">本地上传</Radio>
            <Radio value="url">远程 URL</Radio>
          </Radio.Group>
        </div>

        {values.materialMode === "upload" ? (
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              本地训练素材
            </div>
            <input
              data-testid="digital-human-upload-input"
              type="file"
              accept="image/*,video/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                onChange({
                  ...values,
                  file,
                  fileUrl: "",
                });
              }}
            />
            {values.file ? (
              <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                {values.file.name}
              </div>
            ) : null}
            {uploadPreviewUrl && previewKind === "image" ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-2">
                <img
                  alt="本地上传图片预览"
                  src={uploadPreviewUrl}
                  className="max-h-56 w-full rounded-lg object-contain"
                />
              </div>
            ) : null}
            {uploadPreviewUrl && previewKind === "video" ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-2">
                <video
                  data-testid="digital-human-upload-video-preview"
                  src={uploadPreviewUrl}
                  controls
                  className="max-h-56 w-full rounded-lg"
                />
              </div>
            ) : null}
            {errors.file ? (
              <div className="mt-1 text-[12px] text-[#EF4444]">
                {errors.file}
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              素材 URL
            </div>
            <Input
              placeholder="请输入训练素材 URL"
              value={values.fileUrl}
              status={errors.fileUrl ? "error" : ""}
              onChange={(event) =>
                onChange({
                  ...values,
                  fileUrl: event.target.value,
                  file: null,
                })
              }
            />
            {errors.fileUrl ? (
              <div className="mt-1 text-[12px] text-[#EF4444]">
                {errors.fileUrl}
              </div>
            ) : null}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              训练类型
            </div>
            <Select
              className="w-full"
              value={values.trainType}
              options={[
                { value: "both", label: "形象+声音" },
                { value: "figure", label: "仅形象" },
                { value: "voice", label: "仅声音" },
              ]}
              onChange={(value) => onChange({ ...values, trainType: value })}
            />
          </div>
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              语种
            </div>
            <Select
              className="w-full"
              value={values.language}
              options={[
                { value: "cn", label: "中文" },
                { value: "en", label: "英文" },
              ]}
              onChange={(value) => onChange({ ...values, language: value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] px-3 py-2">
          <div>
            <div className="text-[13px] text-[var(--text-primary)]">
              跳过错误片段
            </div>
            <div className="text-[12px] text-[var(--text-muted)]">
              训练时自动跳过异常片段
            </div>
          </div>
          <Switch
            checked={values.errorSkip}
            onChange={(checked) => onChange({ ...values, errorSkip: checked })}
          />
        </div>
      </div>
    </Modal>
  );
}

export function DigitalHumanMetricsGrid({
  metrics,
}: {
  metrics: DigitalHumanMetrics;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <MetricCard label="数字人总数" value={metrics.total} color="#94A3B8" icon={User2} />
      <MetricCard label="处理中" value={metrics.processingCount} color="#F97316" icon={RefreshCw} />
      <MetricCard label="训练完成" value={metrics.successCount} color="#4ADE80" icon={ListTodo} />
      <MetricCard label="训练失败" value={metrics.failedCount} color="#EF4444" icon={Trash2} />
    </div>
  );
}

export function DigitalHumanFilters({
  keyword,
  statusFilter,
  onKeywordChange,
  onStatusFilterChange,
}: {
  keyword: string;
  statusFilter: DigitalHumanStatusFilterValue;
  onKeywordChange: (keyword: string) => void;
  onStatusFilterChange: (status: DigitalHumanStatusFilterValue) => void;
}) {
  return (
    <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        allowClear
        className="max-w-xs"
        prefix={<Search size={14} />}
        placeholder="搜索数字人名称"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <Radio.Group
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
      >
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="0">排队中</Radio.Button>
        <Radio.Button value="1">训练中</Radio.Button>
        <Radio.Button value="2">训练完成</Radio.Button>
        <Radio.Button value="3">训练失败</Radio.Button>
      </Radio.Group>
    </div>
  );
}

export function DigitalHumanListSection({
  loading,
  humans,
  total,
  currentPage,
  pageSize,
  onViewDetail,
  onRefresh,
  onDelete,
  onPageChange,
}: {
  loading: boolean;
  humans: DigitalPerson[];
  total: number;
  currentPage: number;
  pageSize: number;
  onViewDetail: (human: DigitalPerson) => void;
  onRefresh: (human: DigitalPerson) => void;
  onDelete: (human: DigitalPerson) => void;
  onPageChange: (page: number, pageSize: number) => void;
}) {
  if (loading) {
    return (
      <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">
        数字人列表加载中...
      </div>
    );
  }

  if (humans.length === 0) {
    return <Empty description="暂无数字人" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {humans.map((human) => {
          const statusMeta = getDigitalHumanStatusMeta(human);

          return (
            <div
              key={human.id}
              className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold text-[var(--text-primary)]">
                    {human.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                    进度 {human.progress ?? 0}%
                  </div>
                </div>
                <StatusPill
                  label={statusMeta.label}
                  color={statusMeta.color}
                  background={statusMeta.background}
                />
              </div>

              <div className="mb-4 space-y-2 text-[12px] text-[var(--text-secondary)]">
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">尺寸</span>
                  <span>
                    {human.width && human.height ? `${human.width} x ${human.height}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">4K 支持</span>
                  <span>{human.support4k ? "支持" : "未知"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="small"
                  aria-label={`查看详情-${human.id}`}
                  onClick={() => onViewDetail(human)}
                >
                  查看详情
                </Button>
                <Button
                  size="small"
                  icon={<RefreshCw size={12} />}
                  aria-label={`刷新状态-${human.id}`}
                  onClick={() => onRefresh(human)}
                >
                  刷新状态
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<Trash2 size={12} />}
                  aria-label={`删除数字人-${human.id}`}
                  onClick={() => onDelete(human)}
                >
                  删除
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
          total={total}
          onChange={onPageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
}
