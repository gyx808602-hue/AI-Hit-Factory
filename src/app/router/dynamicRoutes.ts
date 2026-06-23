import type { RouteItem } from "../../api/system/menus/types";
import { getRouteByKey } from "./routeRegistry";
import type {
  AppRoute,
  DynamicRouteState,
  ExternalNavigationItem,
  NavigationItem,
  RouteKey,
} from "./routeTypes";

const backendComponentRouteKeyMap: Record<string, RouteKey> = {
  "dashboard/index": "workspace.dashboard",
  "workspace/assets/index": "workspace.assets",
  "workspace/tasks/index": "workspace.tasks",
  "content/product-video/index": "content.productVideo",
  "content/image-video/index": "content.imageVideo",
  "content/image-video/tasks/index": "content.imageVideoTasks",
  "content/viral-remix/index": "content.viralRemix",
  "content/viral-remix/tasks/index": "content.viralRemixTasks",
  "content/digital-humans/index": "content.digitalHumans",
  "content/digital-human-videos/index": "content.digitalHumanVideoTasks",
};

function normalizePath(path: string | undefined) {
  if (!path) {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeChildren(children: RouteItem["children"]): RouteItem[] {
  return Array.isArray(children) ? children : [];
}

function buildRouteMeta(baseRoute: AppRoute, routeItem: RouteItem): AppRoute {
  return {
    ...baseRoute,
    path: normalizePath(routeItem.path) || baseRoute.path,
    meta: {
      ...baseRoute.meta,
      title: routeItem.meta?.title ?? baseRoute.meta.title,
      icon: routeItem.meta?.icon ?? baseRoute.meta.icon,
      cache: routeItem.meta?.keepAlive ?? baseRoute.meta.cache,
      hideInMenu: routeItem.meta?.hidden ?? baseRoute.meta.hideInMenu,
    },
  };
}

function dedupeRoutes(routes: AppRoute[]) {
  const seen = new Set<RouteKey>();
  return routes.filter((route) => {
    if (seen.has(route.key)) {
      return false;
    }

    seen.add(route.key);
    return true;
  });
}

export function isExternalRedirect(redirect: string | undefined) {
  return typeof redirect === "string" && /^https?:\/\//i.test(redirect);
}

function createExternalItem(routeItem: RouteItem, children: NavigationItem[]): ExternalNavigationItem | null {
  if (!routeItem.redirect || !isExternalRedirect(routeItem.redirect)) {
    return null;
  }

  return {
    kind: "external",
    key: routeItem.name ?? routeItem.path ?? routeItem.redirect,
    title: routeItem.meta?.title ?? routeItem.name ?? routeItem.redirect,
    icon: routeItem.meta?.icon ?? "LayoutDashboard",
    redirect: routeItem.redirect,
    alwaysShow: routeItem.meta?.alwaysShow,
    params: routeItem.meta?.params,
    children,
  };
}

function transformRouteItem(routeItem: RouteItem): DynamicRouteState {
  const childStates = normalizeChildren(routeItem.children).map(transformRouteItem);
  const childRoutes = childStates.flatMap((item) => item.routes);
  const childMenuItems = childStates.flatMap((item) => item.menuItems);
  const childExternalMenuItems = childStates.flatMap((item) => item.externalMenuItems);

  const externalItem = createExternalItem(routeItem, childMenuItems);
  if (externalItem) {
    return {
      routes: childRoutes,
      menuItems: routeItem.meta?.hidden ? childMenuItems : [...childMenuItems, externalItem],
      externalMenuItems: [...childExternalMenuItems, externalItem],
    };
  }

  const routeKey = routeItem.component ? backendComponentRouteKeyMap[routeItem.component] : undefined;
  if (!routeKey) {
    return {
      routes: childRoutes,
      menuItems: childMenuItems,
      externalMenuItems: childExternalMenuItems,
    };
  }

  const route = buildRouteMeta(getRouteByKey(routeKey), routeItem);
  const currentItem: NavigationItem = {
    kind: "route",
    key: route.key,
    title: route.meta.title,
    icon: route.meta.icon,
    route,
    redirect: routeItem.redirect,
    alwaysShow: routeItem.meta?.alwaysShow,
    params: routeItem.meta?.params,
    children: childMenuItems,
  };

  return {
    routes: [route, ...childRoutes],
    menuItems: route.meta.hideInMenu ? childMenuItems : [currentItem],
    externalMenuItems: childExternalMenuItems,
  };
}

export function buildDynamicRouteState(routeItems: RouteItem[]): DynamicRouteState {
  const normalizedRouteItems = Array.isArray(routeItems) ? routeItems : [];
  const states = normalizedRouteItems.map(transformRouteItem);

  return {
    routes: dedupeRoutes(states.flatMap((item) => item.routes)),
    menuItems: states.flatMap((item) => item.menuItems),
    externalMenuItems: states.flatMap((item) => item.externalMenuItems),
  };
}
