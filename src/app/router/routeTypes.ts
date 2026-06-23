import type { LazyExoticComponent, ComponentType } from "react";

export type RouteKey =
  | "auth.login"
  | "workspace.dashboard"
  | "content.productVideo"
  | "content.imageVideo"
  | "content.imageVideoTasks"
  | "content.imageVideoTaskDetail"
  | "content.viralRemix"
  | "content.viralRemixTasks"
  | "content.viralRemixTaskDetail"
  | "content.digitalHumans"
  | "content.digitalHumanDetail"
  | "content.digitalHumanVideoTasks"
  | "content.digitalHumanVideoTaskDetail"
  | "workspace.tasks"
  | "workspace.assets";

export type RouteMeta = {
  title: string;
  icon: string;
  cache?: boolean;
  permissionCode?: string;
  hideInMenu?: boolean;
  requiresAuth?: boolean;
  activeMenuKey?: RouteKey;
};

export type AppRoute = {
  key: RouteKey;
  path: string;
  component: LazyExoticComponent<ComponentType>;
  meta: RouteMeta;
};

type BaseNavigationItem = {
  key: string;
  title: string;
  icon: string;
  alwaysShow?: boolean;
  params?: Record<string, string>;
  children: NavigationItem[];
};

export type RouteNavigationItem = BaseNavigationItem & {
  kind: "route";
  route: AppRoute;
  redirect?: string;
};

export type ExternalNavigationItem = BaseNavigationItem & {
  kind: "external";
  redirect: string;
};

export type GroupNavigationItem = BaseNavigationItem & {
  kind: "group";
};

export type NavigationItem = RouteNavigationItem | ExternalNavigationItem | GroupNavigationItem;

export type DynamicRouteState = {
  routes: AppRoute[];
  menuItems: NavigationItem[];
  externalMenuItems: ExternalNavigationItem[];
};
