import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageVideoPage } from "./ImageVideoPage";

const pageMocks = vi.hoisted(() => ({
  uploadImage: vi.fn(),
  createTextImageVideoTask: vi.fn(),
  generateTextImageVideoPrompt: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../api/aigc/uploads", () => ({
  uploadImage: pageMocks.uploadImage,
}));

vi.mock("../../api/customer/text-image-video", () => ({
  createTextImageVideoTask: pageMocks.createTextImageVideoTask,
  generateTextImageVideoPrompt: pageMocks.generateTextImageVideoPrompt,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  };
});

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/image-video"]}>
        <ImageVideoPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function getCreateButton() {
  const buttons = Array.from(document.querySelectorAll("button"));
  const createButton = buttons.at(-1);
  expect(createButton).toBeInstanceOf(HTMLButtonElement);
  return createButton as HTMLButtonElement;
}

describe("ImageVideoPage submission guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageMocks.uploadImage.mockResolvedValue({
      url: "https://example.com/a.png",
      objectKey: "a.png",
      originalFilename: "a.png",
    });
  });

  it("guards duplicate create clicks while task creation is pending", async () => {
    let resolveCreate: (value: {
      id: number;
      imageUrls: string[];
      prompt: string;
      model: string;
      status: number;
    }) => void = () => undefined;

    pageMocks.createTextImageVideoTask.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve;
        }),
    );

    renderPage();

    fireEvent.change(document.querySelector("#image-video-topic") as HTMLInputElement, {
      target: { value: "Tea topic" },
    });
    fireEvent.change(document.querySelector('input[type="file"][name="file"]') as HTMLInputElement, {
      target: {
        files: [new File(["image"], "a.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(document.querySelector("#image-video-prompt") as HTMLTextAreaElement, {
      target: { value: "prompt text" },
    });

    const createButton = getCreateButton();
    fireEvent.click(createButton);
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).toHaveBeenCalled();
    });

    expect(pageMocks.createTextImageVideoTask).toHaveBeenCalledTimes(1);
    expect(createButton.disabled || createButton.classList.contains("ant-btn-loading")).toBe(true);

    resolveCreate({
      id: 102,
      imageUrls: ["https://example.com/a.png"],
      prompt: "prompt text",
      model: "dreamina-seedance-2-0",
      status: 0,
    });
  });
});
