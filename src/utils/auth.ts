const ACCESS_TOKEN_KEY = "ai_hit_factory_access_token";
const REFRESH_TOKEN_KEY = "ai_hit_factory_refresh_token";
const CURRENT_USER_NAME_KEY = "ai_hit_factory_current_user_name";

export const AuthStorage = {
  getAccessToken() {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken() {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getCurrentUserName() {
    return window.localStorage.getItem(CURRENT_USER_NAME_KEY) ?? "";
  },

  setCurrentUserName(userName: string) {
    const trimmedUserName = userName.trim();

    if (!trimmedUserName) {
      window.localStorage.removeItem(CURRENT_USER_NAME_KEY);
      return;
    }

    window.localStorage.setItem(CURRENT_USER_NAME_KEY, trimmedUserName);
  },

  setTokenPair(tokens: { accessToken?: string; refreshToken?: string }) {
    if (tokens.accessToken) {
      this.setAccessToken(tokens.accessToken);
    }

    if (tokens.refreshToken) {
      this.setRefreshToken(tokens.refreshToken);
    }
  },

  clear() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(CURRENT_USER_NAME_KEY);
  },
};

export function redirectToLogin(message = "登录已过期，请重新登录") {
  AuthStorage.clear();
  window.dispatchEvent(new CustomEvent("auth:expired", { detail: { message } }));
}
