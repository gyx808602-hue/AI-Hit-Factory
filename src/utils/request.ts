import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { AuthStorage, redirectToLogin } from "./auth";
import type { ApiResult } from "../api/shared/types";

export const ApiCode = {
  success: "200",
  accessTokenInvalid: "A0230",
  refreshTokenInvalid: "A0231",
  permissionDenied: "A0301",
} as const;

type NotifyError = (message: string) => void;

export interface RequestClientOptions {
  adapter?: AxiosAdapter;
  baseURL?: string;
  getAccessToken?: () => string | null;
  notifyError?: NotifyError;
  onAuthExpired?: (message?: string) => void | Promise<void>;
}

const retriedConfigs = new WeakSet<InternalAxiosRequestConfig>();

function defaultNotifyError(message: string) {
  // 这里保持请求层无 React Hook 依赖，UI 层后续可监听事件统一展示 toast。
  window.dispatchEvent(new CustomEvent("request:error", { detail: { message } }));
  console.error(message);
}

function isBinaryResponse(response: AxiosResponse) {
  return response.config.responseType === "blob" || response.config.responseType === "arraybuffer";
}

function getBusinessCode(data: unknown) {
  return typeof data === "object" && data !== null && "code" in data
    ? String((data as ApiResult).code)
    : "";
}

export function createRequestClient(options: RequestClientOptions = {}) {
  const notifyError = options.notifyError ?? defaultNotifyError;
  const getAccessToken = options.getAccessToken ?? AuthStorage.getAccessToken;
  const onAuthExpired = options.onAuthExpired ?? redirectToLogin;

  const client = axios.create({
    adapter: options.adapter,
    baseURL: options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? "",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    timeout: 50000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    // Swagger 中登录、验证码等公开接口用 no-auth 标记，发送前必须移除伪 Header。
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

      // 后端统一 Result 包装：业务成功时只把 data 暴露给页面层。
      const code = getBusinessCode(response.data);

      if (code === ApiCode.success) {
        return response.data.data;
      }

      const message = response.data?.msg || "系统出错";
      notifyError(message);
      return Promise.reject(new Error(message));
    }) as never,
    async (error: AxiosError<ApiResult>) => {
      const { config, response } = error;

      if (!response) {
        notifyError("网络连接失败");
        return Promise.reject(error);
      }

      const code = getBusinessCode(response.data);
      const message = response.data?.msg || "请求失败";

      if (code === ApiCode.accessTokenInvalid) {
        if (!config || retriedConfigs.has(config as InternalAxiosRequestConfig)) {
          await onAuthExpired("登录已过期，请重新登录");
          return Promise.reject(new Error("Token Invalid"));
        }

        // 当前阶段先预留一次重试保护，真实刷新逻辑在登录模块接入后补齐。
        retriedConfigs.add(config as InternalAxiosRequestConfig);
        await onAuthExpired("登录已过期，请重新登录");
        return Promise.reject(new Error("Token Invalid"));
      }

      if (code === ApiCode.refreshTokenInvalid) {
        await onAuthExpired("登录已过期，请重新登录");
        return Promise.reject(new Error("Token Invalid"));
      }

      if (code === ApiCode.permissionDenied) {
        notifyError(message || "权限不足");
        return Promise.reject(new Error(message || "权限不足"));
      }

      notifyError(message);
      return Promise.reject(new Error(message));
    },
  );

  return client;
}

const request = createRequestClient();

export type RequestConfig = AxiosRequestConfig;
type DataRequestClient = Omit<typeof request, "get" | "delete" | "post" | "put" | "patch"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
};

export default request as DataRequestClient;
