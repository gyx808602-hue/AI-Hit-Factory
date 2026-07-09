import { ConfigProvider, message, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { matchRoutes, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/system/auth";
import { ForbiddenPage } from "../pages/system/ForbiddenPage";
import { NotFoundPage } from "../pages/system/NotFoundPage";
import { AuthStorage } from "../utils/auth";
import { useAppSelector } from "./hooks";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { clearAllKeepAliveRouteCaches, KeepAliveOutlet } from "./router/KeepAliveOutlet";
import { resolveHomeRoutePath } from "./router/homeRoute";
import { routeRegistry } from "./router/routeRegistry";
import { resolveRouteAccess } from "./router/routeGuards";
import type { AppRoute, DynamicRouteState, NavigationItem } from "./router/routeTypes";
import { useCurrentUserRoutes } from "./router/useCurrentUserRoutes";
import { selectAntdThemeConfig } from "../features/ui-preferences/selectors";
import { ThemeCssVariables } from "../features/ui-preferences/ThemeCssVariables";

function getDefaultWorkspaceRoute(routes: AppRoute[]) {
  return routes.find((route) => !route.meta.hideInMenu) ?? routes[0];
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
  const routeMatches = matchRoutes(
    availableRoutes.map((route) => ({
      path: route.path,
      handle: route,
    })),
    pathname,
  );

  return routeMatches?.at(-1)?.route.handle;
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

type WorkspaceOutletProps = {
  activeRouteKey: AppRoute["key"];
  availableRoutes: AppRoute[];
  currentUserName: string;
  menuItems: NavigationItem[];
  onLogout: () => void;
  onNavigate: (item: NavigationItem) => void;
  resetKey: string;
};

function WorkspaceOutlet({
  activeRouteKey,
  availableRoutes,
  currentUserName,
  menuItems,
  onLogout,
  onNavigate,
  resetKey,
}: WorkspaceOutletProps) {
  return (
    <DashboardLayout
      activeRouteKey={activeRouteKey}
      currentUserName={currentUserName}
      menuItems={menuItems}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <KeepAliveOutlet availableRoutes={availableRoutes} resetKey={resetKey} />
    </DashboardLayout>
  );
}

export function App() {
  const antdThemeConfig = useAppSelector(selectAntdThemeConfig);
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
  const homeRoutePath = resolveHomeRoutePath(dynamicRouteState.menuItems, availableRoutes);
  const currentUserName = getCurrentUserDisplayName();
  const routeCacheResetKey = useMemo(() => {
    // 缓存作用域由当前可访问受保护路由决定。
    // 菜单权限、路径或 cache 开关变化时，旧页面实例必须清空，避免旧权限上下文残留。
    return availableRoutes
      .filter((route) => route.meta.requiresAuth)
      .map((route) => `${route.key}:${route.path}:${route.meta.cache ? "cache" : "plain"}`)
      .join("|");
  }, [availableRoutes]);

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
      // 退出登录时清空所有受保护页面实例，避免下个账号看到上个账号的筛选/表单状态。
      clearAllKeepAliveRouteCaches();
      AuthStorage.clear();
      const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }
  }

  if (dynamicRoutesQuery.isLoading) {
    return <DynamicRouteLoading />;
  }

  if (!canAccessProtectedRoutes && location.pathname === "/") {
    const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (
    canAccessProtectedRoutes &&
    location.pathname === "/" &&
    homeRoutePath &&
    homeRoutePath !== "/"
  ) {
    return <Navigate to={homeRoutePath} replace />;
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
  const publicRouteElements = publicRoutes.map((route) => {
    const Page = route.component;
    return <Route key={route.key} path={route.path} element={<Page />} />;
  });
  const protectedRouteElements = availableRoutes
    .filter((route) => route.meta.requiresAuth !== false)
    .map((route) => {
      const Page = route.component;
      return <Route key={route.key} path={route.path} element={<Page />} />;
    });

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
      theme={antdThemeConfig}
    >
      <ThemeCssVariables />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {publicRouteElements}
          <Route
            element={
              <WorkspaceOutlet
                activeRouteKey={activeWorkspaceRoute.key}
                availableRoutes={availableRoutes}
                currentUserName={currentUserName}
                menuItems={dynamicRouteState.menuItems}
                onNavigate={handleNavigate}
                onLogout={() => {
                  void handleLogout();
                }}
                resetKey={routeCacheResetKey}
              />
            }
          >
            {/* 受保护页面作为 DashboardLayout 的子路由渲染，KeepAliveOutlet 才能通过 useOutlet 拿到当前页面实例。 */}
            {protectedRouteElements}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}
