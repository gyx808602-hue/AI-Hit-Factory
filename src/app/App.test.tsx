import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { AuthStorage, redirectToLogin } from "../utils/auth";

const menuApiMock = vi.hoisted(() => ({
  getCurrentUserRoutes: vi.fn(),
}));

const authApiMock = vi.hoisted(() => ({
  logout: vi.fn(),
}));

vi.mock("../api/system/menus", async () => {
  const actual = await vi.importActual("../api/system/menus/index");

  return {
    ...actual,
    getCurrentUserRoutes: menuApiMock.getCurrentUserRoutes,
  };
});

vi.mock("../api/system/auth", async () => {
  const actual = await vi.importActual("../api/system/auth/index");

  return {
    ...actual,
    logout: authApiMock.logout,
  };
});

function renderApp(initialEntries: string[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("App auth routing", () => {
  let messageErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage.clear();
    menuApiMock.getCurrentUserRoutes.mockReset();
    authApiMock.logout.mockReset();
    authApiMock.logout.mockResolvedValue(undefined);
    vi.unstubAllEnvs();
    messageErrorSpy = vi.spyOn(message, "error").mockImplementation(() => ({
      then: async (callback?: () => void) => {
        callback?.();
      },
      promise: Promise.resolve(),
    }) as never);
  });

  afterEach(() => {
    messageErrorSpy.mockRestore();
  });

  it("renders the workspace shell for unauthenticated users when menu routes are disabled", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("allows protected routes without token when token bypass is enabled", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    vi.stubEnv("VITE_BYPASS_TOKEN_CHECK", "true");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText("素材库")).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("uses fallback routes when dynamic menu routes are disabled", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText(/素材库/i)).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("uses fallback routes for task records when dynamic menu routes are disabled", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/tasks"]);

    await waitFor(() => {
      expect(screen.getByText(/任务记录/i)).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("redirects root path to the first fallback menu route when dashboard is disabled", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/"]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /追爆任务/i })).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("redirects root path to the first dynamic menu route when dashboard is unavailable", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "true");
    AuthStorage.setAccessToken("access-token");
    menuApiMock.getCurrentUserRoutes.mockResolvedValue([
      {
        path: "/tasks",
        component: "workspace/tasks/index",
        meta: { title: "任务记录", icon: "ClipboardList" },
      },
      {
        path: "/assets",
        component: "workspace/assets/index",
        meta: { title: "素材库", icon: "FolderOpen" },
      },
    ]);

    renderApp(["/"]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /任务记录/i })).toBeInTheDocument();
    });
  });

  it("keeps the task list menu selected when opening image video task detail", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/image-video/tasks/123"]);

    await waitFor(() => {
      expect(screen.getByText("文图生视频详情")).toBeInTheDocument();
    });

    const taskMenuButton = screen.getByRole("button", { name: /文图生视频任务/i });
    const inactiveMenuButton = screen.getByRole("button", { name: /追爆任务/i });

    expect(taskMenuButton).toHaveStyle({
      background: "rgba(124,92,252,0.16)",
      color: "#9B7FFF",
    });
    expect(inactiveMenuButton).toHaveStyle({
      background: "transparent",
    });
  });

  it("keeps the digital human video task menu selected on the list page", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/digital-humans/videos"]);

    await waitFor(() => {
      expect(screen.getByText("数字人视频任务")).toBeInTheDocument();
    });

    const videoTaskMenuButton = screen.getByRole("button", { name: /数字人视频任务/i });
    const digitalHumanMenuButton = screen.getByRole("button", { name: /数字人管理/i });

    expect(videoTaskMenuButton).toHaveStyle({
      background: "rgba(124,92,252,0.16)",
      color: "#9B7FFF",
    });
    expect(digitalHumanMenuButton).toHaveStyle({
      background: "transparent",
    });
  });

  it("redirects to login after auth expired event", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getAllByText(/素材库/i).length).toBeGreaterThan(0);
    });

    redirectToLogin();

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    expect(menuApiMock.getCurrentUserRoutes).not.toHaveBeenCalled();
  });

  it("shows global request errors and suppresses duplicate messages", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");

    renderApp(["/login"]);

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    window.dispatchEvent(new CustomEvent("request:error", { detail: { message: "接口请求失败" } }));
    window.dispatchEvent(new CustomEvent("request:error", { detail: { message: "接口请求失败" } }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledTimes(1);
    });
  });

  it("shows current user name from local auth session in the workspace header", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");
    AuthStorage.setCurrentUserName("测试商家");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText("测试商家")).toBeInTheDocument();
    });
  });

  it("falls back to default user label when local auth session has no user name", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText("商家用户")).toBeInTheDocument();
    });
  });

  it("logs out from user menu and clears local auth session", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");
    AuthStorage.setRefreshToken("refresh-token");
    AuthStorage.setCurrentUserName("测试商家");

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByText("测试商家")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "当前登录用户：测试商家" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "退出登录" }));

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    expect(authApiMock.logout).toHaveBeenCalledTimes(1);
    expect(AuthStorage.getAccessToken()).toBeNull();
    expect(AuthStorage.getRefreshToken()).toBeNull();
    expect(AuthStorage.getCurrentUserName()).toBe("");
  });
});
