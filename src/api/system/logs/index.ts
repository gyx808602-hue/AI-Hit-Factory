import request from "../../../utils/request";
import type { PageData } from "../../shared/types";
import type { LogPageItem, LogPageQuery, VisitOverview, VisitTrend } from "./types";

export function getLogPage(params?: LogPageQuery) {
  return request.get<PageData<LogPageItem>>("/api/v1/logs", { params });
}

export function getVisitOverview() {
  return request.get<VisitOverview>("/api/v1/logs/analytics/overview");
}

export function getVisitTrend() {
  return request.get<VisitTrend>("/api/v1/logs/analytics/trend");
}
