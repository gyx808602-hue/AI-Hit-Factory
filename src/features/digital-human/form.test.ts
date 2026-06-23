import { describe, expect, it } from "vitest";
import {
  createDefaultDigitalHumanFormValues,
  mapDigitalHumanFormValuesToCreatePayload,
  validateDigitalHumanFormValues,
} from "./form";

describe("digital human form helpers", () => {
  it("creates default form values for the reference modal", () => {
    expect(createDefaultDigitalHumanFormValues()).toEqual({
      name: "",
      materialMode: "upload",
      file: null,
      fileUrl: "",
      trainType: "both",
      language: "cn",
      errorSkip: false,
    });
  });

  it("validates required fields in upload mode", () => {
    expect(
      validateDigitalHumanFormValues({
        name: "  ",
        materialMode: "upload",
        file: null,
        fileUrl: "",
        trainType: "both",
        language: "cn",
        errorSkip: false,
      }),
    ).toEqual({
      name: "请输入数字人名称",
      file: "请上传训练素材",
    });
  });

  it("validates required fields in remote url mode", () => {
    expect(
      validateDigitalHumanFormValues({
        name: "远程数字人",
        materialMode: "url",
        file: null,
        fileUrl: "   ",
        trainType: "voice",
        language: "en",
        errorSkip: true,
      }),
    ).toEqual({
      fileUrl: "请输入素材 URL",
    });
  });

  it("maps upload mode form values into create payload", () => {
    const file = new File(["demo-video"], "trainer.mp4", { type: "video/mp4" });

    expect(
      mapDigitalHumanFormValuesToCreatePayload({
        name: "  本地数字人  ",
        materialMode: "upload",
        file,
        fileUrl: "https://should-be-ignored.example.com/demo.mp4",
        trainType: "figure",
        language: "cn",
        errorSkip: true,
      }),
    ).toEqual({
      name: "本地数字人",
      file,
      trainType: "figure",
      language: "cn",
      errorSkip: true,
    });
  });

  it("maps remote url mode form values into create payload", () => {
    expect(
      mapDigitalHumanFormValuesToCreatePayload({
        name: "  远程数字人  ",
        materialMode: "url",
        file: new File(["demo-video"], "trainer.mp4", { type: "video/mp4" }),
        fileUrl: "  https://oss.example.com/trainer.mp4  ",
        trainType: "voice",
        language: "en",
        errorSkip: false,
      }),
    ).toEqual({
      name: "远程数字人",
      fileUrl: "https://oss.example.com/trainer.mp4",
      trainType: "voice",
      language: "en",
      errorSkip: false,
    });
  });
});
