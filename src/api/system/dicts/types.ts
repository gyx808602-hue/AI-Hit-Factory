import type { PageQuery, StatusValue } from "../../shared/types";

export interface DictPageQuery extends PageQuery {
  keywords?: string;
  status?: StatusValue;
}

export interface DictPageItem {
  id: number;
  name: string;
  dictCode: string;
  status: StatusValue;
}

export interface DictForm {
  id?: number;
  name?: string;
  dictCode: string;
  remark?: string;
  status?: StatusValue;
}

export interface DictItemPageQuery extends PageQuery {
  keywords?: string;
  status?: StatusValue;
}

export interface DictItemPageItem {
  id: number;
  dictCode: string;
  label: string;
  value: string;
  sort?: number;
  status?: StatusValue;
}

export interface DictItemForm {
  id?: number;
  dictCode?: string;
  value?: string;
  label?: string;
  sort?: number;
  status?: StatusValue;
  tagType?: string;
}

export interface DictItemOption {
  value: string;
  label: string;
  tagType?: string;
}
