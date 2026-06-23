import type { LazyExoticComponent, ComponentType } from "react";

export type RouteKey =
  | "auth.login"
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
  hideInMenu?: boolean;
  requiresAuth?: boolean;
};

export type AppRoute = {
  key: RouteKey;
  path: string;
  component: LazyExoticComponent<ComponentType>;
  meta: RouteMeta;
};
