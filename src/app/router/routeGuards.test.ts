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

  it("returns route when access is allowed", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(resolveRouteAccess(route)).toEqual({ allowed: true, route });
  });
});
