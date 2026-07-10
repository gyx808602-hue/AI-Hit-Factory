import { Alert, Button, Card, Empty, Image, Tag, Upload } from "antd";
import type { UploadProps } from "antd";
import type { ReactNode } from "react";

export type VideoRemixDetailStep = "materials" | "prompt" | "video";

export type VideoRemixStepItem = {
  key: VideoRemixDetailStep;
  title: string;
  description: string;
};

// 本文件承接视频追爆详情页中稳定的步骤展示、素材预览、上传触发和局部操作按钮。
// 页面层继续负责路由参数、React Query、草稿保存、生成任务和上传流程编排。
// 这些组件依赖视频追爆详情页的步骤语义和业务文案，暂不提升到 shared。
export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-4 w-[3px] rounded-full bg-[#2563EB]" />
      <h2 className="m-0 text-[15px] font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
    </div>
  );
}

export function splitAssetUrls(value?: string) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function removeAssetUrl(value?: string, targetUrl?: string) {
  return splitAssetUrls(value)
    .filter((url) => url !== targetUrl)
    .join("\n");
}

export function AssetPreviewGrid({
  title,
  emptyDescription,
  tagLabel,
  removeLabel,
  previewTestId,
  urls,
  onRemove,
}: {
  title: string;
  emptyDescription: string;
  tagLabel: string;
  removeLabel: string;
  previewTestId: string;
  urls: string[];
  onRemove: (url: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[12px] text-[var(--text-muted)]">{title}</div>
      {urls.length > 0 ? (
        <div
          data-testid={
            previewTestId === "video-remix-product-image-preview"
              ? "video-remix-product-image-grid"
              : "video-remix-character-image-grid"
          }
          className="grid grid-cols-[repeat(auto-fill,minmax(140px,180px))] gap-3"
        >
          {urls.map((url, index) => (
            <Card
              key={url}
              size="small"
              className="overflow-hidden border border-[var(--line-subtle)]"
              styles={{ body: { padding: 10 } }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Tag color="blue" className="m-0">
                  {tagLabel} {index + 1}
                </Tag>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={() => onRemove(url)}
                >
                  {removeLabel}
                </Button>
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--muted-bg)]">
                <Image
                  src={url}
                  alt={`${tagLabel}${index + 1}`}
                  preview
                  className="h-full w-full object-cover"
                  fallback={url}
                />
                <img
                  data-testid={previewTestId}
                  className="hidden"
                  src={url}
                  alt={`${tagLabel}棰勮`}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] px-4 py-6">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyDescription}
          />
        </div>
      )}
    </div>
  );
}

export function UploadTrigger({
  testId,
  accept,
  multiple,
  onUpload,
  children,
}: {
  testId: string;
  accept?: string;
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  children: ReactNode;
}) {
  const uploadProps: UploadProps = {
    accept,
    multiple,
    showUploadList: false,
    beforeUpload: async (file, fileList) => {
      // Ant Design 多文件上传会逐个触发 beforeUpload，这里只在第一轮统一处理文件列表。
      const nextFiles = (
        (fileList?.length ? fileList : [file]) as File[]
      ).filter(Boolean);
      const firstFile = nextFiles[0];

      if (!firstFile) {
        return Upload.LIST_IGNORE;
      }

      const currentFileToken = `${file.name}:${file.size}:${file.lastModified}`;
      const firstFileToken = `${firstFile.name}:${firstFile.size}:${firstFile.lastModified}`;

      if (currentFileToken !== firstFileToken) {
        return Upload.LIST_IGNORE;
      }

      await onUpload(nextFiles);
      return Upload.LIST_IGNORE;
    },
  };

  return (
    <Upload {...uploadProps}>
      <div data-testid={testId}>{children}</div>
    </Upload>
  );
}

export function StepNavigation({
  currentStep,
  stepItems,
  onChange,
}: {
  currentStep: VideoRemixDetailStep;
  stepItems: VideoRemixStepItem[];
  onChange: (step: VideoRemixDetailStep) => void;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {stepItems.map((step, index) => {
        const active = step.key === currentStep;

        return (
          <button
            key={step.key}
            type="button"
            className="rounded-2xl border px-4 py-3 text-left transition"
            style={{
              borderColor: active ? "#2563EB55" : "var(--line-subtle)",
              background: active ? "rgba(37,99,235,0.08)" : "var(--card-bg)",
            }}
            onClick={() => onChange(step.key)}
          >
            <div className="mb-1 text-[12px] font-semibold text-[#2563EB]">
              步骤 {index + 1}
            </div>
            <div className="text-[14px] font-semibold text-[var(--text-primary)]">
              {step.title}
            </div>
            <div className="mt-1 text-[12px] leading-4.5 text-[var(--text-muted)]">
              {step.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function StepActions({
  currentStep,
  stepItems,
  saving,
  onPrev,
  onNext,
}: {
  currentStep: VideoRemixDetailStep;
  stepItems: VideoRemixStepItem[];
  saving?: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  // stepItems 由页面传入，组件只负责根据当前步骤展示上一步、下一步、保存按钮。
  const currentIndex = stepItems.findIndex((item) => item.key === currentStep);

  return (
    <div
      data-testid="video-remix-step-actions"
      className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-[var(--line-subtle)] bg-[var(--card-bg)]/95 px-5 py-4 backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {currentIndex > 0 ? (
          <Button onClick={onPrev}>上一步</Button>
        ) : (
          <span className="text-[12px] text-[var(--text-muted)]">
            已在第一步
          </span>
        )}
        <div className="flex gap-2">
          {currentIndex < stepItems.length - 1 ? (
            <Button loading={saving} onClick={onNext}>
              下一步
            </Button>
          ) : null}
          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

export function VideoPreviewCard({
  title,
  testId,
  videoUrl,
  emptyText,
}: {
  title: string;
  testId: string;
  videoUrl?: string;
  emptyText: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[13px] font-medium text-[var(--text-primary)]">
          {title}
        </div>
        {videoUrl ? <Tag color="processing">已就绪</Tag> : null}
      </div>
      <div
        data-testid={testId}
        className="aspect-video overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-black/80"
      >
        {videoUrl ? (
          <video
            className="h-full w-full object-contain"
            controls
            src={videoUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-white/65">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}

export function StepContentHint({ text }: { text: string }) {
  return (
    <div className="text-[12px] leading-5 text-[var(--text-muted)]">{text}</div>
  );
}

export function ActionSuccessAlert({ messageText }: { messageText: string }) {
  return <Alert className="mb-4" type="success" showIcon title={messageText} />;
}

export function ActionErrorAlert({ errorText }: { errorText: string }) {
  return (
    <Alert
      className="mb-4"
      type="error"
      showIcon
      title="操作失败"
      description={errorText}
    />
  );
}

export function PageErrorAlert({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return <Alert type="error" showIcon title={title} description={description} />;
}

export function PageMissingAlert({ text }: { text: string }) {
  return <Alert type="error" showIcon title={text} />;
}
