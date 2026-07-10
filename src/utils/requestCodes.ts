import type { ApiResult } from "../api/shared/types";

export const ApiCode = {
  success: "200",
  successAlt: "00000",
  successAll: "0",
  accessTokenInvalid: "A0230",
  refreshTokenInvalid: "A0231",
  tokenInvalidOrExpired: "C10040",
  permissionDenied: "A0301",
  passwordChangeRequired: "C10013",
} as const;

const businessCodeMessages: Record<string, string> = {
  C10001: "请求参数错误",
  C10002: "账号已停用",
  C10003: "账号已锁定",
  C10010: "旧密码错误",
  C10011: "密码复杂度不足",
  C10012: "确认密码不一致",
  C10013: "必须修改密码",
  C10020: "手机号已被使用",
  C10021: "账户不存在",
  C10022: "无权限访问该资源",
  C10030: "验证码错误",
  C10040: "Token 无效或已过期",
  A6011: "上传文件类型不合法",
  A6012: "上传文件大小超出限制",
  C6011: "上传到对象存储失败",
};

export function getBusinessCode(data: unknown) {
  return typeof data === "object" && data !== null && "code" in data
    ? String((data as ApiResult).code)
    : "";
}

export function getBusinessMessage(data: ApiResult | undefined, fallback: string) {
  const code = getBusinessCode(data);
  // 新后端错误契约使用 message；msg 仅作为旧接口兼容字段。
  return data?.message || data?.msg || businessCodeMessages[code] || fallback;
}

export function isSuccessfulBusinessCode(code: string) {
  return code === ApiCode.success || code === ApiCode.successAlt || code === ApiCode.successAll;
}

export function isAccessTokenExpiredCode(code: string) {
  return code === ApiCode.tokenInvalidOrExpired;
}

export function isTokenInvalidOrExpiredCode(code: string) {
  return code === ApiCode.refreshTokenInvalid;
}

export function isPasswordChangeRequiredCode(code: string) {
  return code === ApiCode.passwordChangeRequired;
}
