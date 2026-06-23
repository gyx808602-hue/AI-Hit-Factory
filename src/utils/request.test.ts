import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createRequestClient } from "./request";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("request client", () => {
  it("adds bearer token to authenticated requests", async () => {
    const seenHeaders: string[] = [];
    const client = createRequestClient({
      getAccessToken: () => "access-token",
      adapter: createAdapter((config) => {
        seenHeaders.push(String(config.headers.Authorization));
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
  });

  it("removes no-auth marker before sending public requests", async () => {
    const seenHeaders: unknown[] = [];
    const client = createRequestClient({
      getAccessToken: () => "access-token",
      adapter: createAdapter((config) => {
        seenHeaders.push(config.headers.Authorization);
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
});
