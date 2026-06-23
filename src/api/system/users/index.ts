import request from "../../../utils/request";
import type { Id, Option, PageData, StatusValue } from "../../shared/types";
import { downloadConfig, joinIds } from "../../shared/utils";
import type { CurrentUser, PasswordUpdateForm, UserForm, UserPageItem, UserPageQuery } from "./types";

// 用户分页列表：params 保持透传，方便页面组合搜索、部门、状态等筛选条件。
export function getUserPage(params?: UserPageQuery) {
  return request.get<PageData<UserPageItem>>("/user-api/users", { params });
}

export function createUser(data: UserForm) {
  return request.post<void>("/user-api/users", data);
}

export function updateUser(userId: Id, data: UserForm) {
  return request.put<void>(`/user-api/users/${userId}`, data);
}

export function deleteUsers(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/users/${joinIds(ids)}`);
}

export function getUserForm(userId: Id) {
  return request.get<UserForm>(`/user-api/users/${userId}/form`);
}

export function updateUserStatus(userId: Id, status: StatusValue) {
  return request.patch<void>(`/user-api/users/${userId}/status`, null, { params: { status } });
}

export function resetUserPassword(userId: Id, password: string) {
  return request.put<void>(`/user-api/users/${userId}/password/reset`, null, { params: { password } });
}

export function getCurrentUser() {
  return request.get<CurrentUser>("/user-api/users/me");
}

export function changeCurrentUserPassword(data: PasswordUpdateForm) {
  return request.put<void>("/user-api/users/password", data);
}

export function getUserOptions() {
  return request.get<Option<number>[]>("/user-api/users/options");
}

export function exportUsers(params?: UserPageQuery) {
  return request.get<Blob>("/user-api/users/export", { ...downloadConfig(), params });
}

export function downloadUserImportTemplate() {
  return request.get<Blob>("/user-api/users/template", downloadConfig());
}
