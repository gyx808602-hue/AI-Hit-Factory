import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => {
    window.localStorage.clear();
    menuApiMock.getCurrentUserRoutes.mockReset();
  });

  it("redirects unauthenticated users to login with redirect query", async () => {
    renderApp(["/assets"]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /欢迎回来/i })).toBeInTheDocument();
    });
  });

  it("redirects to login after auth expired event", async () => {
    AuthStorage.setAccessToken("access-token");
    menuApiMock.getCurrentUserRoutes.mockResolvedValue([
      {
        path: "/assets",
        component: "workspace/assets/index",
        meta: { title: "Assets", icon: "FolderOpen" },
      },
    ]);

    renderApp(["/assets"]);

    await waitFor(() => {
      expect(menuApiMock.getCurrentUserRoutes).toHaveBeenCalled();
    });

    redirectToLogin();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /欢迎回来/i })).toBeInTheDocument();
    });
  });
});
