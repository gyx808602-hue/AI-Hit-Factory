import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextImageVideoTasksPage } from "./TextImageVideoTasksPage";

const listPageMocks = vi.hoisted(() => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
  useQueryClient: vi.fn(),
  deleteTextImageVideoTask: vi.fn(),
  getTextImageVideoTaskPage: vi.fn(),
  navigate: vi.fn(),
  invalidateQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: listPageMocks.useMutation,
  useQuery: listPageMocks.useQuery,
  useQueryClient: listPageMocks.useQueryClient,
}));

vi.mock("../api/customer/text-image-video", () => ({
  getTextImageVideoTaskPage: listPageMocks.getTextImageVideoTaskPage,
  deleteTextImageVideoTask: listPageMocks.deleteTextImageVideoTask,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => listPageMocks.navigate,
  };
});

function createUseQueryResult(overrides?: Record<string, unknown>) {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

function renderTaskListPage() {
  return render(
    <MemoryRouter initialEntries={["/image-video/tasks"]}>
      <TextImageVideoTasksPage />
    </MemoryRouter>,
  );
}

describe("TextImageVideoTasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    const taskPageData = {
      list: [
        {
          id: 1,
          imageUrls: ["https://example.com/a.png"],
          prompt: "Queued task",
          model: "seedance2.0",
          status: 0,
          statusLabel: "queued",
          progress: 10,
        },
        {
          id: 2,
          imageUrls: ["https://example.com/b.png"],
          prompt: "Finished task",
          model: "seedance2.0",
          status: 2,
          statusLabel: "done",
          progress: 100,
          videoUrl: "https://example.com/result.mp4",
        },
      ],
      total: 2,
    };

    listPageMocks.useQueryClient.mockReturnValue({
      invalidateQueries: listPageMocks.invalidateQueries,
    });
    listPageMocks.useMutation.mockReturnValue({
      mutate: vi.fn((taskId: number) => {
        listPageMocks.deleteTextImageVideoTask(taskId);
        listPageMocks.invalidateQueries({ queryKey: ["text-image-video", "tasks"] });
      }),
    });
    listPageMocks.getTextImageVideoTaskPage.mockResolvedValue(taskPageData);
    listPageMocks.useQuery.mockReturnValue(
      createUseQueryResult({
        data: taskPageData,
      }),
    );
  });

  it("filters tasks by status and requests the matching status parameter", async () => {
    renderTaskListPage();

    expect(screen.getByText("Queued task")).toBeInTheDocument();
    expect(screen.getByText("Finished task")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "已完成" }));

    const secondQueryOptions = listPageMocks.useQuery.mock.calls.at(-1)?.[0];
    const pageData = await secondQueryOptions.queryFn();

    expect(pageData).toEqual({
      list: [
        {
          id: 1,
          imageUrls: ["https://example.com/a.png"],
          prompt: "Queued task",
          model: "seedance2.0",
          status: 0,
          statusLabel: "queued",
          progress: 10,
        },
        {
          id: 2,
          imageUrls: ["https://example.com/b.png"],
          prompt: "Finished task",
          model: "seedance2.0",
          status: 2,
          statusLabel: "done",
          progress: 100,
          videoUrl: "https://example.com/result.mp4",
        },
      ],
      total: 2,
    });

    expect(listPageMocks.getTextImageVideoTaskPage).toHaveBeenLastCalledWith({
      pageNum: 1,
      pageSize: 10,
      status: 2,
    });
  });

  it("deletes a task and refreshes the current list", async () => {
    renderTaskListPage();

    fireEvent.click(screen.getByRole("button", { name: "删除任务-1" }));

    await waitFor(() => {
      expect(listPageMocks.deleteTextImageVideoTask).toHaveBeenCalledWith(1);
    });

    expect(listPageMocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["text-image-video", "tasks"],
    });
  });

  it("debounces duplicate delete clicks for the same task", async () => {
    renderTaskListPage();

    const deleteButton = screen.getByRole("button", { name: "删除任务-1" });
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(listPageMocks.deleteTextImageVideoTask).toHaveBeenCalledTimes(1);
    });
  });

  it("polls the list while it still contains processing tasks", () => {
    renderTaskListPage();

    const queryOptions = listPageMocks.useQuery.mock.calls[0]?.[0];
    const interval = queryOptions.refetchInterval({
      state: {
        data: {
          list: [
            {
              id: 1,
              imageUrls: [],
              prompt: "Queued task",
              model: "seedance2.0",
              status: 0,
              statusLabel: "queued",
              progress: 10,
            },
          ],
        },
      },
    });

    expect(interval).toBe(5000);
  });

  it("does not poll the list when all tasks are already finished", () => {
    renderTaskListPage();

    const queryOptions = listPageMocks.useQuery.mock.calls[0]?.[0];
    const interval = queryOptions.refetchInterval({
      state: {
        data: {
          list: [
            {
              id: 2,
              imageUrls: [],
              prompt: "Finished task",
              model: "seedance2.0",
              status: 2,
              statusLabel: "done",
              progress: 100,
              videoUrl: "https://example.com/result.mp4",
            },
          ],
        },
      },
    });

    expect(interval).toBe(false);
  });
});
