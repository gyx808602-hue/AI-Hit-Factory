import request from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import type {
  TextImageVideoCreateRequest,
  TextImageVideoTask,
  TextImageVideoTaskQuery,
} from "./types";

export function getTextImageVideoTaskPage(params?: TextImageVideoTaskQuery) {
  return request.get<PageData<TextImageVideoTask>>("/api/v1/customer/text-image-video/tasks", {
    params,
  });
}

export function createTextImageVideoTask(data: TextImageVideoCreateRequest) {
  return request.post<TextImageVideoTask>("/api/v1/customer/text-image-video/tasks", data);
}

export function getTextImageVideoTaskDetail(id: Id) {
  return request.get<TextImageVideoTask>(`/api/v1/customer/text-image-video/tasks/${id}`);
}

export function deleteTextImageVideoTask(id: Id) {
  return request.delete<void>(`/api/v1/customer/text-image-video/tasks/${id}`);
}
