import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { matchRoutes, useLocation, useOutlet } from "react-router-dom";
import type { AppRoute, RouteKey } from "./routeTypes";

type KeepAliveOutletProps = {
  availableRoutes: AppRoute[];
  resetKey?: string;
};

type CacheEvent =
  | {
      kind: "clear-route";
      routeKey: RouteKey;
    }
  | {
      kind: "clear-all";
    };

// 缓存清理做成模块级事件，是为了给后续 tagsView 使用：
// 关闭标签时只需要传 route.key，不需要把清理函数一层层传给页面组件。
const cacheEventListeners = new Set<(event: CacheEvent) => void>();

function emitCacheEvent(event: CacheEvent) {
  cacheEventListeners.forEach((listener) => listener(event));
}

function subscribeCacheEvents(listener: (event: CacheEvent) => void) {
  cacheEventListeners.add(listener);

  return () => {
    cacheEventListeners.delete(listener);
  };
}

function getActiveRuntimeRoute(pathname: string, availableRoutes: AppRoute[]) {
  // 这里必须使用运行时 availableRoutes，而不是直接读静态 routeRegistry。
  // 原因：动态菜单、权限过滤、后端 keepAlive 合并后，最终可访问路由以 availableRoutes 为准。
  const routeMatches = matchRoutes(
    availableRoutes.map((route) => ({
      path: route.path,
      handle: route,
    })),
    pathname,
  );

  return routeMatches?.at(-1)?.route.handle;
}

function createVersionedOutlet(outlet: ReactNode, routeKey: RouteKey, version: number) {
  if (!isValidElement(outlet)) {
    return outlet;
  }

  return cloneElement(outlet, {
    // 清理当前正在展示的缓存页时，仅从 Map 删除还不够，React 仍可能复用旧元素。
    // 通过版本 key 强制重新挂载，才能确保关闭标签后再次进入是一个全新页面实例。
    key: `${routeKey}:${version}`,
  });
}

export function clearKeepAliveRouteCache(routeKey: RouteKey) {
  emitCacheEvent({ kind: "clear-route", routeKey });
}

export function clearAllKeepAliveRouteCaches() {
  emitCacheEvent({ kind: "clear-all" });
}

export function KeepAliveOutlet({ availableRoutes, resetKey }: KeepAliveOutletProps) {
  const outlet = useOutlet();
  const location = useLocation();

  // cacheRef 存的是页面组件实例对应的 React 元素，不是接口数据。
  // 接口数据的新鲜度继续交给 React Query；这里仅保留筛选、分页、滚动等局部 UI 状态。
  const cacheRef = useRef(new Map<RouteKey, ReactNode>());
  const cacheVersionsRef = useRef(new Map<RouteKey, number>());
  const cacheScopeVersionRef = useRef(0);
  const lastResetKeyRef = useRef(resetKey);
  const [, forceUpdate] = useState(0);

  if (lastResetKeyRef.current !== resetKey) {
    // resetKey 代表登录态、账号、权限菜单这类缓存作用域。
    // 作用域变化时必须在写入当前 outlet 前清空，避免旧账号/旧权限页面被重新放回缓存。
    cacheRef.current.clear();
    cacheVersionsRef.current.clear();
    cacheScopeVersionRef.current += 1;
    lastResetKeyRef.current = resetKey;
  }

  const activeRoute = useMemo(
    () => getActiveRuntimeRoute(location.pathname, availableRoutes),
    [availableRoutes, location.pathname],
  );

  const allowedCacheKeys = useMemo(() => {
    // 只有 meta.cache: true 的路由允许进入缓存池。
    // 详情页、新增页、登录页、错误页保持 cache: false，就会按普通路由正常卸载。
    return new Set(
      availableRoutes
        .filter((route) => route.meta.cache)
        .map((route) => route.key),
    );
  }, [availableRoutes]);

  useEffect(() => {
    return subscribeCacheEvents((event) => {
      if (event.kind === "clear-all") {
        cacheRef.current.clear();
        cacheVersionsRef.current.clear();
        forceUpdate((version) => version + 1);
        return;
      }

      cacheRef.current.delete(event.routeKey);
      // 删除指定 route 时提升版本，保证未来 tagsView 关闭后再进入会重新挂载页面。
      cacheVersionsRef.current.set(
        event.routeKey,
        (cacheVersionsRef.current.get(event.routeKey) ?? 0) + 1,
      );
      forceUpdate((version) => version + 1);
    });
  }, []);

  useEffect(() => {
    let removedStaleCache = false;

    // 权限或动态菜单变化后，已经不在 availableRoutes 里的缓存页必须销毁。
    // 这能避免用户已经没有权限，但旧页面还藏在缓存里继续显示。
    cacheRef.current.forEach((_, routeKey) => {
      if (!allowedCacheKeys.has(routeKey)) {
        cacheRef.current.delete(routeKey);
        removedStaleCache = true;
      }
    });

    if (removedStaleCache) {
      forceUpdate((version) => version + 1);
    }
  }, [allowedCacheKeys]);

  const activeRouteKey = activeRoute?.key;
  const shouldCacheActiveRoute = Boolean(activeRouteKey && activeRoute?.meta.cache);

  if (activeRouteKey && shouldCacheActiveRoute && outlet) {
    // 当前路由允许缓存时，把 useOutlet() 返回的页面元素放进缓存池。
    // 下次从别的页面回来时直接展示同一个实例，页面局部状态不会丢。
    cacheRef.current.set(
      activeRouteKey,
      createVersionedOutlet(
        outlet,
        activeRouteKey,
        cacheScopeVersionRef.current + (cacheVersionsRef.current.get(activeRouteKey) ?? 0),
      ),
    );
  }

  return (
    <>
      {[...cacheRef.current.entries()].map(([routeKey, cachedOutlet]) => (
        <div
          key={routeKey}
          data-keep-alive-route-key={routeKey}
          // 非当前缓存页只隐藏不卸载，这就是 React 版页面 keep-alive 的核心。
          style={{ display: routeKey === activeRouteKey ? "block" : "none" }}
        >
          {cachedOutlet}
        </div>
      ))}
      {/* 不允许缓存的路由直接渲染 outlet；离开页面时由 React Router 正常卸载。 */}
      {!shouldCacheActiveRoute ? outlet : null}
    </>
  );
}
