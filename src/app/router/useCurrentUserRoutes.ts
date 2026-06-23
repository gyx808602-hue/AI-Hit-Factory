import { useQuery } from "@tanstack/react-query";
import { getCurrentUserRoutes } from "../../api/system/menus";
import { buildDynamicRouteState } from "./dynamicRoutes";

export const currentUserRoutesQueryKey = ["current-user-routes"];

export function useCurrentUserRoutes(enabled: boolean) {
  return useQuery({
    queryKey: currentUserRoutesQueryKey,
    queryFn: async () => {
      const routes = await getCurrentUserRoutes();
      return buildDynamicRouteState(routes);
    },
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
