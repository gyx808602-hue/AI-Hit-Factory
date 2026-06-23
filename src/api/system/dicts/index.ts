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
  return request.get<PageData<DictPageItem>>("/user-api/dicts", { params });
}

export function createDict(data: DictForm) {
  return request.post<void>("/user-api/dicts", data);
}

export function updateDict(id: Id, data: DictForm) {
  return request.put<void>(`/user-api/dicts/${id}`, data);
}

export function deleteDicts(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/dicts/${joinIds(ids)}`);
}

export function getDictForm(id: Id) {
  return request.get<DictForm>(`/user-api/dicts/${id}/form`);
}

export function getDictOptions() {
  return request.get<Option<string>[]>("/user-api/dicts/options");
}

export function getDictItemPage(dictCode: string, params?: DictItemPageQuery) {
  return request.get<PageData<DictItemPageItem>>(`/user-api/dicts/${dictCode}/items`, { params });
}

export function createDictItem(dictCode: string, data: DictItemForm) {
  return request.post<void>(`/user-api/dicts/${dictCode}/items`, data);
}

export function updateDictItem(dictCode: string, itemId: Id, data: DictItemForm) {
  return request.put<void>(`/user-api/dicts/${dictCode}/items/${itemId}`, data);
}

export function deleteDictItems(dictCode: string, itemIds: Id | Id[]) {
  return request.delete<void>(`/user-api/dicts/${dictCode}/items/${joinIds(itemIds)}`);
}

export function getDictItemForm(dictCode: string, itemId: Id) {
  return request.get<DictItemForm>(`/user-api/dicts/${dictCode}/items/${itemId}/form`);
}

export function getDictItemOptions(dictCode: string) {
  return request.get<DictItemOption[]>(`/user-api/dicts/${dictCode}/items/options`);
}
