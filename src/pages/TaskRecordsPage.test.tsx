import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskRecordsPage } from "./TaskRecordsPage";

const pageMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  };
});

describe("TaskRecordsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides an entry back to the real text-image-video task page", () => {
    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <TaskRecordsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /文图生视频任务页/i }));

    expect(pageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });
});
