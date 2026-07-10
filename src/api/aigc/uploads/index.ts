import request, { type DataRequestClient, type RequestConfig } from "../../../utils/request";
import { toUploadFormData, uploadConfig } from "../../shared/utils";
import type { UploadRespVO } from "./types";

export const AUDIO_UPLOAD_ACCEPT = ".wav,.mp3,audio/wav,audio/x-wav,audio/mpeg,audio/mp3";

const SUPPORTED_AUDIO_EXTENSIONS = new Set(["wav", "mp3"]);
const SUPPORTED_AUDIO_MIME_TYPES = new Set([
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/vnd.wave",
  "audio/mpeg",
  "audio/mp3",
]);

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

function getUploadFilename(file: File | Blob, filename?: string) {
  return filename || (file instanceof File ? file.name : "");
}

export function isSupportedAudioUploadFile(file: File | Blob, filename?: string) {
  const uploadFilename = getUploadFilename(file, filename).trim().toLowerCase();
  const extension = uploadFilename.includes(".") ? uploadFilename.split(".").pop() : "";
  const mimeType = file.type.trim().toLowerCase();

  if (extension && SUPPORTED_AUDIO_EXTENSIONS.has(extension)) {
    return true;
  }

  return Boolean(mimeType && SUPPORTED_AUDIO_MIME_TYPES.has(mimeType));
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
  if (!isSupportedAudioUploadFile(file, filename)) {
    return Promise.reject(new Error("仅支持上传 wav、mp3 格式的音频文件"));
  }

  return uploadFile("/uploads/audio", file, filename, client, config);
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
  return uploadFile("/uploads/image", file, filename, client, config);
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
  return uploadFile("/uploads/video", file, filename, client, config);
}
