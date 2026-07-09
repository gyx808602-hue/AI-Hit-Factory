import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { message } from "antd";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { createAppStore } from "./store";
import { AuthStorage, redirectToLogin } from "../utils/auth";

const menuApiMock = vi.hoisted(() => ({
  getCurrentUserRoutes: vi.fn(),
}));

const authApiMock = vi.hoisted(() => ({
  changePassword: vi.fn(),
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
    changePassword: authApiMock.changePassword,
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
    <Provider store={createAppStore()}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
}

describe("App auth routing", () => {
  let messageErrorSpy: ReturnType<typeof vi.spyOn>;
  let messageSuccessSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.localStorage.clear();
    menuApiMock.getCurrentUserRoutes.mockReset();
    authApiMock.logout.mockReset();
    authApiMock.changePassword.mockReset();
    authApiMock.logout.mockResolvedValue(undefined);
    authApiMock.changePassword.mockResolvedValue(undefined);
    vi.unstubAllEnvs();
    messageErrorSpy = vi.spyOn(message, "error").mockImplementation(() => ({
      then: async (callback?: () => void) => {
        callback?.();
      },
      promise: Promise.resolve(),
    }) as never);
    messageSuccessSpy = vi.spyOn(message, "success").mockImplementation(() => ({
      then: async (callback?: () => void) => {
        callback?.();
      },
      promise: Promise.resolve(),
    }) as never);
  });

  afterEach(() => {
    messageErrorSpy.mockRestore();
    messageSuccessSpy.mockRestore();
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
      background: "var(--brand-primary-active)",
      color: "var(--brand-primary-hover)",
    });
    expect(inactiveMenuButton).toHaveStyle({
      background: "transparent",
    });
  });

  it("keeps image video tasks selected on the create page", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/image-video"]);

    await waitFor(() => {
      expect(screen.getByTestId("image-video-prompt-section")).toBeInTheDocument();
    });

    const highlightedMenuButtons = screen
      .getAllByRole("button")
      .filter((button) => button.style.background === "var(--brand-primary-active)");

    expect(highlightedMenuButtons).toHaveLength(1);
    expect(highlightedMenuButtons[0]).toHaveAccessibleName("文图生视频任务");
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
      background: "var(--brand-primary-active)",
      color: "var(--brand-primary-hover)",
    });
    expect(digitalHumanMenuButton).toHaveStyle({
      background: "transparent",
    });
  });

  it("redirects to login after auth expired event", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");
    AuthStorage.setAccessToken("access-token");

    renderApp(["/image-video"]);

    await waitFor(() => {
      expect(screen.getByTestId("image-video-prompt-section")).toBeInTheDocument();
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

  it("shows global request success messages and suppresses duplicate messages", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");

    renderApp(["/login"]);

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    window.dispatchEvent(new CustomEvent("request:success", { detail: { message: "操作成功" } }));
    window.dispatchEvent(new CustomEvent("request:success", { detail: { message: "操作成功" } }));

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledTimes(1);
      expect(message.success).toHaveBeenCalledWith("操作成功");
    });
  });

  it("shows a required password change modal after C10013 and submits the new password", async () => {
    vi.stubEnv("VITE_ENABLE_MENU_ROUTES", "false");

    renderApp(["/login"]);

    await waitFor(() => {
      expect(screen.getByText("AI 爆款工厂")).toBeInTheDocument();
    });

    window.dispatchEvent(
      new CustomEvent("auth:password-change-required", {
        detail: { message: "必须修改密码" },
      }),
    );

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("必须修改密码");
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();

    const passwordInputs = dialog.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordInputs[0] as HTMLInputElement, {
      target: { value: "OldPass@123" },
    });
    fireEvent.change(passwordInputs[1] as HTMLInputElement, {
      target: { value: "NewPass@123" },
    });
    fireEvent.change(passwordInputs[2] as HTMLInputElement, {
      target: { value: "NewPass@123" },
    });
    fireEvent.submit(dialog.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(authApiMock.changePassword).toHaveBeenCalledWith({
        oldPassword: "OldPass@123",
        newPassword: "NewPass@123",
        confirmPassword: "NewPass@123",
      });
    });
    expect(message.success).toHaveBeenCalledWith("密码修改成功，请重新登录");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
