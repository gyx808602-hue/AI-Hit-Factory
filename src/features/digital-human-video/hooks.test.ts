import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  DigitalPersonVideo,
  DigitalPersonVideoCreateRequest,
  DigitalPersonVideoPageData,
  DigitalPersonVideoQuery,
} from "../../api/aigc/digital-person-videos/types";
import {
  digitalHumanVideoQueryKeys,
  useCreateDigitalHumanVideoMutation,
  useDeleteDigitalHumanVideoMutation,
  useDigitalHumanVideoDetail,
  useDigitalHumanVideoPage,
  useRefreshDigitalHumanVideoMutation,
} from "./hooks";

const apiMocks = vi.hoisted(() => ({
  getDigitalPersonVideoPage: vi.fn(),
  getDigitalPersonVideoDetail: vi.fn(),
  createDigitalPersonVideo: vi.fn(),
  deleteDigitalPersonVideo: vi.fn(),
  refreshDigitalPersonVideo: vi.fn(),
}));

vi.mock("../../api/aigc/digital-person-videos", () => ({
  getDigitalPersonVideoPage: apiMocks.getDigitalPersonVideoPage,
  getDigitalPersonVideoDetail: apiMocks.getDigitalPersonVideoDetail,
  createDigitalPersonVideo: apiMocks.createDigitalPersonVideo,
  deleteDigitalPersonVideo: apiMocks.deleteDigitalPersonVideo,
  refreshDigitalPersonVideo: apiMocks.refreshDigitalPersonVideo,
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("digital human video hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests task page with caller params", async () => {
    const page: DigitalPersonVideoPageData = {
      list: [{ id: "video-1", personId: "person-1", name: "任务1", status: 1 }],
      total: 1,
      pageNum: 2,
      pageSize: 20,
      pages: 1,
    };
    const params: DigitalPersonVideoQuery = {
      pageNum: 2,
      pageSize: 20,
      keyword: "任务",
      status: 1,
    };

    apiMocks.getDigitalPersonVideoPage.mockResolvedValue(page);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const { result } = renderHook(() => useDigitalHumanVideoPage(params), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.getDigitalPersonVideoPage).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(page);
  });

  it("loads task detail by id", async () => {
    const detail: DigitalPersonVideo = {
      id: "video-2",
      personId: "person-2",
      name: "详情任务",
      status: 2,
      progress: 100,
    };

    apiMocks.getDigitalPersonVideoDetail.mockResolvedValue(detail);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const { result } = renderHook(() => useDigitalHumanVideoDetail("video-2"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.getDigitalPersonVideoDetail).toHaveBeenCalledWith("video-2");
    expect(result.current.data).toEqual(detail);
  });

  it("creates a task and seeds detail cache", async () => {
    const created: DigitalPersonVideo = {
      id: "video-3",
      personId: "person-3",
      name: "新任务",
      status: 1,
      progress: 0,
    };
    const payload: DigitalPersonVideoCreateRequest = {
      name: "新任务",
      personId: "person-3",
      type: "tts",
      text: "欢迎来到直播间",
      bgColor: "#EDEDED",
      screenWidth: 1080,
      screenHeight: 1920,
      x: 108,
      y: 720,
      personWidth: 800,
      personHeight: 600,
      rgbaMode: false,
      speed: 1,
      pitch: 1,
      volume: 100,
      language: "cn",
      model: 1,
      addComplianceWatermark: false,
      resolutionRate: 0,
    };

    apiMocks.createDigitalPersonVideo.mockResolvedValue(created);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateDigitalHumanVideoMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.createDigitalPersonVideo).toHaveBeenCalledWith(payload);
    expect(queryClient.getQueryData(digitalHumanVideoQueryKeys.detail(created.id))).toEqual(created);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: digitalHumanVideoQueryKeys.lists(),
    });
  });

  it("deletes a task and clears detail cache", async () => {
    apiMocks.deleteDigitalPersonVideo.mockResolvedValue(undefined);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(digitalHumanVideoQueryKeys.detail("video-4"), {
      id: "video-4",
      personId: "person-4",
      name: "待删任务",
      status: 3,
    } satisfies DigitalPersonVideo);

    const { result } = renderHook(() => useDeleteDigitalHumanVideoMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("video-4");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.deleteDigitalPersonVideo).toHaveBeenCalledWith("video-4");
    expect(queryClient.getQueryData(digitalHumanVideoQueryKeys.detail("video-4"))).toBeUndefined();
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: digitalHumanVideoQueryKeys.lists(),
    });
  });

  it("refreshes a task and updates both detail and list cache", async () => {
    const refreshed: DigitalPersonVideo = {
      id: "video-5",
      personId: "person-5",
      name: "刷新任务",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      videoUrl: "https://oss.example.com/video-5.mp4",
    };

    apiMocks.refreshDigitalPersonVideo.mockResolvedValue(refreshed);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    queryClient.setQueryData(digitalHumanVideoQueryKeys.list({ pageNum: 1, pageSize: 10 }), {
      list: [
        {
          id: "video-5",
          personId: "person-5",
          name: "刷新任务",
          status: 1,
          progress: 40,
        },
      ],
      total: 1,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
    } satisfies DigitalPersonVideoPageData);

    const { result } = renderHook(() => useRefreshDigitalHumanVideoMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate("video-5");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(apiMocks.refreshDigitalPersonVideo).toHaveBeenCalledWith("video-5");
    expect(queryClient.getQueryData(digitalHumanVideoQueryKeys.detail("video-5"))).toEqual(refreshed);
    expect(
      queryClient.getQueryData<DigitalPersonVideoPageData>(
        digitalHumanVideoQueryKeys.list({ pageNum: 1, pageSize: 10 }),
      )?.list[0],
    ).toEqual(refreshed);
  });
});
