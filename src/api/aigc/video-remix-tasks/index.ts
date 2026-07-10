import request, { type DataRequestClient } from "../../../utils/request";
import type { Id } from "../../shared/types";
import type {
  VideoRemixTask,
  VideoRemixTaskCreateRequest,
  VideoRemixTaskFormRequest,
  VideoRemixTaskPageData,
  VideoRemixTaskPageResponse,
  VideoRemixTaskQuery,
} from "./types";

const VIDEO_REMIX_TASKS_BASE_URL = "/video-remix-tasks";

function toPageData(data: VideoRemixTaskPageResponse): VideoRemixTaskPageData {
  const records = Array.isArray(data.records) ? data.records : [];

  return {
    list: records,
    records,
    total: typeof data.total === "number" ? data.total : 0,
    pageNum: data.current,
    pageSize: data.size,
    pages: data.pages,
  };
}

export async function getVideoRemixTaskPage(
  params?: VideoRemixTaskQuery,
  client: DataRequestClient = request,
) {
  const data = await client.get<VideoRemixTaskPageResponse>(VIDEO_REMIX_TASKS_BASE_URL, { params });
  return toPageData(data);
}

export function createVideoRemixTask(
  data: VideoRemixTaskCreateRequest,
  client: DataRequestClient = request,
) {
  return client.post<VideoRemixTask>(VIDEO_REMIX_TASKS_BASE_URL, data);
}

export function getVideoRemixTaskDetail(id: Id, client: DataRequestClient = request) {
  return client.get<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}`);
}

export function deleteVideoRemixTask(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}`);
}

export function saveVideoRemixTaskForm(
  id: Id,
  data: VideoRemixTaskFormRequest,
  client: DataRequestClient = request,
) {
  return client.put<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/form`, data);
}

export function checkVideoRemixTaskPrompt(id: Id, client: DataRequestClient = request) {
  return client.post<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/check-prompt`);
}

export function generateVideoRemixTaskPrompt(id: Id, client: DataRequestClient = request) {
  return client.post<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/generate-prompt`);
}

export function generateVideoRemixTaskVideo(id: Id, client: DataRequestClient = request) {
  return client.post<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/generate-video`);
}

export function refreshVideoRemixTask(id: Id, client: DataRequestClient = request) {
  return client.get<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/refresh`);
}

export function generateVideoRemixTaskProductInfo(id: Id, client: DataRequestClient = request) {
  return client.post<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/generate-product-info`);
}

export function generateVideoRemixTaskVoiceoverScript(id: Id, client: DataRequestClient = request) {
  return client.post<VideoRemixTask>(`${VIDEO_REMIX_TASKS_BASE_URL}/${id}/generate-voiceover-script`);
}
