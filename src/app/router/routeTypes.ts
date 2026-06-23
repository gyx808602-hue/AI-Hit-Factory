import type { LazyExoticComponent, ComponentType } from "react";

export type RouteKey =
  | "workspace.dashboard"
  | "content.productVideo"
  | "content.imageVideo"
  | "content.viralRemix"
  | "content.digitalHumans"
  | "workspace.tasks"
  | "workspace.assets";

export type RouteMeta = {
  title: string;
  icon: string;
  cache?: boolean;
  permissionCode?: string;
};

export type AppRoute = {
  key: RouteKey;
  path: string;
  component: LazyExoticComponent<ComponentType>;
  meta: RouteMeta;
};
