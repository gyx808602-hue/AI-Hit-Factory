import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import {
  createDigitalPerson,
  deleteDigitalPerson,
  getDigitalPersonDetail,
  getDigitalPersonPage,
  refreshDigitalPerson,
} from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("digital persons api", () => {
  it("maps backend page response into stable page data", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "200",
          data: {
            records: [
              {
                id: "person-1",
                name: "数字人小雅",
                status: 2,
                statusLabel: "训练成功",
                progress: 100,
                previewVideoUrl: "https://oss.example.com/person-1.mp4",
              },
            ],
            total: 11,
            size: 20,
            current: 3,
          },
          msg: "success",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await getDigitalPersonPage(
      { pageNum: 3, pageSize: 20, keyword: "小雅", status: 2 },
      client,
    );

    expect(result).toEqual({
      list: [
        {
          id: "person-1",
          name: "数字人小雅",
          status: 2,
          statusLabel: "训练成功",
          progress: 100,
          previewVideoUrl: "https://oss.example.com/person-1.mp4",
        },
      ],
      total: 11,
      pageNum: 3,
      pageSize: 20,
      pages: 1,
    });
  });

  it("submits multipart form when creating with local file", async () => {
    const seen = {
      url: "",
      params: {} as Record<string, unknown>,
      contentType: undefined as unknown,
      hasFile: false,
      fileUrl: null as FormDataEntryValue | null,
    };

    const client = createRequestClient({
      adapter: createAdapter((config) => {
        const formData = config.data as FormData;
        seen.url = config.url ?? "";
        seen.params = (config.params ?? {}) as Record<string, unknown>;
        seen.contentType = config.headers["Content-Type"];
        seen.hasFile = formData.get("file") instanceof File;
        seen.fileUrl = formData.get("fileUrl");

        return {
          config,
          data: {
            code: "200",
            data: {
              id: "person-2",
              name: "本地训练数字人",
              status: 0,
              statusLabel: "训练中",
              progress: 0,
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const result = await createDigitalPerson(
      {
        name: "本地训练数字人",
        file: new File(["demo-video"], "trainer.mp4", { type: "video/mp4" }),
        trainType: "both",
        language: "cn",
        errorSkip: true,
      },
      client,
    );

    expect(seen.url).toBe("/api/aigc/digital-persons");
    expect(seen.params).toMatchObject({
      name: "本地训练数字人",
      trainType: "both",
      language: "cn",
      errorSkip: true,
    });
    expect(seen.contentType).toBe(false);
    expect(seen.hasFile).toBe(true);
    expect(seen.fileUrl).toBeNull();
    expect(result.id).toBe("person-2");
  });

  it("submits query params only when creating with remote file url", async () => {
    const seen = {
      url: "",
      params: {} as Record<string, unknown>,
      hasData: true,
    };

    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seen.url = config.url ?? "";
        seen.params = (config.params ?? {}) as Record<string, unknown>;
        seen.hasData = Boolean(config.data);

        return {
          config,
          data: {
            code: "200",
            data: {
              id: "person-3",
              name: "远程训练数字人",
              status: 0,
              statusLabel: "训练中",
              progress: 0,
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const result = await createDigitalPerson(
      {
        name: "远程训练数字人",
        fileUrl: "https://oss.example.com/trainer.mp4",
        trainType: "voice",
        language: "en",
        errorSkip: false,
      },
      client,
    );

    expect(seen.url).toBe("/api/aigc/digital-persons");
    expect(seen.params).toMatchObject({
      name: "远程训练数字人",
      fileUrl: "https://oss.example.com/trainer.mp4",
      trainType: "voice",
      language: "en",
      errorSkip: false,
    });
    expect(seen.hasData).toBe(false);
    expect(result.id).toBe("person-3");
  });

  it("uses detail, refresh and delete endpoints with person id", async () => {
    const seenUrls: string[] = [];

    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seenUrls.push(config.url ?? "");
        return {
          config,
          data: {
            code: "200",
            data: config.method === "delete"
              ? {}
              : {
                  id: "person-9",
                  name: "详情数字人",
                  status: 1,
                  statusLabel: "训练中",
                  progress: 75,
                },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await getDigitalPersonDetail("person-9", client);
    await refreshDigitalPerson("person-9", client);
    await deleteDigitalPerson("person-9", client);

    expect(seenUrls).toEqual([
      "/api/aigc/digital-persons/person-9",
      "/api/aigc/digital-persons/person-9/refresh",
      "/api/aigc/digital-persons/person-9",
    ]);
  });
});
