import request from "../../../utils/request";
import type { Id, Option, PageData, StatusValue } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { RoleForm, RolePageItem, RolePageQuery } from "./types";

export function getRolePage(params?: RolePageQuery) {
  return request.get<PageData<RolePageItem>>("/user-api/roles", { params });
}

export function createRole(data: RoleForm) {
  return request.post<void>("/user-api/roles", data);
}

export function updateRole(id: Id, data: RoleForm) {
  return request.put<void>(`/user-api/roles/${id}`, data);
}

export function deleteRoles(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/roles/${joinIds(ids)}`);
}

export function getRoleForm(roleId: Id) {
  return request.get<RoleForm>(`/user-api/roles/${roleId}/form`);
}

export function updateRoleStatus(roleId: Id, status: StatusValue) {
  return request.put<void>(`/user-api/roles/${roleId}/status`, null, { params: { status } });
}

export function getRoleMenuIds(roleId: Id) {
  return request.get<number[]>(`/user-api/roles/${roleId}/menu-ids`);
}

export function assignMenusToRole(roleId: Id, menuIds: number[]) {
  return request.put<void>(`/user-api/roles/${roleId}/menus`, menuIds);
}

export function getRoleDeptIds(roleId: Id) {
  return request.get<number[]>(`/user-api/roles/${roleId}/dept-ids`);
}

export function getRoleOptions() {
  return request.get<Option<number>[]>("/user-api/roles/options");
}
