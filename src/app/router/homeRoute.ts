import { matchRoutes } from "react-router-dom";
import type { AppRoute, NavigationItem } from "./routeTypes";

function normalizeInternalTarget(target: string | undefined) {
  if (typeof target !== "string") {
    return undefined;
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget || /^https?:\/\//i.test(trimmedTarget)) {
    return undefined;
  }

  if (trimmedTarget.startsWith("?") || trimmedTarget.startsWith("#")) {
    return undefined;
  }

  return trimmedTarget.startsWith("/") ? trimmedTarget : `/${trimmedTarget}`;
}

function getTargetPathname(target: string) {
  const [pathname] = target.split(/[?#]/, 1);
  return pathname || "/";
}

function isAccessibleTarget(target: string | undefined, availableRoutes: AppRoute[]) {
  const normalizedTarget = normalizeInternalTarget(target);
  if (!normalizedTarget) {
    return false;
  }

  const pathname = getTargetPathname(normalizedTarget);
  if (pathname === "/") {
    return false;
  }

  return Boolean(
    matchRoutes(
      availableRoutes.map((route) => ({
        path: route.path,
      })),
      pathname,
    ),
  );
}

function resolveNavigationItemHomePath(
  item: NavigationItem,
  availableRoutes: AppRoute[],
): string | undefined {
  // 首页分发优先进入目录真正可用的落点，而不是盲目停在目录自身 path。
  const itemRedirect =
    item.kind === "route" || item.kind === "external" ? item.redirect : undefined;

  if (isAccessibleTarget(itemRedirect, availableRoutes)) {
    return normalizeInternalTarget(itemRedirect);
  }

  const childTarget = resolveHomeRoutePath(item.children, availableRoutes, false);
  if (childTarget) {
    return childTarget;
  }

  if (item.kind !== "route") {
    return undefined;
  }

  if (isAccessibleTarget(item.route.path, availableRoutes)) {
    return normalizeInternalTarget(item.route.path);
  }

  return undefined;
}

export function resolveHomeRoutePath(
  menuItems: NavigationItem[],
  availableRoutes: AppRoute[],
  allowRouteFallback = true,
): string | undefined {
  for (const item of menuItems) {
    const target = resolveNavigationItemHomePath(item, availableRoutes);
    if (target) {
      return target;
    }
  }

  if (allowRouteFallback) {
    const firstVisibleRoute = availableRoutes.find(
      (route) => !route.meta.hideInMenu && isAccessibleTarget(route.path, availableRoutes),
    );
    if (firstVisibleRoute) {
      return normalizeInternalTarget(firstVisibleRoute.path);
    }
  }

  return undefined;
}
