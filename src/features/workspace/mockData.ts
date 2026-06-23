import { taskStatusLabels } from "./status";
import type {
  AssetFilter,
  DigitalHuman,
  DigitalHumanFilter,
  GenerationTask,
  TaskFilter,
  WorkspaceAsset,
} from "./types";

export const generationTasks: GenerationTask[] = [
  { id: 1, title: "智能保温杯·种草短视频", type: "商品视频", mode: "数字人", status: "success", time: "2026-06-15 14:23", duration: "15秒" },
  { id: 2, title: "养生茶礼盒·爆款仿爆款生成", type: "爆款改编", mode: "AI生成", status: "processing", time: "2026-06-15 14:18", duration: "-" },
  { id: 3, title: "收纳盒详情页·图文轮播视频", type: "图文视频", mode: "图文轮播", status: "success", time: "2026-06-15 14:05", duration: "15秒" },
  { id: 4, title: "美妆护肤套装·数字人口播", type: "商品视频", mode: "数字人", status: "failed", time: "2026-06-15 13:52", duration: "-", failReason: "素材图片分辨率不足，请上传清晰图片" },
  { id: 5, title: "运动水壶·快节奏混剪", type: "商品视频", mode: "混剪", status: "success", time: "2026-06-15 13:30", duration: "15秒" },
  { id: 6, title: "办公椅·测评视频", type: "爆款改编", mode: "换商品", status: "queued", time: "2026-06-15 13:15", duration: "-" },
];

const imageThumbnail = (label: string, startColor: string, endColor: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${startColor}"/><stop offset="1" stop-color="${endColor}"/></linearGradient></defs><rect width="320" height="200" rx="24" fill="url(#g)"/><circle cx="252" cy="48" r="34" fill="rgba(255,255,255,.22)"/><rect x="32" y="112" width="168" height="18" rx="9" fill="rgba(255,255,255,.64)"/><rect x="32" y="142" width="118" height="12" rx="6" fill="rgba(255,255,255,.38)"/><text x="32" y="72" fill="white" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="24" font-weight="700">${label}</text></svg>`,
  )}`;

export const workspaceAssets: WorkspaceAsset[] = [
  { id: 1, name: "保温杯主图.jpg", type: "image", size: "2.4MB", date: "06-15", tag: "智能保温杯", thumbnailUrl: imageThumbnail("保温杯主图", "#22D3EE", "#7C5CFC") },
  { id: 2, name: "保温杯展示视频.mp4", type: "video", size: "18MB", date: "06-15", tag: "智能保温杯" },
  { id: 3, name: "养生茶详情图1.jpg", type: "image", size: "1.8MB", date: "06-14", tag: "养生茶礼盒", thumbnailUrl: imageThumbnail("养生茶详情", "#4ADE80", "#F97316") },
  { id: 4, name: "养生茶种草脚本.txt", type: "script", size: "4KB", date: "06-14", tag: "养生茶礼盒" },
  { id: 5, name: "保温杯生成视频01.mp4", type: "result", size: "22MB", date: "06-15", tag: "生成结果" },
  { id: 6, name: "小雅数字人素材", type: "digital-human", size: "-", date: "06-10", tag: "数字人" },
];

export const digitalHumans: DigitalHuman[] = [
  { id: 1, name: "小雅", type: "系统模板", gender: "女", style: "专家型", voice: "温柔女声", status: "启用", color: "#7C5CFC" },
  { id: 2, name: "小美", type: "系统模板", gender: "女", style: "导购型", voice: "活泼女声", status: "启用", color: "#F97316" },
  { id: 3, name: "老板老陈", type: "自定义", gender: "男", style: "老板型", voice: "沉稳男声", status: "启用", color: "#22D3EE" },
  { id: 4, name: "导购小李", type: "系统模板", gender: "男", style: "导购型", voice: "热情男声", status: "停用", color: "#4ADE80" },
];

export function filterTasks(filter: TaskFilter): GenerationTask[] {
  return generationTasks.filter((task) => {
    const matchesKeyword = !filter.keyword || task.title.includes(filter.keyword);
    const matchesType = filter.type === "全部" || task.type === filter.type;
    const matchesStatus = filter.statusLabel === "全部" || taskStatusLabels[task.status] === filter.statusLabel;

    return matchesKeyword && matchesType && matchesStatus;
  });
}

export function filterAssets(filter: AssetFilter): WorkspaceAsset[] {
  return workspaceAssets.filter((asset) => {
    const matchesKeyword = !filter.keyword || asset.name.includes(filter.keyword) || Boolean(asset.tag?.includes(filter.keyword));
    const matchesType = filter.type === "all" || asset.type === filter.type;

    return matchesKeyword && matchesType;
  });
}

export function filterDigitalHumans(filter: DigitalHumanFilter): DigitalHuman[] {
  return digitalHumans.filter((human) => {
    const matchesSearch = !filter.search || human.name.includes(filter.search) || human.style.includes(filter.search);
    const matchesStatus = filter.status === "all" || human.status === filter.status;

    return matchesSearch && matchesStatus;
  });
}
