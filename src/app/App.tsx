import { ConfigProvider, Spin, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Suspense, useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthStorage } from "../utils/auth";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { routeRegistry } from "./router/routeRegistry";
import { resolveRouteAccess } from "./router/routeGuards";
import type { AppRoute, DynamicRouteState, NavigationItem } from "./router/routeTypes";
import { useCurrentUserRoutes } from "./router/useCurrentUserRoutes";
import { ForbiddenPage } from "../pages/ForbiddenPage";
import { NotFoundPage } from "../pages/NotFoundPage";

function getDefaultWorkspaceRoute(routes: AppRoute[]) {
  return routes.find((route) => !route.meta.hideInMenu) ?? routes[0];
}

function buildRedirectTarget(pathname: string, search: string) {
  return `${pathname}${search}`;
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
  return availableRoutes.find((route) => route.path === pathname);
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

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAccessToken = Boolean(AuthStorage.getAccessToken());
  // 公共路由在运行期不会变化，使用 useMemo 固定引用，避免每次渲染都重新筛选。
  const publicRoutes = useMemo(
    () => routeRegistry.filter((route) => route.meta.requiresAuth === false),
    [],
  );
  // 动态菜单接口失败或尚未返回时，仍然需要一份受保护路由白名单参与守卫判断和兜底渲染。
  const fallbackRouteState = useMemo(() => getFallbackRouteState(), []);
  const dynamicRoutesQuery = useCurrentUserRoutes(hasAccessToken);
  const dynamicRouteState = dynamicRoutesQuery.data ?? fallbackRouteState;
  const availableRoutes = hasAccessToken
    ? [...publicRoutes, ...dynamicRouteState.routes]
    : publicRoutes;
  // 未登录时也要拿静态受保护路由做一次候选匹配，这样访问 /assets 之类页面时才能先命中路由，再走未登录跳转，
  // 而不是因为“当前可访问路由里没有它”直接落到 404。
  const candidateRoutes = hasAccessToken
    ? availableRoutes
    : [...publicRoutes, ...fallbackRouteState.routes];
  const activeRoute = getActiveRoute(location.pathname, candidateRoutes);
  const routeAccess = resolveRouteAccess(activeRoute, { hasAccessToken });

  useEffect(() => {
    function handleAuthExpired() {
      // 登录失效后保留来源地址，重新登录后可以按 redirect 回到用户原本访问的页面。
      const redirect = encodeURIComponent(buildRedirectTarget(location.pathname, location.search));
      navigate(`/login?redirect=${redirect}`, { replace: true });
    }

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [location.pathname, location.search, navigate]);

  if (dynamicRoutesQuery.isLoading) {
    return <DynamicRouteLoading />;
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
  // 隐藏路由通常不会出现在侧边栏，因此布局高亮需要回退到一个可见工作台路由。
  const activeWorkspaceRoute = currentRoute.meta.hideInMenu
    ? getDefaultWorkspaceRoute(dynamicRouteState.routes)
    : currentRoute;
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
      {currentRoute.meta.hideInMenu ? (
        activePage
      ) : (
        <DashboardLayout
          activeRouteKey={activeWorkspaceRoute.key}
          menuItems={dynamicRouteState.menuItems}
          onNavigate={handleNavigate}
        >
          {activePage}
        </DashboardLayout>
      )}
    </ConfigProvider>
  );
}
