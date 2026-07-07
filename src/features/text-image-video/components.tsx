import { Button, Card, Empty, Image, Tag } from "antd";
import {
  Image as ImageIcon,
  LayoutGrid,
  Type,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import type { TextImageVideoPromptInputMode } from "../../api/customer/text-image-video/types";

// 本文件承接图文生成视频创建页中稳定的输入方式、上传触发和素材预览 UI。
// 页面层继续负责上传 mutation、文案生成 mutation、任务创建 mutation、表单状态和路由跳转。
// 这些组件依赖图文生视频领域的素材语义，暂不提升到 shared。

export type ImageVideoInputMode = TextImageVideoPromptInputMode;

export type UploadedImage = {
  name: string;
  url: string;
};

export const inputModeOptions = [
  {
    value: "text",
    label: "文字输入",
    icon: <Type size={14} />,
  },
  {
    value: "image",
    label: "图片上传",
    icon: <ImageIcon size={14} />,
  },
  {
    value: "mixed",
    label: "图文混合",
    icon: <LayoutGrid size={14} />,
  },
] as const;

export function InputModeSelector({
  value,
  onChange,
}: {
  value: ImageVideoInputMode;
  onChange: (value: ImageVideoInputMode) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
        输入方式
      </label>
      <div className="flex flex-wrap gap-2">
        {inputModeOptions.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className="rounded-xl border px-4 py-2 text-[13px] transition"
              style={{
                borderColor: active
                  ? "rgba(34,211,238,0.45)"
                  : "var(--line-subtle)",
                background: active ? "rgba(34,211,238,0.16)" : "var(--muted-bg)",
                color: active ? "#22D3EE" : "var(--text-secondary)",
              }}
              onClick={() => onChange(option.value)}
            >
              <span className="inline-flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function UploadButtonTrigger({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: (files: File[]) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="shrink-0">
      <input
        ref={inputRef}
        data-testid="image-video-upload-input"
        name="file"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) {
            void onUpload(files);
          }
          event.currentTarget.value = "";
        }}
      />
      <Button
        type="default"
        loading={uploading}
        icon={<Upload size={14} />}
        onClick={() => inputRef.current?.click()}
      >
        上传商品图
      </Button>
    </div>
  );
}

export function EmptyAssetPanel() {
  return (
    <div
      data-testid="image-video-empty-panel"
      className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[rgba(255,255,255,0.02)] px-6 py-10"
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无商品图，请先上传素材。"
      />
    </div>
  );
}

export function AssetPreviewGrid({
  items,
  onRemove,
}: {
  items: UploadedImage[];
  onRemove: (url: string) => void;
}) {
  if (items.length === 0) {
    return <EmptyAssetPanel />;
  }

  return (
    <div className="space-y-3">
      <div
        data-testid="image-video-uploaded-grid"
        className="grid grid-cols-[repeat(auto-fill,minmax(170px,200px))] gap-4"
      >
        {items.map((item, index) => (
          <Card
            key={`${item.url}-${index}`}
            size="small"
            className="overflow-hidden rounded-2xl border border-[#2F3E8A] bg-[rgba(15,23,42,0.28)]"
            styles={{ body: { padding: 0 } }}
            data-testid="image-video-uploaded-item"
          >
            <div className="flex items-center justify-between gap-2 px-3 pt-3">
              <Tag color="blue" className="m-0">
                商品图 {index + 1}
              </Tag>
              <span className="min-w-0 flex-1 truncate text-[11px] text-[var(--text-muted)]">
                {item.name}
              </span>
              <Button
                type="text"
                danger
                size="small"
                aria-label={`删除商品图-${item.name}`}
                onClick={() => onRemove(item.url)}
              >
                删除图片
              </Button>
            </div>
            <div className="p-3 pt-2">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--muted-bg)]">
                <Image
                  src={item.url}
                  alt={`图片${index + 1}`}
                  preview
                  className="h-full w-full object-cover"
                  fallback={item.url}
                />
                <img
                  data-testid="image-video-uploaded-preview"
                  className="hidden"
                  src={item.url}
                  alt={`图片预览${index + 1}`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
