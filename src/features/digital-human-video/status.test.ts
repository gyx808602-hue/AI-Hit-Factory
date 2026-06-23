import { describe, expect, it } from "vitest";
import { getDigitalHumanVideoStatusMeta } from "./status";

describe("digital human video status helpers", () => {
  it("treats result video as success", () => {
    expect(
      getDigitalHumanVideoStatusMeta({
        name: "成功视频",
        status: 2,
        progress: 100,
        videoUrl: "https://oss.example.com/result.mp4",
      }),
    ).toMatchObject({
      label: "已完成",
      tone: "success",
      resultState: "success",
      canRefresh: false,
    });
  });

  it("treats explicit errors as failed", () => {
    expect(
      getDigitalHumanVideoStatusMeta({
        name: "失败视频",
        status: 4,
        errReason: "音频解析失败",
      }),
    ).toMatchObject({
      label: "生成失败",
      tone: "failed",
      resultState: "failed",
      canRefresh: true,
    });
  });

  it("treats pending states as processing", () => {
    expect(
      getDigitalHumanVideoStatusMeta({
        name: "处理中视频",
        status: 1,
        progress: 38,
      }),
    ).toMatchObject({
      label: "生成中",
      tone: "processing",
      resultState: "processing",
      canRefresh: true,
    });
  });

  it("prefers backend status label when provided", () => {
    expect(
      getDigitalHumanVideoStatusMeta({
        name: "后端标签视频",
        status: 1,
        statusLabel: "队列处理中",
      }),
    ).toMatchObject({
      label: "队列处理中",
    });
  });
});
