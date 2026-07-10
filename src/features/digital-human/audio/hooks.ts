import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createCustomisedAudio,
  deleteCustomisedAudio,
  getCustomisedAudioDetail,
  getCustomisedAudioPage,
  refreshCustomisedAudio,
} from "../../../api/aigc/customised-audios";
import type {
  CustomisedAudio,
  CustomisedAudioCreateRequest,
  CustomisedAudioPageData,
  CustomisedAudioQuery,
} from "../../../api/aigc/customised-audios/types";
import type { Id } from "../../../api/shared/types";
import { useGuardedMutation } from "../../../shared/hooks/useGuardedMutation";

export const customisedAudioQueryKeys = {
  all: () => ["customised-audios"] as const,
  lists: () => [...customisedAudioQueryKeys.all(), "list"] as const,
  list: (params?: CustomisedAudioQuery) => [...customisedAudioQueryKeys.lists(), params ?? {}] as const,
  details: () => [...customisedAudioQueryKeys.all(), "detail"] as const,
  detail: (id: Id) => [...customisedAudioQueryKeys.details(), String(id)] as const,
};

function mergeCustomisedAudioIntoPage(
  page: CustomisedAudioPageData | undefined,
  nextAudio: CustomisedAudio,
): CustomisedAudioPageData | undefined {
  if (!page) {
    return page;
  }

  let changed = false;
  const nextList = page.list.map((item) => {
    if (String(item.id) !== String(nextAudio.id)) {
      return item;
    }

    changed = true;
    return nextAudio;
  });

  if (!changed) {
    return page;
  }

  return {
    ...page,
    list: nextList,
  };
}

// 统一把刷新后的最新音色写回所有列表缓存，避免列表页和详情页状态不一致。
function mergeCustomisedAudioIntoListCaches(queryClient: QueryClient, nextAudio: CustomisedAudio) {
  const listQueries = queryClient.getQueriesData<CustomisedAudioPageData>({
    queryKey: customisedAudioQueryKeys.lists(),
  });

  for (const [queryKey, page] of listQueries) {
    const nextPage = mergeCustomisedAudioIntoPage(page, nextAudio);

    if (nextPage) {
      queryClient.setQueryData(queryKey, nextPage);
    }
  }
}

export function useCustomisedAudioPage(params?: CustomisedAudioQuery) {
  return useQuery({
    queryKey: customisedAudioQueryKeys.list(params),
    queryFn: () => getCustomisedAudioPage(params),
  });
}

export function useCustomisedAudioDetail(id?: Id) {
  return useQuery({
    queryKey: customisedAudioQueryKeys.detail(id ?? ""),
    queryFn: () => getCustomisedAudioDetail(id ?? ""),
    enabled: id !== undefined && id !== null && String(id).length > 0,
  });
}

export function useCreateCustomisedAudioMutation() {
  const queryClient = useQueryClient();

  return useGuardedMutation(useMutation({
    mutationFn: (payload: CustomisedAudioCreateRequest) => createCustomisedAudio(payload),
    onSuccess: async (createdAudio) => {
      queryClient.setQueryData(customisedAudioQueryKeys.detail(createdAudio.id), createdAudio);
      await queryClient.invalidateQueries({
        queryKey: customisedAudioQueryKeys.lists(),
      });
    },
  }));
}

export function useDeleteCustomisedAudioMutation() {
  const queryClient = useQueryClient();

  return useGuardedMutation(useMutation({
    mutationFn: async (id: Id) => {
      await deleteCustomisedAudio(id);
      return id;
    },
    onSuccess: async (deletedId) => {
      queryClient.removeQueries({
        queryKey: customisedAudioQueryKeys.detail(deletedId),
      });
      await queryClient.invalidateQueries({
        queryKey: customisedAudioQueryKeys.lists(),
      });
    },
  }));
}

export function useRefreshCustomisedAudioMutation() {
  const queryClient = useQueryClient();

  return useGuardedMutation(useMutation({
    mutationFn: (id: Id) => refreshCustomisedAudio(id),
    onSuccess: (nextAudio) => {
      queryClient.setQueryData(customisedAudioQueryKeys.detail(nextAudio.id), nextAudio);
      mergeCustomisedAudioIntoListCaches(queryClient, nextAudio);
    },
  }));
}
