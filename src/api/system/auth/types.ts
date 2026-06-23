export interface CaptchaInfo {
  captchaId: string;
  captchaBase64: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  captchaId?: string;
  captchaCode?: string;
}

export interface SmsLoginRequest {
  mobile: string;
  code: string;
}

export interface AuthenticationToken {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
