import type { Id } from "./types";
import type { RequestConfig } from "../../utils/request";

// 后端批量删除接口使用逗号分隔的路径参数，这里统一拼接。
export function joinIds(ids: Id | Id[]) {
  return Array.isArray(ids) ? ids.join(",") : String(ids);
}

// 公开接口通过 no-auth 标记跳过请求鉴权头。
export function noAuth(): Pick<RequestConfig, "headers"> {
  return { headers: { Authorization: "no-auth" } };
}

// 页面已具备本地兜底能力时，可关闭全局错误提示避免重复噪音。
export function silentError(): Pick<RequestConfig, "silentError"> {
  return { silentError: true };
}

// 下载接口需要保留原始二进制响应，不能走统一业务解包。
export function downloadConfig(): Pick<RequestConfig, "responseType"> {
  return { responseType: "blob" };
}

// 统一把上传文件放进 file 字段，避免页面层重复拼接 FormData。
export function toUploadFormData(file: File | Blob, filename?: string) {
  const formData = new FormData();
  const resolvedFilename = filename ?? ("name" in file ? file.name : "upload-file");

  formData.append("file", file, resolvedFilename);
  return formData;
}

// 文件上传统一使用 file 字段封装，避免页面层重复手写 FormData。
export function createUploadFormData(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

// 上传请求需要让浏览器自动补 multipart boundary，因此显式移除默认 JSON 头。
export function uploadConfig(): Pick<RequestConfig, "headers"> {
  return { headers: { "Content-Type": undefined } };
}
