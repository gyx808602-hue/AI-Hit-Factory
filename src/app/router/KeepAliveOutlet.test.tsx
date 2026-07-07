import { fireEvent, render, screen } from "@testing-library/react";
import { lazy, useEffect, useState } from "react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  clearAllKeepAliveRouteCaches,
  clearKeepAliveRouteCache,
  KeepAliveOutlet,
} from "./KeepAliveOutlet";
import type { AppRoute, RouteKey } from "./routeTypes";

type MountCounter = {
  mounts: number;
  unmounts: number;
};

const LazyPlaceholder = lazy(async () => ({
  default: () => null,
}));

function createRoute(key: RouteKey, path: string, cache: boolean): AppRoute {
  return {
    key,
    path,
    component: LazyPlaceholder,
    meta: {
      title: key,
      icon: "LayoutDashboard",
      cache,
      requiresAuth: true,
    },
  };
}

const cacheRoute = createRoute("content.imageVideoTasks", "/cached", true);
const plainRoute = createRoute("content.imageVideoTaskDetail", "/plain/:id", false);
const disabledCacheRoute = createRoute("content.digitalHumans", "/runtime-cache", false);
const enabledRuntimeCacheRoute = createRoute("content.digitalHumans", "/runtime-cache", true);

function CounterPage({
  counter,
  label,
}: {
  counter: MountCounter;
  label: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    counter.mounts += 1;

    return () => {
      counter.unmounts += 1;
    };
  }, [counter]);

  return (
    <section>
      <h1>{label}</h1>
      <button type="button" onClick={() => setValue((nextValue) => nextValue + 1)}>
        {label} count {value}
      </button>
    </section>
  );
}

function TestShell({
  availableRoutes,
  resetKey,
}: {
  availableRoutes: AppRoute[];
  resetKey?: string;
}) {
  return (
    <div>
      <nav>
        <Link to="/cached">cached</Link>
        <Link to="/plain/1">plain 1</Link>
        <Link to="/plain/2">plain 2</Link>
        <Link to="/runtime-cache">runtime cache</Link>
      </nav>
      <KeepAliveOutlet availableRoutes={availableRoutes} resetKey={resetKey} />
    </div>
  );
}

function renderKeepAliveRoutes({
  availableRoutes,
  cachedCounter,
  plainCounter,
  runtimeCounter,
  resetKey,
}: {
  availableRoutes: AppRoute[];
  cachedCounter: MountCounter;
  plainCounter: MountCounter;
  runtimeCounter?: MountCounter;
  resetKey?: string;
}) {
  return render(
    <MemoryRouter initialEntries={["/cached"]}>
      <Routes>
        <Route
          element={<TestShell availableRoutes={availableRoutes} resetKey={resetKey} />}
        >
          <Route
            path="/cached"
            element={<CounterPage counter={cachedCounter} label="cached page" />}
          />
          <Route
            path="/plain/:id"
            element={<CounterPage counter={plainCounter} label="plain page" />}
          />
          <Route
            path="/runtime-cache"
            element={
              <CounterPage
                counter={runtimeCounter ?? { mounts: 0, unmounts: 0 }}
                label="runtime cache page"
              />
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("KeepAliveOutlet", () => {
  it("keeps cache-enabled route instance alive when navigating away and back", async () => {
    const cachedCounter = { mounts: 0, unmounts: 0 };
    const plainCounter = { mounts: 0, unmounts: 0 };

    renderKeepAliveRoutes({
      availableRoutes: [cacheRoute, plainRoute],
      cachedCounter,
      plainCounter,
    });

    fireEvent.click(screen.getByRole("button", { name: "cached page count 0" }));
    fireEvent.click(screen.getByRole("link", { name: "plain 1" }));
    fireEvent.click(screen.getByRole("link", { name: "cached" }));

    expect(screen.getByRole("button", { name: "cached page count 1" })).toBeInTheDocument();
    expect(cachedCounter).toEqual({ mounts: 1, unmounts: 0 });
  });

  it("allows cache-disabled routes to unmount normally", async () => {
    const cachedCounter = { mounts: 0, unmounts: 0 };
    const plainCounter = { mounts: 0, unmounts: 0 };

    renderKeepAliveRoutes({
      availableRoutes: [cacheRoute, plainRoute],
      cachedCounter,
      plainCounter,
    });

    fireEvent.click(screen.getByRole("link", { name: "plain 1" }));
    fireEvent.click(screen.getByRole("button", { name: "plain page count 0" }));
    fireEvent.click(screen.getByRole("link", { name: "cached" }));
    fireEvent.click(screen.getByRole("link", { name: "plain 1" }));

    expect(screen.getByRole("button", { name: "plain page count 0" })).toBeInTheDocument();
    expect(plainCounter).toEqual({ mounts: 2, unmounts: 1 });
  });

  it("uses runtime availableRoutes metadata when deciding whether to cache", async () => {
    const cachedCounter = { mounts: 0, unmounts: 0 };
    const plainCounter = { mounts: 0, unmounts: 0 };
    const runtimeCounter = { mounts: 0, unmounts: 0 };

    renderKeepAliveRoutes({
      availableRoutes: [cacheRoute, plainRoute, enabledRuntimeCacheRoute],
      cachedCounter,
      plainCounter,
      runtimeCounter,
    });

    fireEvent.click(screen.getByRole("link", { name: "runtime cache" }));
    fireEvent.click(screen.getByRole("button", { name: "runtime cache page count 0" }));
    fireEvent.click(screen.getByRole("link", { name: "cached" }));
    fireEvent.click(screen.getByRole("link", { name: "runtime cache" }));

    expect(
      screen.getByRole("button", { name: "runtime cache page count 1" }),
    ).toBeInTheDocument();
    expect(runtimeCounter).toEqual({ mounts: 1, unmounts: 0 });
  });

  it("clears all caches when resetKey changes", async () => {
    const cachedCounter = { mounts: 0, unmounts: 0 };
    const plainCounter = { mounts: 0, unmounts: 0 };

    const view = renderKeepAliveRoutes({
      availableRoutes: [cacheRoute, plainRoute],
      cachedCounter,
      plainCounter,
      resetKey: "session-a",
    });

    fireEvent.click(screen.getByRole("button", { name: "cached page count 0" }));

    view.rerender(
      <MemoryRouter initialEntries={["/cached"]}>
        <Routes>
          <Route
            element={
              <TestShell
                availableRoutes={[cacheRoute, plainRoute]}
                resetKey="session-b"
              />
            }
          >
            <Route
              path="/cached"
              element={<CounterPage counter={cachedCounter} label="cached page" />}
            />
            <Route
              path="/plain/:id"
              element={<CounterPage counter={plainCounter} label="plain page" />}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "cached page count 0" })).toBeInTheDocument();
    expect(cachedCounter.mounts).toBe(2);
  });

  it("exposes route-key cache clearing helpers for future tagsView close actions", async () => {
    const cachedCounter = { mounts: 0, unmounts: 0 };
    const plainCounter = { mounts: 0, unmounts: 0 };

    renderKeepAliveRoutes({
      availableRoutes: [cacheRoute, plainRoute, disabledCacheRoute],
      cachedCounter,
      plainCounter,
    });

    fireEvent.click(screen.getByRole("button", { name: "cached page count 0" }));
    clearKeepAliveRouteCache("content.imageVideoTasks");
    fireEvent.click(screen.getByRole("link", { name: "plain 1" }));
    fireEvent.click(screen.getByRole("link", { name: "cached" }));

    expect(screen.getByRole("button", { name: "cached page count 0" })).toBeInTheDocument();
    expect(cachedCounter.mounts).toBe(2);

    clearAllKeepAliveRouteCaches();
  });
});
