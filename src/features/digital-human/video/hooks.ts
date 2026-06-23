import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createDigitalPersonVideo,
  deleteDigitalPersonVideo,
  getDigitalPersonVideoDetail,
  getDigitalPersonVideoPage,
  refreshDigitalPersonVideo,
} from "../../../api/aigc/digital-person-videos";
import type {
  DigitalPersonVideo,
  DigitalPersonVideoCreateRequest,
  DigitalPersonVideoPageData,
  DigitalPersonVideoQuery,
} from "../../../api/aigc/digital-person-videos/types";
import type { Id } from "../../../api/shared/types";

export const digitalHumanVideoQueryKeys = {
  all: () => ["digital-human-videos"] as const,
  lists: () => [...digitalHumanVideoQueryKeys.all(), "list"] as const,
  list: (params?: DigitalPersonVideoQuery) => [...digitalHumanVideoQueryKeys.lists(), params ?? {}] as const,
  details: () => [...digitalHumanVideoQueryKeys.all(), "detail"] as const,
  detail: (id: Id) => [...digitalHumanVideoQueryKeys.details(), String(id)] as const,
};

function mergeIntoPage(
  page: DigitalPersonVideoPageData | undefined,
  nextTask: DigitalPersonVideo,
): DigitalPersonVideoPageData | undefined {
  if (!page) {
    return page;
  }

  let changed = false;
  const nextList = page.list.map((item) => {
    if (String(item.id) !== String(nextTask.id)) {
      return item;
    }

    changed = true;
    return nextTask;
  });

  if (!changed) {
    return page;
  }

  return {
    ...page,
    list: nextList,
  };
}

function mergeIntoListCaches(queryClient: QueryClient, nextTask: DigitalPersonVideo) {
  const listQueries = queryClient.getQueriesData<DigitalPersonVideoPageData>({
    queryKey: digitalHumanVideoQueryKeys.lists(),
  });

  for (const [queryKey, page] of listQueries) {
    const nextPage = mergeIntoPage(page, nextTask);
    if (nextPage) {
      queryClient.setQueryData(queryKey, nextPage);
    }
  }
}

export function useDigitalHumanVideoPage(params?: DigitalPersonVideoQuery) {
  return useQuery({
    queryKey: digitalHumanVideoQueryKeys.list(params),
    queryFn: () => getDigitalPersonVideoPage(params),
  });
}

export function useDigitalHumanVideoDetail(id?: Id) {
  return useQuery({
    queryKey: digitalHumanVideoQueryKeys.detail(id ?? ""),
    queryFn: () => getDigitalPersonVideoDetail(id ?? ""),
    enabled: id !== undefined && id !== null && String(id).length > 0,
  });
}

export function useCreateDigitalHumanVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DigitalPersonVideoCreateRequest) => createDigitalPersonVideo(payload),
    onSuccess: async (createdTask) => {
      queryClient.setQueryData(digitalHumanVideoQueryKeys.detail(createdTask.id), createdTask);
      await queryClient.invalidateQueries({
        queryKey: digitalHumanVideoQueryKeys.lists(),
      });
    },
  });
}

export function useDeleteDigitalHumanVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Id) => {
      await deleteDigitalPersonVideo(id);
      return id;
    },
    onSuccess: async (deletedId) => {
      queryClient.removeQueries({
        queryKey: digitalHumanVideoQueryKeys.detail(deletedId),
      });
      await queryClient.invalidateQueries({
        queryKey: digitalHumanVideoQueryKeys.lists(),
      });
    },
  });
}

export function useRefreshDigitalHumanVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id) => refreshDigitalPersonVideo(id),
    onSuccess: (nextTask) => {
      queryClient.setQueryData(digitalHumanVideoQueryKeys.detail(nextTask.id), nextTask);
      mergeIntoListCaches(queryClient, nextTask);
    },
  });
}
