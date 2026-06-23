import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextImageVideoTaskDetailPage } from "./TextImageVideoTaskDetailPage";

const detailPageMocks = vi.hoisted(() => ({
  getTextImageVideoTaskDetail: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/customer/text-image-video", () => ({
  getTextImageVideoTaskDetail: detailPageMocks.getTextImageVideoTaskDetail,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => detailPageMocks.navigate,
  };
});

function renderDetailPage(taskId = "101") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/image-video/tasks/${taskId}`]}>
        <Routes>
          <Route path="/image-video/tasks/:taskId" element={<TextImageVideoTaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TextImageVideoTaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows result video information for a completed task", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成一条茶饮种草视频",
      model: "seedance2.0",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
    });

    renderDetailPage();

    expect(await screen.findByText("生成一条茶饮种草视频")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "返回任务列表" })).toBeInTheDocument();
    expect(screen.getAllByText("已完成").length).toBeGreaterThan(0);
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看结果视频" })).toHaveAttribute(
      "href",
      "https://example.com/result.mp4",
    );
  });

  it("navigates back to task list from the header action", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成一条茶饮种草视频",
      model: "seedance2.0",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
    });

    renderDetailPage();

    await screen.findByText("生成一条茶饮种草视频");
    fireEvent.click(screen.getByRole("button", { name: "返回任务列表" }));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });

  it("shows failure context for a failed task", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 102,
      imageUrls: ["https://example.com/a.png"],
      prompt: "失败任务",
      model: "seedance2.0",
      status: 3,
      statusLabel: "生成失败",
      progress: 40,
      errReason: "内容审核未通过",
      syncError: "远端任务同步失败",
    });

    renderDetailPage("102");

    expect(await screen.findByText("失败任务")).toBeInTheDocument();
    expect(screen.getByText("生成失败")).toBeInTheDocument();
    expect(screen.getByText("内容审核未通过")).toBeInTheDocument();
    expect(screen.getByText("远端任务同步失败")).toBeInTheDocument();
  });

  it("passes silent error config for detail query to avoid duplicate global toast", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成一条茶饮种草视频",
      model: "seedance2.0",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
    });

    renderDetailPage();

    await screen.findByText("生成一条茶饮种草视频");

    expect(detailPageMocks.getTextImageVideoTaskDetail).toHaveBeenCalledWith("101", {
      silentError: true,
    });
  });
});
