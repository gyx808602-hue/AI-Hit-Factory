import request from "../../../utils/request";
import type { Id, Option, StatusValue } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { MenuForm, MenuItem, RouteItem } from "./types";

export function getMenuList() {
  return request.get<MenuItem[]>("/api/v1/menus");
}

export function createMenu(data: MenuForm) {
  return request.post<void>("/api/v1/menus", data);
}

export function updateMenu(id: Id, data: MenuForm) {
  return request.put<void>(`/api/v1/menus/${id}`, data);
}

export function deleteMenus(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/menus/${joinIds(ids)}`);
}

export function getMenuForm(id: Id) {
  return request.get<MenuForm>(`/api/v1/menus/${id}/form`);
}

export function updateMenuVisible(menuId: Id, visible: StatusValue) {
  return request.patch<void>(`/api/v1/menus/${menuId}`, null, { params: { visible } });
}

export function getMenuOptions() {
  return request.get<Option<number>[]>("/api/v1/menus/options");
}

export function getCurrentUserRoutes() {
  return request.get<RouteItem[]>("/api/v1/menus/routes");
}
