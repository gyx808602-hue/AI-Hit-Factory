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
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

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
          <Route
            path="/viral-remix/tasks/:taskId"
            element={<VideoRemixTaskDetailPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function getUploadInput(testId: string) {
  const uploadTrigger = screen.getByTestId(testId);
  const uploadInput = uploadTrigger.parentElement?.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement | null;

  expect(uploadInput).not.toBeNull();

  return uploadInput as HTMLInputElement;
}

async function goToPromptStep() {
  fireEvent.click(await screen.findByText("提示词"));
  await screen.findByTestId("video-remix-step-prompt");
}

async function goToVideoStep() {
  fireEvent.click(await screen.findByText("视频生成"));
  await screen.findByTestId("video-remix-step-video");
}

describe("VideoRemixTaskDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue(buildBaseTaskDetail());

    detailPageMocks.saveVideoRemixTaskForm.mockImplementation(
      async (_taskId: string, payload) => ({
        ...buildBaseTaskDetail(),
        ...payload,
        name: payload.name ?? "Remix Task",
        remark: payload.remark ?? "",
        form: {
          ...buildBaseTaskDetail().form,
          ...payload,
        },
      }),
    );

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

  it("renders step navigation and starts in the materials step", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("Remix Task")).toBeInTheDocument();
    expect(screen.getByText("素材上传和配置")).toBeInTheDocument();
    expect(screen.getByText("提示词")).toBeInTheDocument();
    expect(screen.getByText("视频生成")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(screen.queryByTestId("video-remix-step-prompt")).not.toBeInTheDocument();
    expect(screen.queryByTestId("video-remix-step-video")).not.toBeInTheDocument();
    expect(screen.getByTestId("video-remix-basic-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-assets-section")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-direction-section")).toBeInTheDocument();
  });

  it("does not render persistent top alerts for action feedback", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(screen.queryByText("任务信息已保存")).not.toBeInTheDocument();
    expect(screen.queryByText("操作失败")).not.toBeInTheDocument();
  });

  it("removes video summary input and manual image url inputs in the materials step", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(screen.queryByLabelText("视频摘要")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("上传参考视频后自动回填 URL")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("上传商品图后自动回填 URL")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("上传人物图后自动回填 URL")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("可选，上传参考音频后自动回填 URL")).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("粘贴 URL 后按回车添加，或通过上传补充"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("可选，粘贴 URL 或上传人物素材图"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/你想要生成的视频达到怎样的效果/),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "AI 自动生成" })).toHaveLength(2);
  });

  it("renders voiceover and direction fields in a responsive horizontal layout", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

    const horizontalFields = screen.getByTestId("video-remix-direction-horizontal-fields");
    expect(horizontalFields.className).toContain("grid");
    expect(horizontalFields.className).toContain("w-full");
    expect(horizontalFields.className).toContain("gap-6");
    expect(horizontalFields.className).toContain("xl:grid-cols-2");
  });

  it("renders aligned label rows for the horizontal direction fields", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

    const horizontalFields = screen.getByTestId("video-remix-direction-horizontal-fields");
    const formItemLabels = horizontalFields.querySelectorAll(".ant-form-item-label");
    const directionPlaceholder = horizontalFields.querySelector(".inline-flex.h-\\[32px\\].w-\\[108px\\]");

    expect(formItemLabels).toHaveLength(2);
    expect(directionPlaceholder).not.toBeNull();
  });

  it("renders matching fixed heights for the voiceover and direction textareas", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

    const voiceoverTextarea = screen.getByDisplayValue("voiceover script");
    const directionTextarea = screen.getByDisplayValue("direction summary");

    expect(voiceoverTextarea.className).toContain("h-[132px]");
    expect(voiceoverTextarea.className).toContain("resize-none");
    expect(directionTextarea.className).toContain("h-[132px]");
    expect(directionTextarea.className).toContain("resize-none");
  });

  it("renders reference video preview, audio preview and asset image previews", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

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

  it("shows a required marker and helper text for the reference video", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      form: {
        ...buildBaseTaskDetail().form,
        referenceVideoUrl: "",
      },
    });

    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-reference-video-required-mark")).toHaveTextContent("*");
    expect(screen.getByText("参考视频为必填项，请先上传参考视频。")).toBeInTheDocument();
  });

  it("uploads reference video, product image, character image and audio through upload components", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      form: {
        ...buildBaseTaskDetail().form,
        referenceVideoUrl: "",
        productImageUrls: [],
        characterImageUrls: [],
        audioUrl: "",
      },
    });

    detailPageMocks.uploadVideo.mockResolvedValue({
      url: "https://example.com/new-source.mp4",
      objectKey: "video/new-source.mp4",
      originalFilename: "new-source.mp4",
    });
    detailPageMocks.uploadImage
      .mockResolvedValueOnce({
        url: "https://example.com/new-product.png",
        objectKey: "image/new-product.png",
        originalFilename: "new-product.png",
      })
      .mockResolvedValueOnce({
        url: "https://example.com/new-character.png",
        objectKey: "image/new-character.png",
        originalFilename: "new-character.png",
      });
    detailPageMocks.uploadAudio.mockResolvedValue({
      url: "https://example.com/new-audio.mp3",
      objectKey: "audio/new-audio.mp3",
      originalFilename: "new-audio.mp3",
    });

    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

    fireEvent.change(getUploadInput("video-remix-reference-video-upload-input"), {
      target: {
        files: [new File(["video"], "new-source.mp4", { type: "video/mp4" })],
      },
    });

    await waitFor(() => {
      expect(detailPageMocks.uploadVideo).toHaveBeenCalledTimes(1);
    });
    expect(
      await screen.findByDisplayValue("https://example.com/new-source.mp4"),
    ).toBeInTheDocument();

    fireEvent.change(getUploadInput("video-remix-product-image-upload-input"), {
      target: {
        files: [new File(["image"], "new-product.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(detailPageMocks.uploadImage).toHaveBeenCalledTimes(1);
    });
    expect(
      await screen.findByDisplayValue("https://example.com/new-product.png"),
    ).toBeInTheDocument();

    fireEvent.change(getUploadInput("video-remix-character-image-upload-input"), {
      target: {
        files: [new File(["image"], "new-character.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(detailPageMocks.uploadImage).toHaveBeenCalledTimes(2);
    });
    expect(
      await screen.findByDisplayValue("https://example.com/new-character.png"),
    ).toBeInTheDocument();

    fireEvent.change(getUploadInput("video-remix-audio-upload-input"), {
      target: {
        files: [new File(["audio"], "new-audio.mp3", { type: "audio/mpeg" })],
      },
    });

    await waitFor(() => {
      expect(detailPageMocks.uploadAudio).toHaveBeenCalledTimes(1);
    });
    expect(
      await screen.findByDisplayValue("https://example.com/new-audio.mp3"),
    ).toBeInTheDocument();
  });

  it("uploads each selected file batch only once and toggles loading on the upload button", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      form: {
        ...buildBaseTaskDetail().form,
        productImageUrls: [],
      },
    });

    let releaseUpload: (() => void) | undefined;
    const uploadGate = new Promise<void>((resolve) => {
      releaseUpload = resolve;
    });

    detailPageMocks.uploadImage.mockImplementation(async (file: File) => {
      await uploadGate;
      return {
        url: `https://example.com/${file.name}`,
        objectKey: `image/${file.name}`,
        originalFilename: file.name,
      };
    });

    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();

    fireEvent.change(getUploadInput("video-remix-product-image-upload-input"), {
      target: {
        files: [
          new File(["image-1"], "batch-product-1.png", { type: "image/png" }),
          new File(["image-2"], "batch-product-2.png", { type: "image/png" }),
        ],
      },
    });

    await waitFor(() => {
      expect(detailPageMocks.uploadImage).toHaveBeenCalledTimes(2);
    });

    const uploadButton = screen
      .getByTestId("video-remix-product-image-upload-input")
      .querySelector("button");
    expect(uploadButton).not.toBeNull();
    expect(uploadButton?.className).toContain("ant-btn-loading");

    releaseUpload?.();

    await waitFor(() => {
      expect(uploadButton?.className).not.toContain("ant-btn-loading");
    });
  });

  it("saves the current step before moving to the next step", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue("product info"), {
      target: { value: "updated product info before next step" },
    });

    fireEvent.click(screen.getByRole("button", { name: "下一步" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "https://example.com/audio.mp3",
        productInfo: "updated product info before next step",
        voiceoverScript: "voiceover script",
        direction: "direction summary",
        generationDuration: 15,
      });
    });

    expect(await screen.findByTestId("video-remix-step-prompt")).toBeInTheDocument();
  });

  it("blocks moving to the prompt step when the reference video is empty", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      form: {
        ...buildBaseTaskDetail().form,
        referenceVideoUrl: "",
        productImageUrls: [],
        characterImageUrls: [],
        audioUrl: "",
      },
    });

    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "下一步" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).not.toHaveBeenCalled();
    });

    expect(await screen.findByText("请先上传参考视频")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-reference-video-error")).toHaveTextContent("请先上传参考视频");
    expect(screen.getByTestId("video-remix-step-materials")).toBeInTheDocument();
  });

  it("blocks moving to the next step when required content fields are empty", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue("product info"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByDisplayValue("voiceover script"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByDisplayValue("direction summary"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: "下一步" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).not.toHaveBeenCalled();
    });
    expect(await screen.findByText("请填写产品信息")).toBeInTheDocument();
    expect(await screen.findByText("请填写口播文案")).toBeInTheDocument();
    expect(await screen.findByText("请填写复刻方向")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-step-materials")).toBeInTheDocument();
  });

  it("removes the product image card and keeps previews in sync", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(await screen.findAllByTestId("video-remix-product-image-preview")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "删除商品图" }));
    await waitFor(() => {
      expect(screen.queryAllByTestId("video-remix-product-image-preview")).toHaveLength(0);
    });
  });

  it("renders sticky step actions for long-page editing", async () => {
    renderDetailPage();

    const stepActions = await screen.findByTestId("video-remix-step-actions");

    expect(stepActions.className).toContain("sticky");
    expect(stepActions.className).toContain("bottom-0");
  });

  it("removes audio preview and save payload in sync", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(await screen.findByTestId("video-remix-reference-audio-preview")).toHaveAttribute(
      "src",
      "https://example.com/audio.mp3",
    );

    fireEvent.click(screen.getByRole("button", { name: "删除音频" }));

    await waitFor(() => {
      expect(screen.queryByTestId("video-remix-reference-audio-preview")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /保\s*存/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "",
        productImageUrls: ["https://example.com/product.png"],
        characterImageUrls: ["https://example.com/character.png"],
        audioUrl: "",
        productInfo: "product info",
        voiceoverScript: "voiceover script",
        direction: "direction summary",
        generationDuration: 15,
      });
    });
  });

  it("uses compact previews and reserves bottom space for sticky actions", async () => {
    renderDetailPage();

    const referencePreviewShell = await screen.findByTestId("video-remix-reference-video-preview-shell");
    const productPreviewGrid = screen.getByTestId("video-remix-product-image-grid");
    const characterPreviewGrid = screen.getByTestId("video-remix-character-image-grid");
    const stepContent = screen.getByTestId("video-remix-step-materials");
    const stepActions = screen.getByTestId("video-remix-step-actions");

    expect(referencePreviewShell.className).toContain("max-w-[320px]");
    expect(productPreviewGrid.className).toContain("minmax(140px,180px)");
    expect(characterPreviewGrid.className).toContain("minmax(140px,180px)");
    expect(stepContent.className).toContain("pb-28");
    expect(stepActions.className).toContain("bg-[var(--card-bg)]");
  });

  it("keeps the detail panel within viewport height and scrolls inside step content", async () => {
    const { container } = renderDetailPage();

    const detailPanel = await screen.findByTestId("video-remix-detail-panel");
    const scrollBody = screen.getByTestId("video-remix-step-scroll-body");
    const stepActions = screen.getByTestId("video-remix-step-actions");
    const pageShellRoot = container.firstElementChild as HTMLElement;
    const pageShellContent = pageShellRoot?.firstElementChild as HTMLElement;
    const detailForm = container.querySelector("form") as HTMLFormElement | null;

    expect(detailForm).not.toBeNull();
    expect(detailForm?.className).toContain("h-full");
    expect(detailForm?.className).toContain("min-h-0");
    expect(detailForm?.className).toContain("flex-col");
    expect(detailPanel.className).toContain("flex-1");
    expect(detailPanel.className).toContain("min-h-0");
    expect(detailPanel.className).toContain("lg:min-h-[720px]");
    expect(detailPanel.className).toContain("overflow-hidden");
    expect(pageShellRoot.className).toContain("overflow-hidden");
    expect(pageShellRoot.className).toContain("flex");
    expect(pageShellContent.className).toContain("flex-1");
    expect(pageShellContent.className).toContain("min-h-0");
    expect(pageShellContent.className).toContain("flex-col");
    expect(scrollBody.className).toContain("min-h-0");
    expect(scrollBody.className).toContain("overflow-y-auto");
    expect(stepActions.className).toContain("sticky");
  });

  it("moves header actions into the detail panel and removes the outer page title", async () => {
    const { container } = renderDetailPage();

    const detailPanel = await screen.findByTestId("video-remix-detail-panel");
    const panelHeader = screen.getByTestId("video-remix-panel-header");
    const pageHeaderShell = panelHeader.parentElement?.parentElement as HTMLElement | null;
    const pageShellRoot = container.firstElementChild as HTMLElement;

    expect(pageShellRoot.textContent).not.toContain("追爆任务详情");
    expect(detailPanel.textContent).toContain("返回列表");
    expect(detailPanel.textContent).toContain("刷新详情");
    expect(detailPanel.textContent).toContain("编辑视频追爆任务");
    expect(pageHeaderShell).not.toBeNull();
    expect(pageHeaderShell?.className).toContain("px-3");
    expect(pageHeaderShell?.className).toContain("py-3");
  });

  it("removes product image and character image from previews and save payload", async () => {
    renderDetailPage();

    expect(await screen.findByTestId("video-remix-step-materials")).toBeInTheDocument();
    expect(await screen.findAllByTestId("video-remix-product-image-preview")).toHaveLength(1);
    expect(await screen.findAllByTestId("video-remix-character-image-preview")).toHaveLength(1);

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
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "",
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

  it("saves the current task form with mapped payload", async () => {
    renderDetailPage();

    const productInfoInput = await screen.findByDisplayValue("product info");
    fireEvent.change(productInfoInput, { target: { value: "updated product info" } });
    fireEvent.click(screen.getByRole("button", { name: /保\s*存/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "",
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
    fireEvent.click(screen.getByRole("button", { name: /保\s*存/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalledWith("101", {
        name: "Remix Task",
        remark: "",
        targetVideoModel: "seedance2.0",
        referenceVideoUrl: "https://example.com/source.mp4",
        videoMetaSummary: "",
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

  it("shows editable generated prompt with local edit warning in the prompt step", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    renderDetailPage();
    await goToPromptStep();

    expect(await screen.findByDisplayValue("existing generated prompt")).toBeInTheDocument();
    expect(
      screen.getByTestId("video-remix-editable-prompt-input"),
    ).toBeInTheDocument();
  });

  it("saves the form before generating prompt and keeps the edited prompt visible", async () => {
    renderDetailPage();
    await goToPromptStep();

    expect(screen.getByPlaceholderText(/当前还没有生成提示词/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).toHaveBeenCalled();
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    expect(detailPageMocks.saveVideoRemixTaskForm.mock.invocationCallOrder[0]).toBeLessThan(
      detailPageMocks.generateVideoRemixTaskPrompt.mock.invocationCallOrder[0],
    );

    expect(await screen.findByDisplayValue("generated prompt")).toBeInTheDocument();
  });

  it("blocks moving from the prompt step when prompt content is empty", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
    });

    renderDetailPage();
    await goToPromptStep();
    detailPageMocks.saveVideoRemixTaskForm.mockClear();

    fireEvent.change(screen.getByTestId("video-remix-editable-prompt-input"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /下一步/ }));

    await waitFor(() => {
      expect(detailPageMocks.saveVideoRemixTaskForm).not.toHaveBeenCalled();
    });

    expect(await screen.findByText("请先生成或填写提示词")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-step-prompt")).toBeInTheDocument();
  });

  it("keeps prompt step action loading isolated while generating prompt", async () => {
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
    await goToPromptStep();

    const promptButton = await screen.findByRole("button", { name: "生成提示词" });
    const nextButton = screen.getByRole("button", { name: /下一步/ });

    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(promptButton.className).toContain("ant-btn-loading");
      expect(nextButton.className).not.toContain("ant-btn-loading");
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

  it("disables the editable prompt input while regenerate prompt remains in progress", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "处理中",
      progress: 50,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    renderDetailPage();
    await goToPromptStep();

    const promptInput = screen.getByTestId(
      "video-remix-editable-prompt-input",
    ) as HTMLTextAreaElement;

    expect(promptInput).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    await waitFor(() => {
      expect(promptInput).toBeDisabled();
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("50%");
    });
  });

  it("keeps showing prompt generation progress from the generate-prompt response even when progress is 0", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 0,
      statusLabel: "待处理",
      progress: 0,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    renderDetailPage();
    await goToPromptStep();

    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("0%");
  });

  it("does not finish prompt progress just because an old generated prompt exists", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      ...buildBaseTaskDetail(),
      statusLabel: undefined,
      progress: 0,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    renderDetailPage();
    await goToPromptStep();

    const promptInput = screen.getByTestId(
      "video-remix-editable-prompt-input",
    ) as HTMLTextAreaElement;

    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(detailPageMocks.generateVideoRemixTaskPrompt).toHaveBeenCalledWith("101");
    });

    expect(promptInput).toBeDisabled();
    expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("0%");
  });

  it("updates prompt progress from detail polling and hides it after completion", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValueOnce({
      ...buildBaseTaskDetail(),
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    detailPageMocks.refreshVideoRemixTask
      .mockResolvedValueOnce({
        ...buildBaseTaskDetail(),
        status: 1,
        statusLabel: "处理中",
        progress: 65,
        generatedPrompt: "existing generated prompt",
        promptProvider: "openai",
        promptModel: "gpt-4.1",
        promptCheckPass: true,
      })
      .mockResolvedValueOnce({
        ...buildBaseTaskDetail(),
        status: 2,
        statusLabel: "已完成",
        progress: 100,
        generatedPrompt: "final generated prompt",
        promptProvider: "openai",
        promptModel: "gpt-4.1",
        promptCheckPass: true,
      });

    detailPageMocks.generateVideoRemixTaskPrompt.mockResolvedValue({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "处理中",
      progress: 20,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    renderDetailPage();
    await goToPromptStep();

    const promptInput = screen.getByTestId(
      "video-remix-editable-prompt-input",
    ) as HTMLTextAreaElement;

    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(promptInput).toBeDisabled();
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("20%");
    });

    fireEvent.click(screen.getByRole("button", { name: "刷新详情" }));

    await waitFor(() => {
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("65%");
    });

    fireEvent.click(screen.getByRole("button", { name: "刷新详情" }));

    await waitFor(() => {
      expect(promptInput).not.toBeDisabled();
      expect(screen.getByTestId("video-remix-prompt-progress")).not.toHaveTextContent("100%");
    });

    await waitFor(() => {
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("100%");
    }, { timeout: 2200 });

    await waitFor(() => {
      expect(screen.queryByTestId("video-remix-prompt-progress")).not.toBeInTheDocument();
    }, { timeout: 3200 });
  });

  it("smoothly advances prompt progress while waiting for the next status refresh", async () => {
    let resolveGeneratePrompt:
      | ((value: ReturnType<typeof buildBaseTaskDetail> & {
          generatedPrompt: string;
          promptProvider: string;
          promptModel: string;
          promptCheckPass: boolean;
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
    await goToPromptStep();

    fireEvent.click(screen.getByRole("button", { name: "生成提示词" }));

    await waitFor(() => {
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("0%");
    });

    await waitFor(
      () => {
        expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("1%");
      },
      { timeout: 2200 },
    );

    resolveGeneratePrompt?.({
      ...buildBaseTaskDetail(),
      status: 1,
      statusLabel: "处理中",
      progress: 20,
      generatedPrompt: "existing generated prompt",
      promptProvider: "openai",
      promptModel: "gpt-4.1",
      promptCheckPass: true,
    });

    await waitFor(() => {
      expect(screen.getByTestId("video-remix-prompt-progress")).toHaveTextContent("20%");
    });
  });

  it("renders video compare section after refresh", async () => {
    renderDetailPage();

    expect(await screen.findByDisplayValue("Remix Task")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "刷新详情" }));

    await waitFor(() => {
      expect(detailPageMocks.refreshVideoRemixTask).toHaveBeenCalledWith("101");
    });

    await goToVideoStep();

    expect(await screen.findByTestId("video-remix-reference-video-compare")).toBeInTheDocument();
    expect(screen.getByTestId("video-remix-generated-video-preview")).toBeInTheDocument();
    expect(screen.getByText("视频地址：https://example.com/result.mp4")).toBeInTheDocument();
    expect(screen.getByText("封面地址：https://example.com/cover.png")).toBeInTheDocument();
    expect(screen.getByText("时长：15 秒")).toBeInTheDocument();
  });

  it("keeps the reference video preview in step 3 when refresh response omits form data", async () => {
    detailPageMocks.refreshVideoRemixTask.mockResolvedValue({
      id: 101,
      name: "Remix Task",
      status: 2,
      statusLabel: "已完成",
      progress: 100,
      generatedPrompt: "generated prompt",
      videoUrl: "https://example.com/result.mp4",
      coverUrl: "https://example.com/cover.png",
      duration: 15,
    });

    renderDetailPage();

    expect(await screen.findByDisplayValue("Remix Task")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "刷新详情" }));

    await waitFor(() => {
      expect(detailPageMocks.refreshVideoRemixTask).toHaveBeenCalledWith("101");
    });

    await goToVideoStep();

    const referenceVideo = screen
      .getByTestId("video-remix-reference-video-compare")
      .querySelector("video");

    expect(referenceVideo).not.toBeNull();
    expect(referenceVideo).toHaveAttribute("src", "https://example.com/source.mp4");
  });

  it("renders the step 3 reference video from top-level task data when form omits it", async () => {
    detailPageMocks.getVideoRemixTaskDetail.mockResolvedValue({
      ...buildBaseTaskDetail(),
      referenceVideoUrl: "https://example.com/top-level-source.mp4",
      form: {
        ...buildBaseTaskDetail().form,
        referenceVideoUrl: undefined,
      },
    });

    renderDetailPage();
    await goToVideoStep();

    const referenceVideo = screen
      .getByTestId("video-remix-reference-video-compare")
      .querySelector("video");

    expect(referenceVideo).not.toBeNull();
    expect(referenceVideo).toHaveAttribute("src", "https://example.com/top-level-source.mp4");
  });

  it("renders reference video previews with a standard aspect ratio", async () => {
    renderDetailPage();

    const referencePreview = await screen.findByTestId("video-remix-reference-video-preview-wrapper");
    expect(referencePreview.className).toContain("aspect-video");

    await goToVideoStep();
    const comparePreview = screen.getByTestId("video-remix-reference-video-compare");
    expect(comparePreview.className).toContain("aspect-video");
  });

  it("navigates back to the task list from the header action", async () => {
    renderDetailPage();

    await screen.findByDisplayValue("Remix Task");
    fireEvent.click(screen.getByRole("button", { name: "返回列表" }));

    expect(detailPageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks");
  });
});
