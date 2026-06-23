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

  it("shows media previews and download entries for a completed task", async () => {
    detailMocks.useDigitalHumanVideoDetail.mockReturnValue({
      data: {
        id: "video-1",
        personId: "person-1",
        name: "Digital human intro",
        status: 2,
        statusLabel: "done",
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

    expect(await screen.findByRole("heading", { name: "Digital human intro", level: 2 })).toBeInTheDocument();
    expect(screen.getByTestId("digital-human-cover-preview")).toHaveAttribute("src", "https://example.com/cover.png");
    expect(screen.getByTestId("digital-human-video-preview")).toHaveAttribute("src", "https://example.com/video.mp4");
    expect(screen.getByTestId("digital-human-cover-download")).toHaveAttribute(
      "href",
      "https://example.com/cover.png",
    );
    expect(screen.getByTestId("digital-human-video-download")).toHaveAttribute(
      "href",
      "https://example.com/video.mp4",
    );
    expect(screen.getByTestId("digital-human-subtitle-download")).toHaveAttribute(
      "href",
      "https://example.com/subtitle.srt",
    );
  });

  it("shows failure reason for a failed task", async () => {
    detailMocks.useDigitalHumanVideoDetail.mockReturnValue({
      data: {
        id: "video-2",
        personId: "person-2",
        name: "Failed digital human video",
        status: 4,
        statusLabel: "failed",
        progress: 50,
        errReason: "audio parse failed",
        errorMessage: "vendor response error",
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDetailPage("video-2");

    expect(await screen.findByRole("heading", { name: "Failed digital human video", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("audio parse failed")).toBeInTheDocument();
    expect(screen.getByText("vendor response error")).toBeInTheDocument();
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
        name: "Processing task",
        status: 1,
        statusLabel: "processing",
        progress: 60,
      },
      isLoading: false,
      isError: false,
      error: null,
    });
    detailMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue(refreshMutation);
    detailMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue(deleteMutation);

    renderDetailPage("video-3");

    expect(await screen.findByRole("heading", { name: "Processing task", level: 2 })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("digital-human-refresh-button"));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("video-3");

    fireEvent.click(screen.getByTestId("digital-human-delete-button"));
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
        error: new Error("detail load failed"),
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

    expect(screen.getByText("detail load failed")).toBeInTheDocument();
  });
});
