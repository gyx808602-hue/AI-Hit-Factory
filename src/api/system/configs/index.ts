import request from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import type { ConfigForm, ConfigItem, ConfigPageQuery } from "./types";

export function getConfigPage(params?: ConfigPageQuery) {
  return request.get<PageData<ConfigItem>>("/api/v1/configs", { params });
}

export function createConfig(data: ConfigForm) {
  return request.post<void>("/api/v1/configs", data);
}

export function updateConfig(id: Id, data: ConfigForm) {
  return request.put<void>(`/api/v1/configs/${id}`, data);
}

export function deleteConfig(id: Id) {
  return request.delete<void>(`/api/v1/configs/${id}`);
}

export function getConfigForm(id: Id) {
  return request.get<ConfigForm>(`/api/v1/configs/${id}/form`);
}

export function refreshConfigCache() {
  return request.put<ConfigForm>("/api/v1/configs/refresh");
}
