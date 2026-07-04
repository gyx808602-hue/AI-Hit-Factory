import request, { type DataRequestClient } from "../../../utils/request";
import type { Id } from "../../shared/types";
import type {
  PointsSummary,
  PointsUsageRecordDetail,
  PointsUsageRecordPageData,
  PointsUsageRecordPageResponse,
  PointsUsageRecordQuery,
  PointsUsageRecordRequestQuery,
} from "./types";

const POINTS_SUMMARY_URL = "/points/summary";
const POINTS_USAGE_RECORDS_URL = "/points/usage-records";

function toRequestQuery(query: PointsUsageRecordQuery = {}): PointsUsageRecordRequestQuery {
  const {
    businessType,
    dateRange,
    direction,
    status,
    ...rest
  } = query;

  return {
    ...rest,
    businessType: businessType && businessType !== "all" ? businessType : undefined,
    direction: direction && direction !== "all" ? direction : undefined,
    status: status && status !== "all" ? status : undefined,
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
  };
}

function toPageData(data: PointsUsageRecordPageResponse): PointsUsageRecordPageData {
  return {
    list: Array.isArray(data.records) ? data.records : [],
    total: typeof data.total === "number" ? data.total : 0,
    pageNum: data.current,
    pageSize: data.size,
    pages: data.pages,
  };
}

export function getPointsSummary(client: DataRequestClient = request) {
  return client.get<PointsSummary>(POINTS_SUMMARY_URL);
}

export async function getPointsUsageRecordPage(
  query?: PointsUsageRecordQuery,
  client: DataRequestClient = request,
) {
  const data = await client.get<PointsUsageRecordPageResponse>(POINTS_USAGE_RECORDS_URL, {
    params: toRequestQuery(query),
  });

  return toPageData(data);
}

export function getPointsUsageRecordDetail(id: Id, client: DataRequestClient = request) {
  return client.get<PointsUsageRecordDetail>(`${POINTS_USAGE_RECORDS_URL}/${id}`);
}

export type {
  PointsBusinessType,
  PointsDirection,
  PointsSummary,
  PointsUsageRecord,
  PointsUsageRecordDetail,
  PointsUsageRecordPageData,
  PointsUsageRecordQuery,
  PointsUsageStatus,
} from "./types";
