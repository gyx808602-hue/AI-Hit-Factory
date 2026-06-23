import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CustomisedAudio,
  CustomisedAudioPageData,
  CustomisedAudioQuery,
} from "../../../api/aigc/customised-audios/types";
import {
  customisedAudioQueryKeys,
  useCustomisedAudioPage,
} from "./hooks";

const audioApiMocks = vi.hoisted(() => ({
  getCustomisedAudioPage: vi.fn(),
}));

vi.mock("../../../api/aigc/customised-audios", () => ({
  getCustomisedAudioPage: audioApiMocks.getCustomisedAudioPage,
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
});
