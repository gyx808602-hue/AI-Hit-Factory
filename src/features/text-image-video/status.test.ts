import { describe, expect, it } from "vitest";
import { getTextImageVideoTaskStatusMeta } from "./status";

describe("text-image-video status helpers", () => {
  it("uses returned statusLabel as the primary label", () => {
    const meta = getTextImageVideoTaskStatusMeta({
      id: 1,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成视频",
      status: 0,
      statusLabel: "排队中",
    });

    expect(meta.label).toBe("排队中");
  });

  it("treats tasks with videoUrl as successful result state", () => {
    const meta = getTextImageVideoTaskStatusMeta({
      id: 1,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成视频",
      status: 3,
      videoUrl: "https://example.com/result.mp4",
    });

    expect(meta.tone).toBe("success");
    expect(meta.resultState).toBe("success");
  });

  it("falls back to a safe label for unknown statuses", () => {
    const meta = getTextImageVideoTaskStatusMeta({
      id: 1,
      imageUrls: ["https://example.com/a.png"],
      prompt: "生成视频",
      status: 99,
    });

    expect(meta.label).toBe("状态未知");
    expect(meta.resultState).toBe("processing");
  });
});
