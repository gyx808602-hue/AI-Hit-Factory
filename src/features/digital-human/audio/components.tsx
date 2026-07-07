import { Button, Empty, Input, Modal, Pagination, Radio, Select } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  Mic2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
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

// 本文件承接音色管理页中稳定的领域 UI：音色表单弹窗、指标卡、筛选区和列表区。
// 页面层继续负责接口 hooks、分页状态、弹窗开关、创建/刷新/删除 mutation 等流程。
// 这些组件依赖音色领域字段、状态映射和业务文案，因此先保留在 digital-human/audio feature 内。

export type CustomisedAudioStatusFilterValue = "all" | "0" | "1" | "2" | "3";

export interface CustomisedAudioMetrics {
  total: number;
  successCount: number;
  processingCount: number;
  failedCount: number;
}

// 列表指标和卡片展示属于音色领域 UI，避免页面直接混杂状态派生和卡片结构。
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
  onCancel,
  onChange,
  onSubmit,
}: {
  open: boolean;
  mode: AudioModalMode;
  values: AudioFormValues;
  errors: AudioFormErrors;
  submitting: boolean;
  onCancel: () => void;
  onChange: (nextValues: AudioFormValues) => void;
  onSubmit: () => void;
}) {
  return (
    <Modal
      title={mode === "create" ? "新建音色" : "编辑音色"}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitting}
      okText={mode === "create" ? "提交创建" : "关闭弹窗"}
      cancelText="取消"
      destroyOnHidden
    >
      <div className="space-y-4 pt-2">
        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
            闊宠壊鍚嶇О
          </div>
          <Input
            placeholder="璇疯緭鍏ラ煶鑹插悕绉?"
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
            闊抽鍦板潃
          </div>
          <Input
            placeholder="璇疯緭鍏ラ煶棰戝湴鍧€"
            value={values.url}
            status={errors.url ? "error" : ""}
            onChange={(event) =>
              onChange({ ...values, url: event.target.value })
            }
          />
          {errors.url ? (
            <div className="mt-1 text-[12px] text-[#EF4444]">
              {errors.url}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              妯″瀷绫诲瀷
            </div>
            <Select
              className="w-full"
              value={values.modelType}
              options={[{ value: "tts", label: "TTS" }]}
              onChange={(value) => onChange({ ...values, modelType: value })}
            />
          </div>
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
              璇
            </div>
            <Select
              className="w-full"
              value={values.language}
              options={[
                { value: "cn", label: "涓枃" },
                { value: "en", label: "鑻辨枃" },
              ]}
              onChange={(value) => onChange({ ...values, language: value })}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">
            璇曞惉鏂囨
          </div>
          <Input.TextArea
            placeholder="璇疯緭鍏ヨ瘯鍚枃妗?"
            value={values.text}
            rows={4}
            onChange={(event) =>
              onChange({ ...values, text: event.target.value })
            }
          />
        </div>

        {mode === "edit" ? (
          <div className="rounded-lg border border-[var(--line-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[12px] text-[var(--text-muted)]">
            褰撳墠鍏堟彁渚涚紪杈戝脊绐椾笌鏁版嵁鍥炲～锛屽悗缁帴鍏ユ洿鏂版帴鍙ｅ悗鍙洿鎺ュ鐢ㄦ琛ㄥ崟銆?
          </div>
        ) : null}
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
      <MetricCard
        label="闊宠壊鎬绘暟"
        value={metrics.total}
        color="#94A3B8"
        icon={Mic2}
      />
      <MetricCard
        label="澶勭悊涓?"
        value={metrics.processingCount}
        color="#F97316"
        icon={RefreshCw}
      />
      <MetricCard
        label="宸插畬鎴?"
        value={metrics.successCount}
        color="#4ADE80"
        icon={CheckCircle2}
      />
      <MetricCard
        label="澶辫触鏁?"
        value={metrics.failedCount}
        color="#EF4444"
        icon={AlertCircle}
      />
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

      <Radio.Group
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
      >
        <Radio.Button value="all">鍏ㄩ儴</Radio.Button>
        <Radio.Button value="0">鎺掗槦涓?</Radio.Button>
        <Radio.Button value="1">璁粌涓?</Radio.Button>
        <Radio.Button value="2">宸插畬鎴?</Radio.Button>
        <Radio.Button value="3">澶辫触</Radio.Button>
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
    return (
      <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">
        闊宠壊鍒楄〃鍔犺浇涓?..
      </div>
    );
  }

  if (audios.length === 0) {
    return <Empty description="鏆傛棤闊宠壊鏁版嵁" />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {audios.map((audio) => {
          const statusMeta = getCustomisedAudioStatusMeta(audio);

          return (
            <div
              key={audio.id}
              className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[16px] font-semibold text-[var(--text-primary)]">
                    {audio.name}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                    杩涘害 {audio.progress ?? 0}%
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
                  <span className="text-[var(--text-muted)]">妯″瀷</span>
                  <span>{audio.modelType || "-"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--text-muted)]">璇</span>
                  <span>{audio.language || "-"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="small"
                  icon={<Pencil size={12} />}
                  aria-label={`编辑音色-${audio.id}`}
                  onClick={() => onEdit(audio)}
                >
                  缂栬緫
                </Button>
                <Button
                  size="small"
                  icon={<RefreshCw size={12} />}
                  aria-label={`刷新音色-${audio.id}`}
                  onClick={() => onRefresh(audio)}
                >
                  鍒锋柊
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<Trash2 size={12} />}
                  aria-label={`删除音色-${audio.id}`}
                  onClick={() => onDelete(audio)}
                >
                  鍒犻櫎
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
