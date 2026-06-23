export interface ApiResult<T = unknown> {
  code: string | number;
  data: T;
  msg?: string;
}

export interface PageQuery {
  pageNum?: number;
  pageSize?: number;
}

export interface PageData<T> {
  list: T[];
  total: number;
}

export interface Option<TValue = number | string> {
  value: TValue;
  label: string;
  tag?: string;
  children?: Option<TValue>[];
}

export type Id = number | string;
export type StatusValue = 0 | 1;
