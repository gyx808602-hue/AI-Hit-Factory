import request from "../../../utils/request";
import type { Id, Option, PageData } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type {
  DictForm,
  DictItemForm,
  DictItemOption,
  DictItemPageItem,
  DictItemPageQuery,
  DictPageItem,
  DictPageQuery,
} from "./types";

export function getDictPage(params?: DictPageQuery) {
  return request.get<PageData<DictPageItem>>("/api/v1/dicts", { params });
}

export function createDict(data: DictForm) {
  return request.post<void>("/api/v1/dicts", data);
}

export function updateDict(id: Id, data: DictForm) {
  return request.put<void>(`/api/v1/dicts/${id}`, data);
}

export function deleteDicts(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/dicts/${joinIds(ids)}`);
}

export function getDictForm(id: Id) {
  return request.get<DictForm>(`/api/v1/dicts/${id}/form`);
}

export function getDictOptions() {
  return request.get<Option<string>[]>("/api/v1/dicts/options");
}

export function getDictItemPage(dictCode: string, params?: DictItemPageQuery) {
  return request.get<PageData<DictItemPageItem>>(`/api/v1/dicts/${dictCode}/items`, { params });
}

export function createDictItem(dictCode: string, data: DictItemForm) {
  return request.post<void>(`/api/v1/dicts/${dictCode}/items`, data);
}

export function updateDictItem(dictCode: string, itemId: Id, data: DictItemForm) {
  return request.put<void>(`/api/v1/dicts/${dictCode}/items/${itemId}`, data);
}

export function deleteDictItems(dictCode: string, itemIds: Id | Id[]) {
  return request.delete<void>(`/api/v1/dicts/${dictCode}/items/${joinIds(itemIds)}`);
}

export function getDictItemForm(dictCode: string, itemId: Id) {
  return request.get<DictItemForm>(`/api/v1/dicts/${dictCode}/items/${itemId}/form`);
}

export function getDictItemOptions(dictCode: string) {
  return request.get<DictItemOption[]>(`/api/v1/dicts/${dictCode}/items/options`);
}
