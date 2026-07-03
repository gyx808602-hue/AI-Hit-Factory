import type { ComponentType, LazyExoticComponent } from "react";
import { describe, expect, it } from "vitest";
import { resolveHomeRoutePath } from "./homeRoute";
import type { AppRoute, NavigationItem, RouteKey } from "./routeTypes";

const mockComponent = null as unknown as LazyExoticComponent<ComponentType>;

function createRoute(route: Partial<AppRoute> & Pick<AppRoute, "key" | "path">): AppRoute {
  return {
    key: route.key,
    path: route.path,
    component: route.component ?? mockComponent,
    meta: {
      title: route.meta?.title ?? route.key,
      icon: route.meta?.icon ?? "LayoutDashboard",
      requiresAuth: route.meta?.requiresAuth ?? true,
      hideInMenu: route.meta?.hideInMenu,
      cache: route.meta?.cache,
      activeMenuKey: route.meta?.activeMenuKey,
      permissionCode: route.meta?.permissionCode,
    },
  };
}

function createRouteItem(
  route: AppRoute,
  options: Partial<Omit<Extract<NavigationItem, { kind: "route" }>, "kind" | "route">> = {},
): Extract<NavigationItem, { kind: "route" }> {
  return {
    kind: "route",
    key: options.key ?? route.key,
    title: options.title ?? route.meta.title,
    icon: options.icon ?? route.meta.icon,
    route,
    redirect: options.redirect,
    alwaysShow: options.alwaysShow,
    params: options.params,
    children: options.children ?? [],
  };
}

describe("resolveHomeRoutePath", () => {
  it("prefers the first valid internal redirect of the first directory menu", () => {
    const catalogRoute = createRoute({
      key: "content.imageVideo",
      path: "/image-video",
    });
    const taskRoute = createRoute({
      key: "content.imageVideoTasks",
      path: "/image-video/tasks",
    });

    const menuItems: NavigationItem[] = [
      createRouteItem(catalogRoute, {
        redirect: "/image-video/tasks",
        children: [createRouteItem(taskRoute)],
      }),
    ];

    expect(resolveHomeRoutePath(menuItems, [catalogRoute, taskRoute])).toBe("/image-video/tasks");
  });

  it("falls back to the first valid child route when the directory redirect is invalid", () => {
    const catalogRoute = createRoute({
      key: "content.imageVideo",
      path: "/image-video",
    });
    const taskRoute = createRoute({
      key: "content.imageVideoTasks",
      path: "/image-video/tasks",
    });

    const menuItems: NavigationItem[] = [
      createRouteItem(catalogRoute, {
        redirect: "/missing",
        children: [createRouteItem(taskRoute)],
      }),
    ];

    expect(resolveHomeRoutePath(menuItems, [catalogRoute, taskRoute])).toBe("/image-video/tasks");
  });

  it("skips invalid first menu routes and continues to the next accessible menu", () => {
    const invalidFirstRoute = createRoute({
      key: "content.imageVideo" satisfies RouteKey,
      path: "/disabled-entry",
    });
    const taskRoute = createRoute({
      key: "content.viralRemixTasks",
      path: "/viral-remix/tasks",
    });

    const menuItems: NavigationItem[] = [
      createRouteItem(invalidFirstRoute),
      createRouteItem(taskRoute),
    ];

    expect(resolveHomeRoutePath(menuItems, [taskRoute])).toBe("/viral-remix/tasks");
  });

  it("falls back to the first visible accessible route when menu items are empty", () => {
    const hiddenDetailRoute = createRoute({
      key: "content.viralRemixTaskDetail",
      path: "/viral-remix/tasks/:taskId",
      meta: {
        title: "任务详情",
        icon: "Clapperboard",
        hideInMenu: true,
        requiresAuth: true,
      },
    });
    const firstVisibleRoute = createRoute({
      key: "content.viralRemixTasks",
      path: "/viral-remix/tasks",
    });
    const secondVisibleRoute = createRoute({
      key: "content.imageVideo",
      path: "/image-video",
    });

    expect(resolveHomeRoutePath([], [hiddenDetailRoute, firstVisibleRoute, secondVisibleRoute])).toBe(
      "/viral-remix/tasks",
    );
  });
});
