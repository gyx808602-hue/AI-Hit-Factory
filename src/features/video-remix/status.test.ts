import { describe, expect, it } from "vitest";
import { getVideoRemixTaskStatusMeta } from "./status";

describe("video-remix status helpers", () => {
  it("uses returned statusLabel as the primary label", () => {
    const meta = getVideoRemixTaskStatusMeta({
      id: 1,
      name: "任务",
      status: 0,
      statusLabel: "处理中",
    });

    expect(meta.label).toBe("处理中");
  });

  it("treats tasks with videoUrl as successful result state", () => {
    const meta = getVideoRemixTaskStatusMeta({
      id: 1,
      name: "任务",
      status: 7,
      videoUrl: "https://example.com/result.mp4",
    });

    expect(meta.tone).toBe("success");
    expect(meta.resultState).toBe("success");
  });

  it("treats tasks with errReason as failed result state", () => {
    const meta = getVideoRemixTaskStatusMeta({
      id: 1,
      name: "任务",
      status: 4,
      errReason: "生成失败",
    });

    expect(meta.tone).toBe("failed");
    expect(meta.resultState).toBe("failed");
  });
});
