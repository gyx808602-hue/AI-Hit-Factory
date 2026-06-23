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

  it("registers viral remix task routes for list and detail pages", () => {
    const taskListRoute = getRouteByKey("content.viralRemixTasks");
    const taskDetailRoute = getRouteByKey("content.viralRemixTaskDetail");

    expect(taskListRoute.path).toBe("/viral-remix/tasks");
    expect(taskListRoute.meta.hideInMenu).not.toBe(true);
    expect(taskDetailRoute.path).toBe("/viral-remix/tasks/:taskId");
    expect(taskDetailRoute.meta.hideInMenu).toBe(true);
  });

  it("registers text-image-video task routes for list and detail pages", () => {
    const taskListRoute = getRouteByKey("content.imageVideoTasks");
    const taskDetailRoute = getRouteByKey("content.imageVideoTaskDetail");

    expect(taskListRoute.path).toBe("/image-video/tasks");
    expect(taskListRoute.meta.hideInMenu).not.toBe(true);
    expect(taskDetailRoute.path).toBe("/image-video/tasks/:taskId");
    expect(taskDetailRoute.meta.hideInMenu).toBe(true);
  });

  it("registers digital human list and detail routes", () => {
    const listRoute = getRouteByKey("content.digitalHumans");
    const detailRoute = getRouteByKey("content.digitalHumanDetail");

    expect(listRoute.path).toBe("/digital-humans");
    expect(listRoute.meta.hideInMenu).not.toBe(true);
    expect(detailRoute.path).toBe("/digital-humans/:humanId");
    expect(detailRoute.meta.hideInMenu).toBe(true);
  });

  it("registers digital human video task routes for list and detail pages", () => {
    const taskListRoute = getRouteByKey("content.digitalHumanVideoTasks");
    const taskDetailRoute = getRouteByKey("content.digitalHumanVideoTaskDetail");

    expect(taskListRoute.path).toBe("/digital-humans/videos");
    expect(taskListRoute.meta.hideInMenu).not.toBe(true);
    expect(taskDetailRoute.path).toBe("/digital-humans/videos/:taskId");
    expect(taskDetailRoute.meta.hideInMenu).toBe(true);
  });

  it("uses lazy page components so routes can be split into chunks", () => {
    expect(routeRegistry.every((route) => route.component.$$typeof)).toBe(true);
  });
});
