import request from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import type { ConfigForm, ConfigItem, ConfigPageQuery } from "./types";

export function getConfigPage(params?: ConfigPageQuery) {
  return request.get<PageData<ConfigItem>>("/user-api/configs", { params });
}

export function createConfig(data: ConfigForm) {
  return request.post<void>("/user-api/configs", data);
}

export function updateConfig(id: Id, data: ConfigForm) {
  return request.put<void>(`/user-api/configs/${id}`, data);
}

export function deleteConfig(id: Id) {
  return request.delete<void>(`/user-api/configs/${id}`);
}

export function getConfigForm(id: Id) {
  return request.get<ConfigForm>(`/user-api/configs/${id}/form`);
}

export function refreshConfigCache() {
  return request.put<ConfigForm>("/user-api/configs/refresh");
}
