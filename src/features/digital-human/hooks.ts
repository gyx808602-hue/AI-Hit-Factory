import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import {
  createDigitalPerson,
  deleteDigitalPerson,
  getDigitalPersonDetail,
  getDigitalPersonPage,
  refreshDigitalPerson,
} from "../../api/aigc/digital-persons";
import type {
  DigitalPerson,
  DigitalPersonCreateRequest,
  DigitalPersonPageResponse,
  DigitalPersonQuery,
} from "../../api/aigc/digital-persons/types";
import type { Id } from "../../api/shared/types";

export const digitalHumanQueryKeys = {
  all: () => ["digital-humans"] as const,
  lists: () => [...digitalHumanQueryKeys.all(), "list"] as const,
  list: (params?: DigitalPersonQuery) => [...digitalHumanQueryKeys.lists(), params ?? {}] as const,
  details: () => [...digitalHumanQueryKeys.all(), "detail"] as const,
  detail: (id: Id) => [...digitalHumanQueryKeys.details(), String(id)] as const,
};

function mergeDigitalHumanIntoPage(
  page: DigitalPersonPageResponse | undefined,
  nextHuman: DigitalPerson,
): DigitalPersonPageResponse | undefined {
  if (!page) {
    return page;
  }

  let changed = false;
  const nextList = page.list.map((item) => {
    if (String(item.id) !== String(nextHuman.id)) {
      return item;
    }

    changed = true;
    return nextHuman;
  });

  if (!changed) {
    return page;
  }

  return {
    ...page,
    list: nextList,
  };
}

function mergeDigitalHumanIntoListCaches(queryClient: QueryClient, nextHuman: DigitalPerson) {
  const listQueries = queryClient.getQueriesData<DigitalPersonPageResponse>({
    queryKey: digitalHumanQueryKeys.lists(),
  });

  for (const [queryKey, page] of listQueries) {
    const nextPage = mergeDigitalHumanIntoPage(page, nextHuman);

    if (nextPage) {
      queryClient.setQueryData(queryKey, nextPage);
    }
  }
}

export function useDigitalHumanPage(params?: DigitalPersonQuery) {
  return useQuery({
    queryKey: digitalHumanQueryKeys.list(params),
    queryFn: () => getDigitalPersonPage(params),
  });
}

export function useDigitalHumanDetail(id?: Id) {
  return useQuery({
    queryKey: digitalHumanQueryKeys.detail(id ?? ""),
    queryFn: () => getDigitalPersonDetail(id ?? ""),
    enabled: id !== undefined && id !== null && String(id).length > 0,
  });
}

export function useCreateDigitalHumanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DigitalPersonCreateRequest) => createDigitalPerson(payload),
    onSuccess: async (createdHuman) => {
      queryClient.setQueryData(digitalHumanQueryKeys.detail(createdHuman.id), createdHuman);
      await queryClient.invalidateQueries({
        queryKey: digitalHumanQueryKeys.lists(),
      });
    },
  });
}

export function useDeleteDigitalHumanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Id) => {
      await deleteDigitalPerson(id);
      return id;
    },
    onSuccess: async (deletedId) => {
      queryClient.removeQueries({
        queryKey: digitalHumanQueryKeys.detail(deletedId),
      });
      await queryClient.invalidateQueries({
        queryKey: digitalHumanQueryKeys.lists(),
      });
    },
  });
}

export function useRefreshDigitalHumanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Id) => refreshDigitalPerson(id),
    onSuccess: (nextHuman) => {
      queryClient.setQueryData(digitalHumanQueryKeys.detail(nextHuman.id), nextHuman);
      mergeDigitalHumanIntoListCaches(queryClient, nextHuman);
    },
  });
}
