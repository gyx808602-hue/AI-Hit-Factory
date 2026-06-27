import { ConfigProvider, message, Spin, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { matchPath, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/system/auth";
import { ForbiddenPage } from "../pages/ForbiddenPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AuthStorage } from "../utils/auth";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { routeRegistry } from "./router/routeRegistry";
import { resolveRouteAccess } from "./router/routeGuards";
import type { AppRoute, DynamicRouteState, NavigationItem } from "./router/routeTypes";
import { useCurrentUserRoutes } from "./router/useCurrentUserRoutes";

function getDefaultWorkspaceRoute(routes: AppRoute[]) {
  return routes.find((route) => !route.meta.hideInMenu) ?? routes[0];
}

function getFirstMenuRoute(menuItems: NavigationItem[]): AppRoute | undefined {
  for (const item of menuItems) {
    if (item.kind === "route") {
      return item.route;
    }

    const childRoute = getFirstMenuRoute(item.children);
    if (childRoute) {
      return childRoute;
    }
  }

  return undefined;
}

function resolveActiveMenuRoute(
  currentRoute: AppRoute,
  availableRoutes: AppRoute[],
): AppRoute {
  if (!currentRoute.meta.hideInMenu) {
    return currentRoute;
  }

  if (currentRoute.meta.activeMenuKey) {
    const matchedParentRoute = availableRoutes.find(
      (route) => route.key === currentRoute.meta.activeMenuKey,
    );

    if (matchedParentRoute) {
      return matchedParentRoute;
    }
  }

  return getDefaultWorkspaceRoute(availableRoutes);
}

function dedupeRoutes(routes: AppRoute[]) {
  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.key)) {
      return false;
    }

    seen.add(route.key);
    return true;
  });
}

function buildRedirectTarget(pathname: string, search: string) {
  return `${pathname}${search}`;
}

function isTokenBypassEnabled() {
  return import.meta.env.VITE_BYPASS_TOKEN_CHECK === "true";
}

function PageFallback() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center text-[13px] text-[var(--text-muted)]">
      <Spin size="small" />
    </div>
  );
}

function DynamicRouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] text-[var(--text-muted)]">
      <div className="flex items-center gap-3 text-[13px]">
        <Spin size="small" />
        正在加载菜单权限...
      </div>
    </div>
  );
}

function getActiveRoute(pathname: string, availableRoutes: AppRoute[]) {
  return availableRoutes.find((route) => matchPath({ path: route.path, end: true }, pathname));
}

function getFallbackRouteState(): DynamicRouteState {
  const routes = routeRegistry.filter((route) => route.meta.requiresAuth);
  return {
    routes,
    menuItems: routes
      .filter((route) => !route.meta.hideInMenu)
      .map((route) => ({
        kind: "route" as const,
        key: route.key,
        title: route.meta.title,
        icon: route.meta.icon,
        route,
        children: [],
      })),
    externalMenuItems: [],
  };
}

function getCurrentUserDisplayName() {
  return AuthStorage.getCurrentUserName() || "商家用户";
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const lastRequestErrorRef = useRef<{ message: string; time: number } | null>(null);
  const hasAccessToken = Boolean(AuthStorage.getAccessToken());
  const bypassTokenCheck = isTokenBypassEnabled();
  const publicRoutes = useMemo(
    () => routeRegistry.filter((route) => route.meta.requiresAuth === false),
    [],
  );
  const hiddenProtectedRoutes = useMemo(
    () => routeRegistry.filter((route) => route.meta.requiresAuth && route.meta.hideInMenu),
    [],
  );
  const fallbackRouteState = useMemo(() => getFallbackRouteState(), []);
  const dynamicRoutesQuery = useCurrentUserRoutes(hasAccessToken);
  const dynamicRouteState = dynamicRoutesQuery.data ?? fallbackRouteState;
  const canAccessProtectedRoutes = hasAccessToken || bypassTokenCheck;
  const availableRoutes = canAccessProtectedRoutes
    ? dedupeRoutes([...publicRoutes, ...dynamicRouteState.routes, ...hiddenProtectedRoutes])
    : publicRoutes;
  const candidateRoutes = canAccessProtectedRoutes
    ? availableRoutes
    : [...publicRoutes, ...fallbackRouteState.routes, ...hiddenProtectedRoutes];
  const activeRoute = getActiveRoute(location.pathname, candidateRoutes);
  const routeAccess = resolveRouteAccess(activeRoute, { hasAccessToken, bypassTokenCheck });
  const homeRoute = getFirstMenuRoute(dynamicRouteState.menuItems);
  const currentUserName = getCurrentUserDisplayName();

  useEffect(() => {
    function handleAuthExpired() {
      const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    function handleRequestError(event: Event) {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      const nextMessage = detail?.message?.trim();
      if (!nextMessage) {
        return;
      }

      const now = Date.now();
      const lastError = lastRequestErrorRef.current;

      // 短时间内相同文案只提示一次，避免全局错误事件导致 message 刷屏。
      if (lastError && lastError.message === nextMessage && now - lastError.time < 1500) {
        return;
      }

      lastRequestErrorRef.current = { message: nextMessage, time: now };
      void message.error(nextMessage);
    }

    window.addEventListener("request:error", handleRequestError as EventListener);
    return () => {
      window.removeEventListener("request:error", handleRequestError as EventListener);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      AuthStorage.clear();
      const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }
  }

  if (dynamicRoutesQuery.isLoading) {
    return <DynamicRouteLoading />;
  }

  if (
    canAccessProtectedRoutes &&
    location.pathname === "/" &&
    homeRoute &&
    homeRoute.path !== "/"
  ) {
    return <Navigate to={homeRoute.path} replace />;
  }

  if (!routeAccess.allowed) {
    if (routeAccess.reason === "unauthenticated") {
      const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
      return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    if (routeAccess.reason === "forbidden") {
      return <ForbiddenPage />;
    }

    return <NotFoundPage />;
  }

  const currentRoute = routeAccess.route;
  const activeWorkspaceRoute = resolveActiveMenuRoute(currentRoute, dynamicRouteState.routes);
  const activePage = (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {availableRoutes.map((route) => {
          const Page = route.component;
          return <Route key={route.key} path={route.path} element={<Page />} />;
        })}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );

  function handleNavigate(item: NavigationItem) {
    if (item.kind === "external") {
      window.open(item.redirect, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.kind === "route") {
      navigate(item.route.path);
      return;
    }

    if (item.children[0]?.kind === "route") {
      navigate(item.children[0].route.path);
    }
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#7C5CFC",
          colorInfo: "#22D3EE",
          colorSuccess: "#4ADE80",
          colorWarning: "#F97316",
          colorError: "#EF4444",
          colorBgBase: "#0C0D14",
          colorBgContainer: "#13141F",
          colorBgElevated: "#1A1B28",
          colorBorder: "rgba(255,255,255,0.08)",
          borderRadius: 8,
          fontFamily:
            "Inter, Microsoft YaHei, PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 36,
            borderRadius: 8,
          },
          Card: {
            colorBgContainer: "#13141F",
          },
          Table: {
            colorBgContainer: "#13141F",
            colorFillAlter: "rgba(255,255,255,0.02)",
          },
        },
      }}
    >
      {currentRoute.meta.requiresAuth === false ? (
        activePage
      ) : (
        <DashboardLayout
          activeRouteKey={activeWorkspaceRoute.key}
          currentUserName={currentUserName}
          menuItems={dynamicRouteState.menuItems}
          onNavigate={handleNavigate}
          onLogout={() => {
            void handleLogout();
          }}
        >
          {activePage}
        </DashboardLayout>
      )}
    </ConfigProvider>
  );
}
