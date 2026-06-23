import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { AuthStorage, redirectToLogin } from "../utils/auth";

const menuApiMock = vi.hoisted(() => ({
  getCurrentUserRoutes: vi.fn(),
}));

vi.mock("../api/system/menus", async () => {
  const actual = await vi.importActual("../api/system/menus/index");

  return {
    ...actual,
    getCurrentUserRoutes: menuApiMock.getCurrentUserRoutes,
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

  it("keeps the task list menu selected when opening image video task detail", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/image-video/tasks/123"]);

    await waitFor(() => {
      expect(screen.getByText("文图生视频详情")).toBeInTheDocument();
    });

    const taskMenuButton = screen.getByRole("button", { name: /文图生视频任务/i });
    const dashboardButton = screen.getByRole("button", { name: /工作台/i });

    expect(taskMenuButton).toHaveStyle({
      background: "rgba(124,92,252,0.16)",
      color: "#9B7FFF",
    });
    expect(dashboardButton).toHaveStyle({
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
});
