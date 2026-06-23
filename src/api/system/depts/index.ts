import request from "../../../utils/request";
import type { Id, Option } from "../../shared/types";
import { joinIds } from "../../shared/utils";
import type { DeptForm, DeptItem } from "./types";

export function getDeptList() {
  return request.get<DeptItem[]>("/user-api/depts");
}

export function createDept(data: DeptForm) {
  return request.post<void>("/user-api/depts", data);
}

export function updateDept(deptId: Id, data: DeptForm) {
  return request.put<void>(`/user-api/depts/${deptId}`, data);
}

export function deleteDepts(ids: Id | Id[]) {
  return request.delete<void>(`/user-api/depts/${joinIds(ids)}`);
}

export function getDeptForm(deptId: Id) {
  return request.get<DeptForm>(`/user-api/depts/${deptId}/form`);
}

export function getDeptOptions() {
  return request.get<Option<number>[]>("/user-api/depts/options");
}
