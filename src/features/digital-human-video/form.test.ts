import { describe, expect, it } from "vitest";
import type { UploadRespVO } from "../../api/aigc/uploads/types";
import {
  createDefaultDigitalHumanVideoFormValues,
  mapDigitalHumanVideoFormValuesToCreatePayload,
  mapUploadResponseToBackgroundConfig,
  mapUploadResponseToWavUrl,
  validateDigitalHumanVideoFormValues,
} from "./form";

describe("digital human video form helpers", () => {
  it("provides stable defaults matching the creation modal", () => {
    expect(createDefaultDigitalHumanVideoFormValues()).toEqual({
      name: "",
      personId: "",
      type: "tts",
      text: "",
      customAudioId: "",
      wavUrl: "",
      backgroundImageUrl: "",
      bgColor: "#EDEDED",
      screenWidth: 1080,
      screenHeight: 1920,
      x: 108,
      y: 720,
      personWidth: 800,
      personHeight: 600,
      rgbaMode: false,
      speed: 1,
      pitch: 1,
      volume: 100,
      language: "cn",
      model: 1,
      addComplianceWatermark: false,
      resolutionRate: 0,
    });
  });

  it("validates required fields for tts mode", () => {
    expect(
      validateDigitalHumanVideoFormValues({
        ...createDefaultDigitalHumanVideoFormValues(),
      }),
    ).toEqual({
      name: "请输入视频名称",
      personId: "请选择数字人形象",
      text: "请输入驱动文本",
    });
  });

  it("validates wav url for audio mode", () => {
    expect(
      validateDigitalHumanVideoFormValues({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "音频驱动视频",
        personId: "person-1",
        type: "audio",
      }),
    ).toEqual({
      wavUrl: "请上传或填写驱动音频",
    });
  });

  it("validates speed, pitch and volume ranges", () => {
    expect(
      validateDigitalHumanVideoFormValues({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "范围校验视频",
        personId: "person-1",
        text: "欢迎来到直播间",
        speed: 0.2,
        pitch: 2.3,
        volume: 120,
      }),
    ).toEqual({
      speed: "语速需在 0.5 到 2 之间",
      pitch: "音调需在 0.5 到 2 之间",
      volume: "音量需在 0 到 100 之间",
    });
  });

  it("validates screen and person geometry boundaries", () => {
    expect(
      validateDigitalHumanVideoFormValues({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "边界校验视频",
        personId: "person-1",
        text: "欢迎来到直播间",
        screenWidth: 0,
        screenHeight: -1,
        x: -10,
        y: -20,
        personWidth: 0,
        personHeight: -5,
      }),
    ).toEqual({
      screenWidth: "画布宽需大于 0",
      screenHeight: "画布高需大于 0",
      x: "人物 X 不能小于 0",
      y: "人物 Y 不能小于 0",
      personWidth: "人物宽需大于 0",
      personHeight: "人物高需大于 0",
    });
  });

  it("validates person frame stays inside the screen", () => {
    expect(
      validateDigitalHumanVideoFormValues({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "越界视频",
        personId: "person-1",
        text: "欢迎来到直播间",
        screenWidth: 500,
        screenHeight: 600,
        x: 300,
        y: 200,
        personWidth: 260,
        personHeight: 500,
      }),
    ).toEqual({
      personFrame: "人物区域不能超出画布范围",
    });
  });

  it("maps tts form values into backend payload", () => {
    expect(
      mapDigitalHumanVideoFormValuesToCreatePayload({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "  数字人讲解视频  ",
        personId: "person-2",
        text: "  欢迎来到直播间  ",
        customAudioId: "audio-2",
        backgroundImageUrl: "https://oss.example.com/bg.png",
        addComplianceWatermark: true,
        resolutionRate: 1,
      }),
    ).toEqual({
      name: "数字人讲解视频",
      personId: "person-2",
      type: "tts",
      text: "欢迎来到直播间",
      customAudioId: "audio-2",
      bg: {
        src_url: "https://oss.example.com/bg.png",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
      },
      bgColor: "#EDEDED",
      screenWidth: 1080,
      screenHeight: 1920,
      x: 108,
      y: 720,
      personWidth: 800,
      personHeight: 600,
      rgbaMode: false,
      speed: 1,
      pitch: 1,
      volume: 100,
      language: "cn",
      model: 1,
      addComplianceWatermark: true,
      resolutionRate: 1,
    });
  });

  it("maps audio mode values without text-only fields", () => {
    expect(
      mapDigitalHumanVideoFormValuesToCreatePayload({
        ...createDefaultDigitalHumanVideoFormValues(),
        name: "音频模式视频",
        personId: "person-3",
        type: "audio",
        wavUrl: "https://oss.example.com/demo.wav",
      }),
    ).toEqual({
      name: "音频模式视频",
      personId: "person-3",
      type: "audio",
      wavUrl: "https://oss.example.com/demo.wav",
      bgColor: "#EDEDED",
      screenWidth: 1080,
      screenHeight: 1920,
      x: 108,
      y: 720,
      personWidth: 800,
      personHeight: 600,
      rgbaMode: false,
      speed: 1,
      pitch: 1,
      volume: 100,
      language: "cn",
      model: 1,
      addComplianceWatermark: false,
      resolutionRate: 0,
    });
  });

  it("maps upload responses into background and wav fields", () => {
    const imageUpload: UploadRespVO = {
      url: "https://oss.example.com/bg.png",
      objectKey: "bg.png",
      originalFilename: "bg.png",
    };
    const audioUpload: UploadRespVO = {
      url: "https://oss.example.com/demo.wav",
      objectKey: "demo.wav",
      originalFilename: "demo.wav",
    };

    expect(mapUploadResponseToBackgroundConfig(imageUpload)).toBe("https://oss.example.com/bg.png");
    expect(mapUploadResponseToWavUrl(audioUpload)).toBe("https://oss.example.com/demo.wav");
  });
});
