import { Button, Empty, Input, Modal, Pagination, Radio, Upload } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  Mic2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { CustomisedAudio } from "../../../api/aigc/customised-audios/types";
import { MetricCard } from "../../../shared/components/MetricCard";
import { StatusPill } from "../../../shared/components/StatusPill";
import type {
  AudioFormErrors,
  AudioFormValues,
  AudioModalMode,
} from "./form";
import { getCustomisedAudioStatusMeta } from "./status";

export type CustomisedAudioStatusFilterValue = "all" | "0" | "1" | "2" | "3";

export interface CustomisedAudioMetrics {
  total: number;
  successCount: number;
  processingCount: number;
  failedCount: number;
}

function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

export function buildCustomisedAudioMetrics(
  audios: CustomisedAudio[],
  total: number,
): CustomisedAudioMetrics {
  const successCount = countByState(
    audios,
    (item) => getCustomisedAudioStatusMeta(item).resultState === "success",
  );
  const processingCount = countByState(audios, (item) => {
    const resultState = getCustomisedAudioStatusMeta(item).resultState;
    return resultState === "processing" || resultState === "queued";
  });
  const failedCount = countByState(
    audios,
    (item) => getCustomisedAudioStatusMeta(item).resultState === "failed",
  );

  return {
    total,
    successCount,
    processingCount,
    failedCount,
  };
}

export function AudioFormModal({
  open,
  mode,
  values,
  errors,
  submitting,
  audioUploading = false,
  uploadedAudioName,
  onCancel,
  onChange,
  onAudioUpload,
  onRemoveAudio,
  onSubmit,
}: {
  open: boolean;
  mode: AudioModalMode;
  values: AudioFormValues;
  errors: AudioFormErrors;
  submitting: boolean;
  audioUploading?: boolean;
  uploadedAudioName?: string | null;
  onCancel: () => void;
  onChange: (nextValues: AudioFormValues) => void;
  onAudioUpload?: (file: File) => Promise<void> | void;
  onRemoveAudio?: () => void;
  onSubmit: () => void;
}) {
  const isCreateMode = mode === "create";

  return (
    <Modal
      title={isCreateMode ? "新建音色" : "编辑音色"}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitting}
      okText={isCreateMode ? "提交创建" : "关闭弹窗"}
      cancelText="取消"
      destroyOnHidden
    >
      <div className="space-y-4 pt-2">
        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音色名称</div>
          <Input
            placeholder="请输入音色名称"
            value={values.name}
            status={errors.name ? "error" : ""}
            onChange={(event) => onChange({ ...values, name: event.target.value })}
          />
          {errors.name ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.name}</div> : null}
        </div>

        {isCreateMode ? (
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音频文件</div>
            {values.url ? (
              <div className="space-y-3 rounded-lg border border-[var(--line-subtle)] bg-[var(--card-bg)] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-[var(--text-primary)]">
                      {uploadedAudioName || "已上传音频"}
                    </div>
                    <div className="text-[12px] text-[var(--text-muted)]">已上传到素材服务</div>
                  </div>
                  <Button size="small" danger icon={<Trash2 size={12} />} onClick={onRemoveAudio}>
                    删除音频
                  </Button>
                </div>
                <audio className="w-full" controls src={values.url} data-testid="customised-audio-preview">
                  当前浏览器不支持音频预览
                </audio>
              </div>
            ) : (
              <Upload.Dragger
                accept="audio/*"
                multiple={false}
                showUploadList={false}
                disabled={audioUploading}
                beforeUpload={(file) => {
                  void onAudioUpload?.(file as File);
                  return Upload.LIST_IGNORE;
                }}
              >
                <div className="py-5">
                  <UploadCloud size={28} className="mx-auto mb-2 text-[#1677FF]" />
                  <input
                    data-testid="customised-audio-upload-input"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void onAudioUpload?.(file);
                      }
                    }}
                  />
                  <p className="text-[13px] text-[var(--text-secondary)]">
                    {audioUploading ? "音频上传中..." : "点击或拖拽上传音频"}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">上传成功后会自动写入音频地址</p>
                </div>
              </Upload.Dragger>
            )}
            {errors.url ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.url}</div> : null}
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音频地址</div>
            <Input
              placeholder="请输入音频地址"
              value={values.url}
              status={errors.url ? "error" : ""}
              onChange={(event) => onChange({ ...values, url: event.target.value })}
            />
            {errors.url ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.url}</div> : null}
            <div className="mt-3 rounded-lg border border-[var(--line-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[12px] text-[var(--text-muted)]">
              当前先提供编辑弹窗与数据回填，后续接入更新接口后可直接复用此表单。
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function CustomisedAudioMetricsGrid({
  metrics,
}: {
  metrics: CustomisedAudioMetrics;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <MetricCard label="音色总数" value={metrics.total} color="#94A3B8" icon={Mic2} />
      <MetricCard label="处理中" value={metrics.processingCount} color="#F97316" icon={RefreshCw} />
      <MetricCard label="已完成" value={metrics.successCount} color="#4ADE80" icon={CheckCircle2} />
      <MetricCard label="失败数" value={metrics.failedCount} color="#EF4444" icon={AlertCircle} />
    </div>
  );
}

export function CustomisedAudioFilters({
  keyword,
  statusFilter,
  onKeywordChange,
  onStatusFilterChange,
}: {
  keyword: string;
  statusFilter: CustomisedAudioStatusFilterValue;
  onKeywordChange: (keyword: string) => void;
  onStatusFilterChange: (status: CustomisedAudioStatusFilterValue) => void;
}) {
  return (
    <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        allowClear
        className="max-w-xs"
        prefix={<Search size={14} />}
        placeholder="搜索音色名称"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <Radio.Group value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="0">排队中</Radio.Button>
        <Radio.Button value="1">训练中</Radio.Button>
        <Radio.Button value="2">已完成</Radio.Button>
        <Radio.Button value="3">失败</Radio.Button>
      </Radio.Group>
    </div>
  );
}

export function CustomisedAudioListSection({
  loading,
  audios,
  total,
  currentPage,
  pageSize,
  onEdit,
  onRefresh,
  onDelete,
  onPageChange,
}: {
  loading: boolean;
  audios: CustomisedAudio[];
  total: number;
  currentPage: number;
  pageSize: number;
  onEdit: (audio: CustomisedAudio) => void;
  onRefresh: (audio: CustomisedAudio) => void;
  onDelete: (audio: CustomisedAudio) => void;
  onPageChange: (page: number, pageSize: number) => void;
}) {
  if (loading) {
    return <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">音色列表加载中...</div>;
  }

  if (audios.length === 0) {
    return <Empty description="暂无音色数据" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {audios.map((audio) => {
          const statusMeta = getCustomisedAudioStatusMeta(audio);

          return (
            <div key={audio.id} className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold text-[var(--text-primary)]">{audio.name}</div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">进度 {audio.progress ?? 0}%</div>
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
                  <span className="text-[var(--text-muted)]">模型</span>
                  <span>{audio.modelType || "-"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">语种</span>
                  <span>{audio.language || "-"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="small" icon={<Pencil size={12} />} aria-label={`编辑音色-${audio.id}`} onClick={() => onEdit(audio)}>
                  编辑
                </Button>
                <Button
                  size="small"
                  icon={<RefreshCw size={12} />}
                  aria-label={`刷新音色-${audio.id}`}
                  onClick={() => onRefresh(audio)}
                >
                  刷新
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<Trash2 size={12} />}
                  aria-label={`删除音色-${audio.id}`}
                  onClick={() => onDelete(audio)}
                >
                  删除
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={onPageChange} showSizeChanger />
      </div>
    </div>
  );
}
