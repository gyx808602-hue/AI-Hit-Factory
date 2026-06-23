import { lazy } from "react";
import type { AppRoute, RouteKey } from "./routeTypes";

const DashboardPage = lazy(() =>
  import("../../pages/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const ProductVideoPage = lazy(() =>
  import("../../pages/ProductVideoPage").then((module) => ({ default: module.ProductVideoPage })),
);
const ViralRemixPage = lazy(() =>
  import("../../pages/ViralRemixPage").then((module) => ({ default: module.ViralRemixPage })),
);
const ImageVideoPage = lazy(() =>
  import("../../pages/ImageVideoPage").then((module) => ({ default: module.ImageVideoPage })),
);
const DigitalHumansPage = lazy(() =>
  import("../../pages/DigitalHumansPage").then((module) => ({ default: module.DigitalHumansPage })),
);
const TaskRecordsPage = lazy(() =>
  import("../../pages/TaskRecordsPage").then((module) => ({ default: module.TaskRecordsPage })),
);
const AssetLibraryPage = lazy(() =>
  import("../../pages/AssetLibraryPage").then((module) => ({ default: module.AssetLibraryPage })),
);

export const routeRegistry: AppRoute[] = [
  {
    key: "workspace.dashboard",
    path: "/",
    component: DashboardPage,
    meta: { title: "工作台", icon: "LayoutDashboard", cache: true },
  },
  {
    key: "content.productVideo",
    path: "/product-video",
    component: ProductVideoPage,
    meta: { title: "商品视频生成", icon: "Video", cache: false },
  },
  {
    key: "content.viralRemix",
    path: "/viral-remix",
    component: ViralRemixPage,
    meta: { title: "爆款视频改编", icon: "Repeat2", cache: false },
  },
  {
    key: "content.imageVideo",
    path: "/image-video",
    component: ImageVideoPage,
    meta: { title: "图文生成视频", icon: "Image", cache: false },
  },
  {
    key: "content.digitalHumans",
    path: "/digital-humans",
    component: DigitalHumansPage,
    meta: { title: "数字人管理", icon: "User2", cache: true },
  },
  {
    key: "workspace.tasks",
    path: "/tasks",
    component: TaskRecordsPage,
    meta: { title: "任务记录", icon: "ClipboardList", cache: true },
  },
  {
    key: "workspace.assets",
    path: "/assets",
    component: AssetLibraryPage,
    meta: { title: "素材库", icon: "FolderOpen", cache: true },
  },
];

export function getRouteByKey(routeKey: RouteKey): AppRoute {
  const route = routeRegistry.find((item) => item.key === routeKey);

  if (!route) {
    throw new Error(`Unknown route key: ${routeKey}`);
  }

  return route;
}
