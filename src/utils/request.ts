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
import type { ApiResult } from "../api/shared/types";

export const ApiCode = {
  success: "200",
  successAlt: "00000",
  accessTokenInvalid: "A0230",
  accessTokenInvalidAlt: "B0001",
  refreshTokenInvalid: "A0231",
  permissionDenied: "A0301",
} as const;

type NotifyError = (message: string) => void;

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
}

export interface RequestClientOptions {
  adapter?: AxiosAdapter;
  baseURL?: string;
  getAccessToken?: () => string | null;
  notifyError?: NotifyError;
  onAuthExpired?: (message?: string) => void | Promise<void>;
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

function defaultNotifyError(message: string) {
  // 统一派发请求错误事件，避免请求层直接依赖具体 UI 组件。
  window.dispatchEvent(new CustomEvent("request:error", { detail: { message } }));
  console.error(message);
}

function isBinaryResponse(response: AxiosResponse) {
  return response.config.responseType === "blob" || response.config.responseType === "arraybuffer";
}

function isSuccessfulBusinessCode(code: string) {
  return code === ApiCode.success || code === ApiCode.successAlt;
}

function isAccessTokenExpiredCode(code: string) {
  return code === ApiCode.accessTokenInvalid || code === ApiCode.accessTokenInvalidAlt;
}

function getBusinessCode(data: unknown) {
  return typeof data === "object" && data !== null && "code" in data
    ? String((data as ApiResult).code)
    : "";
}

function shouldNotifyError(config?: AxiosRequestConfig) {
  return !(config as RequestConfig | undefined)?.silentError;
}

function isFormDataPayload(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

export function createRequestClient(options: RequestClientOptions = {}): DataRequestClient {
  const notifyError = options.notifyError ?? defaultNotifyError;
  const getAccessToken = options.getAccessToken ?? AuthStorage.getAccessToken;
  const onAuthExpired = options.onAuthExpired ?? redirectToLogin;

  const client = axios.create({
    adapter: options.adapter,
    // baseURL:  (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? "")+'/api',
    baseURL: (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? ""),
    headers: { "Content-Type": "application/json;charset=utf-8" },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    timeout: 50000,
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
    ((response: AxiosResponse<ApiResult>): unknown => {
      if (isBinaryResponse(response)) {
        return response.data;
      }

      // 统一解包后端 Result，业务成功时仅向页面暴露 data。
      const code = getBusinessCode(response.data);
      if (isSuccessfulBusinessCode(code)) {
        return response.data.data;
      }

      const message = response.data?.msg || "系统出错";
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
      const message = response.data?.msg || "请求失败";

      if (isAccessTokenExpiredCode(code)) {
        if (!config || retriedConfigs.has(config as InternalAxiosRequestConfig)) {
          await onAuthExpired("登录已过期，请重新登录");
          return Promise.reject(new Error("Token Invalid"));
        }

        // 当前阶段仅保留一次保护性重试位，真实 refresh-token 串联后续再接入。
        retriedConfigs.add(config as InternalAxiosRequestConfig);
        await onAuthExpired("登录已过期，请重新登录");
        return Promise.reject(new Error("Token Invalid"));
      }

      if (code === ApiCode.refreshTokenInvalid) {
        await onAuthExpired("登录已过期，请重新登录");
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
