import { describe, expect, it } from "vitest";
import type { UploadRespVO } from "../../api/aigc/uploads/types";
import {
  createDefaultTextImageVideoFormValues,
  mapTaskDetailToFormValues,
  mapTextImageVideoFormValuesToCreatePayload,
  mapUploadResponsesToImageUrls,
} from "./form";

describe("text-image-video form helpers", () => {
  it("creates default form values with the documented default model", () => {
    expect(createDefaultTextImageVideoFormValues()).toEqual({
      prompt: "",
      model: "seedance2.0",
      imageUrls: [],
    });
  });

  it("maps upload responses into image url array", () => {
    const uploads: UploadRespVO[] = [
      {
        url: "https://example.com/a.png",
        objectKey: "a.png",
        originalFilename: "a.png",
      },
      {
        url: "https://example.com/b.png",
        objectKey: "b.png",
        originalFilename: "b.png",
      },
    ];

    expect(mapUploadResponsesToImageUrls(uploads)).toEqual([
      "https://example.com/a.png",
      "https://example.com/b.png",
    ]);
  });

  it("maps task detail into editable form values", () => {
    const values = mapTaskDetailToFormValues({
      id: 101,
      imageUrls: ["https://example.com/a.png"],
      prompt: "请生成数字人口播视频",
      model: "seedance2.0",
      status: 1,
    });

    expect(values).toEqual({
      prompt: "请生成数字人口播视频",
      model: "seedance2.0",
      imageUrls: ["https://example.com/a.png"],
    });
  });

  it("maps form values into a create payload with trimmed prompt", () => {
    expect(
      mapTextImageVideoFormValuesToCreatePayload({
        prompt: "  生成一条茶饮种草视频  ",
        model: "seedance2.0",
        imageUrls: ["https://example.com/a.png"],
      }),
    ).toEqual({
      prompt: "生成一条茶饮种草视频",
      model: "seedance2.0",
      imageUrls: ["https://example.com/a.png"],
    });
  });
});
