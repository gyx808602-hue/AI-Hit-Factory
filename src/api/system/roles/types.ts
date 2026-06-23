import type { PageQuery, StatusValue } from "../../shared/types";

export interface RolePageQuery extends PageQuery {
  keywords?: string;
  status?: StatusValue;
}

export interface RolePageItem {
  id: number;
  name: string;
  code: string;
  status: StatusValue;
  sort?: number;
  dataScope?: number;
  dataScopeLabel?: string;
  createTime?: string;
  updateTime?: string;
}

export interface RoleForm {
  id?: number;
  name: string;
  code: string;
  sort?: number;
  status?: StatusValue;
  dataScope?: number;
  deptIds?: number[];
}
