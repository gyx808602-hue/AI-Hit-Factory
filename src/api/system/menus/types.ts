import type { StatusValue } from "../../shared/types";

export type MenuType = "C" | "M" | "B";

export interface RouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  alwaysShow?: boolean;
  params?: Record<string, string>;
}

export interface RouteItem {
  path: string;
  component?: string;
  redirect?: string;
  name?: string;
  meta?: RouteMeta;
  children?: RouteItem[];
}

export interface MenuItem {
  id: number;
  parentId?: number;
  name: string;
  type: MenuType;
  routeName?: string;
  routePath?: string;
  component?: string;
  sort?: number;
  visible?: StatusValue;
  icon?: string;
  redirect?: string;
  perm?: string;
  children?: MenuItem[];
}

export interface MenuForm extends Omit<MenuItem, "children"> {
  keepAlive?: StatusValue;
  alwaysShow?: StatusValue;
  params?: Array<{ key: string; value: string }>;
}
