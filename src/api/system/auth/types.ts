export interface CaptchaInfo {
  captchaId?: string;
  captchaKey?: string;
  captchaBase64: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
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

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
