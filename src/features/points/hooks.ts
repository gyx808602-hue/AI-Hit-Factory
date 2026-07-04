import { useQuery } from "@tanstack/react-query";
import {
  getMockPointsUsageRecordDetail,
  getMockPointsUsageRecordPage,
  mockPointsSummary,
} from "./mockData";
import type { PointsUsageRecordQuery } from "../../api/points/usage";
import type { Id } from "../../api/shared/types";

export const pointsQueryKeys = {
  summary: ["points", "summary"] as const,
  usageRecords: (query: PointsUsageRecordQuery) => ["points", "usage-records", query] as const,
  usageRecordDetail: (id: Id | undefined) => ["points", "usage-records", id] as const,
};

export function usePointsSummary() {
  return useQuery({
    queryKey: pointsQueryKeys.summary,
    queryFn: async () => mockPointsSummary,
  });
}

export function usePointsUsageRecords(query: PointsUsageRecordQuery) {
  return useQuery({
    queryKey: pointsQueryKeys.usageRecords(query),
    queryFn: async () => getMockPointsUsageRecordPage(query),
  });
}

export function usePointsUsageRecordDetail(id: Id | undefined) {
  return useQuery({
    queryKey: pointsQueryKeys.usageRecordDetail(id),
    queryFn: async () => {
      const detail = id ? getMockPointsUsageRecordDetail(String(id)) : undefined;
      if (!detail) {
        throw new Error("积分记录不存在");
      }

      return detail;
    },
    enabled: Boolean(id),
  });
}
