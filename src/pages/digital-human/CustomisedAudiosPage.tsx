import { useEffect, useMemo, useState } from "react";
import { Button, message } from "antd";
import { Plus } from "lucide-react";
import type { CustomisedAudio } from "../../api/aigc/customised-audios/types";
import { uploadAudio } from "../../api/aigc/uploads";
import { PageShell } from "../../shared/components/PageShell";
import {
  AudioFormModal,
  CustomisedAudioFilters,
  CustomisedAudioListSection,
  CustomisedAudioMetricsGrid,
  buildCustomisedAudioMetrics,
  type CustomisedAudioStatusFilterValue,
} from "../../features/digital-human/audio/components";
import {
  createAudioFormValuesFromAudio,
  createDefaultAudioFormValues,
  mapAudioFormValuesToCreatePayload,
  validateAudioFormValues,
  type AudioFormErrors,
  type AudioFormValues,
  type AudioModalMode,
} from "../../features/digital-human/audio/form";
import {
  useCreateCustomisedAudioMutation,
  useCustomisedAudioPage,
  useDeleteCustomisedAudioMutation,
  useRefreshCustomisedAudioMutation,
} from "../../features/digital-human/audio/hooks";

const PAGE_SIZE = 10;

type StatusFilterValue = CustomisedAudioStatusFilterValue;

export function CustomisedAudiosPage() {
  const [keyword, setKeyword] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AudioModalMode>("create");
  const [formValues, setFormValues] = useState<AudioFormValues>(createDefaultAudioFormValues());
  const [formErrors, setFormErrors] = useState<AudioFormErrors>({});
  const [audioUploading, setAudioUploading] = useState(false);
  const [uploadedAudioName, setUploadedAudioName] = useState<string | null>(null);

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
    return buildCustomisedAudioMetrics(audios, total);
  }, [audios, total]);

  function openCreateModal() {
    setModalMode("create");
    setFormValues(createDefaultAudioFormValues());
    setFormErrors({});
    setUploadedAudioName(null);
    setAudioUploading(false);
    setModalOpen(true);
  }

  function openEditModal(audio: CustomisedAudio) {
    setModalMode("edit");
    setFormValues(createAudioFormValuesFromAudio(audio));
    setFormErrors({});
    setUploadedAudioName(audio.name ? `${audio.name}.wav` : null);
    setAudioUploading(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormErrors({});
    setAudioUploading(false);
  }

  async function handleAudioUpload(file: File) {
    setAudioUploading(true);
    setFormErrors((current) => ({ ...current, url: undefined }));

    try {
      const result = await uploadAudio(file);
      setFormValues((current) => ({ ...current, url: result.url }));
      setUploadedAudioName(result.originalFilename || file.name);
      message.success("音频上传成功");
    } catch (error) {
      setFormValues((current) => ({ ...current, url: "" }));
      setUploadedAudioName(null);
      setFormErrors((current) => ({
        ...current,
        url: (error as Error).message || "音频上传失败，请重新上传",
      }));
      message.error((error as Error).message || "音频上传失败");
    } finally {
      setAudioUploading(false);
    }
  }

  function handleRemoveAudio() {
    // 这里只移除当前弹窗里的 URL 引用，不删除远端对象，避免误删已上传素材。
    setFormValues((current) => ({ ...current, url: "" }));
    setUploadedAudioName(null);
    setFormErrors((current) => ({ ...current, url: undefined }));
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
      await createMutation.mutateAsync(mapAudioFormValuesToCreatePayload(formValues));
      message.success("音色创建成功");
      setModalOpen(false);
      setFormValues(createDefaultAudioFormValues());
      setFormErrors({});
      setUploadedAudioName(null);
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
      <CustomisedAudioMetricsGrid metrics={metrics} />

      <CustomisedAudioFilters
        keyword={keyword}
        statusFilter={statusFilter}
        onKeywordChange={setKeyword}
        onStatusFilterChange={setStatusFilter}
      />

      <CustomisedAudioListSection
        loading={pageQuery.isLoading}
        audios={audios}
        total={total}
        currentPage={pageQuery.data?.pageNum ?? pageNum}
        pageSize={pageQuery.data?.pageSize ?? pageSize}
        onEdit={openEditModal}
        onRefresh={(audio) => refreshMutation.mutate(audio.id)}
        onDelete={(audio) => handleDelete(audio.id)}
        onPageChange={(nextPage, nextPageSize) => {
          setPageNum(nextPage);
          setPageSize(nextPageSize);
        }}
      />

      <AudioFormModal
        open={modalOpen}
        mode={modalMode}
        values={formValues}
        errors={formErrors}
        submitting={modalMode === "create" ? createMutation.isPending : false}
        audioUploading={audioUploading}
        uploadedAudioName={uploadedAudioName}
        onCancel={closeModal}
        onChange={(nextValues) => {
          setFormValues(nextValues);
          if (Object.keys(formErrors).length > 0 && modalMode === "create") {
            setFormErrors(validateAudioFormValues(nextValues));
          }
        }}
        onAudioUpload={(file) => void handleAudioUpload(file)}
        onRemoveAudio={handleRemoveAudio}
        onSubmit={() => void handleSubmit()}
      />
    </PageShell>
  );
}
