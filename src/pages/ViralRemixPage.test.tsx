import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ViralRemixPage } from "./ViralRemixPage";

const pageMocks = vi.hoisted(() => ({
  uploadVideo: vi.fn(),
  createVideoRemixTask: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadImage: vi.fn(),
  uploadVideo: pageMocks.uploadVideo,
}));

vi.mock("../api/aigc/video-remix-tasks", () => ({
  createVideoRemixTask: pageMocks.createVideoRemixTask,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  };
});

function renderViralRemixPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/viral-remix"]}>
        <ViralRemixPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ViralRemixPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageMocks.uploadVideo.mockResolvedValue({
      url: "https://example.com/source.mp4",
      objectKey: "source.mp4",
      originalFilename: "source.mp4",
    });
    pageMocks.createVideoRemixTask.mockResolvedValue({
      id: 101,
      name: "追爆任务",
      status: 0,
    });
  });

  it("creates a video remix task after source video upload and navigates to detail page", async () => {
    renderViralRemixPage();

    const uploadInput = screen.getByTestId("viral-source-upload-input");
    const sourceFile = new File(["video"], "source.mp4", { type: "video/mp4" });
    fireEvent.change(uploadInput, { target: { files: [sourceFile] } });

    await waitFor(() => {
      expect(pageMocks.uploadVideo).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: /创建追爆任务/i }));

    await waitFor(() => {
      expect(pageMocks.createVideoRemixTask).toHaveBeenCalled();
    });

    expect(pageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks/101");
  });
});
