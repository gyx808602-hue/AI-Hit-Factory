import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DigitalHumanVideoTaskDetailPage } from "./DigitalHumanVideoTaskDetailPage";

const detailMocks = vi.hoisted(() => ({
  useDigitalHumanVideoDetail: vi.fn(),
  useRefreshDigitalHumanVideoMutation: vi.fn(),
  useDeleteDigitalHumanVideoMutation: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../features/digital-human/video/hooks", () => ({
  useDigitalHumanVideoDetail: detailMocks.useDigitalHumanVideoDetail,
  useRefreshDigitalHumanVideoMutation: detailMocks.useRefreshDigitalHumanVideoMutation,
  useDeleteDigitalHumanVideoMutation: detailMocks.useDeleteDigitalHumanVideoMutation,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => detailMocks.navigate,
  };
});

function renderDetailPage(taskId = "video-1") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/digital-humans/videos/${taskId}`]}>
        <Routes>
          <Route path="/digital-humans/videos/:taskId" element={<DigitalHumanVideoTaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DigitalHumanVideoTaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    detailMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    detailMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("shows successful task detail content", async () => {
    detailMocks.useDigitalHumanVideoDetail.mockReturnValue({
      data: {
        id: "video-1",
        personId: "person-1",
        name: "数字人讲解视频",
        status: 2,
        statusLabel: "已完成",
        progress: 100,
        coverUrl: "https://example.com/cover.png",
        videoUrl: "https://example.com/video.mp4",
        subtitleUrl: "https://example.com/subtitle.srt",
        duration: 18,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDetailPage();

    expect(await screen.findByRole("heading", { name: "数字人讲解视频", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText("已完成").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "查看结果视频" })).toHaveAttribute(
      "href",
      "https://example.com/video.mp4",
    );
    expect(screen.getByRole("link", { name: "查看字幕文件" })).toHaveAttribute(
      "href",
      "https://example.com/subtitle.srt",
    );
    expect(screen.getByText(/18/)).toBeInTheDocument();
  });

  it("shows failure reason for a failed task", async () => {
    detailMocks.useDigitalHumanVideoDetail.mockReturnValue({
      data: {
        id: "video-2",
        personId: "person-2",
        name: "失败视频",
        status: 4,
        statusLabel: "生成失败",
        progress: 50,
        errReason: "音频解析失败",
        errorMessage: "远端厂商返回异常",
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDetailPage("video-2");

    expect(await screen.findByRole("heading", { name: "失败视频", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("生成失败")).toBeInTheDocument();
    expect(screen.getByText("音频解析失败")).toBeInTheDocument();
    expect(screen.getByText("远端厂商返回异常")).toBeInTheDocument();
  });

  it("refreshes and deletes the current task", async () => {
    const refreshMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    const deleteMutation = {
      mutate: vi.fn(),
      isPending: false,
    };

    detailMocks.useDigitalHumanVideoDetail.mockReturnValue({
      data: {
        id: "video-3",
        personId: "person-3",
        name: "处理中视频",
        status: 1,
        statusLabel: "生成中",
        progress: 60,
      },
      isLoading: false,
      isError: false,
      error: null,
    });
    detailMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue(refreshMutation);
    detailMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue(deleteMutation);

    renderDetailPage("video-3");

    expect(await screen.findByRole("heading", { name: "处理中视频", level: 1 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刷新状态" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("video-3");

    fireEvent.click(screen.getByRole("button", { name: "删除任务" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("video-3", expect.any(Object));
  });

  it("shows loading and error states", () => {
    detailMocks.useDigitalHumanVideoDetail
      .mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("详情加载失败"),
      });

    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans/videos/video-4"]}>
          <Routes>
            <Route path="/digital-humans/videos/:taskId" element={<DigitalHumanVideoTaskDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("数字人视频详情加载中...")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans/videos/video-4"]}>
          <Routes>
            <Route path="/digital-humans/videos/:taskId" element={<DigitalHumanVideoTaskDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("详情加载失败")).toBeInTheDocument();
  });
});
