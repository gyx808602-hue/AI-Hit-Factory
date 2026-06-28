import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { videoRemixStatusOptions } from "../features/video-remix/status";
import { VideoRemixTasksPage } from "./VideoRemixTasksPage";

const listPageMocks = vi.hoisted(() => ({
  getVideoRemixTaskPage: vi.fn(),
  deleteVideoRemixTask: vi.fn(),
  createVideoRemixTask: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/aigc/video-remix-tasks", () => ({
  getVideoRemixTaskPage: listPageMocks.getVideoRemixTaskPage,
  deleteVideoRemixTask: listPageMocks.deleteVideoRemixTask,
  createVideoRemixTask: listPageMocks.createVideoRemixTask,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => listPageMocks.navigate,
  };
});

function renderTaskListPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/viral-remix/tasks"]}>
        <VideoRemixTasksPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("VideoRemixTasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    listPageMocks.getVideoRemixTaskPage.mockImplementation((params?: { status?: number }) => {
      if (params?.status === 2) {
        return Promise.resolve({
          list: [
            {
              id: 2,
              name: "Completed Task",
              status: 2,
              statusLabel: "已完成",
              progress: 100,
              videoUrl: "https://example.com/result.mp4",
            },
          ],
          total: 1,
        });
      }

      return Promise.resolve({
        list: [
          {
            id: 1,
            name: "Queued Task",
            remark: "Waiting for generation",
            status: 0,
            statusLabel: "排队中",
            progress: 10,
          },
          {
            id: 2,
            name: "Completed Task",
            status: 2,
            statusLabel: "已完成",
            progress: 100,
            videoUrl: "https://example.com/result.mp4",
          },
        ],
        total: 2,
      });
    });

    listPageMocks.deleteVideoRemixTask.mockResolvedValue(undefined);
    listPageMocks.createVideoRemixTask.mockResolvedValue({
      id: 101,
      name: "New Remix Task",
      status: 0,
      statusLabel: "待处理",
      progress: 0,
    });
  });

  it("filters tasks by status and requests the matching status parameter", async () => {
    renderTaskListPage();

    expect(await screen.findByText("Queued Task")).toBeInTheDocument();
    expect(screen.getByText("Completed Task")).toBeInTheDocument();

    const completedOption = videoRemixStatusOptions.find((option) => option.value === 2);

    expect(completedOption).toBeDefined();

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(await screen.findByText(String(completedOption!.label)));

    await waitFor(() => {
      expect(listPageMocks.getVideoRemixTaskPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        keyword: undefined,
        status: 2,
      });
    });
  });

  it("deletes a task and refreshes the current list", async () => {
    renderTaskListPage();

    const queuedTaskCell = await screen.findByText("Queued Task");
    const queuedRow = queuedTaskCell.closest("tr");

    expect(queuedRow).not.toBeNull();

    const rowButtons = within(queuedRow as HTMLElement).getAllByRole("button");

    fireEvent.click(rowButtons[1]!);

    await waitFor(() => {
      expect(listPageMocks.deleteVideoRemixTask).toHaveBeenCalledWith(1);
    });

    expect(listPageMocks.getVideoRemixTaskPage).toHaveBeenCalledTimes(2);
  });

  it("navigates to detail page from the row action", async () => {
    renderTaskListPage();

    const queuedTaskCell = await screen.findByText("Queued Task");
    const queuedRow = queuedTaskCell.closest("tr");

    expect(queuedRow).not.toBeNull();

    const rowButtons = within(queuedRow as HTMLElement).getAllByRole("button");

    fireEvent.click(rowButtons[0]!);

    expect(listPageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks/1");
  });

  it("renders a clickable result link when the task has a generated video", async () => {
    renderTaskListPage();

    const completedTaskCell = await screen.findByText("Completed Task");
    const completedRow = completedTaskCell.closest("tr");

    expect(completedRow).not.toBeNull();

    const resultLink = within(completedRow as HTMLElement).getByRole("link");

    expect(resultLink).toHaveAttribute("href", "https://example.com/result.mp4");
    expect(resultLink).toHaveAttribute("target", "_blank");
    expect(resultLink).toHaveAttribute("rel", "noreferrer");
    expect(resultLink).toHaveTextContent("查看成品");
  });

  it("opens create modal, creates a task and navigates to detail page", async () => {
    renderTaskListPage();

    await screen.findByText("Queued Task");
    fireEvent.click(screen.getByRole("button", { name: "新建追爆任务" }));

    expect(await screen.findByText("创建视频追爆任务")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "创建任务" }));
    expect(await screen.findByText("请输入任务名称")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("如：追爆-双11大促"), {
      target: { value: "New Remix Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("可选"), {
      target: { value: "Need product and prompt details" },
    });

    fireEvent.click(screen.getByRole("button", { name: "创建任务" }));

    await waitFor(() => {
      expect(listPageMocks.createVideoRemixTask).toHaveBeenCalledWith({
        name: "New Remix Task",
        remark: "Need product and prompt details",
      });
    });

    expect(listPageMocks.navigate).toHaveBeenCalledWith("/viral-remix/tasks/101");
  });
});
