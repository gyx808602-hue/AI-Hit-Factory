import request, { type DataRequestClient, type RequestConfig } from "../../../utils/request";
import { toUploadFormData, uploadConfig } from "../../shared/utils";
import type { UploadRespVO } from "./types";

function uploadFile(
  url: string,
  file: File | Blob,
  filename?: string,
  client: DataRequestClient = request,
  config?: RequestConfig,
) {
  return client.post<UploadRespVO>(url, toUploadFormData(file, filename), {
    ...uploadConfig(),
    ...config,
  });
}

/**
 * 上传音频文件
 *
 * @param file - 待上传的音频文件
 * @param filename - 可选文件名，Blob 场景下用于补齐上传文件名
 * @param client - 可注入请求客户端，便于测试或特殊场景复用
 * @param config - 额外请求配置
 * @returns {Promise<UploadRespVO>} 返回签名 URL、对象 Key 和原始文件名
 */
export function uploadAudio(
  file: File | Blob,
  filename?: string,
  client?: DataRequestClient,
  config?: RequestConfig,
) {
  return uploadFile("/user-api/aigc/uploads/audio", file, filename, client, config);
}

/**
 * 上传图片文件
 *
 * @param file - 待上传的图片文件
 * @param filename - 可选文件名，Blob 场景下用于补齐上传文件名
 * @param client - 可注入请求客户端，便于测试或特殊场景复用
 * @param config - 额外请求配置
 * @returns {Promise<UploadRespVO>} 返回签名 URL、对象 Key 和原始文件名
 */
export function uploadImage(
  file: File | Blob,
  filename?: string,
  client?: DataRequestClient,
  config?: RequestConfig,
) {
  return uploadFile("/user-api/aigc/uploads/image", file, filename, client, config);
}

/**
 * 上传视频文件
 *
 * @param file - 待上传的视频文件
 * @param filename - 可选文件名，Blob 场景下用于补齐上传文件名
 * @param client - 可注入请求客户端，便于测试或特殊场景复用
 * @param config - 额外请求配置
 * @returns {Promise<UploadRespVO>} 返回签名 URL、对象 Key 和原始文件名
 */
export function uploadVideo(
  file: File | Blob,
  filename?: string,
  client?: DataRequestClient,
  config?: RequestConfig,
) {
  return uploadFile("/user-api/aigc/uploads/video", file, filename, client, config);
}
