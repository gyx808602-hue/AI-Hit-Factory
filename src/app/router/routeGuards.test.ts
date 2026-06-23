import { describe, expect, it } from "vitest";
import { getRouteByKey } from "./routeRegistry";
import { resolveRouteAccess } from "./routeGuards";

describe("resolveRouteAccess", () => {
  it("returns not-found when route is missing", () => {
    expect(resolveRouteAccess(undefined)).toEqual({ allowed: false, reason: "not-found" });
  });

  it("returns forbidden when route exists but permission check fails", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(resolveRouteAccess(route, false)).toEqual({ allowed: false, reason: "forbidden" });
  });

  it("returns unauthenticated when an auth route has no access token", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(resolveRouteAccess(route, { hasAccessToken: false })).toEqual({
      allowed: false,
      reason: "unauthenticated",
    });
  });

  it("allows auth routes without an access token when bypass is enabled", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(
      resolveRouteAccess(route, {
        hasAccessToken: false,
        bypassTokenCheck: true,
      }),
    ).toEqual({ allowed: true, route });
  });

  it("allows public routes without an access token", () => {
    const route = getRouteByKey("auth.login");

    expect(resolveRouteAccess(route, { hasAccessToken: false })).toEqual({ allowed: true, route });
  });

  it("returns route when access is allowed", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(resolveRouteAccess(route)).toEqual({ allowed: true, route });
  });
});
