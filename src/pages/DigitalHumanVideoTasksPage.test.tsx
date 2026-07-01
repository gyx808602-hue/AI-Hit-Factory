import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DigitalHumanVideoTasksPage } from "./DigitalHumanVideoTasksPage";

const pageMocks = vi.hoisted(() => ({
  useDigitalHumanVideoPage: vi.fn(),
  useCreateDigitalHumanVideoMutation: vi.fn(),
  useDeleteDigitalHumanVideoMutation: vi.fn(),
  useRefreshDigitalHumanVideoMutation: vi.fn(),
  useDigitalHumanPage: vi.fn(),
  useCustomisedAudioPage: vi.fn(),
  uploadAudio: vi.fn(),
  uploadImage: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}));

vi.mock("../features/digital-human/video/hooks", () => ({
  useDigitalHumanVideoPage: pageMocks.useDigitalHumanVideoPage,
  useCreateDigitalHumanVideoMutation: pageMocks.useCreateDigitalHumanVideoMutation,
  useDeleteDigitalHumanVideoMutation: pageMocks.useDeleteDigitalHumanVideoMutation,
  useRefreshDigitalHumanVideoMutation: pageMocks.useRefreshDigitalHumanVideoMutation,
}));

vi.mock("../features/digital-human/hooks", () => ({
  useDigitalHumanPage: pageMocks.useDigitalHumanPage,
}));

vi.mock("../features/digital-human/audio/hooks", () => ({
  useCustomisedAudioPage: pageMocks.useCustomisedAudioPage,
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadAudio: pageMocks.uploadAudio,
  uploadImage: pageMocks.uploadImage,
}));

vi.mock("antd", async () => {
  const actual = await vi.importActual<typeof import("antd")>("antd");

  return {
    ...actual,
    ColorPicker: ({
      value,
      onChange,
      ...props
    }: {
      value?: string;
      onChange?: (color: { toHexString: () => string }) => void;
      [key: string]: unknown;
    }) => (
      <input
        {...props}
        aria-label="背景颜色选择器"
        type="color"
        value={typeof value === "string" ? value : "#000000"}
        onChange={(event) =>
          onChange?.({
            toHexString: () => event.target.value,
          })
        }
      />
    ),
    message: {
      success: pageMocks.messageSuccess,
      error: pageMocks.messageError,
    },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  };
});

function renderTaskPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/digital-humans/videos"]}>
        <DigitalHumanVideoTasksPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DigitalHumanVideoTasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    pageMocks.useDigitalHumanVideoPage.mockReturnValue({
      data: {
        list: [
          {
            id: "video-1",
            personId: "person-1",
            name: "数字人讲解视频",
            status: 1,
            statusLabel: "生成中",
            progress: 45,
          },
          {
            id: "video-2",
            personId: "person-2",
            name: "数字人带货视频",
            status: 2,
            statusLabel: "已完成",
            progress: 100,
            videoUrl: "https://example.com/video-2.mp4",
          },
        ],
        total: 2,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    pageMocks.useDigitalHumanPage.mockReturnValue({
      data: {
        list: [
          {
            id: "person-1",
            name: "小雅",
            status: 2,
            previewImageUrl: "https://example.com/person-1.png",
          },
          {
            id: "person-2",
            name: "小美",
            status: 2,
            previewImageUrl: "https://example.com/person-2.png",
          },
        ],
        total: 2,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    pageMocks.useCustomisedAudioPage.mockReturnValue({
      data: {
        list: [
          { id: "audio-1", name: "客服女声", status: 2, audioPath: "https://example.com/audio-1.wav" },
          { id: "audio-2", name: "品牌男声", status: 2, audioPath: "https://example.com/audio-2.wav" },
        ],
        total: 2,
        pageNum: 1,
        pageSize: 100,
        pages: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    pageMocks.useCreateDigitalHumanVideoMutation.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        id: "video-9",
        personId: "person-1",
        name: "新数字人视频",
        status: 1,
        statusLabel: "生成中",
      }),
      isPending: false,
    });

    pageMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    pageMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    pageMocks.uploadAudio.mockResolvedValue({
      url: "https://example.com/audio.wav",
      objectKey: "audio.wav",
      originalFilename: "audio.wav",
    });
    pageMocks.uploadImage.mockResolvedValue({
      url: "https://example.com/bg.png",
      objectKey: "bg.png",
      originalFilename: "bg.png",
    });
  });

  it("queries task list with search and status params", async () => {
    renderTaskPage();

    expect(await screen.findByText("数字人讲解视频")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜索视频名称"), {
      target: { value: "带货" },
    });

    await waitFor(() => {
      expect(pageMocks.useDigitalHumanVideoPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: "带货",
        status: undefined,
      });
    });
  });

  it("opens create modal, validates fields, creates a tts task and navigates to detail", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "video-9",
        personId: "person-1",
        name: "新数字人视频",
        status: 1,
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanVideoMutation.mockReturnValue(createMutation);

    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));
    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    expect(await screen.findByText("请输入视频名称")).toBeInTheDocument();
    expect(screen.getByText("请选择数字人形象")).toBeInTheDocument();
    expect(screen.getAllByText("请选择定制音色").length).toBeGreaterThan(0);
    expect(screen.getByText("请输入驱动文本")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("请输入视频名称"), {
      target: { value: "新数字人视频" },
    });

    fireEvent.mouseDown(screen.getByLabelText("数字人形象"));
    fireEvent.click(await screen.findByText("小雅"));

    fireEvent.mouseDown(screen.getByLabelText("定制音色"));
    fireEvent.click(await screen.findByText("客服女声"));

    fireEvent.change(screen.getByPlaceholderText("请输入驱动文案"), {
      target: { value: "欢迎来到直播间" },
    });

    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "新数字人视频",
          personId: "person-1",
          type: "tts",
          text: "欢迎来到直播间",
          customAudioId: "audio-1",
          screenWidth: 1080,
          screenHeight: 1920,
        }),
      );
    });

    expect(pageMocks.navigate).toHaveBeenCalledWith("/digital-humans/videos/video-9");
  });

  it("switches to audio mode, uploads wav and maps the audio payload", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "video-10",
        personId: "person-2",
        name: "音频驱动视频",
        status: 1,
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanVideoMutation.mockReturnValue(createMutation);

    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));
    fireEvent.change(screen.getByPlaceholderText("请输入视频名称"), {
      target: { value: "音频驱动视频" },
    });
    fireEvent.mouseDown(screen.getByLabelText("数字人形象"));
    fireEvent.click(await screen.findByText("小美"));
    fireEvent.click(screen.getByRole("radio", { name: "音频驱动" }));

    fireEvent.change(screen.getByTestId("digital-human-video-audio-upload-input"), {
      target: {
        files: [new File(["audio"], "demo.wav", { type: "audio/wav" })],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadAudio).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "音频驱动视频",
          personId: "person-2",
          type: "audio",
          wavUrl: "https://example.com/audio.wav",
        }),
      );
    });
  });

  it("shows only the background color picker without a text input", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    expect(
      await screen.findByTestId("digital-human-video-bg-color-picker"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("背景色")).not.toBeInTheDocument();
  });

  it("uses a scrollable modal body with the preview stage centered", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    const modalBody = await screen.findByTestId("digital-human-video-create-modal-body");
    const previewStage = screen.getByTestId("digital-human-video-preview-stage");
    const previewStickyShell = screen.getByTestId("digital-human-video-preview-sticky-shell");

    expect(modalBody).toBeInTheDocument();
    expect(previewStage).toBeInTheDocument();
    expect(previewStickyShell).toBeInTheDocument();
    expect(modalBody.getAttribute("style")).toContain("max-height: 72vh");
    expect(modalBody.getAttribute("style")).toContain("overflow-y: auto");
    expect(previewStickyShell.className).toContain("sticky");
  });

  it("syncs the preview stage with selected digital human, background image and background color", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    fireEvent.mouseDown(screen.getByLabelText("数字人形象"));
    fireEvent.click(await screen.findByText("小雅"));

    const previewStage = await screen.findByTestId("digital-human-video-preview-stage");
    const backgroundImageInput = screen.getByLabelText("背景图 URL");
    const colorPicker = screen.getByLabelText("背景颜色选择器");

    fireEvent.change(backgroundImageInput, {
      target: { value: "https://example.com/preview-bg.png" },
    });
    fireEvent.change(colorPicker, {
      target: { value: "#112233" },
    });

    expect(screen.getByTestId("digital-human-video-preview-person-image")).toHaveAttribute(
      "src",
      "https://example.com/person-1.png",
    );
    expect(screen.getByTestId("digital-human-video-preview-background-image")).toHaveAttribute(
      "src",
      "https://example.com/preview-bg.png",
    );
    expect(previewStage).toHaveAttribute("data-preview-bg-color", "#112233");
  });

  it("clears the background image and falls back to background color only", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    const backgroundImageInput = await screen.findByLabelText("背景图 URL");
    fireEvent.change(backgroundImageInput, {
      target: { value: "https://example.com/preview-bg.png" },
    });

    expect(await screen.findByTestId("digital-human-video-preview-background-image")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "清空背景图" }));

    expect(screen.queryByTestId("digital-human-video-preview-background-image")).not.toBeInTheDocument();
    expect(screen.getByTestId("digital-human-video-preview-empty-background-tip")).toBeInTheDocument();
  });

  it("uses a plain color stage without the empty-background light overlay", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    const previewStage = await screen.findByTestId("digital-human-video-preview-stage");

    expect(previewStage.querySelector('[class*="radial-gradient"]')).toBeNull();
  });

  it("shows a richer empty state before selecting a digital human", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    expect(await screen.findByTestId("digital-human-video-preview-empty-person")).toBeInTheDocument();
    expect(screen.getByText("选择数字人后将在此处联动预览")).toBeInTheDocument();
    expect(screen.getByText("建议先选择形象，再调整位置和尺寸")).toBeInTheDocument();
  });

  it("shows canvas ratio and current frame metrics in the preview helper area", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    expect(await screen.findByTestId("digital-human-video-preview-stage-meta")).toHaveTextContent(
      "画布比例 1080 × 1920",
    );
    expect(screen.getByTestId("digital-human-video-preview-frame-meta")).toHaveTextContent(
      "人物位置 X:108 / Y:720",
    );
    expect(screen.getByTestId("digital-human-video-preview-frame-meta")).toHaveTextContent(
      "人物尺寸 800 × 600",
    );
  });

  it("refreshes, navigates to detail and deletes a task", async () => {
    const refreshMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    const deleteMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    pageMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue(refreshMutation);
    pageMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue(deleteMutation);

    renderTaskPage();

    expect(await screen.findByText("数字人讲解视频")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "查看详情-video-1" }));
    expect(pageMocks.navigate).toHaveBeenCalledWith("/digital-humans/videos/video-1");

    fireEvent.click(screen.getByRole("button", { name: "刷新状态-video-1" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("video-1");

    fireEvent.click(screen.getByRole("button", { name: "删除任务-video-1" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("video-1");
  });

  it("drags the preview frame and updates x y inputs", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    const previewFrame = await screen.findByTestId("digital-human-video-preview-frame");
    const xInput = screen.getByLabelText("人物 X") as HTMLInputElement;
    const yInput = screen.getByLabelText("人物 Y") as HTMLInputElement;

    expect(xInput.value).toBe("108");
    expect(yInput.value).toBe("720");

    fireEvent.mouseDown(previewFrame, { clientX: 40, clientY: 90 });
    fireEvent.mouseMove(window, { clientX: 58, clientY: 74 });
    fireEvent.mouseUp(window);

    expect(xInput.value).toBe("189");
    expect(yInput.value).toBe("648");
  });

  it("resizes the preview frame and updates width height inputs", async () => {
    renderTaskPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人视频" }));

    const resizeHandle = await screen.findByTestId("digital-human-video-preview-resize-handle");
    const widthInput = screen.getByLabelText("人物宽") as HTMLInputElement;
    const heightInput = screen.getByLabelText("人物高") as HTMLInputElement;

    expect(widthInput.value).toBe("800");
    expect(heightInput.value).toBe("600");

    fireEvent.mouseDown(resizeHandle, { clientX: 120, clientY: 200 });
    fireEvent.mouseMove(window, { clientX: 142.5, clientY: 220 });
    fireEvent.mouseUp(window);

    expect(widthInput.value).toBe("901");
    expect(heightInput.value).toBe("690");
  });
});
