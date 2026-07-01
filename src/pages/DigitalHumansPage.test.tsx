import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DigitalHumansPage } from "./DigitalHumansPage";

const pageMocks = vi.hoisted(() => ({
  useDigitalHumanPage: vi.fn(),
  useCreateDigitalHumanMutation: vi.fn(),
  useDeleteDigitalHumanMutation: vi.fn(),
  useRefreshDigitalHumanMutation: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}));

vi.mock("../features/digital-human/hooks", () => ({
  useDigitalHumanPage: pageMocks.useDigitalHumanPage,
  useCreateDigitalHumanMutation: pageMocks.useCreateDigitalHumanMutation,
  useDeleteDigitalHumanMutation: pageMocks.useDeleteDigitalHumanMutation,
  useRefreshDigitalHumanMutation: pageMocks.useRefreshDigitalHumanMutation,
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

function renderDigitalHumansPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/digital-humans"]}>
        <DigitalHumansPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function openCreateModal() {
  fireEvent.click(screen.getByRole("button", { name: "新建数字人" }));
  return screen.getByRole("dialog");
}

function clickPrimaryModalButton() {
  const submitButton = document.querySelector(".ant-modal-footer .ant-btn-primary");
  if (!(submitButton instanceof HTMLButtonElement)) {
    throw new Error("未找到弹窗确认按钮");
  }

  fireEvent.click(submitButton);
}

describe("DigitalHumansPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));
    vi.stubGlobal(
      "URL",
      Object.assign(globalThis.URL ?? {}, {
        createObjectURL: vi.fn((file: File) => `blob:${file.name}`),
        revokeObjectURL: vi.fn(),
      }),
    );

    pageMocks.useDigitalHumanPage.mockReturnValue({
      data: {
        list: [
          {
            id: "human-1",
            name: "Human One",
            status: 1,
            statusLabel: "processing",
            progress: 66,
          },
          {
            id: "human-2",
            name: "Human Two",
            status: 2,
            statusLabel: "success",
            progress: 100,
            previewVideoUrl: "https://example.com/human-2.mp4",
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

    pageMocks.useCreateDigitalHumanMutation.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        id: "human-3",
        name: "New Human",
        status: 0,
        statusLabel: "queued",
      }),
      isPending: false,
    });

    pageMocks.useDeleteDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    pageMocks.useRefreshDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  it("queries digital humans with search params", async () => {
    renderDigitalHumansPage();

    expect(await screen.findByText("Human One")).toBeInTheDocument();

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Human Two" },
    });

    await waitFor(() => {
      expect(pageMocks.useDigitalHumanPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: "Human Two",
        status: undefined,
      });
    });
  });

  it("validates required fields, creates a digital human and navigates to detail", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "human-9",
        name: "New Human",
        status: 0,
        statusLabel: "queued",
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanMutation.mockReturnValue(createMutation);

    renderDigitalHumansPage();

    const dialog = openCreateModal();
    clickPrimaryModalButton();

    expect(createMutation.mutateAsync).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getAllByRole("textbox")[0], {
      target: { value: "New Human" },
    });

    fireEvent.change(screen.getByTestId("digital-human-upload-input"), {
      target: {
        files: [new File(["video"], "train.mp4", { type: "video/mp4" })],
      },
    });

    clickPrimaryModalButton();

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Human",
          trainType: "both",
          language: "cn",
          errorSkip: false,
          file: expect.any(File),
        }),
      );
    });

    expect(pageMocks.navigate).toHaveBeenCalledWith("/digital-humans/human-9");
  });

  it("switches to remote url mode and maps the fileUrl payload", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "human-10",
        name: "Remote Human",
        status: 0,
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanMutation.mockReturnValue(createMutation);

    renderDigitalHumansPage();

    const dialog = openCreateModal();
    fireEvent.click(within(dialog).getAllByRole("radio")[1]);

    const textboxes = within(dialog).getAllByRole("textbox");
    fireEvent.change(textboxes[0], {
      target: { value: "Remote Human" },
    });
    fireEvent.change(textboxes[1], {
      target: { value: "https://example.com/train.mp4" },
    });

    clickPrimaryModalButton();

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith({
        name: "Remote Human",
        trainType: "both",
        language: "cn",
        errorSkip: false,
        fileUrl: "https://example.com/train.mp4",
      });
    });
  });

  it("previews an uploaded image file in the create modal", async () => {
    renderDigitalHumansPage();
    openCreateModal();

    fireEvent.change(screen.getByTestId("digital-human-upload-input"), {
      target: {
        files: [new File(["image"], "poster.png", { type: "image/png" })],
      },
    });

    expect(await screen.findByAltText("本地上传图片预览")).toHaveAttribute(
      "src",
      "blob:poster.png",
    );
  });

  it("previews an uploaded video file in the create modal", async () => {
    renderDigitalHumansPage();
    openCreateModal();

    fireEvent.change(screen.getByTestId("digital-human-upload-input"), {
      target: {
        files: [new File(["video"], "train.mp4", { type: "video/mp4" })],
      },
    });

    const preview = await screen.findByTestId("digital-human-upload-video-preview");
    expect(preview).toHaveAttribute("src", "blob:train.mp4");
  });

  it("refreshes status, navigates to detail and deletes a digital human", async () => {
    const refreshMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    const deleteMutation = {
      mutate: vi.fn(),
      isPending: false,
    };
    pageMocks.useRefreshDigitalHumanMutation.mockReturnValue(refreshMutation);
    pageMocks.useDeleteDigitalHumanMutation.mockReturnValue(deleteMutation);

    renderDigitalHumansPage();

    expect(await screen.findByText("Human One")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "查看详情-human-1" }));
    expect(pageMocks.navigate).toHaveBeenCalledWith("/digital-humans/human-1");

    fireEvent.click(screen.getByRole("button", { name: "刷新状态-human-1" }));
    expect(refreshMutation.mutate).toHaveBeenCalledWith("human-1");

    fireEvent.click(screen.getByRole("button", { name: "删除数字人-human-1" }));
    expect(deleteMutation.mutate).toHaveBeenCalledWith("human-1");
  });

  it("shows loading, empty and error states", () => {
    pageMocks.useDigitalHumanPage
      .mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: {
          list: [],
          total: 0,
          pageNum: 1,
          pageSize: 10,
          pages: 0,
        },
        isLoading: false,
        isError: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error("list failed"),
      });

    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Human One")).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.queryByText("Human One")).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.queryByText("Human One")).not.toBeInTheDocument();
  });
});
