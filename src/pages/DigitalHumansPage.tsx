import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import { ListTodo, Plus, RefreshCw, Search, Trash2, User2 } from "lucide-react";
import { getDigitalHumanStatusMeta } from "../features/digital-human/status";
import {
  createDefaultDigitalHumanFormValues,
  mapDigitalHumanFormValuesToCreatePayload,
  type DigitalHumanFormErrors,
  type DigitalHumanFormValues,
  validateDigitalHumanFormValues,
} from "../features/digital-human/form";
import {
  useCreateDigitalHumanMutation,
  useDeleteDigitalHumanMutation,
  useDigitalHumanPage,
  useRefreshDigitalHumanMutation,
} from "../features/digital-human/hooks";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

const PAGE_SIZE = 10;

function getLocalUploadPreviewKind(file: File | null) {
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

type StatusFilterValue = "all" | "0" | "1" | "2" | "3" | "4";

function countByState<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}

function DigitalHumanCreateModal({
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
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">数字人名称</div>
          <Input
            placeholder="请输入数字人名称"
            value={values.name}
            status={errors.name ? "error" : ""}
            onChange={(event) => onChange({ ...values, name: event.target.value })}
          />
          {errors.name ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.name}</div> : null}
        </div>

        <div>
          <div className="mb-2 text-[13px] text-[var(--text-secondary)]">训练素材</div>
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
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">本地训练素材</div>
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
              <div className="mt-2 text-[12px] text-[var(--text-secondary)]">{values.file.name}</div>
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
            {errors.file ? <div className="mt-1 text-[12px] text-[#EF4444]">{errors.file}</div> : null}
          </div>
        ) : (
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">素材 URL</div>
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
              <div className="mt-1 text-[12px] text-[#EF4444]">{errors.fileUrl}</div>
            ) : null}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">训练类型</div>
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

        <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] px-3 py-2">
          <div>
            <div className="text-[13px] text-[var(--text-primary)]">跳过错误帧</div>
            <div className="text-[12px] text-[var(--text-muted)]">训练时自动跳过异常片段</div>
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

export function DigitalHumansPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [formValues, setFormValues] = useState<DigitalHumanFormValues>(
    createDefaultDigitalHumanFormValues(),
  );
  const [formErrors, setFormErrors] = useState<DigitalHumanFormErrors>({});
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");

  const pageQuery = useDigitalHumanPage({
    pageNum,
    pageSize,
    keyword: keyword.trim() || undefined,
    status: statusFilter === "all" ? undefined : Number(statusFilter),
  });
  const createMutation = useCreateDigitalHumanMutation();
  const deleteMutation = useDeleteDigitalHumanMutation();
  const refreshMutation = useRefreshDigitalHumanMutation();

  useEffect(() => {
    setPageNum(1);
  }, [keyword, statusFilter]);

  useEffect(() => {
    if (!formValues.file) {
      setUploadPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return "";
      });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(formValues.file);
    setUploadPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return nextPreviewUrl;
    });

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [formValues.file]);

  const humans = pageQuery.data?.list ?? [];
  const total = pageQuery.data?.total ?? 0;

  const metrics = useMemo(() => {
    const successCount = countByState(humans, (item) => Boolean(item.previewVideoUrl));
    const processingCount = countByState(humans, (item) => getDigitalHumanStatusMeta(item).resultState === "processing");
    const failedCount = countByState(humans, (item) => getDigitalHumanStatusMeta(item).resultState === "failed");

    return {
      total,
      successCount,
      processingCount,
      failedCount,
    };
  }, [humans, total]);

  async function handleCreate() {
    const nextErrors = validateDigitalHumanFormValues(formValues);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const created = await createMutation.mutateAsync(
        mapDigitalHumanFormValuesToCreatePayload(formValues),
      );
      message.success("数字人创建成功");
      setCreateOpen(false);
      setFormValues(createDefaultDigitalHumanFormValues());
      setFormErrors({});
      setUploadPreviewUrl("");
      navigate(`/digital-humans/${created.id}`);
    } catch (error) {
      message.error((error as Error).message || "数字人创建失败");
    }
  }

  function handleDelete(id: string | number) {
    if (!window.confirm(`确认删除数字人 ${id} 吗？`)) {
      return;
    }

    deleteMutation.mutate(id);
  }

  return (
    <PageShell
      title="数字人管理"
      description="管理数字人形象资产，支持创建、状态刷新、详情查看与删除。"
      actions={
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={() => {
            setCreateOpen(true);
            setFormValues(createDefaultDigitalHumanFormValues());
            setFormErrors({});
            setUploadPreviewUrl("");
          }}
        >
          新建数字人
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="数字人总数" value={metrics.total} color="#94A3B8" icon={User2} />
        <MetricCard label="处理中" value={metrics.processingCount} color="#F97316" icon={RefreshCw} />
        <MetricCard label="训练完成" value={metrics.successCount} color="#4ADE80" icon={ListTodo} />
        <MetricCard label="训练失败" value={metrics.failedCount} color="#EF4444" icon={Trash2} />
      </div>

      <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          allowClear
          className="max-w-xs"
          prefix={<Search size={14} />}
          placeholder="搜索数字人名称"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <Radio.Group
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="0">排队中</Radio.Button>
          <Radio.Button value="1">训练中</Radio.Button>
          <Radio.Button value="2">训练完成</Radio.Button>
          <Radio.Button value="3">训练失败</Radio.Button>
        </Radio.Group>
      </div>

      {pageQuery.isLoading ? (
        <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">
          数字人列表加载中...
        </div>
      ) : humans.length === 0 ? (
        <Empty description="暂无数字人" />
      ) : (
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
                      onClick={() => navigate(`/digital-humans/${human.id}`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      size="small"
                      icon={<RefreshCw size={12} />}
                      aria-label={`刷新状态-${human.id}`}
                      onClick={() => refreshMutation.mutate(human.id)}
                    >
                      刷新状态
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={12} />}
                      aria-label={`删除数字人-${human.id}`}
                      onClick={() => handleDelete(human.id)}
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

      <DigitalHumanCreateModal
        open={createOpen}
        values={formValues}
        errors={formErrors}
        submitting={createMutation.isPending}
        onCancel={() => {
          setCreateOpen(false);
          setFormValues(createDefaultDigitalHumanFormValues());
          setFormErrors({});
          setUploadPreviewUrl("");
        }}
        onChange={(nextValues) => {
          setFormValues(nextValues);
          if (Object.keys(formErrors).length > 0) {
            setFormErrors(validateDigitalHumanFormValues(nextValues));
          }
        }}
        onSubmit={() => void handleCreate()}
        uploadPreviewUrl={uploadPreviewUrl}
      />
    </PageShell>
  );
}
