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
import type { AuthenticationToken } from "../api/system/auth/types";

export const ApiCode = {
  success: "200",
  successAlt: "00000",
  successAll: "0",
  accessTokenInvalid: "A0230",
  refreshTokenInvalid: "A0231",
  permissionDenied: "A0301",
} as const;

const businessCodeMessages: Record<string, string> = {
  C10001: "请求参数错误",
  C10002: "账号已停用",
  C10003: "账号已锁定",
  C10010: "旧密码错误",
  C10011: "密码复杂度不足",
  C10012: "确认密码不一致",
  C10020: "手机号已被使用",
  C10021: "账户不存在",
  C10022: "无权限访问该资源",
  C10030: "验证码错误",
  C10040: "Token 无效或已过期",
  A6011: "上传文件类型不合法",
  A6012: "上传文件大小超出限制",
  C6011: "上传到对象存储失败",
};

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
  skipAuthRefresh?: boolean;
}

export interface RequestClientOptions {
  adapter?: AxiosAdapter;
  baseURL?: string;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  notifyError?: NotifyError;
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
const ERROR_DEDUPE_WINDOW = 1500;

function createDedupedNotifyError(notifyError: NotifyError): NotifyError {
  let lastError: { message: string; time: number } | null = null;

  return (message: string) => {
    const now = Date.now();

    if (lastError && lastError.message === message && now - lastError.time < ERROR_DEDUPE_WINDOW) {
      return;
    }

    lastError = { message, time: now };
    notifyError(message);
  };
}

function defaultNotifyError(message: string) {
  // 统一派发请求错误事件，避免请求层直接依赖具体 UI 组件。
  window.dispatchEvent(new CustomEvent("request:error", { detail: { message } }));
  console.error(message);
}

function isBinaryResponse(response: AxiosResponse) {
  return response.config.responseType === "blob" || response.config.responseType === "arraybuffer";
}

function isSuccessfulBusinessCode(code: string) {
  return code === ApiCode.success || code === ApiCode.successAlt || code === ApiCode.successAll;
}

function isAccessTokenExpiredCode(code: string) {
  return code === ApiCode.accessTokenInvalid;
}

function getBusinessCode(data: unknown) {
  return typeof data === "object" && data !== null && "code" in data
    ? String((data as ApiResult).code)
    : "";
}

function getBusinessMessage(data: ApiResult | undefined, fallback: string) {
  const code = getBusinessCode(data);
  // 新后端错误契约使用 message；msg 仅作为旧接口兼容字段。
  return data?.message || data?.msg || businessCodeMessages[code] || fallback;
}

function shouldNotifyError(config?: AxiosRequestConfig) {
  return !(config as RequestConfig | undefined)?.silentError;
}

function isFormDataPayload(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

export function createRequestClient(options: RequestClientOptions = {}): DataRequestClient {
  const notifyError = createDedupedNotifyError(options.notifyError ?? defaultNotifyError);
  const getAccessToken = options.getAccessToken ?? AuthStorage.getAccessToken;
  const getRefreshToken = options.getRefreshToken ?? AuthStorage.getRefreshToken;
  const onAuthExpired = options.onAuthExpired ?? redirectToLogin;
  const setTokenPair = options.setTokenPair ?? AuthStorage.setTokenPair.bind(AuthStorage);
  let refreshTokenPromise: Promise<AuthenticationToken> | null = null;

  const client = axios.create({
    adapter: options.adapter,
    // baseURL:  (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? "")+'/api',
    baseURL: (options.baseURL ?? import.meta.env.VITE_APP_BASE_API ?? ""),
    headers: { "Content-Type": "application/json;charset=utf-8" },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    timeout: 50000,
  });

  function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return Promise.reject(new Error("Token Invalid"));
    }

    if (!refreshTokenPromise) {
      refreshTokenPromise = (client as DataRequestClient)
        .post<AuthenticationToken>(
          "/auth/refresh",
          { refreshToken },
          {
            headers: { Authorization: "no-auth" },
            silentError: true,
            skipAuthRefresh: true,
          },
        )
        .then((tokens) => {
          setTokenPair(tokens);
          return tokens;
        })
        .finally(() => {
          refreshTokenPromise = null;
        });
    }

    return refreshTokenPromise;
  }

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

      const message = getBusinessMessage(response.data, "系统出错");
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

      if (isAccessTokenExpiredCode(code)) {
        if (!config || retriedConfigs.has(config as InternalAxiosRequestConfig)) {
          await onAuthExpired("登录已过期，请重新登录");
          return Promise.reject(new Error("Token Invalid"));
        }

        retriedConfigs.add(config as InternalAxiosRequestConfig);

        try {
          await refreshAccessToken();
          return client(config);
        } catch {
          await onAuthExpired("登录已过期，请重新登录");
          return Promise.reject(new Error("Token Invalid"));
        }
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
