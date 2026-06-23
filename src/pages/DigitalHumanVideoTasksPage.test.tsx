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
          { id: "person-1", name: "小雅", status: 2 },
          { id: "person-2", name: "小美", status: 2 },
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

    expect(xInput.value).toBe("216");
    expect(yInput.value).toBe("624");
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

    expect(widthInput.value).toBe("935");
    expect(heightInput.value).toBe("720");
  });
});
