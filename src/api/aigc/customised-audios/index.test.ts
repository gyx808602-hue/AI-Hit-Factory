import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import {
  createCustomisedAudio,
  deleteCustomisedAudio,
  getCustomisedAudioDetail,
  getCustomisedAudioPage,
  refreshCustomisedAudio,
} from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("customised audios api", () => {
  it("maps backend records pagination to stable page data", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "200",
          data: {
            records: [
              {
                id: "audio-1",
                chanjingAudioId: "remote-audio-1",
                name: "客服女声",
                modelType: "tts",
                language: "cn",
                previewText: "欢迎来到直播间",
                audioPath: "https://oss.example.com/audio-1.wav",
                status: 2,
                statusLabel: "已完成",
                progress: 100,
              },
            ],
            total: 6,
            size: 10,
            current: 1,
            pages: 1,
          },
          msg: "success",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await getCustomisedAudioPage(
      { pageNum: 1, pageSize: 10, keyword: "客服", status: 2 },
      client,
    );

    expect(result).toEqual({
      list: [
        {
          id: "audio-1",
          chanjingAudioId: "remote-audio-1",
          name: "客服女声",
          modelType: "tts",
          language: "cn",
          previewText: "欢迎来到直播间",
          audioPath: "https://oss.example.com/audio-1.wav",
          status: 2,
          statusLabel: "已完成",
          progress: 100,
        },
      ],
      total: 6,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
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
              id: "audio-2",
              chanjingAudioId: "remote-audio-2",
              name: "品牌男声",
              modelType: "tts",
              language: "cn",
              url: "https://oss.example.com/source.wav",
              text: "品牌广告试听文案",
              status: 1,
              statusLabel: "训练中",
              progress: 5,
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await createCustomisedAudio(
      {
        name: "品牌男声",
        url: "https://oss.example.com/source.wav",
        modelType: "tts",
        language: "cn",
        text: "品牌广告试听文案",
      },
      client,
    );

    expect(seen).toHaveLength(1);
    expect(seen[0]?.method).toBe("post");
    expect(seen[0]?.url).toBe("/user-api/aigc/customised-audios");
    expect(JSON.parse(String(seen[0]?.data))).toEqual({
      name: "品牌男声",
      url: "https://oss.example.com/source.wav",
      modelType: "tts",
      language: "cn",
      text: "品牌广告试听文案",
    });
  });

  it("calls detail, refresh and delete endpoints with audio id", async () => {
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
                    id: "audio-9",
                    name: "音色详情",
                    status: 2,
                    statusLabel: "已完成",
                    progress: 100,
                  },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await getCustomisedAudioDetail("audio-9", client);
    await refreshCustomisedAudio("audio-9", client);
    await deleteCustomisedAudio("audio-9", client);

    expect(seenUrls).toEqual([
      "/user-api/aigc/customised-audios/audio-9",
      "/user-api/aigc/customised-audios/audio-9/refresh",
      "/user-api/aigc/customised-audios/audio-9",
    ]);
  });
});
