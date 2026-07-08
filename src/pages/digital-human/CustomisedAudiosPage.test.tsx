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
  uploadAudio: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}));

vi.mock("../../features/digital-human/audio/hooks", () => ({
  useCustomisedAudioPage: pageMocks.useCustomisedAudioPage,
  useCreateCustomisedAudioMutation: pageMocks.useCreateCustomisedAudioMutation,
  useDeleteCustomisedAudioMutation: pageMocks.useDeleteCustomisedAudioMutation,
  useRefreshCustomisedAudioMutation: pageMocks.useRefreshCustomisedAudioMutation,
}));

vi.mock("../../api/aigc/uploads", () => ({
  uploadAudio: pageMocks.uploadAudio,
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
    throw new Error("Modal primary button not found");
  }

  fireEvent.click(submitButton);
}

function getAudioUploadInput() {
  const uploadInput = screen.getByTestId("customised-audio-upload-input");
  expect(uploadInput).toBeInTheDocument();
  return uploadInput as HTMLInputElement;
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
            name: "瀹㈡湇濂冲０",
            status: 1,
            statusLabel: "processing",
            progress: 65,
            audioPath: "https://example.com/audio-1.wav",
            language: "cn",
            modelType: "tts",
          },
          {
            id: "audio-2",
            name: "鍝佺墝鐢峰０",
            status: 2,
            statusLabel: "done",
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
        name: "鏂板搧浠嬬粛闊宠壊",
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

    pageMocks.uploadAudio.mockResolvedValue({
      url: "https://example.com/uploaded-source.wav",
      objectKey: "audio/uploaded-source.wav",
      originalFilename: "uploaded-source.wav",
    });
  });

  it("queries customised audio list with search and status params", async () => {
    renderCustomisedAudiosPage();

    expect(await screen.findByText("瀹㈡湇濂冲０")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜索音色名称"), {
      target: { value: "鍝佺墝" },
    });

    await waitFor(() => {
      expect(pageMocks.useCustomisedAudioPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: "鍝佺墝",
        status: undefined,
      });
    });
  });

  it("only renders required create fields and creates a customised audio from uploaded audio url", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "audio-9",
        name: "鏂板搧浠嬬粛闊宠壊",
        status: 0,
        progress: 0,
      }),
      isPending: false,
    };
    pageMocks.useCreateCustomisedAudioMutation.mockReturnValue(createMutation);

    renderCustomisedAudiosPage();

    const dialog = openCreateModal();
    expect(within(dialog).getAllByRole("textbox")).toHaveLength(1);
    expect(within(dialog).queryByRole("combobox")).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("textbox", { name: /preview/i })).not.toBeInTheDocument();
    clickPrimaryModalButton();

    expect(createMutation.mutateAsync).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByRole("textbox"), {
      target: { value: "Uploaded Voice" },
    });
    fireEvent.change(getAudioUploadInput(), {
      target: {
        files: [new File(["audio"], "uploaded-source.wav", { type: "audio/wav" })],
      },
    });
    expect(await screen.findByText("uploaded-source.wav")).toBeInTheDocument();
    expect(screen.getByTestId("customised-audio-preview")).toHaveAttribute(
      "src",
      "https://example.com/uploaded-source.wav",
    );

    clickPrimaryModalButton();

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith({
        name: "Uploaded Voice",
        url: "https://example.com/uploaded-source.wav",
      });
    });
  });

  it("clears uploaded audio and blocks stale url submission after delete", async () => {
    const createMutation = {
      mutateAsync: vi.fn(),
      isPending: false,
    };
    pageMocks.useCreateCustomisedAudioMutation.mockReturnValue(createMutation);

    renderCustomisedAudiosPage();

    const dialog = openCreateModal();
    fireEvent.change(within(dialog).getByRole("textbox"), {
      target: { value: "Uploaded Voice" },
    });
    fireEvent.change(getAudioUploadInput(), {
      target: {
        files: [new File(["audio"], "uploaded-source.wav", { type: "audio/wav" })],
      },
    });

    expect(await screen.findByText("uploaded-source.wav")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "删除音频" }));
    expect(screen.queryByTestId("customised-audio-preview")).not.toBeInTheDocument();

    clickPrimaryModalButton();

    expect(createMutation.mutateAsync).not.toHaveBeenCalled();
    expect(screen.queryByText("uploaded-source.wav")).not.toBeInTheDocument();
  });

  it("opens edit modal and backfills the selected audio data", async () => {
    renderCustomisedAudiosPage();

    expect(await screen.findByText("瀹㈡湇濂冲０")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "编辑音色-audio-1" }));

    const dialog = await screen.findByRole("dialog");
    const textboxes = within(dialog).getAllByRole("textbox");

    expect(within(dialog).getByText("编辑音色")).toBeInTheDocument();
    expect(textboxes[0]).toHaveValue("瀹㈡湇濂冲０");
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

    expect(await screen.findByText("瀹㈡湇濂冲０")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "刷新音色-audio-1" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("audio-1");

    fireEvent.click(screen.getByRole("button", { name: "删除音色-audio-1" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("audio-1");
  });
});


