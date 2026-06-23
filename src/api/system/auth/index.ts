import request from "../../../utils/request";
import { noAuth } from "../../shared/utils";
import type { AuthenticationToken, CaptchaInfo, LoginRequest, SmsLoginRequest } from "./types";

// 获取验证码：公开接口，不需要携带 access token。
export function getCaptcha(): Promise<CaptchaInfo> {
  return request.get<CaptchaInfo>("/api/v1/auth/captcha", noAuth());
}

// 账号密码登录：成功后由调用方把 token 写入 AuthStorage，接口层只负责请求。
export function login(data: LoginRequest): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/api/v1/auth/login", data, noAuth());
}

// 短信验证码登录：用于后续手机号快捷登录页面。
export function loginBySms(data: SmsLoginRequest): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/api/v1/auth/login/sms", data, noAuth());
}

// 发送登录短信验证码，手机号作为 query 参数传给后端。
export function sendLoginSmsCode(mobile: string): Promise<void> {
  return request.post<void>("/api/v1/auth/sms/code", null, { ...noAuth(), params: { mobile } });
}

// 刷新令牌：当前请求层已预留过期处理，真正刷新流程接入登录状态后再串起来。
export function refreshToken(refreshTokenValue: string): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/api/v1/auth/refresh-token", null, {
    ...noAuth(),
    params: { refreshToken: refreshTokenValue },
  });
}

// 退出登录：服务端清理会话，前端本地 token 清理由调用方统一处理。
export function logout(): Promise<void> {
  return request.delete<void>("/api/v1/auth/logout");
}
