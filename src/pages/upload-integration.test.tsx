import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageVideoPage } from "./ImageVideoPage";
import { ProductVideoPage } from "./ProductVideoPage";
import { ViralRemixPage } from "./ViralRemixPage";

const uploadMocks = vi.hoisted(() => ({
  uploadImage: vi.fn(),
  uploadVideo: vi.fn(),
}));

vi.mock("../api/aigc/uploads", () => ({
  uploadImage: uploadMocks.uploadImage,
  uploadVideo: uploadMocks.uploadVideo,
}));

function renderWithPageContext(ui: ReactElement, initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("upload integrations", () => {
  beforeEach(() => {
    uploadMocks.uploadImage.mockReset();
    uploadMocks.uploadVideo.mockReset();
  });

  it("uploads source video and replace-product image in viral remix page", async () => {
    uploadMocks.uploadVideo.mockResolvedValue({
      url: "https://oss.example.com/source.mp4",
      objectKey: "aigc/video/20260623/source.mp4",
      originalFilename: "source.mp4",
    });
    uploadMocks.uploadImage.mockResolvedValue({
      url: "https://oss.example.com/product.png",
      objectKey: "aigc/image/20260623/product.png",
      originalFilename: "product.png",
    });

    renderWithPageContext(<ViralRemixPage />, "/viral-remix");

    fireEvent.change(screen.getByTestId("viral-source-upload-input"), {
      target: {
        files: [new File(["video"], "source.mp4", { type: "video/mp4" })],
      },
    });

    await waitFor(() => {
      expect(uploadMocks.uploadVideo).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("source.mp4")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("remix-mode-replace-product"));

    fireEvent.change(screen.getByTestId("viral-product-image-upload-input"), {
      target: {
        files: [new File(["image"], "product.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(uploadMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("product.png")).toBeInTheDocument();
  });

  it("uploads images in image video page and renders uploaded file names", async () => {
    uploadMocks.uploadImage.mockResolvedValueOnce({
      url: "https://oss.example.com/a.png",
      objectKey: "aigc/image/20260623/a.png",
      originalFilename: "a.png",
    });
    uploadMocks.uploadImage.mockResolvedValueOnce({
      url: "https://oss.example.com/b.png",
      objectKey: "aigc/image/20260623/b.png",
      originalFilename: "b.png",
    });

    renderWithPageContext(<ImageVideoPage />, "/image-video");

    fireEvent.change(screen.getByTestId("image-video-upload-input"), {
      target: {
        files: [
          new File(["image-a"], "a.png", { type: "image/png" }),
          new File(["image-b"], "b.png", { type: "image/png" }),
        ],
      },
    });

    await waitFor(() => {
      expect(uploadMocks.uploadImage).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
  });

  it("uploads product images in product video page and renders uploaded file names", async () => {
    uploadMocks.uploadImage.mockResolvedValue({
      url: "https://oss.example.com/cup.png",
      objectKey: "aigc/image/20260623/cup.png",
      originalFilename: "cup.png",
    });

    renderWithPageContext(<ProductVideoPage />, "/product-video");

    fireEvent.change(screen.getByTestId("product-video-image-upload-input"), {
      target: {
        files: [new File(["cup"], "cup.png", { type: "image/png" })],
      },
    });

    await waitFor(() => {
      expect(uploadMocks.uploadImage).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("cup.png")).toBeInTheDocument();
  });
});
