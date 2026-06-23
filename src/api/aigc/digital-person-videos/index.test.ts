import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import {
  createDigitalPersonVideo,
  deleteDigitalPersonVideo,
  getDigitalPersonVideoDetail,
  getDigitalPersonVideoPage,
  refreshDigitalPersonVideo,
} from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("digital person videos api", () => {
  it("maps backend records pagination to stable page data", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "200",
          data: {
            records: [
              {
                id: "video-1",
                personId: "person-1",
                customAudioId: "audio-1",
                name: "数字人讲解视频",
                status: 2,
                statusLabel: "已完成",
                progress: 100,
                videoUrl: "https://oss.example.com/video-1.mp4",
              },
            ],
            total: 12,
            size: 10,
            current: 2,
            pages: 2,
          },
          msg: "success",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await getDigitalPersonVideoPage(
      { pageNum: 2, pageSize: 10, keyword: "讲解", status: 2 },
      client,
    );

    expect(result).toEqual({
      list: [
        {
          id: "video-1",
          personId: "person-1",
          customAudioId: "audio-1",
          name: "数字人讲解视频",
          status: 2,
          statusLabel: "已完成",
          progress: 100,
          videoUrl: "https://oss.example.com/video-1.mp4",
        },
      ],
      total: 12,
      pageNum: 2,
      pageSize: 10,
      pages: 2,
    });
  });

  it("posts the exact create payload to backend", async () => {
    const seen: Array<{ method?: string; url?: string; data?: unknown }> = [];
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seen.push({
          method: config.method,
          url: config.url,
          data: config.data,
        });

        return {
          config,
          data: {
            code: "200",
            data: {
              id: "video-2",
              personId: "person-2",
              name: "新建数字人视频",
              status: 1,
              statusLabel: "生成中",
              progress: 10,
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await createDigitalPersonVideo(
      {
        name: "新建数字人视频",
        personId: "person-2",
        type: "tts",
        text: "欢迎来到直播间",
        customAudioId: "audio-2",
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
      },
      client,
    );

    expect(seen).toHaveLength(1);
    expect(seen[0]?.method).toBe("post");
    expect(seen[0]?.url).toBe("/api/aigc/digital-person-videos");
    expect(JSON.parse(String(seen[0]?.data))).toEqual({
      name: "新建数字人视频",
      personId: "person-2",
      type: "tts",
      text: "欢迎来到直播间",
      customAudioId: "audio-2",
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

  it("calls detail, refresh and delete endpoints with task id", async () => {
    const seenUrls: string[] = [];
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seenUrls.push(config.url ?? "");

        return {
          config,
          data: {
            code: "200",
            data:
              config.method === "delete"
                ? {}
                : {
                    id: "video-9",
                    personId: "person-9",
                    name: "详情数字人视频",
                    status: 1,
                    statusLabel: "生成中",
                    progress: 66,
                  },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await getDigitalPersonVideoDetail("video-9", client);
    await refreshDigitalPersonVideo("video-9", client);
    await deleteDigitalPersonVideo("video-9", client);

    expect(seenUrls).toEqual([
      "/api/aigc/digital-person-videos/video-9",
      "/api/aigc/digital-person-videos/video-9/refresh",
      "/api/aigc/digital-person-videos/video-9",
    ]);
  });
});
