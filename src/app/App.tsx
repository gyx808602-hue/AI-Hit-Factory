import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { routeRegistry } from "./router/routeRegistry";
import type { AppRoute } from "./router/routeTypes";

function getActiveRoute(pathname: string): AppRoute {
  return routeRegistry.find((route) => route.path === pathname) ?? getDefaultWorkspaceRoute();
}

function getDefaultWorkspaceRoute(): AppRoute {
  return routeRegistry.find((route) => !route.meta.hideInMenu) ?? routeRegistry[0];
}

function PageFallback() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center text-[13px] text-[var(--text-muted)]">
      页面加载中...
    </div>
  );
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = getActiveRoute(location.pathname);
  const activePage = (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {routeRegistry.map((route) => {
          const Page = route.component;

          return <Route key={route.key} path={route.path} element={<Page />} />;
        })}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );

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
      {activeRoute.meta.hideInMenu ? (
        activePage
      ) : (
      <DashboardLayout
        activeRouteKey={activeRoute.key}
        onNavigate={(route) => navigate(route.path)}
      >
        {activePage}
      </DashboardLayout>
      )}
    </ConfigProvider>
  );
}
