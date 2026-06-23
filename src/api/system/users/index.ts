import request from "../../../utils/request";
import type { Id, Option, PageData, StatusValue } from "../../shared/types";
import { downloadConfig, joinIds } from "../../shared/utils";
import type { CurrentUser, PasswordUpdateForm, UserForm, UserPageItem, UserPageQuery } from "./types";

// 用户分页列表：params 保持透传，方便页面组合搜索、部门、状态等筛选条件。
export function getUserPage(params?: UserPageQuery) {
  return request.get<PageData<UserPageItem>>("/api/v1/users", { params });
}

export function createUser(data: UserForm) {
  return request.post<void>("/api/v1/users", data);
}

export function updateUser(userId: Id, data: UserForm) {
  return request.put<void>(`/api/v1/users/${userId}`, data);
}

export function deleteUsers(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/users/${joinIds(ids)}`);
}

export function getUserForm(userId: Id) {
  return request.get<UserForm>(`/api/v1/users/${userId}/form`);
}

export function updateUserStatus(userId: Id, status: StatusValue) {
  return request.patch<void>(`/api/v1/users/${userId}/status`, null, { params: { status } });
}

export function resetUserPassword(userId: Id, password: string) {
  return request.put<void>(`/api/v1/users/${userId}/password/reset`, null, { params: { password } });
}

export function getCurrentUser() {
  return request.get<CurrentUser>("/api/v1/users/me");
}

export function changeCurrentUserPassword(data: PasswordUpdateForm) {
  return request.put<void>("/api/v1/users/password", data);
}

export function getUserOptions() {
  return request.get<Option<number>[]>("/api/v1/users/options");
}

export function exportUsers(params?: UserPageQuery) {
  return request.get<Blob>("/api/v1/users/export", { ...downloadConfig(), params });
}

export function downloadUserImportTemplate() {
  return request.get<Blob>("/api/v1/users/template", downloadConfig());
}
