import request from "../../../utils/request";
import type { Id, Option } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { DeptForm, DeptItem } from "./types";

export function getDeptList() {
  return request.get<DeptItem[]>("/api/v1/depts");
}

export function createDept(data: DeptForm) {
  return request.post<void>("/api/v1/depts", data);
}

export function updateDept(deptId: Id, data: DeptForm) {
  return request.put<void>(`/api/v1/depts/${deptId}`, data);
}

export function deleteDepts(ids: Id | Id[]) {
  return request.delete<void>(`/api/v1/depts/${joinIds(ids)}`);
}

export function getDeptForm(deptId: Id) {
  return request.get<DeptForm>(`/api/v1/depts/${deptId}/form`);
}

export function getDeptOptions() {
  return request.get<Option<number>[]>("/api/v1/depts/options");
}
