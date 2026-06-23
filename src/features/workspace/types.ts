export type TaskStatus = "success" | "processing" | "queued" | "failed" | "cancelled";

export type TaskType = "商品视频" | "爆款改编" | "图文视频";

export type GenerationTask = {
  id: number;
  title: string;
  type: TaskType;
  mode: string;
  status: TaskStatus;
  time: string;
  duration: string;
  failReason?: string;
};

export type AssetType = "all" | "image" | "video" | "script" | "result" | "digital-human";

export type WorkspaceAsset = {
  id: number;
  name: string;
  type: Exclude<AssetType, "all">;
  size: string;
  date: string;
  tag?: string;
  thumbnailUrl?: string;
};

export type DigitalHumanStatus = "启用" | "停用";

export type DigitalHuman = {
  id: number;
  name: string;
  type: "系统模板" | "自定义";
  gender: "女" | "男";
  style: string;
  voice: string;
  status: DigitalHumanStatus;
  color: string;
};

export type TaskFilter = {
  keyword: string;
  type: "全部" | TaskType;
  statusLabel: "全部" | "生成成功" | "生成中" | "排队中" | "生成失败";
};

export type AssetFilter = {
  keyword: string;
  type: AssetType;
};

export type DigitalHumanFilter = {
  search: string;
  status: "all" | DigitalHumanStatus;
};
