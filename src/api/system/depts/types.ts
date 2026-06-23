import type { StatusValue } from "../../shared/types";

export interface DeptItem {
  id: number;
  parentId: number;
  name: string;
  code?: string;
  sort?: number;
  status?: StatusValue;
  children?: DeptItem[];
  createTime?: string;
  updateTime?: string;
}

export interface DeptForm {
  id?: number;
  name?: string;
  code?: string;
  parentId: number;
  status?: StatusValue;
  sort?: number;
}
