import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DigitalHumanDetailPage } from "./DigitalHumanDetailPage";

const detailMocks = vi.hoisted(() => ({
  useDigitalHumanDetail: vi.fn(),
  useRefreshDigitalHumanMutation: vi.fn(),
  useDeleteDigitalHumanMutation: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../features/digital-human/hooks", () => ({
  useDigitalHumanDetail: detailMocks.useDigitalHumanDetail,
  useRefreshDigitalHumanMutation: detailMocks.useRefreshDigitalHumanMutation,
  useDeleteDigitalHumanMutation: detailMocks.useDeleteDigitalHumanMutation,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => detailMocks.navigate,
  };
});

function renderDetailPage(humanId = "human-1") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/digital-humans/${humanId}`]}>
        <Routes>
          <Route path="/digital-humans/:humanId" element={<DigitalHumanDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DigitalHumanDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    detailMocks.useRefreshDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    detailMocks.useDeleteDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("shows successful digital human detail content", async () => {
    detailMocks.useDigitalHumanDetail.mockReturnValue({
      data: {
        id: "human-1",
        name: "小雅",
        status: 2,
        statusLabel: "训练完成",
        progress: 100,
        previewImageUrl: "https://example.com/cover.png",
        previewVideoUrl: "https://example.com/preview.mp4",
        width: 1080,
        height: 1920,
        support4k: true,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDetailPage();

    expect(await screen.findByRole("heading", { name: "小雅", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("训练完成")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看预览图" })).toHaveAttribute(
      "href",
      "https://example.com/cover.png",
    );
    expect(screen.getByRole("link", { name: "查看预览视频" })).toHaveAttribute(
      "href",
      "https://example.com/preview.mp4",
    );
    expect(screen.getByText(/1080 x 1920/)).toBeInTheDocument();
    expect(screen.getByText(/4K 支持：支持/)).toBeInTheDocument();
  });

  it("shows failure reason for a failed digital human", async () => {
    detailMocks.useDigitalHumanDetail.mockReturnValue({
      data: {
        id: "human-2",
        name: "艾文",
        status: 3,
        statusLabel: "训练失败",
        progress: 42,
        errReason: "训练素材解析失败",
        errorMessage: "文件内容损坏",
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDetailPage("human-2");

    expect(await screen.findByRole("heading", { name: "艾文", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("训练失败")).toBeInTheDocument();
    expect(screen.getByText("训练素材解析失败")).toBeInTheDocument();
    expect(screen.getByText("文件内容损坏")).toBeInTheDocument();
  });

  it("refreshes status and deletes the digital human", async () => {
    const refreshMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    const deleteMutation = {
      mutate: vi.fn(),
      isPending: false,
    };

    detailMocks.useDigitalHumanDetail.mockReturnValue({
      data: {
        id: "human-3",
        name: "Noah",
        status: 1,
        statusLabel: "训练中",
        progress: 55,
      },
      isLoading: false,
      isError: false,
      error: null,
    });
    detailMocks.useRefreshDigitalHumanMutation.mockReturnValue(refreshMutation);
    detailMocks.useDeleteDigitalHumanMutation.mockReturnValue(deleteMutation);

    renderDetailPage("human-3");

    expect(await screen.findByRole("heading", { name: "Noah", level: 1 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刷新状态" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("human-3");

    fireEvent.click(screen.getByRole("button", { name: "删除数字人" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("human-3", expect.any(Object));
  });

  it("shows loading and error states", () => {
    detailMocks.useDigitalHumanDetail
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
        <MemoryRouter initialEntries={["/digital-humans/human-4"]}>
          <Routes>
            <Route path="/digital-humans/:humanId" element={<DigitalHumanDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("数字人详情加载中...")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans/human-4"]}>
          <Routes>
            <Route path="/digital-humans/:humanId" element={<DigitalHumanDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("详情加载失败")).toBeInTheDocument();
  });
});
