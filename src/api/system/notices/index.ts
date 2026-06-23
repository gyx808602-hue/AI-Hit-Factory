import request from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { NoticeDetail, NoticeForm, NoticePageItem, NoticePageQuery } from "./types";

export function getNoticePage(params?: NoticePageQuery) {
  return request.get<PageData<NoticePageItem>>("/user-api/notices", { params });
}

export function createNotice(data: NoticeForm) {
  return request.post<void>("/user-api/notices", data);
}

export function updateNotice(id: Id, data: NoticeForm) {
  return request.put<void>(`/user-api/notices/${id}`, data);
}

export function deleteNotices(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/notices/${joinIds(ids)}`);
}

export function getNoticeForm(id: Id) {
  return request.get<NoticeForm>(`/user-api/notices/${id}/form`);
}

export function getNoticeDetail(id: Id) {
  return request.get<NoticeDetail>(`/user-api/notices/${id}/detail`);
}

export function publishNotice(id: Id) {
  return request.put<void>(`/user-api/notices/${id}/publish`);
}

export function revokeNotice(id: Id) {
  return request.put<void>(`/user-api/notices/${id}/revoke`);
}

export function getMyNoticePage(params?: NoticePageQuery) {
  return request.get<PageData<NoticePageItem>>("/user-api/notices/my", { params });
}

export function readAllNotices() {
  return request.put<void>("/user-api/notices/read-all");
}
