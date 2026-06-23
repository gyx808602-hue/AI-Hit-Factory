import type { AppRoute } from "./routeTypes";

export type RouteAccessResult =
  | { allowed: true; route: AppRoute }
  | { allowed: false; reason: "not-found" | "forbidden" | "unauthenticated" };

type RouteAccessOptions = {
  allowed?: boolean;
  hasAccessToken?: boolean;
};

export function resolveRouteAccess(
  route: AppRoute | undefined,
  options: boolean | RouteAccessOptions = true,
): RouteAccessResult {
  if (!route) {
    return { allowed: false, reason: "not-found" };
  }

  const allowed = typeof options === "boolean" ? options : (options.allowed ?? true);
  const hasAccessToken = typeof options === "boolean" ? true : (options.hasAccessToken ?? true);

  if (route.meta.requiresAuth && !hasAccessToken) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (!allowed) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, route };
}
