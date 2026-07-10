import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { AuthStorage, redirectToLogin } from "./auth";
import { createRefreshAccessToken } from "./requestAuthRefresh";
import {
  ApiCode,
  getBusinessCode,
  getBusinessMessage,
  isAccessTokenExpiredCode,
  isPasswordChangeRequiredCode,
  isTokenInvalidOrExpiredCode,
  isSuccessfulBusinessCode,
} from "./requestCodes";
import {
  createDedupedNotify,
  defaultNotifyError,
  defaultNotifyPasswordChangeRequired,
  defaultNotifySuccess,
  type NotifyMessage,
} from "./requestNotify";
import type { ApiResult } from "../api/shared/types";

export class RequestBusinessError<TData = unknown> extends Error {
  code: string;
  data: TData | undefined;

  constructor(code: string, message: string, data?: TData) {
    super(message);
    this.name = "RequestBusinessError";
    this.code = code;
    this.data = data;
  }
}

export interface RequestConfig extends AxiosRequestConfig {
  silentError?: boolean;
  skipAuthRefresh?: boolean;
}

export interface RequestClientOptions {
  adapter?: AxiosAdapter;
  baseURL?: string;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  notifyError?: NotifyMessage;
  notifyPasswordChangeRequired?: NotifyMessage;
  notifySuccess?: NotifyMessage;
  onAuthExpired?: (message?: string) => void | Promise<void>;
  setTokenPair?: (tokens: { accessToken?: string; refreshToken?: string }) => void;
}

export type DataRequestClient = Omit<
  AxiosInstance,
  "get" | "delete" | "post" | "put" | "patch"
> & {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
};

const retriedConfigs = new WeakSet<InternalAxiosRequestConfig>();
const AUTH_EXPIRED_MESSAGE = "登录已过期，请重新登录";
const AUTH_EXPIRED_DEDUPE_WINDOW = 1500;

function isBinaryResponse(response: AxiosResponse) {
  return response.config.responseType === "blob" || response.config.responseType === "arraybuffer";
}

function shouldNotifyError(config?: AxiosRequestConfig) {
  return !(config as RequestConfig | undefined)?.silentError;
}

function isFormDataPayload(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

function resolveNotify(
  customNotify: NotifyMessage | undefined,
  defaultNotify: NotifyMessage,
) {
  return createDedupedNotify(customNotify ?? defaultNotify);
}

export function createRequestClient(options: RequestClientOptions = {}): DataRequestClient {
  const notifyError = resolveNotify(options.notifyError, defaultNotifyError);
  const notifyPasswordChangeRequired = resolveNotify(
    options.notifyPasswordChangeRequired,
    defaultNotifyPasswordChangeRequired,
  );
  const notifySuccess = resolveNotify(options.notifySuccess, defaultNotifySuccess);
  const getAccessToken = options.getAccessToken ?? AuthStorage.getAccessToken;
  const getRefreshToken = options.getRefreshToken ?? AuthStorage.getRefreshToken;
  const onAuthExpired = options.onAuthExpired ?? redirectToLogin;
  const setTokenPair = options.setTokenPair ?? AuthStorage.setTokenPair.bind(AuthStorage);
  let lastAuthExpired: { message: string; time: number } | null = null;

  async function notifyAuthExpired(message = AUTH_EXPIRED_MESSAGE) {
    const now = Date.now();

    if (
      lastAuthExpired &&
      lastAuthExpired.message === message &&
      now - lastAuthExpired.time < AUTH_EXPIRED_DEDUPE_WINDOW
    ) {
      return;
    }

    lastAuthExpired = { message, time: now };
    await onAuthExpired(message);
  }

  const client = axios.create({
    adapter: options.adapter,
    // baseURL:  (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? "")+'/api',
    baseURL: (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? ""),
    headers: { "Content-Type": "application/json;charset=utf-8" },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    timeout: 50000,
  });

  const refreshAccessToken = createRefreshAccessToken({
    client,
    getRefreshToken,
    setTokenPair,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    config.headers["X-Source"] = "customer";

    // FormData 上传必须移除默认 JSON 头，让浏览器自动附带 multipart boundary。
    if (isFormDataPayload(config.data)) {
      config.headers["Content-Type"] = false;
    }

    // 公开接口通过 no-auth 标记跳过鉴权头，例如验证码和登录接口。
    if (config.headers.Authorization === "no-auth") {
      delete config.headers.Authorization;
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (async (response: AxiosResponse<ApiResult>): Promise<unknown> => {
      if (isBinaryResponse(response)) {
        return response.data;
      }

      // 统一解包后端 Result，业务成功时仅向页面暴露 data。
      const code = getBusinessCode(response.data);
      if (isSuccessfulBusinessCode(code)) {
        const successMessage = response.data.message?.trim();
        if (successMessage) {
          notifySuccess(successMessage);
        }
        return response.data.data;
      }

      const message = getBusinessMessage(response.data, "系统出错");
      if (isPasswordChangeRequiredCode(code)) {
        notifyPasswordChangeRequired(message);
        return Promise.reject(
          new RequestBusinessError(code, message, response.data?.data),
        );
      }

      if ((response.config as RequestConfig | undefined)?.skipAuthRefresh) {
        return Promise.reject(
          new RequestBusinessError(code, message, response.data?.data),
        );
      }

      if (isAccessTokenExpiredCode(code)) {
        const config = response.config;

        if (!config || retriedConfigs.has(config as InternalAxiosRequestConfig)) {
          await notifyAuthExpired();
          return Promise.reject(new Error("Token Invalid"));
        }

        retriedConfigs.add(config as InternalAxiosRequestConfig);

        try {
          await refreshAccessToken();
          return client(config);
        } catch {
          await notifyAuthExpired();
          return Promise.reject(new Error("Token Invalid"));
        }
      }

      if (isTokenInvalidOrExpiredCode(code)) {
        await notifyAuthExpired(message);
        return Promise.reject(new Error("Token Invalid"));
      }

      if (shouldNotifyError(response.config)) {
        notifyError(message);
      }
      return Promise.reject(
        new RequestBusinessError(code, message, response.data?.data),
      );
    }) as never,
    async (error: AxiosError<ApiResult>) => {
      const { config, response } = error;

      if (!response) {
        if (shouldNotifyError(config)) {
          notifyError("网络连接失败");
        }
        return Promise.reject(error);
      }

      const code = getBusinessCode(response.data);
      const message = getBusinessMessage(response.data, "请求失败");

      if ((config as RequestConfig | undefined)?.skipAuthRefresh) {
        return Promise.reject(
          new RequestBusinessError(code, message, response.data?.data),
        );
      }

      if (isTokenInvalidOrExpiredCode(code)) {
        await notifyAuthExpired(message);
        return Promise.reject(
          new Error("Token Invalid"),
        );
      }

      if (isPasswordChangeRequiredCode(code)) {
        notifyPasswordChangeRequired(message);
        return Promise.reject(
          new RequestBusinessError(code, message, response.data?.data),
        );
      }

      if (isAccessTokenExpiredCode(code)) {
        if (!config || retriedConfigs.has(config as InternalAxiosRequestConfig)) {
          await notifyAuthExpired();
          return Promise.reject(new Error("Token Invalid"));
        }

        retriedConfigs.add(config as InternalAxiosRequestConfig);

        try {
          await refreshAccessToken();
          return client(config);
        } catch {
          await notifyAuthExpired();
          return Promise.reject(new Error("Token Invalid"));
        }
      }

      if (code === ApiCode.refreshTokenInvalid) {
        await notifyAuthExpired();
        return Promise.reject(new Error("Token Invalid"));
      }

      if (code === ApiCode.permissionDenied) {
        const deniedMessage = message || "权限不足";
        if (shouldNotifyError(config)) {
          notifyError(deniedMessage);
        }
        return Promise.reject(new Error(deniedMessage));
      }

      if (shouldNotifyError(config)) {
        notifyError(message);
      }
      return Promise.reject(
        new RequestBusinessError(code, message, response.data?.data),
      );
    },
  );

  return client as DataRequestClient;
}

const request = createRequestClient();

export default request as DataRequestClient;
