import type { PageQuery } from "../../shared/types";

export interface LogPageQuery extends PageQuery {
  module?: string;
  actionType?: string;
  keywords?: string;
  status?: number;
}

export interface LogPageItem {
  id: number;
  module?: string;
  actionType?: string;
  title?: string;
  content?: string;
  operatorId?: number;
  operatorName?: string;
  requestUri?: string;
  requestMethod?: string;
  ip?: string;
  region?: string;
  device?: string;
  os?: string;
  browser?: string;
  status?: number;
  executionTime?: number;
  errorMsg?: string;
  createTime?: string;
}

export interface VisitOverview {
  todayUvCount: number;
  totalUvCount: number;
  uvGrowthRate: number;
  todayPvCount: number;
  totalPvCount: number;
  pvGrowthRate: number;
}

export interface VisitTrend {
  dates: string[];
  pvList: number[];
  uvList: number[];
}
