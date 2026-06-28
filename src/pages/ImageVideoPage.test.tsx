import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageVideoPage } from "./ImageVideoPage";

const pageMocks = vi.hoisted(() => ({
  uploadImage: vi.fn(),
  createTextImageVideoTask: vi.fn(),
  generateTextImageVideoPrompt: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadImage: pageMocks.uploadImage,
}));

vi.mock("../api/customer/text-image-video", () => ({
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

function renderImageVideoPage() {
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

function getUploadInput() {
  const input = document.querySelector('input[type="file"][name="file"]');
  expect(input).not.toBeNull();
  return input as HTMLInputElement;
}

describe("ImageVideoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageMocks.uploadImage.mockResolvedValue({
      url: "https://example.com/a.png",
      objectKey: "a.png",
      originalFilename: "a.png",
    });
    pageMocks.createTextImageVideoTask.mockResolvedValue({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "Generate a tea promo video",
      model: "seedance2.0",
      status: 0,
    });
    pageMocks.generateTextImageVideoPrompt.mockResolvedValue({
      prompt: "Generate a short mixed-media promo about office wellness tea for busy workers.",
    });
  });

  it("renders the create page sections including topic and ai prompt generation", () => {
    renderImageVideoPage();

    expect(screen.getByRole("button", { name: /AI.*生成文案/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/视频主题/i)).toBeInTheDocument();
    expect(getUploadInput()).toBeInTheDocument();
  });

  it("renders the prompt input after the upload section", () => {
    renderImageVideoPage();

    const uploadSection = screen.getByTestId("image-video-upload-section");
    const promptSection = screen.getByTestId("image-video-prompt-section");

    expect(
      uploadSection.compareDocumentPosition(promptSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("generates prompt from topic and keeps the prompt editable before create", async () => {
    renderImageVideoPage();

    fireEvent.change(screen.getByLabelText(/视频主题/i), {
      target: { value: "办公室养生茶推荐" },
    });

    fireEvent.change(getUploadInput(), {
      target: {
        files: [new File(["image"], "a.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: /AI.*生成文案/i }));

    await waitFor(() => {
      expect(pageMocks.generateTextImageVideoPrompt).toHaveBeenCalledWith({
        topic: "办公室养生茶推荐",
        imageUrls: ["https://example.com/a.png"],
        inputMode: "mixed",
      });
    });

    const promptInput = screen.getByRole("textbox", { name: /文案内容|输入文案|生成文案/i });
    expect(promptInput).toHaveValue(
      "Generate a short mixed-media promo about office wellness tea for busy workers.",
    );

    fireEvent.change(promptInput, {
      target: { value: "生成更口语化、更适合上班族传播的办公室养生茶短视频文案。" },
    });

    fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).toHaveBeenCalledWith({
        imageUrls: ["https://example.com/a.png"],
        prompt: "生成更口语化、更适合上班族传播的办公室养生茶短视频文案。",
        model: "seedance2.0",
      });
    });
  });

  it("blocks prompt generation in mixed mode when images are missing", async () => {
    renderImageVideoPage();

    fireEvent.change(screen.getByLabelText(/视频主题/i), {
      target: { value: "办公室养生茶推荐" },
    });

    fireEvent.click(screen.getByRole("button", { name: /AI.*生成文案/i }));

    await waitFor(() => {
      expect(pageMocks.generateTextImageVideoPrompt).not.toHaveBeenCalled();
    });

    expect(screen.getByText("请先上传至少一张参考图")).toBeInTheDocument();
  });

  it("renders uploaded images as managed upload items", async () => {
    pageMocks.uploadImage
      .mockResolvedValueOnce({
        url: "https://example.com/a.png",
        objectKey: "a.png",
        originalFilename: "a.png",
      })
      .mockResolvedValueOnce({
        url: "https://example.com/b.png",
        objectKey: "b.png",
        originalFilename: "b.png",
      });

    renderImageVideoPage();

    fireEvent.change(getUploadInput(), {
      target: {
        files: [
          new File(["image-a"], "a.png", { type: "image/png" }),
          new File(["image-b"], "b.png", { type: "image/png" }),
        ],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
  });

  it("removes deleted upload item from ui and payload", async () => {
    renderImageVideoPage();

    fireEvent.change(getUploadInput(), {
      target: {
        files: [new File(["image"], "a.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: /删除图片-a\.png/i }));
    fireEvent.click(screen.getByText("文字输入"));

    fireEvent.change(screen.getByLabelText(/视频主题/i), {
      target: { value: "Tea topic" },
    });

    const promptInput = screen.getByRole("textbox", { name: /文案内容|输入文案|生成文案/i });
    fireEvent.change(promptInput, {
      target: { value: "prompt text" },
    });

    fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).toHaveBeenCalledWith({
        imageUrls: [],
        prompt: "prompt text",
        model: "seedance2.0",
      });
    });
  });

  it("navigates to task list from the header action", () => {
    renderImageVideoPage();

    fireEvent.click(screen.getByRole("button", { name: /查看任务列表/i }));

    expect(pageMocks.navigate).toHaveBeenCalledWith("/image-video/tasks");
  });

  it("blocks submit when required fields are missing", async () => {
    renderImageVideoPage();

    fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

    await waitFor(() => {
      expect(pageMocks.createTextImageVideoTask).not.toHaveBeenCalled();
    });

    expect(screen.getByText("请先上传至少一张参考图")).toBeInTheDocument();
    expect(screen.getByText("请输入视频提示词")).toBeInTheDocument();
  });
});
