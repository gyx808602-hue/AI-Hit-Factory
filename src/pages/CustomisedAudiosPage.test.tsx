import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomisedAudiosPage } from "./CustomisedAudiosPage";

const pageMocks = vi.hoisted(() => ({
  useCustomisedAudioPage: vi.fn(),
  useCreateCustomisedAudioMutation: vi.fn(),
  useDeleteCustomisedAudioMutation: vi.fn(),
  useRefreshCustomisedAudioMutation: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}));

vi.mock("../features/digital-human/audio/hooks", () => ({
  useCustomisedAudioPage: pageMocks.useCustomisedAudioPage,
  useCreateCustomisedAudioMutation: pageMocks.useCreateCustomisedAudioMutation,
  useDeleteCustomisedAudioMutation: pageMocks.useDeleteCustomisedAudioMutation,
  useRefreshCustomisedAudioMutation: pageMocks.useRefreshCustomisedAudioMutation,
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

function renderCustomisedAudiosPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/customised-audios"]}>
        <CustomisedAudiosPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function openCreateModal() {
  fireEvent.click(screen.getByRole("button", { name: "新建音色" }));
  return screen.getByRole("dialog");
}

function clickPrimaryModalButton() {
  const submitButton = document.querySelector(".ant-modal-footer .ant-btn-primary");
  if (!(submitButton instanceof HTMLButtonElement)) {
    throw new Error("未找到弹窗确认按钮");
  }

  fireEvent.click(submitButton);
}

describe("CustomisedAudiosPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    pageMocks.useCustomisedAudioPage.mockReturnValue({
      data: {
        list: [
          {
            id: "audio-1",
            name: "客服女声",
            status: 1,
            statusLabel: "训练中",
            progress: 65,
            audioPath: "https://example.com/audio-1.wav",
            language: "cn",
            modelType: "tts",
          },
          {
            id: "audio-2",
            name: "品牌男声",
            status: 2,
            statusLabel: "已完成",
            progress: 100,
            audioPath: "https://example.com/audio-2.wav",
            language: "en",
            modelType: "tts",
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

    pageMocks.useCreateCustomisedAudioMutation.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        id: "audio-3",
        name: "新品介绍音色",
        status: 0,
        progress: 0,
      }),
      isPending: false,
    });

    pageMocks.useDeleteCustomisedAudioMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    pageMocks.useRefreshCustomisedAudioMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("queries customised audio list with search and status params", async () => {
    renderCustomisedAudiosPage();

    expect(await screen.findByText("客服女声")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜索音色名称"), {
      target: { value: "品牌" },
    });

    await waitFor(() => {
      expect(pageMocks.useCustomisedAudioPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: "品牌",
        status: undefined,
      });
    });
  });

  it("validates required fields and creates a customised audio", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "audio-9",
        name: "新品介绍音色",
        status: 0,
        progress: 0,
      }),
      isPending: false,
    };
    pageMocks.useCreateCustomisedAudioMutation.mockReturnValue(createMutation);

    renderCustomisedAudiosPage();

    const dialog = openCreateModal();
    clickPrimaryModalButton();

    expect(createMutation.mutateAsync).not.toHaveBeenCalled();

    const textboxes = within(dialog).getAllByRole("textbox");
    fireEvent.change(textboxes[0], {
      target: { value: "新品介绍音色" },
    });
    fireEvent.change(textboxes[1], {
      target: { value: "https://example.com/source.wav" },
    });
    fireEvent.change(textboxes[2], {
      target: { value: "欢迎来到直播间" },
    });

    clickPrimaryModalButton();

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith({
        name: "新品介绍音色",
        url: "https://example.com/source.wav",
        modelType: "tts",
        language: "cn",
        text: "欢迎来到直播间",
      });
    });
  });

  it("opens edit modal and backfills the selected audio data", async () => {
    renderCustomisedAudiosPage();

    expect(await screen.findByText("客服女声")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "编辑音色-audio-1" }));

    const dialog = await screen.findByRole("dialog");
    const textboxes = within(dialog).getAllByRole("textbox");

    expect(within(dialog).getByText("编辑音色")).toBeInTheDocument();
    expect(textboxes[0]).toHaveValue("客服女声");
    expect(textboxes[1]).toHaveValue("https://example.com/audio-1.wav");
  });

  it("refreshes and deletes a customised audio", async () => {
    const refreshMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    const deleteMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    pageMocks.useRefreshCustomisedAudioMutation.mockReturnValue(refreshMutation);
    pageMocks.useDeleteCustomisedAudioMutation.mockReturnValue(deleteMutation);

    renderCustomisedAudiosPage();

    expect(await screen.findByText("客服女声")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刷新音色-audio-1" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("audio-1");

    fireEvent.click(screen.getByRole("button", { name: "删除音色-audio-1" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("audio-1");
  });
});
