import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardLayout } from "./DashboardLayout";
import type { NavigationItem } from "../router/routeTypes";

const menuItems: NavigationItem[] = [
  {
    kind: "route",
    key: "workspace.dashboard",
    title: "工作台",
    icon: "LayoutDashboard",
    route: {
      key: "workspace.dashboard",
      path: "/",
      component: vi.fn() as never,
      meta: {
        title: "工作台",
        icon: "LayoutDashboard",
        requiresAuth: true,
      },
    },
    children: [],
  },
];

describe("DashboardLayout", () => {
  it("renders correct brand and sidebar copy", () => {
    render(
      <DashboardLayout
        activeRouteKey="workspace.dashboard"
        menuItems={menuItems}
        onNavigate={vi.fn()}
      >
        <div>页面内容</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    expect(screen.getByText("内容生产平台")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "收起侧边栏" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "通知" })).toBeInTheDocument();
    expect(screen.getByText("商家用户")).toBeInTheDocument();
  });

  it("updates collapse toggle label after collapsing sidebar", () => {
    render(
      <DashboardLayout
        activeRouteKey="workspace.dashboard"
        menuItems={menuItems}
        onNavigate={vi.fn()}
      >
        <div>页面内容</div>
      </DashboardLayout>,
    );

    fireEvent.click(screen.getByRole("button", { name: "收起侧边栏" }));

    expect(screen.getByRole("button", { name: "展开侧边栏" })).toBeInTheDocument();
  });
});
