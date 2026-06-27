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

function buildBaseTaskDetail() {
  return {
    id: 101,
    name: "Remix Task",
    status: 0,
    statusLabel: "待处理",
    progress: 0,
    form: {
      targetVideoModel: "wan2.7-r2v",
      referenceVideoUrl: "https://example.com/source.mp4",
      videoMetaSummary: "viral structure summary",
      productImageUrls: ["https://example.com/product.png"],
      characterImageUrls: ["https://example.com/character.png"],
      audioUrl: "https://example.com/audio.mp3",
      productInfo: "product info",
      voiceoverScript: "voiceover script",
      direction: "direction summary",
      generationDuration: 15,
    },
  };
}

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

    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue(buildBaseTaskDetail());

    detailPageMocks.saveVideoRemixTaskForm.mockImplementation(async (_taskId: string, payload) => ({
      ...buildBaseTaskDetail(),
      ...payload,
      name: payload.name ?? "Remix Task",
      remark: payload.remark ?? "",
      form: {
        ...buildBaseTaskDetail().form,
        ...payload,
      },
    }));

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "处理中",
      progress: 45,
      generatedPrompt: "generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskVideo.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "视频生成中",
      progress: 60,
      generatedPrompt: "generated prompt",
    });

    detailPageMocks.refreshVideoRemixTask.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
      generatedPrompt: "generated prompt",
    });
  });

  it("renders the task edit sections and restores form values", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("Remix Task")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-basic-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-direction-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-assets-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-prompt-section")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/source.mp4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("viral structure summary")).toBeInTheDocument();
    expect(screen.getByDisplayValue("product info")).toBeInTheDocument();
    expect(screen.getByDisplayValue("voiceover script")).toBeInTheDocument();
  });

  it("renders reference video preview, audio preview and asset image previews", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-assets-section")).toBeInTheDocument();

    const referenceVideo = screen.getByTestId("video-remix-reference-video-preview");
    expect(referenceVideo).toHaveAttribute("src", "https://example.com/source.mp4");

    const referenceAudio = screen.getByTestId("video-remix-reference-audio-preview");
    expect(referenceAudio).toHaveAttribute("src", "https://example.com/audio.mp3");

    const productImages = screen.getAllByTestId("video-remix-product-image-preview");
    expect(productImages).toHaveLength(1);
    expect(productImages[0]).toHaveAttribute("src", "https://example.com/product.png");

    const characterImages = screen.getAllByTestId("video-remix-character-image-preview");
    expect(characterImages).toHaveLength(1);
    expect(characterImages[0]).toHaveAttribute("src", "https://example.com/character.png");
  });

  it("removes product image and character image from previews and save payload", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-assets-section")).toBeInTheDocument();
    expect(screen.getAllByTestId("video-remix-product-image-preview")).toHaveLength(1);
    expect(screen.getAllByTestId("video-remix-character-image-preview")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "删除商品图" }));
    fireEvent.click(screen.getByRole("button", { name: "删除人物图" }));

    await waitFor(() => {
      expect(screen.queryAllByTestId("video-remix-product-image-preview")).toHaveLength(0);
      expect(screen.queryAllByTestId("video-remix-character-image-preview")).toHaveLength(0);
    });

    fireEvent.click(screen.getByRole("button", { name: /保\s*存/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "seedance2.0",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "viral structure summary",
        productImageUrls: [],
        characterImageUrls: [],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "product info",
        voiceoverScript: "voiceover script",
        direction: "direction summary",
        generationDuration: 15,
      });
    });
  });

  it.skip("resets prompt and generated result when switching target model", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
    });

    renderDetailPage();

    expect(await screen.findByText("existing generated prompt")).toBeInTheDocument();
    expect(screen.getByText("视频地址：https://example.com/result.mp4")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getAllByRole("combobox")[0]!);
    fireEvent.click(await screen.findByText("SeeDance 2.0"));

    await waitFor(() => {
      expect(screen.queryByText("existing generated prompt")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "生成视频" })).not.toBeInTheDocument();
      expect(screen.queryByText("视频地址：https://example.com/result.mp4")).not.toBeInTheDocument();
    });

    expect(screen.getByText("当前还没有生成 Prompt")).toBeInTheDocument();
  });

  it("saves the current task form with mapped payload", async () => {
    renderDetailPage();

    const productInfoInput = await screen.findByDisplayValue("product info");
    fireEvent.change(productInfoInput, { target: { value: "updated product info" } });
    fireEvent.click(screen.getByRole("button", { name: /保\s*存/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "seedance2.0",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "viral structure summary",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "updated product info",
        voiceoverScript: "voiceover script",
        direction: "direction summary",
        generationDuration: 15,
      });
    });

  });

  it("submits seedance2.0 when target model field is hidden from the form", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      form: {
        ...buildBaseTaskDetail().form,
        targetVideoModel: undefined,
      },
      targetVideoModel: undefined,
    });

    renderDetailPage();

    expect(await screen.findByDisplayValue("product info")).toBeInTheDocument();
    const saveButton = screen.getAllByRole("button").at(-1);
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton!);

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "seedance2.0",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "viral structure summary",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "product info",
        voiceoverScript: "voiceover script",
        direction: "direction summary",
        generationDuration: 15,
      });
    });
  });

  it("saves the form before generating prompt and shows generate video after prompt succeeds", async () => {
    renderDetailPage();

    expect(await screen.findByText("当前还没有生成 Prompt")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "生成视频" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue("product info"), {
      target: { value: "product info for prompt" },
    });
    fireEvent.click(screen.getByRole("button", { name: "生成 Prompt" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalled();
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    expect(detailPageMocks.saveVideoRemixTaskForm.mock.invocationCallOrder[0]).toBeLessThan(
      detailPageMocks.generateVideoRemixTaskPrompt.mock.invocationCallOrder[0],
    );

    expect(await screen.findByText("generated prompt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "生成视频" })).toBeInTheDocument();
  });

  it("keeps generate video button idle while generate prompt is loading", async () => {
    let resolveGeneratePrompt:
      | ((value: {
          id: number;
          name: string;
          status: number;
          statusLabel: string;
          progress: number;
          generatedPrompt: string;
          promptProvider: string;
          promptModel: string;
          promptCheckPass: boolean;
          form: ReturnType<typeof buildBaseTaskDetail>["form"];
        }) => void)
      | undefined;

    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskPrompt.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveGeneratePrompt = resolve;
        }),
    );

    renderDetailPage();

    const promptButton = await screen.findByRole("button", { name: "生成 Prompt" });
    const videoButton = screen.getByRole("button", { name: "生成视频" });

    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(promptButton.className).toContain("ant-btn-loading");
      expect(videoButton.className).not.toContain("ant-btn-loading");
    });

    resolveGeneratePrompt?.({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "处理中",
      progress: 50,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    await waitFor(() => {
      expect(promptButton.className).not.toContain("ant-btn-loading");
    });
  });

  it("keeps generate prompt button idle while generate video is loading", async () => {
    let resolveGenerateVideo:
      | ((value: {
          id: number;
          name: string;
          status: number;
          statusLabel: string;
          progress: number;
          generatedPrompt: string;
          form: ReturnType<typeof buildBaseTaskDetail>["form"];
        }) => void)
      | undefined;

    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskVideo.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveGenerateVideo = resolve;
        }),
    );

    renderDetailPage();

    const promptButton = await screen.findByRole("button", { name: "生成 Prompt" });
    const videoButton = screen.getByRole("button", { name: "生成视频" });

    fireEvent.click(videoButton);

    await waitFor(() => {
      expect(videoButton.className).toContain("ant-btn-loading");
      expect(promptButton.className).not.toContain("ant-btn-loading");
    });

    resolveGenerateVideo?.({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "视频生成中",
      progress: 60,
      generatedPrompt: "existing generated prompt",
    });

    await waitFor(() => {
      expect(videoButton.className).not.toContain("ant-btn-loading");
    });
  });

  it("refreshes task status and shows the generated video result", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("Remix Task")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "刷新详情" }));

    await waitFor(() => {
      expect(detailPageMocks.refreshVideoRemixTask).toHaveBeenCalledWith("101");
    });

    expect(await screen.findByText("视频地址：https://example.com/result.mp4")).toBeInTheDocument();
    expect(screen.getByText("封面地址：https://example.com/cover.png")).toBeInTheDocument();
    expect(screen.getByText("时长：15 秒")).toBeInTheDocument();
  });

  it("navigates back to the task list from the header action", async () => {
    renderDetailPage();

    await screen.findByDisplayValue("Remix Task");
    fireEvent.click(screen.getByRole("button", { name: "返回列表" }));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks");
  });
});
