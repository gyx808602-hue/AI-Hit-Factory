import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PointsUsageStatisticsPage } from "./PointsUsageStatisticsPage";

const pageMocks = vi.hoisted(() => ({
  usePointsSummary: vi.fn(),
  usePointsUsageRecordDetail: vi.fn(),
  usePointsUsageRecords: vi.fn(),
}));

vi.mock("../../features/points/hooks", () => ({
  usePointsSummary: pageMocks.usePointsSummary,
  usePointsUsageRecordDetail: pageMocks.usePointsUsageRecordDetail,
  usePointsUsageRecords: pageMocks.usePointsUsageRecords,
}));

const summary = {
  accountName: "默认企业空间",
  availablePoints: 12450,
  totalEarned: 36000,
  totalUsed: 23550,
  frozenPoints: 200,
  expiringPoints: 800,
  expiringAt: "2026-07-17",
  updatedAt: "2026-07-03 10:30:00",
};

const record = {
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
};

describe("PointsUsageStatisticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pageMocks.usePointsSummary.mockReturnValue({
      data: summary,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    pageMocks.usePointsUsageRecords.mockReturnValue({
      data: {
        list: [record],
        total: 1,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    pageMocks.usePointsUsageRecordDetail.mockReturnValue({
      data: { ...record, ruleName: "文图生视频基础扣费", refundStatus: "none", auditTraceId: "AUDIT-1" },
      isLoading: false,
      isError: false,
    });
  });

  it("renders points summary and usage records with existing page shell style", () => {
    render(<PointsUsageStatisticsPage />);

    expect(screen.getByRole("heading", { name: "积分统计" })).toBeInTheDocument();
    expect(screen.getByText("12,450")).toBeInTheDocument();
    expect(screen.getByText("PTS202607030001")).toBeInTheDocument();
    expect(screen.getByText("文图生视频")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "详情" })).toBeInTheDocument();
  });

  it("opens a detail drawer for the selected usage record", async () => {
    render(<PointsUsageStatisticsPage />);

    fireEvent.click(screen.getByRole("button", { name: "详情" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("积分记录详情")).toBeInTheDocument();
    expect(within(dialog).getByText("PTS202607030001")).toBeInTheDocument();
    expect(within(dialog).getByText("AUDIT-1")).toBeInTheDocument();
  });

  it("resets to the first page when filters change", async () => {
    render(<PointsUsageStatisticsPage />);

    fireEvent.change(screen.getByPlaceholderText("搜索流水号、任务或操作人"), {
      target: { value: "夏季" },
    });

    await waitFor(() => {
      const latestFilters = pageMocks.usePointsUsageRecords.mock.calls.at(-1)?.[0];
      expect(latestFilters).toMatchObject({
        pageNum: 1,
        keyword: "夏季",
      });
    });
  });

  it("shows empty and error states", () => {
    pageMocks.usePointsSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });
    pageMocks.usePointsUsageRecords.mockReturnValue({
      data: { list: [], total: 0, pageNum: 1, pageSize: 10, pages: 0 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<PointsUsageStatisticsPage />);

    expect(screen.getByText("积分摘要加载失败")).toBeInTheDocument();
    expect(screen.getByText("暂无积分使用记录")).toBeInTheDocument();
  });
});
