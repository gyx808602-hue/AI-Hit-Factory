import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VideoRemixTaskDetailPage } from "./VideoRemixTaskDetailPage";

const detailPageMocks = vi.hoisted(() => ({
  getVideoRemixTaskDetail: vi.fn(),
  saveVideoRemixTaskForm: vi.fn(),
  checkVideoRemixTaskPrompt: vi.fn(),
  generateVideoRemixTaskPrompt: vi.fn(),
  generateVideoRemixTaskVideo: vi.fn(),
  refreshVideoRemixTask: vi.fn(),
  uploadVideo: vi.fn(),
  uploadImage: vi.fn(),
  uploadAudio: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/aigc/video-remix-tasks", () => ({
  getVideoRemixTaskDetail: detailPageMocks.getVideoRemixTaskDetail,
  saveVideoRemixTaskForm: detailPageMocks.saveVideoRemixTaskForm,
  checkVideoRemixTaskPrompt: detailPageMocks.checkVideoRemixTaskPrompt,
  generateVideoRemixTaskPrompt: detailPageMocks.generateVideoRemixTaskPrompt,
  generateVideoRemixTaskVideo: detailPageMocks.generateVideoRemixTaskVideo,
  refreshVideoRemixTask: detailPageMocks.refreshVideoRemixTask,
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadVideo: detailPageMocks.uploadVideo,
  uploadImage: detailPageMocks.uploadImage,
  uploadAudio: detailPageMocks.uploadAudio,
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
      <MemoryRouter initialEntries={[`/viral-remix/tasks/${taskId}`]}>
        <Routes>
          <Route path="/viral-remix/tasks/:taskId" element={<VideoRemixTaskDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("VideoRemixTaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      id: 101,
      name: "追爆任务",
      status: 0,
      statusLabel: "待处理",
      progress: 0,
      form: {
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "爆款结构分析",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "产品信息",
        voiceoverScript: "口播脚本",
        direction: "复刻方向说明",
        generationDuration: 15,
      },
    });

    detailPageMocks.saveVideoRemixTaskForm.mockResolvedValue({
      id: 101,
      name: "追爆任务",
      status: 0,
      statusLabel: "待处理",
      progress: 0,
      form: {
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "爆款结构分析",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "更新后的产品信息",
        voiceoverScript: "口播脚本",
        direction: "复刻方向说明",
        generationDuration: 15,
      },
    });

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      id: 101,
      name: "追爆任务",
      status: 1,
      statusLabel: "处理中",
      progress: 45,
      generatedPrompt: "生成后的 prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
      form: {
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "爆款结构分析",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "产品信息",
        voiceoverScript: "口播脚本",
        direction: "复刻方向说明",
        generationDuration: 15,
      },
    });

    detailPageMocks.refreshVideoRemixTask.mockResolvedValue({
      id: 101,
      name: "追爆任务",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
      generatedPrompt: "生成后的 prompt",
      form: {
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "爆款结构分析",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "产品信息",
        voiceoverScript: "口播脚本",
        direction: "复刻方向说明",
        generationDuration: 15,
      },
    });
  });

  it("renders the task edit sections and restores form values", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("追爆任务")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-basic-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-direction-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-assets-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-prompt-section")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/source.mp4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("爆款结构分析")).toBeInTheDocument();
    expect(screen.getByDisplayValue("产品信息")).toBeInTheDocument();
    expect(screen.getByDisplayValue("口播脚本")).toBeInTheDocument();
  });

  it("renders reference video preview and all asset image previews", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-assets-section")).toBeInTheDocument();

    const referenceVideo = screen.getByTestId("video-remix-reference-video-preview");
    expect(referenceVideo).toHaveAttribute("src", "https://example.com/source.mp4");

    const productImages = screen.getAllByTestId("video-remix-product-image-preview");
    expect(productImages).toHaveLength(1);
    expect(productImages[0]).toHaveAttribute("src", "https://example.com/product.png");

    const characterImages = screen.getAllByTestId("video-remix-character-image-preview");
    expect(characterImages).toHaveLength(1);
    expect(characterImages[0]).toHaveAttribute("src", "https://example.com/character.png");
  });

  it("saves the current task form with mapped payload", async () => {
    renderDetailPage();

    const productInfoInput = await screen.findByDisplayValue("产品信息");
    fireEvent.change(productInfoInput, { target: { value: "更新后的产品信息" } });
    fireEvent.click(screen.getByRole("button", { name: "保 存" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "追爆任务",
        remark: "",
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "爆款结构分析",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "更新后的产品信息",
        voiceoverScript: "口播脚本",
        direction: "复刻方向说明",
        generationDuration: 15,
      });
    });
  });

  it("generates prompt and renders the returned prompt content", async () => {
    renderDetailPage();

    expect(await screen.findByText("当前还没有生成 Prompt")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "生成 Prompt" }));

    await waitFor(() => {
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    expect(await screen.findByText("生成后的 prompt")).toBeInTheDocument();
    expect(screen.getByText("Prompt 服务：openai")).toBeInTheDocument();
  });

  it("refreshes task status and shows the generated video result", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("追爆任务")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "刷新详情" })[1]!);

    await waitFor(() => {
      expect(detailPageMocks.refreshVideoRemixTask).toHaveBeenCalledWith("101");
    });

    expect(await screen.findByText("视频地址：https://example.com/result.mp4")).toBeInTheDocument();
    expect(screen.getByText("封面地址：https://example.com/cover.png")).toBeInTheDocument();
    expect(screen.getByText("时长：15 秒")).toBeInTheDocument();
  });

  it("navigates back to the task list from the header action", async () => {
    renderDetailPage();

    await screen.findByDisplayValue("追爆任务");
    fireEvent.click(screen.getByRole("button", { name: "返回列表" }));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks");
  });
});
