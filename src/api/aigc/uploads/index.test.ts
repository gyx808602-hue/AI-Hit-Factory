import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import { uploadAudio, uploadImage, uploadVideo } from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("aigc uploads api", () => {
  it("uploads audio file with file field", async () => {
    const seen = {
      url: "",
      hasFileField: false,
    };

    const client = createRequestClient({
      adapter: createAdapter((config) => {
        const formData = config.data as FormData;
        seen.url = config.url ?? "";
        seen.hasFileField = formData.get("file") instanceof File;

        return {
          config,
          data: {
            code: "200",
            data: {
              url: "https://oss.example.com/audio.mp3",
              objectKey: "aigc/audio/20260623/demo.mp3",
              originalFilename: "demo.mp3",
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const result = await uploadAudio(
      new File(["demo-audio"], "demo.mp3", { type: "audio/mpeg" }),
      undefined,
      client,
    );

    expect(seen.url).toBe("/api/aigc/uploads/audio");
    expect(seen.hasFileField).toBe(true);
    expect(result.url).toBe("https://oss.example.com/audio.mp3");
  });

  it("uploads image and video files to their own endpoints", async () => {
    const seenUrls: string[] = [];
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seenUrls.push(config.url ?? "");
        return {
          config,
          data: {
            code: "200",
            data: {
              url: "https://oss.example.com/demo",
              objectKey: "aigc/file/20260623/demo",
              originalFilename: "demo",
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await uploadImage(new File(["demo-image"], "demo.png", { type: "image/png" }), undefined, client);
    await uploadVideo(new File(["demo-video"], "demo.mp4", { type: "video/mp4" }), undefined, client);

    expect(seenUrls).toEqual(["/api/aigc/uploads/image", "/api/aigc/uploads/video"]);
  });
});
