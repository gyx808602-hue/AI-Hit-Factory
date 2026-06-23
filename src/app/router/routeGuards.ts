import type { AppRoute } from "./routeTypes";

export type RouteAccessResult =
  | { allowed: true; route: AppRoute }
  | { allowed: false; reason: "not-found" | "forbidden" };

export function resolveRouteAccess(route: AppRoute | undefined, allowed = true): RouteAccessResult {
  if (!route) {
    return { allowed: false, reason: "not-found" };
  }

  if (!allowed) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, route };
}
