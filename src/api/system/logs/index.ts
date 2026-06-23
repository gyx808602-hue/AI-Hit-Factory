import request from "../../../utils/request";
import type { PageData } from "../../shared/types";
import type { LogPageItem, LogPageQuery, VisitOverview, VisitTrend } from "./types";

export function getLogPage(params?: LogPageQuery) {
  return request.get<PageData<LogPageItem>>("/user-api/logs", { params });
}

export function getVisitOverview() {
  return request.get<VisitOverview>("/user-api/logs/analytics/overview");
}

export function getVisitTrend() {
  return request.get<VisitTrend>("/user-api/logs/analytics/trend");
}
