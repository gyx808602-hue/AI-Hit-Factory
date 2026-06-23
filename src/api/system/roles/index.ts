import request from "../../../utils/request";
import type { Id, Option, PageData, StatusValue } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { RoleForm, RolePageItem, RolePageQuery } from "./types";

export function getRolePage(params?: RolePageQuery) {
  return request.get<PageData<RolePageItem>>("/api/v1/roles", { params });
}

export function createRole(data: RoleForm) {
  return request.post<void>("/api/v1/roles", data);
}

export function updateRole(id: Id, data: RoleForm) {
  return request.put<void>(`/api/v1/roles/${id}`, data);
}

export function deleteRoles(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/roles/${joinIds(ids)}`);
}

export function getRoleForm(roleId: Id) {
  return request.get<RoleForm>(`/api/v1/roles/${roleId}/form`);
}

export function updateRoleStatus(roleId: Id, status: StatusValue) {
  return request.put<void>(`/api/v1/roles/${roleId}/status`, null, { params: { status } });
}

export function getRoleMenuIds(roleId: Id) {
  return request.get<number[]>(`/api/v1/roles/${roleId}/menu-ids`);
}

export function assignMenusToRole(roleId: Id, menuIds: number[]) {
  return request.put<void>(`/api/v1/roles/${roleId}/menus`, menuIds);
}

export function getRoleDeptIds(roleId: Id) {
  return request.get<number[]>(`/api/v1/roles/${roleId}/dept-ids`);
}

export function getRoleOptions() {
  return request.get<Option<number>[]>("/api/v1/roles/options");
}
