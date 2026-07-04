import { describe, expect, it } from "vitest";
import { getRouteByKey } from "./routeRegistry";

describe("points route registry", () => {
  it("registers points usage statistics route", () => {
    const route = getRouteByKey("points.usageStatistics");

    expect(route.path).toBe("/points/usage-statistics");
    expect(route.meta.permissionCode).toBe("points:usage:view");
    expect(route.meta.hideInMenu).not.toBe(true);
  });
});
