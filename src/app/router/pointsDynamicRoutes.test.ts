import { describe, expect, it } from "vitest";
import type { RouteItem } from "../../api/system/menus/types";
import { buildDynamicRouteState } from "./dynamicRoutes";

describe("points dynamic routes", () => {
  it("maps points usage statistics backend component into a route", () => {
    const routes: RouteItem[] = [
      {
        path: "/points/usage-statistics",
        component: "points/usage-statistics/index",
        meta: { title: "积分统计", icon: "CircleDollarSign", keepAlive: true },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["points.usageStatistics"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["points.usageStatistics"]);
  });
});
