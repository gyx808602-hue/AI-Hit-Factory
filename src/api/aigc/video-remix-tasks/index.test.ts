import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import {
  checkVideoRemixTaskPrompt,
  createVideoRemixTask,
  deleteVideoRemixTask,
  generateVideoRemixTaskPrompt,
  generateVideoRemixTaskVideo,
  getVideoRemixTaskDetail,
  getVideoRemixTaskPage,
  refreshVideoRemixTask,
  saveVideoRemixTaskForm,
} from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("video remix tasks api", () => {
  it("maps backend records pagination to page data", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "200",
          data: {
            records: [
              {
                id: "task-1",
                name: "追爆-双11大促",
                status: 2,
                statusLabel: "生成中",
                progress: 68,
                form: {
                  targetVideoModel: "wan2.7-r2v",
                  referenceVideoUrl: "https://oss.example.com/reference.mp4",
                  productImageUrls: [],
                  characterImageUrls: [],
                  audioUrl: "https://oss.example.com/audio.mp3",
                },
              },
            ],
            total: 12,
            current: 1,
            size: 10,
          },
          msg: "success",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await getVideoRemixTaskPage({ pageNum: 1, pageSize: 10, keyword: "双11" }, client);

    expect(result.total).toBe(12);
    expect(result.list).toHaveLength(1);
    expect(result.list[0]?.id).toBe("task-1");
  });

  it("calls task create, detail, form save and action endpoints", async () => {
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
              id: "task-1",
              name: "追爆任务",
              status: 0,
              statusLabel: "待处理",
              progress: 0,
              form: {
                targetVideoModel: "wan2.7-r2v",
                referenceVideoUrl: "https://oss.example.com/reference.mp4",
                productImageUrls: [],
                characterImageUrls: [],
                audioUrl: "https://oss.example.com/audio.mp3",
              },
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await createVideoRemixTask({ name: "追爆任务", remark: "备注" }, client);
    await getVideoRemixTaskDetail("task-1", client);
    await saveVideoRemixTaskForm(
      "task-1",
      {
        name: "追爆任务",
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: "https://oss.example.com/reference.mp4",
        audioUrl: "https://oss.example.com/audio.mp3",
      },
      client,
    );
    await checkVideoRemixTaskPrompt("task-1", client);
    await generateVideoRemixTaskPrompt("task-1", client);
    await generateVideoRemixTaskVideo("task-1", client);
    await refreshVideoRemixTask("task-1", client);
    await deleteVideoRemixTask("task-1", client);

    expect(seen.map((item) => `${item.method}:${item.url}`)).toEqual([
      "post:/user-api/aigc/video-remix-tasks",
      "get:/user-api/aigc/video-remix-tasks/task-1",
      "put:/user-api/aigc/video-remix-tasks/task-1/form",
      "post:/user-api/aigc/video-remix-tasks/task-1/check-prompt",
      "post:/user-api/aigc/video-remix-tasks/task-1/generate-prompt",
      "post:/user-api/aigc/video-remix-tasks/task-1/generate-video",
      "get:/user-api/aigc/video-remix-tasks/task-1/refresh",
      "delete:/user-api/aigc/video-remix-tasks/task-1",
    ]);
  });
});
