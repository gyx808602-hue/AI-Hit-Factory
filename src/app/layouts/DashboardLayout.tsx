import {
  Bell,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  Image,
  LayoutDashboard,
  Repeat2,
  User,
  User2,
  Video,
  Zap,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import type { NavigationItem, RouteKey } from "../router/routeTypes";

type DashboardLayoutProps = {
  activeRouteKey: RouteKey;
  children: ReactNode;
  menuItems: NavigationItem[];
  onNavigate: (item: NavigationItem) => void;
};

const iconMap = {
  LayoutDashboard,
  Video,
  Repeat2,
  Image,
  User2,
  ClipboardList,
  FolderOpen,
};

export function DashboardLayout({
  activeRouteKey,
  children,
  menuItems,
  onNavigate,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)]">
      <aside
        className="flex h-full shrink-0 flex-col border-r border-[var(--line-subtle)] bg-[var(--sidebar-bg)] transition-[width] duration-200"
        style={{ width: collapsed ? 64 : 224 }}
      >
        <div className="flex h-[56px] items-center gap-3 border-b border-[var(--line-subtle)] px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7C5CFC,#F97316)]">
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold leading-4 text-[var(--text-primary)]">
                AI 爆款工厂
              </div>
              <div className="truncate text-[11px] text-[var(--text-muted)]">内容生产平台</div>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
            const active = item.kind === "route" && activeRouteKey === item.route.key;

            return (
              <button
                key={item.key}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition"
                style={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderColor: active ? "rgba(124,92,252,0.35)" : "transparent",
                  background: active ? "rgba(124,92,252,0.16)" : "transparent",
                  color: active ? "#9B7FFF" : "var(--text-muted)",
                }}
                title={collapsed ? item.title : undefined}
                onClick={() => onNavigate(item)}
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && (
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {item.title}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[var(--line-subtle)] px-2 py-3">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg py-2 text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            <ChevronRight
              size={14}
              style={{
                transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[52px] shrink-0 items-center justify-end gap-3 border-b border-[var(--line-subtle)] px-4 sm:px-6">
          <button
            type="button"
            className="relative rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
            aria-label="通知"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-[var(--text-secondary)] transition hover:bg-white/5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7C5CFC,#F97316)]">
              <User size={13} color="#fff" />
            </span>
            <span className="hidden sm:inline">商家用户</span>
          </button>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
