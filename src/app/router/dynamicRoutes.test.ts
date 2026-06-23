import { describe, expect, it } from "vitest";
import type { RouteItem } from "../../api/system/menus/types";
import {
  buildDynamicRouteState,
  isExternalRedirect,
} from "./dynamicRoutes";

describe("dynamicRoutes", () => {
  it("maps known backend components into renderable routes and menus", () => {
    const routes: RouteItem[] = [
      {
        path: "/dashboard",
        component: "dashboard/index",
        meta: { title: "Dashboard", icon: "LayoutDashboard", keepAlive: true },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["workspace.dashboard"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["workspace.dashboard"]);
    expect(result.routes[0]?.meta.cache).toBe(true);
  });

  it("filters unknown backend components and normalizes invalid children", () => {
    const routes: RouteItem[] = [
      {
        path: "/unknown",
        component: "system/user/index",
        name: "unknown",
        children: "broken-children" as unknown as RouteItem[],
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes).toEqual([]);
    expect(result.menuItems).toEqual([]);
  });

  it("keeps hidden routes accessible while excluding them from menus", () => {
    const routes: RouteItem[] = [
      {
        path: "/assets",
        component: "workspace/assets/index",
        meta: { title: "Assets", hidden: true },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["workspace.assets"]);
    expect(result.menuItems).toEqual([]);
  });

  it("marks external redirects and does not register them as internal routes", () => {
    const routes: RouteItem[] = [
      {
        path: "/docs",
        component: "external/link",
        redirect: "https://www.youlai.tech",
        meta: { title: "Docs" },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(isExternalRedirect("https://www.youlai.tech")).toBe(true);
    expect(result.routes).toEqual([]);
    expect(result.externalMenuItems).toHaveLength(1);
    expect(result.externalMenuItems[0]?.redirect).toBe("https://www.youlai.tech");
  });

  it("maps viral remix task list backend component into a route", () => {
    const routes: RouteItem[] = [
      {
        path: "/viral-remix/tasks",
        component: "content/viral-remix/tasks/index",
        meta: { title: "追爆任务", icon: "ListTodo" },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["content.viralRemixTasks"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["content.viralRemixTasks"]);
  });

  it("maps text-image-video task list backend component into a route", () => {
    const routes: RouteItem[] = [
      {
        path: "/image-video/tasks",
        component: "content/image-video/tasks/index",
        meta: { title: "文图生视频任务", icon: "ListTodo" },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["content.imageVideoTasks"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["content.imageVideoTasks"]);
  });

  it("maps digital human backend component into a route", () => {
    const routes: RouteItem[] = [
      {
        path: "/digital-humans",
        component: "content/digital-humans/index",
        meta: { title: "数字人管理", icon: "User2" },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["content.digitalHumans"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["content.digitalHumans"]);
  });

  it("maps digital human video task backend component into a route", () => {
    const routes: RouteItem[] = [
      {
        path: "/digital-humans/videos",
        component: "content/digital-human-videos/index",
        meta: { title: "数字人视频任务", icon: "ListTodo" },
      },
    ];

    const result = buildDynamicRouteState(routes);

    expect(result.routes.map((route) => route.key)).toEqual(["content.digitalHumanVideoTasks"]);
    expect(
      result.menuItems
        .filter((item) => item.kind === "route")
        .map((item) => item.route.key),
    ).toEqual(["content.digitalHumanVideoTasks"]);
  });
});
