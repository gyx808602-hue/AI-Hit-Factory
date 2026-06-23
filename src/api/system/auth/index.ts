import request from "../../../utils/request";
import { noAuth, silentError } from "../../shared/utils";
import type {
  AuthenticationToken,
  CaptchaInfo,
  ChangePasswordRequest,
  LoginRequest,
  SmsLoginRequest,
} from "./types";

// 验证码属于公开接口，失败时由登录页本地兜底渲染，不再触发全局错误提示。
export function getCaptcha(): Promise<CaptchaInfo> {
  return request.get<CaptchaInfo>("/user-api/customer/auth/captcha", {
    ...noAuth(),
    ...silentError(),
  });
}

// 账号密码登录成功后，由调用方负责处理 token 写入或首登改密分支。
export function login(data: LoginRequest): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/user-api/customer/auth/login", data, noAuth());
}

// 客户首次登录或主动改密时，必须验证旧密码并确认新密码。
export function changePassword(data: ChangePasswordRequest): Promise<void> {
  return request.post<void>("/user-api/customer/auth/change-password", data);
}

// 短信验证码登录用于后续手机号快捷登录流程。
export function loginBySms(data: SmsLoginRequest): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/user-api/customer/auth/login/sms", data, noAuth());
}

// 发送登录短信验证码，手机号通过 query 参数传给后端。
export function sendLoginSmsCode(mobile: string): Promise<void> {
  return request.post<void>("/user-api/customer/auth/sms/code", null, {
    ...noAuth(),
    params: { mobile },
  });
}

// 刷新令牌的请求入口先保留，真正自动刷新流程后续再接入登录状态模块。
export function refreshToken(refreshTokenValue: string): Promise<AuthenticationToken> {
  return request.post<AuthenticationToken>("/user-api/customer/auth/refresh-token", null, {
    ...noAuth(),
    params: { refreshToken: refreshTokenValue },
  });
}

// 退出登录时仅负责通知服务端，前端 token 清理由调用方统一处理。
export function logout(): Promise<void> {
  return request.post<void>("/user-api/customer/auth/logout");
}
