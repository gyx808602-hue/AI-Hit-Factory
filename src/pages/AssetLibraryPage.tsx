import { Button, Input, Segmented } from "antd";
import { Download, FileText, ImageIcon, Play, Plus, Search, Trash2, Upload, User2, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { filterAssets } from "../features/workspace/mockData";
import type { AssetFilter, AssetType } from "../features/workspace/types";
import { LazyImage } from "../shared/components/LazyImage";
import { PageShell } from "../shared/components/PageShell";

const assetTypeOptions: Array<{ value: AssetType; label: string }> = [
  { value: "all", label: "全部" },
  { value: "image", label: "商品图片" },
  { value: "video", label: "商品视频" },
  { value: "script", label: "脚本文案" },
  { value: "result", label: "生成结果" },
  { value: "digital-human", label: "数字人素材" },
];

const assetIcon = {
  image: ImageIcon,
  video: Video,
  script: FileText,
  result: Play,
  "digital-human": User2,
};

const assetColor = {
  image: "#22D3EE",
  video: "#F97316",
  script: "#A78BFA",
  result: "#4ADE80",
  "digital-human": "#7C5CFC",
};

export function AssetLibraryPage() {
  const [filter, setFilter] = useState<AssetFilter>({ keyword: "", type: "all" });
  const assets = useMemo(() => filterAssets(filter), [filter]);

  return (
    <PageShell
      title="素材库"
      description="管理商品图片、视频素材、脚本文案和生成结果"
      actions={<Button type="primary" icon={<Upload size={14} />}>上传素材</Button>}
    >
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Segmented
          value={filter.type}
          options={assetTypeOptions}
          onChange={(value) => setFilter((current) => ({ ...current, type: value as AssetType }))}
        />
        <Input
          allowClear
          className="max-w-xs"
          prefix={<Search size={14} />}
          placeholder="搜索素材名称或商品..."
          value={filter.keyword}
          onChange={(event) => setFilter((current) => ({ ...current, keyword: event.target.value }))}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3">
        <button className="flex min-h-[156px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#7C5CFC]/30 text-[var(--text-muted)] transition hover:border-[#7C5CFC]/70">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
            <Plus size={18} />
          </span>
          <span className="text-[12px]">上传素材</span>
        </button>

        {assets.map((asset) => {
          const Icon = assetIcon[asset.type];
          const color = assetColor[asset.type];

          return (
            <div
              key={asset.id}
              className="group overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] transition hover:border-[#7C5CFC]/40"
            >
              <div className="relative flex h-[104px] items-center justify-center overflow-hidden" style={{ background: `${color}18` }}>
                {asset.thumbnailUrl ? (
                  <LazyImage
                    src={asset.thumbnailUrl}
                    alt={`${asset.name} 缩略图`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon size={30} style={{ color, opacity: 0.65 }} />
                )}
                {asset.tag && (
                  <span className="absolute left-2 top-2 max-w-[120px] truncate rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
                    {asset.tag}
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-[12px] text-[var(--text-primary)]">{asset.name}</div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-[var(--text-muted)]">
                    {asset.size} · {asset.date}
                  </span>
                  <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                    <button className="rounded bg-[#7C5CFC]/15 p-1 text-[#9B7FFF]" aria-label="下载素材">
                      <Download size={11} />
                    </button>
                    <button className="rounded bg-[#EF4444]/10 p-1 text-[#EF4444]" aria-label="删除素材">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
