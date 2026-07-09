import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { createAppStore } from "./store";
import { setThemePalette } from "../features/ui-preferences/slice";

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

function renderAppWithStore(store = createAppStore()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
}

describe("App UI preferences integration", () => {
  it("syncs Redux theme values when the app shell renders", async () => {
    const store = createAppStore();
    store.dispatch(setThemePalette({ primary: "#0052CC" }));

    renderAppWithStore(store);

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue("--brand-primary")).toBe("#0052CC");
    });
  });
});
