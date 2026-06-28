import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextImageVideoTaskDetailPage } from "./TextImageVideoTaskDetailPage";

const detailPageMocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  getTextImageVideoTaskDetail: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: detailPageMocks.useQuery,
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

function createUseQueryResult(overrides?: Record<string, unknown>) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

function renderDetailPage(taskId = "101") {
  return render(
    <MemoryRouter initialEntries={[`/image-video/tasks/${taskId}`]}>
      <Routes>
        <Route path="/image-video/tasks/:taskId" element={<TextImageVideoTaskDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TextImageVideoTaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    detailPageMocks.useQuery.mockReturnValue(createUseQueryResult({ isLoading: true }));
  });

  it("shows image and video previews with download entries for a completed task", async () => {
    detailPageMocks.useQuery.mockReturnValue(
      createUseQueryResult({
        data: {
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
        },
      }),
    );

    renderDetailPage();

    expect(screen.getByRole("heading", { name: "Generate product trailer", level: 2 })).toBeInTheDocument();
    expect(screen.getAllByTestId("text-image-video-reference-preview")).toHaveLength(1);
    expect(screen.getByTestId("text-image-video-cover-preview")).toHaveAttribute(
      "src",
      "https://example.com/cover.png",
    );
    expect(screen.getByTestId("text-image-video-result-video-preview")).toHaveAttribute(
      "src",
      "https://example.com/result.mp4",
    );
  });

  it("navigates back to task list from the header action", async () => {
    detailPageMocks.useQuery.mockReturnValue(
      createUseQueryResult({
        data: {
          id: 101,
          imageUrls: [],
          prompt: "Generate product trailer",
          model: "seedance2.0",
          status: 2,
          statusLabel: "done",
          progress: 100,
        },
      }),
    );

    renderDetailPage();

    fireEvent.click(screen.getByTestId("text-image-video-back-button"));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });

  it("shows failure context for a failed task", async () => {
    detailPageMocks.useQuery.mockReturnValue(
      createUseQueryResult({
        data: {
          id: 102,
          imageUrls: ["https://example.com/reference-a.png"],
          prompt: "Failed task",
          model: "seedance2.0",
          status: 3,
          statusLabel: "failed",
          progress: 40,
          errReason: "moderation rejected",
          syncError: "upstream sync failed",
        },
      }),
    );

    renderDetailPage("102");

    expect(screen.getByRole("heading", { name: "Failed task", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("moderation rejected")).toBeInTheDocument();
    expect(screen.getByText("upstream sync failed")).toBeInTheDocument();
  });

  it("passes silent error config for detail query to avoid duplicate global toast", async () => {
    detailPageMocks.useQuery.mockReturnValue(
      createUseQueryResult({
        data: {
          id: 101,
          imageUrls: [],
          prompt: "Generate product trailer",
          model: "seedance2.0",
          status: 2,
          statusLabel: "done",
          progress: 100,
        },
      }),
    );

    renderDetailPage();

    const queryOptions = detailPageMocks.useQuery.mock.calls[0]?.[0];
    expect(queryOptions.queryFn).toBeTypeOf("function");
    await queryOptions.queryFn();

    expect(detailPageMocks.getTextImageVideoTaskDetail).toHaveBeenCalledWith("101", {
      silentError: true,
    });
  });

  it("polls detail while the task is still processing", () => {
    renderDetailPage();

    const queryOptions = detailPageMocks.useQuery.mock.calls[0]?.[0];
    const interval = queryOptions.refetchInterval({
      state: {
        data: {
          id: 101,
          imageUrls: [],
          prompt: "Processing task",
          model: "seedance2.0",
          status: 1,
          statusLabel: "processing",
          progress: 42,
        },
      },
    });

    expect(interval).toBe(5000);
  });

  it("does not poll detail again once the task is finished", () => {
    renderDetailPage();

    const queryOptions = detailPageMocks.useQuery.mock.calls[0]?.[0];
    const interval = queryOptions.refetchInterval({
      state: {
        data: {
          id: 101,
          imageUrls: [],
          prompt: "Finished task",
          model: "seedance2.0",
          status: 2,
          statusLabel: "done",
          progress: 100,
          videoUrl: "https://example.com/result.mp4",
        },
      },
    });

    expect(interval).toBe(false);
  });
});
