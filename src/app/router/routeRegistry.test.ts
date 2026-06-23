import { describe, expect, it } from "vitest";
import { getRouteByKey, routeRegistry } from "./routeRegistry";

describe("routeRegistry", () => {
  it("maps dashboard route key to a route definition", () => {
    const route = getRouteByKey("workspace.dashboard");

    expect(route.path).toBe("/");
    expect(route.meta.title).toBe("工作台");
  });

  it("contains unique route keys", () => {
    const keys = routeRegistry.map((route) => route.key);
    const uniqueKeys = new Set(keys);

    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("uses lazy page components so routes can be split into chunks", () => {
    expect(routeRegistry.every((route) => route.component.$$typeof)).toBe(true);
  });
});
