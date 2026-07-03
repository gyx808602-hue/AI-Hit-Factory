import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CustomisedAudio,
  CustomisedAudioCreateRequest,
  CustomisedAudioPageData,
  CustomisedAudioQuery,
} from "../../../api/aigc/customised-audios/types";
import {
  customisedAudioQueryKeys,
  useCreateCustomisedAudioMutation,
  useCustomisedAudioDetail,
  useDeleteCustomisedAudioMutation,
  useCustomisedAudioPage,
  useRefreshCustomisedAudioMutation,
} from "./hooks";

const audioApiMocks = vi.hoisted(() => ({
  createCustomisedAudio: vi.fn(),
  deleteCustomisedAudio: vi.fn(),
  getCustomisedAudioDetail: vi.fn(),
  getCustomisedAudioPage: vi.fn(),
  refreshCustomisedAudio: vi.fn(),
}));

vi.mock("../../../api/aigc/customised-audios", () => ({
  createCustomisedAudio: audioApiMocks.createCustomisedAudio,
  deleteCustomisedAudio: audioApiMocks.deleteCustomisedAudio,
  getCustomisedAudioDetail: audioApiMocks.getCustomisedAudioDetail,
  getCustomisedAudioPage: audioApiMocks.getCustomisedAudioPage,
  refreshCustomisedAudio: audioApiMocks.refreshCustomisedAudio,
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("customised audio hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests audio page with caller params", async () => {
    const page: CustomisedAudioPageData = {
      list: [
        {
          id: "audio-1",
          name: "客服女声",
          status: 2,
          statusLabel: "已完成",
          progress: 100,
        } satisfies CustomisedAudio,
      ],
      total: 1,
      pageNum: 1,
      pageSize: 100,
      pages: 1,
    };
    const params: CustomisedAudioQuery = {
      pageNum: 1,
      pageSize: 100,
      keyword: "客服",
      status: 2,
    };

    audioApiMocks.getCustomisedAudioPage.mockResolvedValue(page);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const { result } = renderHook(() => useCustomisedAudioPage(params), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(audioApiMocks.getCustomisedAudioPage).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(page);
    expect(customisedAudioQueryKeys.list(params)).toEqual([
      "customised-audios",
      "list",
      params,
    ]);
  });

  it("loads customised audio detail by id", async () => {
    const detail: CustomisedAudio = {
      id: "audio-2",
      name: "品牌女声",
      status: 2,
      progress: 100,
      audioPath: "https://example.com/audio-2.wav",
    };

    audioApiMocks.getCustomisedAudioDetail.mockResolvedValue(detail);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const { result } = renderHook(() => useCustomisedAudioDetail("audio-2"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(audioApiMocks.getCustomisedAudioDetail).toHaveBeenCalledWith("audio-2");
    expect(result.current.data).toEqual(detail);
  });

  it("creates a customised audio and seeds the detail cache", async () => {
    const created: CustomisedAudio = {
      id: "audio-3",
      name: "新品讲解音色",
      status: 0,
      progress: 0,
      url: "https://example.com/source.wav",
    };
    const payload: CustomisedAudioCreateRequest = {
      name: "新品讲解音色",
      url: "https://example.com/source.wav",
      modelType: "tts",
      language: "cn",
      text: "欢迎来到直播间",
    };

    audioApiMocks.createCustomisedAudio.mockResolvedValue(created);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCustomisedAudioMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(audioApiMocks.createCustomisedAudio).toHaveBeenCalledWith(payload);
    expect(queryClient.getQueryData(customisedAudioQueryKeys.detail(created.id))).toEqual(created);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: customisedAudioQueryKeys.lists(),
    });
  });

  it("deletes a customised audio and clears the detail cache", async () => {
    audioApiMocks.deleteCustomisedAudio.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(customisedAudioQueryKeys.detail("audio-4"), {
      id: "audio-4",
      name: "客服男声",
      status: 3,
    } satisfies CustomisedAudio);

    const { result } = renderHook(() => useDeleteCustomisedAudioMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("audio-4");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(audioApiMocks.deleteCustomisedAudio).toHaveBeenCalledWith("audio-4");
    expect(queryClient.getQueryData(customisedAudioQueryKeys.detail("audio-4"))).toBeUndefined();
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: customisedAudioQueryKeys.lists(),
    });
  });

  it("refreshes a customised audio and updates both detail and list cache", async () => {
    const refreshed: CustomisedAudio = {
      id: "audio-5",
      name: "商品介绍音色",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      audioPath: "https://example.com/audio-5.wav",
    };

    audioApiMocks.refreshCustomisedAudio.mockResolvedValue(refreshed);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    queryClient.setQueryData(customisedAudioQueryKeys.list({ pageNum: 1, pageSize: 10 }), {
      list: [
        {
          id: "audio-5",
          name: "商品介绍音色",
          status: 1,
          progress: 52,
        },
      ],
      total: 1,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
    } satisfies CustomisedAudioPageData);

    const { result } = renderHook(() => useRefreshCustomisedAudioMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("audio-5");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(audioApiMocks.refreshCustomisedAudio).toHaveBeenCalledWith("audio-5");
    expect(queryClient.getQueryData(customisedAudioQueryKeys.detail("audio-5"))).toEqual(refreshed);
    expect(
      queryClient.getQueryData<CustomisedAudioPageData>(
        customisedAudioQueryKeys.list({ pageNum: 1, pageSize: 10 }),
      )?.list[0],
    ).toEqual(refreshed);
  });
});
