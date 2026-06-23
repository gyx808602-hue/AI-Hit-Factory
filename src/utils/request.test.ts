import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createRequestClient, RequestBusinessError } from "./request";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("request client", () => {
  it("adds bearer token to authenticated requests", async () => {
    const seenHeaders: string[] = [];
    const seenSources: string[] = [];
    const client = createRequestClient({
      getAccessToken: () => "access-token",
      adapter: createAdapter((config) => {
        seenHeaders.push(String(config.headers.Authorization));
        seenSources.push(String(config.headers["X-Source"]));
        return {
          config,
          data: { code: "200", data: { ok: true }, msg: "success" },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const result = await client.get<{ ok: boolean }>("/secure");

    expect(result).toEqual({ ok: true });
    expect(seenHeaders).toEqual(["Bearer access-token"]);
    expect(seenSources).toEqual(["customer"]);
  });

  it("removes no-auth marker before sending public requests", async () => {
    const seenHeaders: unknown[] = [];
    const seenSources: unknown[] = [];
    const client = createRequestClient({
      getAccessToken: () => "access-token",
      adapter: createAdapter((config) => {
        seenHeaders.push(config.headers.Authorization);
        seenSources.push(config.headers["X-Source"]);
        return {
          config,
          data: { code: "200", data: { public: true }, msg: "success" },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    await client.get("/captcha", { headers: { Authorization: "no-auth" } });

    expect(seenHeaders).toEqual([undefined]);
    expect(seenSources).toEqual(["customer"]);
  });

  it("returns binary responses without business unwrap", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: new Blob(["file"]),
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await client.get("/export", { responseType: "blob" });

    expect(result).toBeInstanceOf(Blob);
  });

  it("treats backend success code 00000 as a successful business response", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "00000",
          data: {
            captchaId: "captcha-id",
            captchaBase64: "data:image/png;base64,abc",
          },
          msg: "success",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    const result = await client.get<{ captchaId: string; captchaBase64: string }>("/captcha");

    expect(result).toEqual({
      captchaId: "captcha-id",
      captchaBase64: "data:image/png;base64,abc",
    });
  });

  it("notifies and rejects when business code is not successful", async () => {
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "500", data: null, msg: "业务失败" },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.get("/broken")).rejects.toThrow("业务失败");
    expect(notifyError).toHaveBeenCalledWith("业务失败");
  });

  it("rejects with a business error that preserves code and data", async () => {
    const client = createRequestClient({
      adapter: createAdapter((config) => ({
        config,
        data: {
          code: "C10001",
          data: {
            accessToken: "access-token",
            refreshToken: "refresh-token",
          },
          msg: "请先修改初始密码",
        },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.post("/login")).rejects.toMatchObject({
      code: "C10001",
      message: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });
  });

  it("rejects silently when request config disables global error notification", async () => {
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "500", data: null, msg: "静默业务失败" },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.get("/captcha", { silentError: true })).rejects.toThrow("静默业务失败");
    expect(notifyError).not.toHaveBeenCalled();
  });

  it("removes default json content-type when sending form-data", async () => {
    const seenContentTypes: unknown[] = [];
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seenContentTypes.push(config.headers["Content-Type"]);
        return {
          config,
          data: { code: "200", data: { ok: true }, msg: "success" },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const formData = new FormData();
    formData.append("file", new Blob(["demo-audio"]), "demo.mp3");

    await client.post("/upload", formData);

    expect(seenContentTypes).not.toEqual(["application/json;charset=utf-8"]);
  });
});
