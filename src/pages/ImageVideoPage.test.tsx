import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageVideoPage } from "./ImageVideoPage";

const pageMocks = vi.hoisted(() => ({
  uploadImage: vi.fn(),
  createTextImageVideoTask: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadImage: pageMocks.uploadImage,
}));

vi.mock("../api/customer/text-image-video", () => ({
  createTextImageVideoTask: pageMocks.createTextImageVideoTask,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  };
});

function renderImageVideoPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/image-video"]}>
        <ImageVideoPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ImageVideoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageMocks.uploadImage.mockResolvedValue({
      url: "https://example.com/a.png",
      objectKey: "a.png",
      originalFilename: "a.png",
    });
    pageMocks.createTextImageVideoTask.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成一条茶饮种草视频",
      model: "seedance2.0",
      status: 0,
    });
  });

  it("renders figma-aligned sections for image video creation", () => {
    renderImageVideoPage();

    expect(screen.getByText("图文生成视频")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "查看任务列表" })).toBeInTheDocument();
    expect(screen.getByLabelText(/视频主题/i)).toBeInTheDocument();
    expect(screen.getAllByText("视频风格").length).toBeGreaterThan(0);
    expect(screen.getAllByText("输出方式").length).toBeGreaterThan(0);
    expect(screen.getByText("自动配音")).toBeInTheDocument();
    expect(screen.getByText("自动字幕")).toBeInTheDocument();
    expect(screen.getByText("添加 BGM")).toBeInTheDocument();
    expect(screen.getByText("视频预览")).toBeInTheDocument();
  });

  it("creates a text-image-video task and navigates to the detail page", async () => {
    renderImageVideoPage();

    fireEvent.change(screen.getByTestId("image-video-upload-input"), {
      target: {
        files: [new File(["image"], "a.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByPlaceholderText("请输入视频提示词，例如：生成一条茶饮种草短视频"), {
      target: { value: "生成一条茶饮种草视频" },
    });

    fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).toHaveBeenCalledWith({
        imageUrls: ["https://example.com/a.png"],
        prompt: "生成一条茶饮种草视频",
        model: "seedance2.0",
      });
    });

    expect(pageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks/101");
  });

  it("navigates to task list from the header action", () => {
    renderImageVideoPage();

    fireEvent.click(screen.getByRole("button", { name: "查看任务列表" }));

    expect(pageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });

  it("blocks submit when required fields are missing", async () => {
    renderImageVideoPage();

    fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).not.toHaveBeenCalled();
    });

    expect(screen.getByText("请先上传至少一张参考图")).toBeInTheDocument();
    expect(screen.getByText("请输入视频提示词")).toBeInTheDocument();
  });
});
