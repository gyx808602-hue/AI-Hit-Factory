import { useEffect, useMemo, useState } from "react";
import { Button, Empty, Input, Modal, Pagination, Radio, Select, message } from "antd";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Mic2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import type { CustomisedAudio, CustomisedAudioCreateRequest } from "../api/aigc/customised-audios/types";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";
import {
  useCreateCustomisedAudioMutation,
  useCustomisedAudioPage,
  useDeleteCustomisedAudioMutation,
  useRefreshCustomisedAudioMutation,
} from "../features/digital-human/audio/hooks";

const PAGE_SIZE = 10;

type StatusFilterValue = "all" | "0" | "1" | "2" | "3";
type AudioModalMode = "create" | "edit";

type AudioFormValues = {
  name: string;
  url: string;
  modelType: string;
  language: string;
  text: string;
};

type AudioFormErrors = Partial<Record<keyof AudioFormValues, string>>;

function createDefaultAudioFormValues(): AudioFormValues {
  return {
    name: "",
    url: "",
    modelType: "tts",
    language: "cn",
    text: "",
  };
}

function validateAudioFormValues(values: AudioFormValues): AudioFormErrors {
  const errors: AudioFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "请输入音色名称";
  }

  if (!values.url.trim()) {
    errors.url = "请输入音频地址";
  }

  return errors;
}

function mapFormValuesToCreatePayload(values: AudioFormValues): CustomisedAudioCreateRequest {
  return {
    name: values.name.trim(),
    url: values.url.trim(),
    modelType: values.modelType,
    language: values.language,
    text: values.text.trim() || undefined,
  };
}

function createFormValuesFromAudio(audio: CustomisedAudio): AudioFormValues {
  return {
    name: audio.name ?? "",
    url: audio.url ?? audio.audioPath ?? audio.sourceUrl ?? "",
    modelType: audio.modelType ?? "tts",
    language: audio.language ?? "cn",
    text: audio.text ?? audio.previewText ?? "",
  };
}

function getStatusMeta(audio: CustomisedAudio) {
  if (audio.status === 2) {
    return {
      label: audio.statusLabel ?? "已完成",
      color: "#166534",
      background: "#DCFCE7",
      icon: CheckCircle2,
      resultState: "success" as const,
    };
  }

  if (audio.status === 3) {
    return {
      label: audio.statusLabel ?? "失败",
      color: "#B91C1C",
      background: "#FEE2E2",
      icon: AlertCircle,
      resultState: "failed" as const,
    };
  }

  if (audio.status === 1) {
    return {
      label: audio.statusLabel ?? "训练中",
      color: "#C2410C",
      background: "#FFEDD5",
      icon: RefreshCw,
      resultState: "processing" as const,
    };
  }

  return {
    label: audio.statusLabel ?? "排队中",
    color: "#475569",
    background: "#E2E8F0",
    icon: Clock3,
    resultState: "queued" as const,
  };
}

function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

function AudioFormModal({
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
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音色名称</div>
          <Input
            placeholder="请输入音色名称"
            value={values.name}
            status={errors.name ? "error" : ""}
            onChange={(event) => onChange({ ...values, name: event.target.value })}
          />
          {errors.name ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.name}</div> : null}
        </div>

        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音频地址</div>
          <Input
            placeholder="请输入音频地址"
            value={values.url}
            status={errors.url ? "error" : ""}
            onChange={(event) => onChange({ ...values, url: event.target.value })}
          />
          {errors.url ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.url}</div> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">模型类型</div>
            <Select
              className="w-full"
              value={values.modelType}
              options={[{ value: "tts", label: "TTS" }]}
              onChange={(value) => onChange({ ...values, modelType: value })}
            />
          </div>
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">语种</div>
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

        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">试听文案</div>
          <Input.TextArea
            placeholder="请输入试听文案"
            value={values.text}
            rows={4}
            onChange={(event) => onChange({ ...values, text: event.target.value })}
          />
        </div>

        {mode === "edit" ? (
          <div className="rounded-lg border border-[var(--line-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[12px] text-[var(--text-muted)]">
            当前先提供编辑弹窗与数据回填，后续接入更新接口后可直接复用此表单。
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export function CustomisedAudiosPage() {
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AudioModalMode>("create");
  const [formValues, setFormValues] = useState<AudioFormValues>(createDefaultAudioFormValues());
  const [formErrors, setFormErrors] = useState<AudioFormErrors>({});

  const pageQuery = useCustomisedAudioPage({
    pageNum,
    pageSize,
    keyword: keyword.trim() || undefined,
    status: statusFilter === "all" ? undefined : Number(statusFilter),
  });
  const createMutation = useCreateCustomisedAudioMutation();
  const deleteMutation = useDeleteCustomisedAudioMutation();
  const refreshMutation = useRefreshCustomisedAudioMutation();

  useEffect(() => {
    setPageNum(1);
  }, [keyword, statusFilter]);

  const audios = pageQuery.data?.list ?? [];
  const total = pageQuery.data?.total ?? 0;

  const metrics = useMemo(() => {
    const successCount = countByState(audios, (item) => getStatusMeta(item).resultState === "success");
    const processingCount = countByState(
      audios,
      (item) => getStatusMeta(item).resultState === "processing" || getStatusMeta(item).resultState === "queued",
    );
    const failedCount = countByState(audios, (item) => getStatusMeta(item).resultState === "failed");

    return {
      total,
      successCount,
      processingCount,
      failedCount,
    };
  }, [audios, total]);

  function openCreateModal() {
    setModalMode("create");
    setFormValues(createDefaultAudioFormValues());
    setFormErrors({});
    setModalOpen(true);
  }

  function openEditModal(audio: CustomisedAudio) {
    setModalMode("edit");
    setFormValues(createFormValuesFromAudio(audio));
    setFormErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormErrors({});
  }

  async function handleSubmit() {
    if (modalMode === "edit") {
      closeModal();
      return;
    }

    const nextErrors = validateAudioFormValues(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await createMutation.mutateAsync(mapFormValuesToCreatePayload(formValues));
      message.success("音色创建成功");
      setModalOpen(false);
      setFormValues(createDefaultAudioFormValues());
      setFormErrors({});
    } catch (error) {
      message.error((error as Error).message || "音色创建失败");
    }
  }

  function handleDelete(id: string | number) {
    if (!window.confirm(`确认删除音色 ${id} 吗？`)) {
      return;
    }

    deleteMutation.mutate(id);
  }

  return (
    <PageShell
      title="音色管理"
      description="管理定制音色资产，支持新建、弹窗编辑、状态刷新与删除。"
      actions={
        <Button type="primary" icon={<Plus size={14} />} onClick={openCreateModal}>
          新建音色
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="音色总数" value={metrics.total} color="#94A3B8" icon={Mic2} />
        <MetricCard label="处理中" value={metrics.processingCount} color="#F97316" icon={RefreshCw} />
        <MetricCard label="已完成" value={metrics.successCount} color="#4ADE80" icon={CheckCircle2} />
        <MetricCard label="失败数" value={metrics.failedCount} color="#EF4444" icon={AlertCircle} />
      </div>

      <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          allowClear
          className="max-w-xs"
          prefix={<Search size={14} />}
          placeholder="搜索音色名称"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Radio.Group value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="0">排队中</Radio.Button>
          <Radio.Button value="1">训练中</Radio.Button>
          <Radio.Button value="2">已完成</Radio.Button>
          <Radio.Button value="3">失败</Radio.Button>
        </Radio.Group>
      </div>

      {pageQuery.isLoading ? (
        <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">音色列表加载中...</div>
      ) : audios.length === 0 ? (
        <Empty description="暂无音色数据" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {audios.map((audio) => {
              const statusMeta = getStatusMeta(audio);

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
                        进度 {audio.progress ?? 0}%
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
                      <span className="text-[var(--text-muted)]">模型</span>
                      <span>{audio.modelType || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[var(--text-muted)]">语种</span>
                      <span>{audio.language || "-"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="small"
                      icon={<Pencil size={12} />}
                      aria-label={`编辑音色-${audio.id}`}
                      onClick={() => openEditModal(audio)}
                    >
                      编辑
                    </Button>
                    <Button
                      size="small"
                      icon={<RefreshCw size={12} />}
                      aria-label={`刷新音色-${audio.id}`}
                      onClick={() => refreshMutation.mutate(audio.id)}
                    >
                      刷新
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={12} />}
                      aria-label={`删除音色-${audio.id}`}
                      onClick={() => handleDelete(audio.id)}
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
              current={pageQuery.data?.pageNum ?? pageNum}
              pageSize={pageQuery.data?.pageSize ?? pageSize}
              total={total}
              onChange={(nextPage, nextPageSize) => {
                setPageNum(nextPage);
                setPageSize(nextPageSize);
              }}
              showSizeChanger
            />
          </div>
        </div>
      )}

      <AudioFormModal
        open={modalOpen}
        mode={modalMode}
        values={formValues}
        errors={formErrors}
        submitting={modalMode === "create" ? createMutation.isPending : false}
        onCancel={closeModal}
        onChange={(nextValues) => {
          setFormValues(nextValues);
          if (Object.keys(formErrors).length > 0 && modalMode === "create") {
            setFormErrors(validateAudioFormValues(nextValues));
          }
        }}
        onSubmit={() => void handleSubmit()}
      />
    </PageShell>
  );
}
