import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextImageVideoTasksPage } from "./TextImageVideoTasksPage";

const listPageMocks = vi.hoisted(() => ({
  getTextImageVideoTaskPage: vi.fn(),
  deleteTextImageVideoTask: vi.fn(),
  navigate: vi.fn(),
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

function renderTaskListPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/image-video/tasks"]}>
        <TextImageVideoTasksPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TextImageVideoTasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));

    listPageMocks.getTextImageVideoTaskPage.mockImplementation((params?: { status?: number }) => {
      if (params?.status === 2) {
        return Promise.resolve({
          list: [
            {
              id: 2,
              imageUrls: ["https://example.com/b.png"],
              prompt: "已完成任务",
              model: "seedance2.0",
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
            imageUrls: ["https://example.com/a.png"],
            prompt: "排队任务",
            model: "seedance2.0",
            status: 0,
            statusLabel: "排队中",
            progress: 10,
          },
          {
            id: 2,
            imageUrls: ["https://example.com/b.png"],
            prompt: "已完成任务",
            model: "seedance2.0",
            status: 2,
            statusLabel: "已完成",
            progress: 100,
            videoUrl: "https://example.com/result.mp4",
          },
        ],
        total: 2,
      });
    });

    listPageMocks.deleteTextImageVideoTask.mockResolvedValue(undefined);
  });

  it("filters tasks by status and requests the matching status parameter", async () => {
    renderTaskListPage();

    expect(await screen.findByText("排队任务")).toBeInTheDocument();
    expect(screen.getByText("已完成任务")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "已完成" }));

    await waitFor(() => {
      expect(listPageMocks.getTextImageVideoTaskPage).toHaveBeenLastCalledWith({
        pageNum: 1,
        pageSize: 10,
        status: 2,
      });
    });
  });

  it("deletes a task and refreshes the current list", async () => {
    renderTaskListPage();

    expect(await screen.findByText("排队任务")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "删除任务-1" }));

    await waitFor(() => {
      expect(listPageMocks.deleteTextImageVideoTask).toHaveBeenCalledWith(1);
    });

    expect(listPageMocks.getTextImageVideoTaskPage).toHaveBeenCalledTimes(2);
  });

  it("debounces duplicate delete clicks for the same task", async () => {
    let resolveDelete: (() => void) | undefined;
    listPageMocks.deleteTextImageVideoTask.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );

    renderTaskListPage();

    expect(await screen.findByText("排队任务")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "删除任务-1" });
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(listPageMocks.deleteTextImageVideoTask).toHaveBeenCalledTimes(1);
    });

    resolveDelete?.();
  });
});
