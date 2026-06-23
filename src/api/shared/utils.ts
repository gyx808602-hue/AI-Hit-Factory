import type { Id } from "./types";
import type { RequestConfig } from "../../utils/request";

// 后端批量删除接口使用逗号分隔的路径参数，统一在这里处理。
export function joinIds(ids: Id | Id[]) {
  return Array.isArray(ids) ? ids.join(",") : String(ids);
}

// 公开接口的约定标记，请求拦截器会在真正发送前移除该 Header。
export function noAuth(): Pick<RequestConfig, "headers"> {
  return { headers: { Authorization: "no-auth" } };
}

// 文件下载接口需要跳过业务 Result 解包，直接拿二进制响应。
export function downloadConfig(): Pick<RequestConfig, "responseType"> {
  return { responseType: "blob" };
}
