import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import { Plus } from "lucide-react";
import { uploadImage, uploadVideo } from "../../api/aigc/uploads";
import {
  createDefaultDigitalHumanFormValues,
  mapDigitalHumanFormValuesToCreatePayload,
  type DigitalHumanFormErrors,
  type DigitalHumanFormValues,
  type DigitalHumanUploadedMaterialType,
  validateDigitalHumanFormValues,
} from "../../features/digital-human/form";
import {
  useCreateDigitalHumanMutation,
  useDeleteDigitalHumanMutation,
  useDigitalHumanPage,
  useRefreshDigitalHumanMutation,
} from "../../features/digital-human/hooks";
import {
  DigitalHumanCreateModal,
  DigitalHumanFilters,
  DigitalHumanListSection,
  DigitalHumanMetricsGrid,
  buildDigitalHumanMetrics,
  type DigitalHumanStatusFilterValue,
} from "../../features/digital-human/components";
import { PageShell } from "../../shared/components/PageShell";

const PAGE_SIZE = 10;

type StatusFilterValue = DigitalHumanStatusFilterValue;

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
  const [materialUploading, setMaterialUploading] = useState(false);

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

  const humans = pageQuery.data?.list ?? [];
  const total = pageQuery.data?.total ?? 0;

  const metrics = useMemo(() => {
    return buildDigitalHumanMetrics(humans, total);
  }, [humans, total]);

  function resetCreateForm() {
    setFormValues(createDefaultDigitalHumanFormValues());
    setFormErrors({});
    setMaterialUploading(false);
  }

  async function handleMaterialUpload(file: File) {
    const materialType = getMaterialType(file);

    if (!materialType) {
      setFormErrors((current) => ({
        ...current,
        file: "仅支持上传图片或视频训练素材",
      }));
      message.error("仅支持上传图片或视频训练素材");
      return;
    }

    setMaterialUploading(true);
    setFormErrors((current) => ({ ...current, file: undefined }));

    try {
      const result = materialType === "image" ? await uploadImage(file) : await uploadVideo(file);
      setFormValues((current) => ({
        ...current,
        materialMode: "upload",
        file,
        fileUrl: result.url,
        uploadedMaterialName: result.originalFilename || file.name,
        uploadedMaterialType: materialType,
      }));
      message.success("训练素材上传成功");
    } catch (error) {
      handleRemoveMaterial();
      setFormErrors((current) => ({
        ...current,
        file: (error as Error).message || "训练素材上传失败，请重新上传",
      }));
      message.error((error as Error).message || "训练素材上传失败");
    } finally {
      setMaterialUploading(false);
    }
  }

  function handleRemoveMaterial() {
    // 只清空当前表单引用，不删除远端素材对象，避免误删已经上传的文件。
    setFormValues((current) => ({
      ...current,
      file: null,
      fileUrl: "",
      uploadedMaterialName: "",
      uploadedMaterialType: null,
    }));
    setFormErrors((current) => ({ ...current, file: undefined }));
  }

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
      resetCreateForm();
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
            resetCreateForm();
          }}
        >
          新建数字人
        </Button>
      }
    >
      <DigitalHumanMetricsGrid metrics={metrics} />

      <DigitalHumanFilters
        keyword={keyword}
        statusFilter={statusFilter}
        onKeywordChange={setKeyword}
        onStatusFilterChange={setStatusFilter}
      />

      <DigitalHumanListSection
        loading={pageQuery.isLoading}
        humans={humans}
        total={total}
        currentPage={pageQuery.data?.pageNum ?? pageNum}
        pageSize={pageQuery.data?.pageSize ?? pageSize}
        onViewDetail={(human) => navigate(`/digital-humans/${human.id}`)}
        onRefresh={(human) => refreshMutation.mutate(human.id)}
        onDelete={(human) => handleDelete(human.id)}
        onPageChange={(nextPage, nextPageSize) => {
          setPageNum(nextPage);
          setPageSize(nextPageSize);
        }}
      />

      <DigitalHumanCreateModal
        open={createOpen}
        values={formValues}
        errors={formErrors}
        submitting={createMutation.isPending}
        materialUploading={materialUploading}
        onCancel={() => {
          setCreateOpen(false);
          resetCreateForm();
        }}
        onChange={(nextValues) => {
          setFormValues(nextValues);
          if (Object.keys(formErrors).length > 0) {
            setFormErrors(validateDigitalHumanFormValues(nextValues));
          }
        }}
        onMaterialUpload={(file) => void handleMaterialUpload(file)}
        onRemoveMaterial={handleRemoveMaterial}
        onSubmit={() => void handleCreate()}
      />
    </PageShell>
  );
}

function getMaterialType(file: File): DigitalHumanUploadedMaterialType | null {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return null;
}
