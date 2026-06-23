import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import {
  createTextImageVideoTask,
  deleteTextImageVideoTask,
  getTextImageVideoTaskDetail,
  getTextImageVideoTaskPage,
} from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("text image video api", () => {
  it("maps backend page data to list and total structure", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "200",
          msg: "success",
          data: {
            list: [
              {
                id: 101,
                remoteTaskId: 9001,
                externalTaskId: "ext-101",
                imageUrls: ["https://oss.example.com/1.png"],
                prompt: "生成办公室养生茶短视频",
                model: "seedance2.0",
                status: 2,
                statusLabel: "生成中",
                progress: 66,
                videoUrl: "",
                coverUrl: "",
                duration: 0,
                errReason: "",
                syncError: "",
                createTime: "2026-06-23T10:00:00",
                updateTime: "2026-06-23T10:10:00",
              },
            ],
            total: 8,
          },
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await getTextImageVideoTaskPage({ pageNum: 1, pageSize: 10, status: 2 }, client);

    expect(result.total).toBe(8);
    expect(result.list).toHaveLength(1);
    expect(result.list[0]?.id).toBe(101);
    expect(result.list[0]?.statusLabel).toBe("生成中");
  });

  it("calls create detail and delete endpoints with correct paths", async () => {
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
            msg: "success",
            data: {
              id: 101,
              remoteTaskId: 9001,
              externalTaskId: "ext-101",
              imageUrls: ["https://oss.example.com/1.png"],
              prompt: "生成办公室养生茶短视频",
              model: "seedance2.0",
              status: 0,
              statusLabel: "待处理",
              progress: 0,
              videoUrl: "",
              coverUrl: "",
              duration: 0,
              errReason: "",
              syncError: "",
              createTime: "2026-06-23T10:00:00",
              updateTime: "2026-06-23T10:10:00",
            },
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await createTextImageVideoTask(
      {
        imageUrls: ["https://oss.example.com/1.png", "https://oss.example.com/2.png"],
        prompt: "生成办公室养生茶短视频",
        model: "seedance2.0",
      },
      client,
    );
    await getTextImageVideoTaskDetail(101, client);
    await deleteTextImageVideoTask(101, client);

    expect(seen.map((item) => `${item.method}:${item.url}`)).toEqual([
      "post:/user-api/customer/text-image-video/tasks",
      "get:/user-api/customer/text-image-video/tasks/101",
      "delete:/user-api/customer/text-image-video/tasks/101",
    ]);
  });
});
