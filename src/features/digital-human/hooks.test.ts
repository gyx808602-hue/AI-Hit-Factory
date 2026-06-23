import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type {
  DigitalPerson,
  DigitalPersonCreateRequest,
  DigitalPersonPageResponse,
  DigitalPersonQuery,
} from "../../api/aigc/digital-persons/types";
import {
  digitalHumanQueryKeys,
  useCreateDigitalHumanMutation,
  useDeleteDigitalHumanMutation,
  useDigitalHumanDetail,
  useDigitalHumanPage,
  useRefreshDigitalHumanMutation,
} from "./hooks";

const apiMocks = vi.hoisted(() => ({
  getDigitalPersonPage: vi.fn(),
  getDigitalPersonDetail: vi.fn(),
  createDigitalPerson: vi.fn(),
  deleteDigitalPerson: vi.fn(),
  refreshDigitalPerson: vi.fn(),
}));

vi.mock("../../api/aigc/digital-persons", () => ({
  getDigitalPersonPage: apiMocks.getDigitalPersonPage,
  getDigitalPersonDetail: apiMocks.getDigitalPersonDetail,
  createDigitalPerson: apiMocks.createDigitalPerson,
  deleteDigitalPerson: apiMocks.deleteDigitalPerson,
  refreshDigitalPerson: apiMocks.refreshDigitalPerson,
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("digital human hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests digital human page with the caller params", async () => {
    const page: DigitalPersonPageResponse = {
      list: [{ id: "human-1", name: "Ava", status: 1 }],
      total: 1,
      pageNum: 2,
      pageSize: 20,
      pages: 1,
    };
    const params: DigitalPersonQuery = {
      pageNum: 2,
      pageSize: 20,
      keyword: "Ava",
      status: 1,
    };

    apiMocks.getDigitalPersonPage.mockResolvedValue(page);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const { result } = renderHook(() => useDigitalHumanPage(params), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.getDigitalPersonPage).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(page);
  });

  it("loads digital human detail by id", async () => {
    const detail: DigitalPerson = {
      id: "human-2",
      name: "Noah",
      status: 2,
      progress: 100,
    };

    apiMocks.getDigitalPersonDetail.mockResolvedValue(detail);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const { result } = renderHook(() => useDigitalHumanDetail("human-2"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.getDigitalPersonDetail).toHaveBeenCalledWith("human-2");
    expect(result.current.data).toEqual(detail);
  });

  it("creates a digital human and seeds the detail cache", async () => {
    const created: DigitalPerson = {
      id: "human-3",
      name: "Mia",
      status: 0,
      progress: 0,
    };
    const payload: DigitalPersonCreateRequest = {
      name: "Mia",
      trainType: "both",
      language: "cn",
      errorSkip: false,
      fileUrl: "https://example.com/train.mp4",
    };

    apiMocks.createDigitalPerson.mockResolvedValue(created);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateDigitalHumanMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.createDigitalPerson).toHaveBeenCalledWith(payload);
    expect(queryClient.getQueryData(digitalHumanQueryKeys.detail(created.id))).toEqual(created);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: digitalHumanQueryKeys.lists(),
    });
  });

  it("deletes a digital human and clears the detail cache", async () => {
    apiMocks.deleteDigitalPerson.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(digitalHumanQueryKeys.detail("human-4"), {
      id: "human-4",
      name: "Liam",
      status: 3,
    } satisfies DigitalPerson);

    const { result } = renderHook(() => useDeleteDigitalHumanMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("human-4");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.deleteDigitalPerson).toHaveBeenCalledWith("human-4");
    expect(queryClient.getQueryData(digitalHumanQueryKeys.detail("human-4"))).toBeUndefined();
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: digitalHumanQueryKeys.lists(),
    });
  });

  it("refreshes a digital human and updates both detail and list cache", async () => {
    const refreshed: DigitalPerson = {
      id: "human-5",
      name: "Ethan",
      status: 2,
      statusLabel: "训练完成",
      progress: 100,
      previewVideoUrl: "https://example.com/preview.mp4",
    };

    apiMocks.refreshDigitalPerson.mockResolvedValue(refreshed);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    queryClient.setQueryData(digitalHumanQueryKeys.list({ pageNum: 1, pageSize: 10 }), {
      list: [
        {
          id: "human-5",
          name: "Ethan",
          status: 1,
          progress: 56,
        },
      ],
      total: 1,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
    } satisfies DigitalPersonPageResponse);

    const { result } = renderHook(() => useRefreshDigitalHumanMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("human-5");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.refreshDigitalPerson).toHaveBeenCalledWith("human-5");
    expect(queryClient.getQueryData(digitalHumanQueryKeys.detail("human-5"))).toEqual(refreshed);
    expect(
      queryClient.getQueryData<DigitalPersonPageResponse>(
        digitalHumanQueryKeys.list({ pageNum: 1, pageSize: 10 }),
      )?.list[0],
    ).toEqual(refreshed);
  });
});
