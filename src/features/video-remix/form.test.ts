import { describe, expect, it } from "vitest";
import { mapTaskDetailToFormValues, mapFormValuesToSavePayload } from "./form";

describe("video-remix form helpers", () => {
  it("uses seedance2.0 as the default target model", () => {
    const values = mapTaskDetailToFormValues({
      id: 1,
      name: "杩界垎浠诲姟",
      status: 0,
      form: {},
    });

    expect(values.targetVideoModel).toBe("seedance2.0");
  });

  it("falls back to seedance2.0 when save payload target model is empty", () => {
    const payload = mapFormValuesToSavePayload({
      name: "追爆任务",
      remark: "备注",
      targetVideoModel: "",
      referenceVideoUrl: "https://example.com/source.mp4",
      productImageUrlsText: "https://example.com/p1.png",
      characterImageUrlsText: "",
      audioUrl: "",
      productInfo: "商品信息",
      voiceoverScript: "口播脚本",
      direction: "改编方向",
      editablePrompt: "",
      generationDuration: 15,
    });

    expect(payload.targetVideoModel).toBe("seedance2.0");
  });

  it("maps task detail into editable form values", () => {
    const values = mapTaskDetailToFormValues({
      id: 1,
      name: "追爆任务",
      remark: "备注",
      status: 0,
      form: {
        targetVideoModel: "wan2.1-i2v",
        referenceVideoUrl: "https://example.com/source.mp4",
        productImageUrls: ["https://example.com/p1.png", "https://example.com/p2.png"],
      },
    });

    expect(values.name).toBe("追爆任务");
    expect(values.remark).toBe("备注");
    expect(values.targetVideoModel).toBe("wan2.1-i2v");
    expect(values.referenceVideoUrl).toBe("https://example.com/source.mp4");
    expect(values.productImageUrlsText).toBe("https://example.com/p1.png\nhttps://example.com/p2.png");
    expect(values.editablePrompt).toBe("");
  });

  it("maps form values into save payload", () => {
    const payload = mapFormValuesToSavePayload({
      name: "追爆任务",
      remark: "备注",
      targetVideoModel: "wan2.1-i2v",
      referenceVideoUrl: "https://example.com/source.mp4",
      productImageUrlsText: "https://example.com/p1.png\n\n https://example.com/p2.png ",
      characterImageUrlsText: "",
      audioUrl: "https://example.com/audio.mp3",
      productInfo: "商品信息",
      voiceoverScript: "口播脚本",
      direction: "导播意图",
      editablePrompt: "editable prompt",
      generationDuration: 15,
    });

    expect(payload.productImageUrls).toEqual([
      "https://example.com/p1.png",
      "https://example.com/p2.png",
    ]);
    expect(payload.characterImageUrls).toEqual([]);
    expect(payload.audioUrl).toBe("https://example.com/audio.mp3");
    expect(payload.videoMetaSummary).toBe("");
  });

  it("maps generated prompt into local editable prompt field", () => {
    const values = mapTaskDetailToFormValues({
      id: 1,
      name: "追爆任务",
      status: 1,
      generatedPrompt: "generated prompt",
      form: {},
    });

    expect(values.editablePrompt).toBe("generated prompt");
  });
});
