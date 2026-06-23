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

  it("shows image and video previews with download entries for a completed task", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/reference-a.png"],
      prompt: "Generate product trailer",
      model: "seedance2.0",
      status: 2,
      statusLabel: "done",
      progress: 100,
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
    });

    renderDetailPage();

    expect(await screen.findByRole("heading", { name: "Generate product trailer", level: 2 })).toBeInTheDocument();
    expect(screen.getAllByTestId("text-image-video-reference-preview")).toHaveLength(1);
    expect(screen.getByTestId("text-image-video-cover-preview")).toHaveAttribute(
      "src",
      "https://example.com/cover.png",
    );
    expect(screen.getByTestId("text-image-video-result-video-preview")).toHaveAttribute(
      "src",
      "https://example.com/result.mp4",
    );
    expect(screen.getByTestId("text-image-video-cover-download")).toHaveAttribute(
      "href",
      "https://example.com/cover.png",
    );
    expect(screen.getByTestId("text-image-video-video-download")).toHaveAttribute(
      "href",
      "https://example.com/result.mp4",
    );
  });

  it("navigates back to task list from the header action", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: [],
      prompt: "Generate product trailer",
      model: "seedance2.0",
      status: 2,
      statusLabel: "done",
      progress: 100,
    });

    renderDetailPage();

    await screen.findByRole("heading", { name: "Generate product trailer", level: 2 });
    fireEvent.click(screen.getByTestId("text-image-video-back-button"));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });

  it("shows failure context for a failed task", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 102,
      imageUrls: ["https://example.com/reference-a.png"],
      prompt: "Failed task",
      model: "seedance2.0",
      status: 3,
      statusLabel: "failed",
      progress: 40,
      errReason: "moderation rejected",
      syncError: "upstream sync failed",
    });

    renderDetailPage("102");

    expect(await screen.findByRole("heading", { name: "Failed task", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("moderation rejected")).toBeInTheDocument();
    expect(screen.getByText("upstream sync failed")).toBeInTheDocument();
  });

  it("passes silent error config for detail query to avoid duplicate global toast", async () => {
    detailPageMocks.getTextImageVideoTaskDetail.mockResolvedValue({
      id: 101,
      imageUrls: [],
      prompt: "Generate product trailer",
      model: "seedance2.0",
      status: 2,
      statusLabel: "done",
      progress: 100,
    });

    renderDetailPage();

    await screen.findByRole("heading", { name: "Generate product trailer", level: 2 });

    expect(detailPageMocks.getTextImageVideoTaskDetail).toHaveBeenCalledWith("101", {
      silentError: true,
    });
  });
});
