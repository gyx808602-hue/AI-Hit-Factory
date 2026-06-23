import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("DigitalHumansPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    pageMocks.useDigitalHumanPage.mockReturnValue({
      data: {
        list: [
          {
            id: "human-1",
            name: "小雅",
            status: 1,
            statusLabel: "训练中",
            progress: 66,
          },
          {
            id: "human-2",
            name: "艾文",
            status: 2,
            statusLabel: "训练完成",
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
        name: "新数字人",
        status: 0,
        statusLabel: "排队中",
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

  it("queries digital humans with search and status params", async () => {
    renderDigitalHumansPage();

    expect(await screen.findByText("小雅")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜索数字人名称"), {
      target: { value: "艾文" },
    });

    await waitFor(() => {
      expect(pageMocks.useDigitalHumanPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: "艾文",
        status: undefined,
      });
    });
  });

  it("opens create modal, validates fields, creates a digital human and navigates to detail", async () => {
    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({
        id: "human-9",
        name: "新数字人",
        status: 0,
        statusLabel: "排队中",
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanMutation.mockReturnValue(createMutation);

    renderDigitalHumansPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    expect(await screen.findByText("请输入数字人名称")).toBeInTheDocument();
    expect(screen.getByText("请上传训练素材")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("请输入数字人名称"), {
      target: { value: "新数字人" },
    });

    fireEvent.change(screen.getByTestId("digital-human-upload-input"), {
      target: {
        files: [new File(["video"], "train.mp4", { type: "video/mp4" })],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "新数字人",
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
        name: "远程数字人",
        status: 0,
      }),
      isPending: false,
    };
    pageMocks.useCreateDigitalHumanMutation.mockReturnValue(createMutation);

    renderDigitalHumansPage();

    fireEvent.click(screen.getByRole("button", { name: "新建数字人" }));
    fireEvent.click(screen.getByRole("radio", { name: "远程 URL" }));

    fireEvent.change(screen.getByPlaceholderText("请输入数字人名称"), {
      target: { value: "远程数字人" },
    });
    fireEvent.change(screen.getByPlaceholderText("请输入训练素材 URL"), {
      target: { value: "https://example.com/train.mp4" },
    });

    fireEvent.click(screen.getByRole("button", { name: "提交创建" }));

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith({
        name: "远程数字人",
        trainType: "both",
        language: "cn",
        errorSkip: false,
        fileUrl: "https://example.com/train.mp4",
      });
    });
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

    expect(await screen.findByText("小雅")).toBeInTheDocument();

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
        error: new Error("列表加载失败"),
      });

    const { rerender } = render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("数字人列表加载中...")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText("暂无数字人")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={["/digital-humans"]}>
          <DigitalHumansPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText("列表加载失败")).toBeInTheDocument();
  });
});
