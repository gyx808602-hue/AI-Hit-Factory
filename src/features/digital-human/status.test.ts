import { describe, expect, it } from "vitest";
import { getDigitalHumanStatusMeta } from "./status";

describe("digital human status helpers", () => {
  it("uses backend statusLabel as primary label", () => {
    const meta = getDigitalHumanStatusMeta({
      id: "person-1",
      name: "数字人小雅",
      status: 1,
      statusLabel: "训练中",
    });

    expect(meta.label).toBe("训练中");
  });

  it("treats preview video as successful result", () => {
    const meta = getDigitalHumanStatusMeta({
      id: "person-2",
      name: "数字人小美",
      status: 1,
      previewVideoUrl: "https://oss.example.com/person-2.mp4",
    });

    expect(meta.tone).toBe("success");
    expect(meta.resultState).toBe("success");
  });

  it("treats error reason as failed result", () => {
    const meta = getDigitalHumanStatusMeta({
      id: "person-3",
      name: "数字人老陈",
      status: 2,
      errReason: "训练素材不合规",
    });

    expect(meta.tone).toBe("failed");
    expect(meta.resultState).toBe("failed");
  });

  it("falls back safely for unknown statuses", () => {
    const meta = getDigitalHumanStatusMeta({
      id: "person-4",
      name: "未知状态数字人",
      status: 99,
    });

    expect(meta.label).toBe("状态未知");
    expect(meta.resultState).toBe("processing");
  });
});
