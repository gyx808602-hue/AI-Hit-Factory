import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";
import { createRequestClient } from "../../../utils/request";
import { getPointsSummary, getPointsUsageRecordDetail, getPointsUsageRecordPage } from "./index";

function createAdapter(handler: (config: InternalAxiosRequestConfig) => AxiosResponse): AxiosAdapter {
  return async (config) => handler(config as InternalAxiosRequestConfig);
}

describe("points usage api", () => {
  it("maps backend page response into stable points usage page data", async () => {
    const seen = {
      url: "",
      params: {} as Record<string, unknown>,
    };
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seen.url = config.url ?? "";
        seen.params = (config.params ?? {}) as Record<string, unknown>;

        return {
          config,
          data: {
            code: "200",
            data: {
              records: [
                {
                  id: "points-1",
                  serialNo: "PTS202607030001",
                  businessType: "image_video",
                  businessName: "文图生视频",
                  direction: "expense",
                  points: 120,
                  balanceAfter: 12330,
                  relatedBizId: "task-1",
                  relatedBizName: "夏季新品视频生成",
                  operatorName: "Robert",
                  workspaceName: "默认企业空间",
                  status: "success",
                  occurredAt: "2026-07-03 10:30:00",
                  remark: "生成任务扣费",
                },
              ],
              total: 8,
              size: 20,
              current: 2,
              pages: 1,
            },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const result = await getPointsUsageRecordPage(
      {
        pageNum: 2,
        pageSize: 20,
        keyword: "夏季",
        businessType: "image_video",
        direction: "expense",
        status: "success",
        dateRange: ["2026-07-01", "2026-07-03"],
      },
      client,
    );

    expect(seen.url).toBe("/points/usage-records");
    expect(seen.params).toMatchObject({
      pageNum: 2,
      pageSize: 20,
      keyword: "夏季",
      businessType: "image_video",
      direction: "expense",
      status: "success",
      startDate: "2026-07-01",
      endDate: "2026-07-03",
    });
    expect(result).toEqual({
      list: [
        {
          id: "points-1",
          serialNo: "PTS202607030001",
          businessType: "image_video",
          businessName: "文图生视频",
          direction: "expense",
          points: 120,
          balanceAfter: 12330,
          relatedBizId: "task-1",
          relatedBizName: "夏季新品视频生成",
          operatorName: "Robert",
          workspaceName: "默认企业空间",
          status: "success",
          occurredAt: "2026-07-03 10:30:00",
          remark: "生成任务扣费",
        },
      ],
      total: 8,
      pageNum: 2,
      pageSize: 20,
      pages: 1,
    });
  });

  it("uses summary and detail endpoints", async () => {
    const seenUrls: string[] = [];
    const client = createRequestClient({
      adapter: createAdapter((config) => {
        seenUrls.push(config.url ?? "");

        return {
          config,
          data: {
            code: "200",
            data:
              config.url === "/points/summary"
                ? {
                    accountName: "默认企业空间",
                    availablePoints: 12450,
                    totalEarned: 36000,
                    totalUsed: 23550,
                    frozenPoints: 200,
                    expiringPoints: 800,
                    expiringAt: "2026-07-17",
                    updatedAt: "2026-07-03 10:30:00",
                  }
                : {
                    id: "points-1",
                    serialNo: "PTS202607030001",
                    businessType: "image_video",
                    businessName: "文图生视频",
                    direction: "expense",
                    points: 120,
                    balanceAfter: 12330,
                    relatedBizId: "task-1",
                    relatedBizName: "夏季新品视频生成",
                    operatorName: "Robert",
                    workspaceName: "默认企业空间",
                    status: "success",
                    occurredAt: "2026-07-03 10:30:00",
                    remark: "生成任务扣费",
                    ruleName: "文图生视频基础扣费",
                    refundStatus: "none",
                    auditTraceId: "AUDIT-1",
                  },
            msg: "success",
          },
          headers: {},
          status: 200,
          statusText: "OK",
        };
      }),
    });

    const summary = await getPointsSummary(client);
    const detail = await getPointsUsageRecordDetail("points-1", client);

    expect(seenUrls).toEqual(["/points/summary", "/points/usage-records/points-1"]);
    expect(summary.availablePoints).toBe(12450);
    expect(detail.auditTraceId).toBe("AUDIT-1");
  });
});
