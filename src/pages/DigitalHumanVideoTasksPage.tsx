import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Empty,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Switch,
  message,
} from "antd";
import { Clapperboard, ListTodo, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { uploadAudio, uploadImage } from "../api/aigc/uploads";
import { useCustomisedAudioPage } from "../features/digital-human/audio/hooks";
import { useDigitalHumanPage } from "../features/digital-human/hooks";
import {
  clampDigitalHumanVideoFrame,
  resizeDigitalHumanVideoFrameFromPreviewDelta,
  translateDigitalHumanVideoFrameFromPreviewDelta,
} from "../features/digital-human/video/canvas";
import {
  createDefaultDigitalHumanVideoFormValues,
  mapDigitalHumanVideoFormValuesToCreatePayload,
  mapUploadResponseToBackgroundConfig,
  mapUploadResponseToWavUrl,
  type DigitalHumanVideoFormErrors,
  type DigitalHumanVideoFormValues,
  validateDigitalHumanVideoFormValues,
} from "../features/digital-human/video/form";
import {
  useCreateDigitalHumanVideoMutation,
  useDeleteDigitalHumanVideoMutation,
  useDigitalHumanVideoPage,
  useRefreshDigitalHumanVideoMutation,
} from "../features/digital-human/video/hooks";
import { getDigitalHumanVideoStatusMeta } from "../features/digital-human/video/status";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

const PAGE_SIZE = 10;
const PREVIEW_WIDTH = 180;
const PREVIEW_HEIGHT = 320;

type StatusFilterValue = "all" | "1" | "2" | "4";
type DragMode = "move" | "resize";

interface DragState {
  mode: DragMode;
  startClientX: number;
  startClientY: number;
  baseValues: DigitalHumanVideoFormValues;
}

function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

function renderFieldError(message?: string) {
  if (!message) {
    return null;
  }

  return <div className="mt-1 text-[12px] text-[#EF4444]">{message}</div>;
}

function previewRect(values: DigitalHumanVideoFormValues) {
  return {
    left: (values.x / Math.max(values.screenWidth, 1)) * PREVIEW_WIDTH,
    top: (values.y / Math.max(values.screenHeight, 1)) * PREVIEW_HEIGHT,
    width: (values.personWidth / Math.max(values.screenWidth, 1)) * PREVIEW_WIDTH,
    height: (values.personHeight / Math.max(values.screenHeight, 1)) * PREVIEW_HEIGHT,
  };
}

function DigitalHumanVideoCreateModal({
  open,
  values,
  errors,
  digitalHumanOptions,
  customisedAudioOptions,
  customisedAudioLoading,
  submitting,
  onCancel,
  onChange,
  onSubmit,
}: {
  open: boolean;
  values: DigitalHumanVideoFormValues;
  errors: DigitalHumanVideoFormErrors;
  digitalHumanOptions: Array<{ value: string; label: string }>;
  customisedAudioOptions: Array<{ value: string; label: string }>;
  customisedAudioLoading: boolean;
  submitting: boolean;
  onCancel: () => void;
  onChange: (nextValues: DigitalHumanVideoFormValues) => void;
  onSubmit: () => void;
}) {
  const dragStateRef = useRef<DragState | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!dragStateRef.current) {
        return;
      }

      const deltaX = event.clientX - dragStateRef.current.startClientX;
      const deltaY = event.clientY - dragStateRef.current.startClientY;

      const nextValues =
        dragStateRef.current.mode === "move"
          ? translateDigitalHumanVideoFrameFromPreviewDelta(dragStateRef.current.baseValues, {
              deltaX,
              deltaY,
              previewWidth: PREVIEW_WIDTH,
              previewHeight: PREVIEW_HEIGHT,
            })
          : resizeDigitalHumanVideoFrameFromPreviewDelta(dragStateRef.current.baseValues, {
              deltaX,
              deltaY,
              previewWidth: PREVIEW_WIDTH,
              previewHeight: PREVIEW_HEIGHT,
            });

      onChange(nextValues);
    }

    function handleMouseUp() {
      dragStateRef.current = null;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onChange]);

  const frameRect = previewRect(values);

  function startDrag(mode: DragMode, clientX: number, clientY: number) {
    dragStateRef.current = {
      mode,
      startClientX: clientX,
      startClientY: clientY,
      baseValues: values,
    };
  }

  return (
    <Modal
      title="新建数字人视频"
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={submitting}
      okText="提交创建"
      cancelText="取消"
      width={980}
      destroyOnHidden
    >
      <div className="grid gap-6 pt-2 lg:grid-cols-[minmax(0,1fr)_260px_320px]">
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">基础信息</div>
            <div className="space-y-4 rounded-xl border border-[var(--line-subtle)] p-4">
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">视频名称</div>
                <Input
                  aria-label="视频名称"
                  placeholder="请输入视频名称"
                  value={values.name}
                  status={errors.name ? "error" : ""}
                  onChange={(event) => onChange({ ...values, name: event.target.value })}
                />
                {renderFieldError(errors.name)}
              </div>

              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">数字人形象</div>
                <Select
                  aria-label="数字人形象"
                  className="w-full"
                  placeholder="选择已训练成功的数字人"
                  value={values.personId || undefined}
                  options={digitalHumanOptions}
                  status={errors.personId ? "error" : ""}
                  onChange={(value) => onChange({ ...values, personId: value })}
                />
                {renderFieldError(errors.personId)}
              </div>

              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">模式</div>
                <Radio.Group
                  value={values.type}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      type: event.target.value,
                    })
                  }
                >
                  <Radio value="tts">TTS</Radio>
                  <Radio value="audio">音频驱动</Radio>
                </Radio.Group>
              </div>

              {values.type === "tts" ? (
                <>
                  <div>
                    <div className="mb-2 text-[13px] text-[var(--text-secondary)]">定制音色</div>
                    <Select
                      aria-label="定制音色"
                      className="w-full"
                      placeholder="请选择定制音色"
                      value={values.customAudioId || undefined}
                      loading={customisedAudioLoading}
                      options={customisedAudioOptions}
                      status={errors.customAudioId ? "error" : ""}
                      onChange={(value) => onChange({ ...values, customAudioId: value })}
                    />
                    {renderFieldError(errors.customAudioId)}
                  </div>

                  <div>
                    <div className="mb-2 text-[13px] text-[var(--text-secondary)]">驱动文本</div>
                    <Input.TextArea
                      aria-label="驱动文本"
                      placeholder="请输入驱动文案"
                      value={values.text}
                      status={errors.text ? "error" : ""}
                      rows={4}
                      onChange={(event) => onChange({ ...values, text: event.target.value })}
                    />
                    {renderFieldError(errors.text)}
                  </div>
                </>
              ) : (
                <div>
                  <div className="mb-2 text-[13px] text-[var(--text-secondary)]">驱动音频</div>
                  <input
                    data-testid="digital-human-video-audio-upload-input"
                    type="file"
                    accept="audio/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      try {
                        const upload = await uploadAudio(file);
                        onChange({
                          ...values,
                          wavUrl: mapUploadResponseToWavUrl(upload),
                        });
                      } catch (error) {
                        message.error((error as Error).message || "音频上传失败");
                      }
                    }}
                  />
                  {values.wavUrl ? (
                    <div className="mt-2 text-[12px] text-[var(--text-secondary)]">{values.wavUrl}</div>
                  ) : null}
                  {renderFieldError(errors.wavUrl)}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">TTS 参数</div>
            <div className="grid gap-4 rounded-xl border border-[var(--line-subtle)] p-4 md:grid-cols-3">
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">语速</div>
                <Input
                  aria-label="语速"
                  type="number"
                  status={errors.speed ? "error" : ""}
                  value={values.speed}
                  onChange={(event) => onChange({ ...values, speed: Number(event.target.value) || 1 })}
                />
                {renderFieldError(errors.speed)}
              </div>
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音调</div>
                <Input
                  aria-label="音调"
                  type="number"
                  status={errors.pitch ? "error" : ""}
                  value={values.pitch}
                  onChange={(event) => onChange({ ...values, pitch: Number(event.target.value) || 1 })}
                />
                {renderFieldError(errors.pitch)}
              </div>
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">音量</div>
                <Input
                  aria-label="音量"
                  type="number"
                  status={errors.volume ? "error" : ""}
                  value={values.volume}
                  onChange={(event) => onChange({ ...values, volume: Number(event.target.value) || 100 })}
                />
                {renderFieldError(errors.volume)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">画布预览</div>
          <div className="rounded-xl border border-[var(--line-subtle)] bg-[#F8FAFC] p-4">
            <div
              className="relative mx-auto overflow-hidden rounded-xl border border-dashed border-[#CBD5E1] bg-white"
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
            >
              <div
                data-testid="digital-human-video-preview-frame"
                className="absolute cursor-move rounded-lg bg-[#4F9CF9] text-center text-[12px] font-semibold text-white shadow"
                style={{
                  left: frameRect.left,
                  top: frameRect.top,
                  width: frameRect.width,
                  height: frameRect.height,
                  minWidth: 32,
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  startDrag("move", event.clientX, event.clientY);
                }}
              >
                数字人
                <button
                  type="button"
                  data-testid="digital-human-video-preview-resize-handle"
                  className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl-md border-0 bg-white/90"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    startDrag("resize", event.clientX, event.clientY);
                  }}
                />
              </div>
            </div>
            <div className="mt-3 text-center text-[12px] text-[var(--text-muted)]">
              可直接拖动蓝色数字人调整位置，也可拖右下角手柄缩放尺寸
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">画布参数</div>
            <div className="grid gap-3 rounded-xl border border-[var(--line-subtle)] p-4">
              {[
                { key: "screenWidth", label: "画布宽" },
                { key: "screenHeight", label: "画布高" },
                { key: "x", label: "人物 X" },
                { key: "y", label: "人物 Y" },
                { key: "personWidth", label: "人物宽" },
                { key: "personHeight", label: "人物高" },
              ].map((item) => (
                <div key={item.key}>
                  <div className="mb-2 text-[13px] text-[var(--text-secondary)]">{item.label}</div>
                  <Input
                    aria-label={item.label}
                    type="number"
                    status={errors[item.key as keyof DigitalHumanVideoFormErrors] ? "error" : ""}
                    value={values[item.key as keyof DigitalHumanVideoFormValues] as number}
                    onChange={(event) =>
                      onChange(
                        clampDigitalHumanVideoFrame({
                          ...values,
                          [item.key]: Number(event.target.value) || 0,
                        }),
                      )
                    }
                  />
                  {renderFieldError(errors[item.key as keyof DigitalHumanVideoFormErrors])}
                </div>
              ))}
              {renderFieldError(errors.personFrame)}
              <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] px-3 py-2">
                <div className="text-[13px] text-[var(--text-secondary)]">去除背景</div>
                <Switch
                  checked={values.rgbaMode}
                  onChange={(checked) => onChange({ ...values, rgbaMode: checked })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">背景</div>
            <div className="space-y-3 rounded-xl border border-[var(--line-subtle)] p-4">
              <Input
                aria-label="背景图 URL"
                placeholder="可手动输入背景图 URL"
                value={values.backgroundImageUrl}
                onChange={(event) => onChange({ ...values, backgroundImageUrl: event.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  try {
                    const upload = await uploadImage(file);
                    onChange({
                      ...values,
                      backgroundImageUrl: mapUploadResponseToBackgroundConfig(upload),
                    });
                  } catch (error) {
                    message.error((error as Error).message || "背景图上传失败");
                  }
                }}
              />
              <Input
                aria-label="背景色"
                placeholder="背景色"
                value={values.bgColor}
                onChange={(event) => onChange({ ...values, bgColor: event.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">高级选项</div>
            <div className="space-y-3 rounded-xl border border-[var(--line-subtle)] p-4">
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">模型</div>
                <Select
                  className="w-full"
                  value={values.model}
                  options={[{ value: 1, label: "模型 1（默认）" }]}
                  onChange={(value) => onChange({ ...values, model: value })}
                />
              </div>
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">分辨率</div>
                <Select
                  className="w-full"
                  value={values.resolutionRate}
                  options={[
                    { value: 0, label: "1080p" },
                    { value: 1, label: "4K" },
                  ]}
                  onChange={(value) => onChange({ ...values, resolutionRate: value })}
                />
              </div>
              <div>
                <div className="mb-2 text-[13px] text-[var(--text-secondary)]">语种</div>
                <Select
                  className="w-full"
                  value={values.language}
                  options={[
                    { value: "cn", label: "中文（cn）" },
                    { value: "en", label: "英文（en）" },
                  ]}
                  onChange={(value) => onChange({ ...values, language: value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] px-3 py-2">
                <div className="text-[13px] text-[var(--text-secondary)]">添加合规水印</div>
                <Switch
                  checked={values.addComplianceWatermark}
                  onChange={(checked) => onChange({ ...values, addComplianceWatermark: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function DigitalHumanVideoTasksPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [formValues, setFormValues] = useState<DigitalHumanVideoFormValues>(
    createDefaultDigitalHumanVideoFormValues(),
  );
  const [formErrors, setFormErrors] = useState<DigitalHumanVideoFormErrors>({});

  const taskPageQuery = useDigitalHumanVideoPage({
    pageNum,
    pageSize,
    keyword: keyword.trim() || undefined,
    status: statusFilter === "all" ? undefined : Number(statusFilter),
  });
  const createMutation = useCreateDigitalHumanVideoMutation();
  const deleteMutation = useDeleteDigitalHumanVideoMutation();
  const refreshMutation = useRefreshDigitalHumanVideoMutation();
  const digitalHumanQuery = useDigitalHumanPage({
    pageNum: 1,
    pageSize: 100,
    status: 2,
  });
  const customisedAudioQuery = useCustomisedAudioPage({
    pageNum: 1,
    pageSize: 100,
    status: 2,
  });

  useEffect(() => {
    setPageNum(1);
  }, [keyword, statusFilter]);

  const tasks = taskPageQuery.data?.list ?? [];
  const total = taskPageQuery.data?.total ?? 0;
  const digitalHumanOptions = (digitalHumanQuery.data?.list ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const customisedAudioOptions = (customisedAudioQuery.data?.list ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const metrics = useMemo(() => {
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
  }, [tasks, total]);

  async function handleCreate() {
    const nextErrors = validateDigitalHumanVideoFormValues(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const created = await createMutation.mutateAsync(
        mapDigitalHumanVideoFormValuesToCreatePayload(formValues),
      );
      message.success("数字人视频创建成功");
      setCreateOpen(false);
      setFormValues(createDefaultDigitalHumanVideoFormValues());
      setFormErrors({});
      navigate(`/digital-humans/videos/${created.id}`);
    } catch (error) {
      message.error((error as Error).message || "数字人视频创建失败");
    }
  }

  function handleDelete(id: string | number) {
    if (!window.confirm(`确认删除任务 ${id} 吗？`)) {
      return;
    }

    deleteMutation.mutate(id);
  }

  return (
    <PageShell
      title="数字人视频任务"
      description="管理数字人生成视频任务，支持创建、刷新、详情查看与删除。"
      actions={
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={() => {
            setCreateOpen(true);
            setFormValues(createDefaultDigitalHumanVideoFormValues());
            setFormErrors({});
          }}
        >
          新建数字人视频
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="任务总数" value={metrics.total} color="#94A3B8" icon={ListTodo} />
        <MetricCard label="处理中" value={metrics.processingCount} color="#F97316" icon={RefreshCw} />
        <MetricCard label="已完成" value={metrics.successCount} color="#4ADE80" icon={Clapperboard} />
        <MetricCard label="生成失败" value={metrics.failedCount} color="#EF4444" icon={Trash2} />
      </div>

      <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          allowClear
          className="max-w-xs"
          prefix={<Search size={14} />}
          placeholder="搜索视频名称"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Radio.Group value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="1">生成中</Radio.Button>
          <Radio.Button value="2">已完成</Radio.Button>
          <Radio.Button value="4">生成失败</Radio.Button>
        </Radio.Group>
      </div>

      {taskPageQuery.isLoading ? (
        <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">数字人视频任务加载中...</div>
      ) : taskPageQuery.isError ? (
        <Alert type="error" showIcon message={(taskPageQuery.error as Error)?.message || "列表加载失败"} />
      ) : tasks.length === 0 ? (
        <Empty description="暂无数字人视频任务" />
      ) : (
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
                      <div className="mt-1 text-[12px] text-[var(--text-muted)]">进度 {task.progress ?? 0}%</div>
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
                      <span className="text-[var(--text-muted)]">数字人 ID</span>
                      <span>{task.personId}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[var(--text-muted)]">时长</span>
                      <span>{typeof task.duration === "number" ? `${task.duration} 秒` : "-"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="small"
                      aria-label={`查看详情-${task.id}`}
                      onClick={() => navigate(`/digital-humans/videos/${task.id}`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      size="small"
                      icon={<RefreshCw size={12} />}
                      aria-label={`刷新状态-${task.id}`}
                      onClick={() => refreshMutation.mutate(task.id)}
                    >
                      刷新状态
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={12} />}
                      aria-label={`删除任务-${task.id}`}
                      onClick={() => handleDelete(task.id)}
                    >
                      删除任务
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Pagination
              current={taskPageQuery.data?.pageNum ?? pageNum}
              pageSize={taskPageQuery.data?.pageSize ?? pageSize}
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

      <DigitalHumanVideoCreateModal
        open={createOpen}
        values={formValues}
        errors={formErrors}
        digitalHumanOptions={digitalHumanOptions}
        customisedAudioOptions={customisedAudioOptions}
        customisedAudioLoading={customisedAudioQuery.isLoading}
        submitting={createMutation.isPending}
        onCancel={() => setCreateOpen(false)}
        onChange={(nextValues) => {
          setFormValues(nextValues);
          if (Object.keys(formErrors).length > 0) {
            setFormErrors(validateDigitalHumanVideoFormValues(nextValues));
          }
        }}
        onSubmit={() => void handleCreate()}
      />
    </PageShell>
  );
}
