import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createRequestClient } from "./request";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

function createHttpError(config: InternalAxiosRequestConfig, data: unknown, status = 401) {
  const response: AxiosResponse = {
    config,
    data,
    headers: {},
    status,
    statusText: status === 401 ? "Unauthorized" : "Error",
  };

  return {
    config,
    isAxiosError: true,
    name: "AxiosError",
    message: `Request failed with status code ${status}`,
    response,
    toJSON: () => ({}),
  };
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

  it("uses backend message as the error content before fallback messages", async () => {
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "C10001", data: null, message: "后端返回的参数错误" },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.post("/login")).rejects.toMatchObject({
      code: "C10001",
      message: "后端返回的参数错误",
    });
    expect(notifyError).toHaveBeenCalledWith("后端返回的参数错误");
  });

  it("notifies success message without returning it when business code is successful", async () => {
    const notifyError = vi.fn();
    const notifySuccess = vi.fn();
    const client = createRequestClient({
      notifyError,
      notifySuccess,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "0", data: { ok: true }, message: "操作成功" },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.get<{ ok: boolean }>("/success")).resolves.toEqual({ ok: true });
    expect(notifyError).not.toHaveBeenCalled();
    expect(notifySuccess).toHaveBeenCalledWith("操作成功");
  });

  it("uses error-code document fallback message when backend omits message", async () => {
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "C10010", data: null },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(client.post("/auth/password")).rejects.toMatchObject({
      code: "C10010",
      message: "旧密码错误",
    });
    expect(notifyError).toHaveBeenCalledWith("旧密码错误");
  });

  it("refreshes token for C10040 http error responses when backend omits message", async () => {
    const notifyError = vi.fn();
    const onAuthExpired = vi.fn();
    let accessToken = "old-access-token";
    let refreshTokenValue = "refresh-token";
    const seenUrls: Array<string | undefined> = [];
    const client = createRequestClient({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshTokenValue,
      setTokenPair: (tokens) => {
        accessToken = tokens.accessToken ?? accessToken;
        refreshTokenValue = tokens.refreshToken ?? refreshTokenValue;
      },
      notifyError,
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;
        seenUrls.push(requestConfig.url);

        if (requestConfig.url === "/auth/refresh") {
          return {
            config: requestConfig,
            data: {
              code: "200",
              data: {
                tokenType: "Bearer",
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
                expiresIn: 3600,
              },
            },
            headers: {},
            status: 200,
            statusText: "OK",
          };
        }

        if (requestConfig.headers.Authorization === "Bearer new-access-token") {
          return {
            config: requestConfig,
            data: { code: "200", data: { ok: true } },
            headers: {},
            status: 200,
            statusText: "OK",
          };
        }

        const response: AxiosResponse = {
          config: requestConfig,
          data: { code: "C10040", data: null },
          headers: {},
          status: 401,
          statusText: "Unauthorized",
        };

        throw {
          config: requestConfig,
          isAxiosError: true,
          name: "AxiosError",
          message: "Request failed with status code 401",
          response,
          toJSON: () => ({}),
        };
      },
    });

    await expect(client.get("/secure")).resolves.toEqual({ ok: true });
    expect(seenUrls).toEqual(["/secure", "/auth/refresh", "/secure"]);
    expect(notifyError).not.toHaveBeenCalled();
    expect(onAuthExpired).not.toHaveBeenCalled();
  });

  it("refreshes token for C10040 business responses even when http status is 200", async () => {
    const notifyError = vi.fn();
    const onAuthExpired = vi.fn();
    let accessToken = "old-access-token";
    let refreshed = false;
    const client = createRequestClient({
      getAccessToken: () => accessToken,
      getRefreshToken: () => "refresh-token",
      setTokenPair: (tokens) => {
        accessToken = tokens.accessToken ?? accessToken;
      },
      notifyError,
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        if (requestConfig.url === "/auth/refresh") {
          refreshed = true;
          return {
            config: requestConfig,
            data: {
              code: "200",
              data: {
                tokenType: "Bearer",
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
                expiresIn: 3600,
              },
            },
            headers: {},
            status: 200,
            statusText: "OK",
          };
        }

        return {
          config: requestConfig,
          data:
            requestConfig.headers.Authorization === "Bearer new-access-token"
              ? { code: "200", data: { ok: true } }
              : { code: "C10040", data: null },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      },
    });

    await expect(client.get("/secure")).resolves.toEqual({ ok: true });
    expect(refreshed).toBe(true);
    expect(notifyError).not.toHaveBeenCalled();
    expect(onAuthExpired).not.toHaveBeenCalled();
  });

  it("emits password-change event for C10013 from http 403 without auth expiry", async () => {
    const notifyError = vi.fn();
    const notifyPasswordChangeRequired = vi.fn();
    const onAuthExpired = vi.fn();
    const client = createRequestClient({
      notifyError,
      notifyPasswordChangeRequired,
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        throw createHttpError(requestConfig, { code: "C10013", data: null }, 403);
      },
    });

    await expect(client.post("/auth/login")).rejects.toMatchObject({
      code: "C10013",
      message: "必须修改密码",
    });
    expect(notifyPasswordChangeRequired).toHaveBeenCalledWith("必须修改密码");
    expect(notifyError).not.toHaveBeenCalled();
    expect(onAuthExpired).not.toHaveBeenCalled();
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

  it("treats B0001 as a normal business error without forcing relogin", async () => {
    const onAuthExpired = vi.fn();
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;
        const response: AxiosResponse = {
          config: requestConfig,
          data: {
            code: "B0001",
            data: null,
            msg: "登录已失效",
          },
          headers: {},
          status: 401,
          statusText: "Unauthorized",
        };

        throw {
          config: requestConfig,
          isAxiosError: true,
          name: "AxiosError",
          message: "Request failed with status code 401",
          response,
          toJSON: () => ({}),
        };
      },
    });

    await expect(client.get("/secure")).rejects.toMatchObject({
      code: "B0001",
      message: "登录已失效",
    });
    expect(notifyError).toHaveBeenCalledTimes(1);
    expect(notifyError).toHaveBeenCalledWith("登录已失效");
    expect(onAuthExpired).not.toHaveBeenCalled();
  });

  it("refreshes token and replays the original request after access token expires", async () => {
    let accessToken = "old-access-token";
    let refreshTokenValue = "refresh-token";
    const seenRequests: Array<{ url?: string; authorization?: string; data?: unknown }> = [];
    const client = createRequestClient({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshTokenValue,
      setTokenPair: (tokens) => {
        accessToken = tokens.accessToken ?? accessToken;
        refreshTokenValue = tokens.refreshToken ?? refreshTokenValue;
      },
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;
        seenRequests.push({
          url: requestConfig.url,
          authorization: String(requestConfig.headers.Authorization),
          data: requestConfig.data,
        });

        if (requestConfig.url === "/secure" && requestConfig.headers.Authorization === "Bearer old-access-token") {
          throw createHttpError(requestConfig, {
            code: "C10040",
            data: null,
            msg: "access token expired",
          });
        }

        if (requestConfig.url === "/auth/refresh") {
          return {
            config: requestConfig,
            data: {
              code: "200",
              data: {
                tokenType: "Bearer",
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
                expiresIn: 3600,
              },
              msg: "success",
            },
            headers: {},
            status: 200,
            statusText: "OK",
          };
        }

        return {
          config: requestConfig,
          data: { code: "200", data: { ok: true }, msg: "success" },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      },
    });

    await expect(client.get<{ ok: boolean }>("/secure")).resolves.toEqual({ ok: true });
    expect(seenRequests.map((item) => item.url)).toEqual([
      "/secure",
      "/auth/refresh",
      "/secure",
    ]);
    expect(seenRequests[1]?.authorization).toBe("undefined");
    expect(JSON.parse(String(seenRequests[1]?.data))).toEqual({ refreshToken: "refresh-token" });
    expect(seenRequests[2]?.authorization).toBe("Bearer new-access-token");
  });

  it("shares one refresh request for concurrent expired requests", async () => {
    let accessToken = "old-access-token";
    let refreshCount = 0;
    const client = createRequestClient({
      getAccessToken: () => accessToken,
      getRefreshToken: () => "refresh-token",
      setTokenPair: (tokens) => {
        accessToken = tokens.accessToken ?? accessToken;
      },
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        if (requestConfig.url === "/auth/refresh") {
          refreshCount += 1;
          await new Promise((resolve) => setTimeout(resolve, 5));
          return {
            config: requestConfig,
            data: {
              code: "200",
              data: {
                tokenType: "Bearer",
                accessToken: "new-access-token",
                refreshToken: "new-refresh-token",
                expiresIn: 3600,
              },
              msg: "success",
            },
            headers: {},
            status: 200,
            statusText: "OK",
          };
        }

        if (requestConfig.headers.Authorization === "Bearer old-access-token") {
          throw createHttpError(requestConfig, {
            code: "C10040",
            data: null,
            msg: "access token expired",
          });
        }

        return {
          config: requestConfig,
          data: { code: "200", data: { url: requestConfig.url }, msg: "success" },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      },
    });

    await expect(Promise.all([client.get("/alpha"), client.get("/beta")])).resolves.toEqual([
      { url: "/alpha" },
      { url: "/beta" },
    ]);
    expect(refreshCount).toBe(1);
  });

  it("does not replay waiting requests when refresh fails", async () => {
    let secureAttempts = 0;
    const onAuthExpired = vi.fn();
    const client = createRequestClient({
      getAccessToken: () => "old-access-token",
      getRefreshToken: () => "refresh-token",
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        if (requestConfig.url === "/secure") {
          secureAttempts += 1;
          throw createHttpError(requestConfig, {
            code: "C10040",
            data: null,
            msg: "access token expired",
          });
        }

        throw createHttpError(requestConfig, {
          code: "A0231",
          data: null,
          msg: "refresh token expired",
        });
      },
    });

    await expect(client.get("/secure")).rejects.toThrow("Token Invalid");
    expect(secureAttempts).toBe(1);
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
  });

  it("deduplicates auth expiry notification when concurrent requests share a failed refresh", async () => {
    const onAuthExpired = vi.fn();
    const client = createRequestClient({
      getAccessToken: () => "old-access-token",
      getRefreshToken: () => "refresh-token",
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        if (requestConfig.url === "/auth/refresh") {
          await new Promise((resolve) => setTimeout(resolve, 5));
          throw createHttpError(requestConfig, {
            code: "C10040",
            data: null,
            msg: "refresh token expired",
          });
        }

        throw createHttpError(requestConfig, {
          code: "C10040",
          data: null,
          msg: "access token expired",
        });
      },
    });

    await expect(Promise.allSettled([client.get("/alpha"), client.get("/beta")])).resolves.toHaveLength(2);
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
  });

  it("expires auth when refresh endpoint returns C10040", async () => {
    let secureAttempts = 0;
    const onAuthExpired = vi.fn();
    const client = createRequestClient({
      getAccessToken: () => "old-access-token",
      getRefreshToken: () => "refresh-token",
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;

        if (requestConfig.url === "/secure") {
          secureAttempts += 1;
          throw createHttpError(requestConfig, {
            code: "C10040",
            data: null,
            msg: "access token expired",
          });
        }

        throw createHttpError(requestConfig, {
          code: "C10040",
          data: null,
          msg: "refresh token expired",
        });
      },
    });

    await expect(client.get("/secure")).rejects.toThrow("Token Invalid");
    expect(secureAttempts).toBe(1);
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
  });

  it("expires auth without calling refresh when refresh token is missing", async () => {
    const seenUrls: Array<string | undefined> = [];
    const onAuthExpired = vi.fn();
    const client = createRequestClient({
      getAccessToken: () => "old-access-token",
      getRefreshToken: () => null,
      onAuthExpired,
      adapter: async (config) => {
        const requestConfig = config as InternalAxiosRequestConfig;
        seenUrls.push(requestConfig.url);
        throw createHttpError(requestConfig, {
          code: "C10040",
          data: null,
          msg: "access token expired",
        });
      },
    });

    await expect(client.get("/secure")).rejects.toThrow("Token Invalid");
    expect(seenUrls).toEqual(["/secure"]);
    expect(onAuthExpired).toHaveBeenCalledTimes(1);
  });

  it("deduplicates identical error notifications within a short window", async () => {
    const notifyError = vi.fn();
    const client = createRequestClient({
      notifyError,
      adapter: createAdapter((config) => ({
        config,
        data: { code: "500", data: null, msg: "same error" },
        headers: {},
        status: 200,
        statusText: "OK",
      })),
    });

    await expect(Promise.allSettled([client.get("/one"), client.get("/two")])).resolves.toHaveLength(2);
    expect(notifyError).toHaveBeenCalledTimes(1);
    expect(notifyError).toHaveBeenCalledWith("same error");
  });
});
