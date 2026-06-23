import request from "../../../utils/request";
import type { Id, Option, StatusValue } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { MenuForm, MenuItem, RouteItem } from "./types";

export function getMenuList() {
  return request.get<MenuItem[]>("/user-api/menus");
}

export function createMenu(data: MenuForm) {
  return request.post<void>("/user-api/menus", data);
}

export function updateMenu(id: Id, data: MenuForm) {
  return request.put<void>(`/user-api/menus/${id}`, data);
}

export function deleteMenus(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/menus/${joinIds(ids)}`);
}

export function getMenuForm(id: Id) {
  return request.get<MenuForm>(`/user-api/menus/${id}/form`);
}

export function updateMenuVisible(menuId: Id, visible: StatusValue) {
  return request.patch<void>(`/user-api/menus/${menuId}`, null, { params: { visible } });
}

export function getMenuOptions() {
  return request.get<Option<number>[]>("/user-api/menus/options");
}
/**
 * 获取当前用户的路由菜单列表
 * 
 * @description 从服务端获取当前登录用户有权限访问的路由配置信息，用于动态生成前端路由和菜单
 * @returns {Promise<RouteItem[]>} 返回路由配置数组，每个路由项包含路径、组件、元信息和子路由等配置
 */
export function getCurrentUserRoutes() {
  return request.get<RouteItem[]>("/user-api/menus/routes");
}
