import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { AuthenticationToken } from "../api/system/auth/types";


interface RefreshRequestConfig extends AxiosRequestConfig {
  silentError?: boolean;
  skipAuthRefresh?: boolean;
}

type RefreshDataClient = Omit<AxiosInstance, "post"> & {
  post<T = unknown>(url: string, data?: unknown, config?: RefreshRequestConfig): Promise<T>;
};

type RefreshAccessTokenOptions = {
  client: AxiosInstance;
  getRefreshToken: () => string | null;
  setTokenPair: (tokens: { accessToken?: string; refreshToken?: string }) => void;
};

export function createRefreshAccessToken({
  client,
  getRefreshToken,
  setTokenPair,
}: RefreshAccessTokenOptions) {
  let refreshTokenPromise: Promise<AuthenticationToken> | null = null;

  return function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return Promise.reject(new Error("Token Invalid"));
    }

    if (!refreshTokenPromise) {
      refreshTokenPromise = (client as RefreshDataClient)
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
  };
}
