import request from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { NoticeDetail, NoticeForm, NoticePageItem, NoticePageQuery } from "./types";

export function getNoticePage(params?: NoticePageQuery) {
  return request.get<PageData<NoticePageItem>>("/api/v1/notices", { params });
}

export function createNotice(data: NoticeForm) {
  return request.post<void>("/api/v1/notices", data);
}

export function updateNotice(id: Id, data: NoticeForm) {
  return request.put<void>(`/api/v1/notices/${id}`, data);
}

export function deleteNotices(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/notices/${joinIds(ids)}`);
}

export function getNoticeForm(id: Id) {
  return request.get<NoticeForm>(`/api/v1/notices/${id}/form`);
}

export function getNoticeDetail(id: Id) {
  return request.get<NoticeDetail>(`/api/v1/notices/${id}/detail`);
}

export function publishNotice(id: Id) {
  return request.put<void>(`/api/v1/notices/${id}/publish`);
}

export function revokeNotice(id: Id) {
  return request.put<void>(`/api/v1/notices/${id}/revoke`);
}

export function getMyNoticePage(params?: NoticePageQuery) {
  return request.get<PageData<NoticePageItem>>("/api/v1/notices/my", { params });
}

export function readAllNotices() {
  return request.put<void>("/api/v1/notices/read-all");
}
