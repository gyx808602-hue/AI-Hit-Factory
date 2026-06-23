import { AlertCircle, CheckCircle2, Clock, Download, Play, RefreshCw, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Input, Segmented, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { filterTasks } from "../features/workspace/mockData";
import { taskStatusLabels } from "../features/workspace/status";
import type { GenerationTask, TaskFilter } from "../features/workspace/types";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

const statusView = {
  success: { label: "生成成功", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", icon: CheckCircle2 },
  processing: { label: "生成中", color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: Clock },
  queued: { label: "排队中", color: "#22D3EE", bg: "rgba(34,211,238,0.1)", icon: Clock },
  failed: { label: "生成失败", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertCircle },
  cancelled: { label: "已取消", color: "#6B6C80", bg: "rgba(107,108,128,0.1)", icon: XCircle },
};

export function TaskRecordsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TaskFilter>({
    keyword: "",
    type: "全部",
    statusLabel: "全部",
  });

  const tasks = useMemo(() => filterTasks(filter), [filter]);
  const successCount = tasks.filter((task) => task.status === "success").length;
  const activeCount = tasks.filter((task) => task.status === "processing" || task.status === "queued").length;
  const failedCount = tasks.filter((task) => task.status === "failed").length;

  const columns: ColumnsType<GenerationTask> = [
    {
      title: "任务名称",
      dataIndex: "title",
      width: 320,
      render: (_, task) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--muted-bg)]">
            <Play size={11} className="text-[var(--text-muted)]" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] text-[var(--text-primary)]">{task.title}</div>
            {task.failReason && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#EF4444]">
                <AlertCircle size={11} />
                {task.failReason}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 110,
      render: (value: string) => <Tag color="purple">{value}</Tag>,
    },
    { title: "生成方式", dataIndex: "mode", width: 110 },
    { title: "时长", dataIndex: "duration", width: 90 },
    { title: "创建时间", dataIndex: "time", width: 150 },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (value: GenerationTask["status"]) => {
        const status = statusView[value];
        return <StatusPill label={status.label} color={status.color} background={status.bg} icon={status.icon} />;
      },
    },
    {
      title: "操作",
      width: 160,
      fixed: "right",
      render: (_, task) => {
        if (task.status === "success") {
          return (
            <div className="flex gap-2">
              <Button size="small" icon={<Play size={12} />}>预览</Button>
              <Button size="small" type="primary" icon={<Download size={12} />}>下载</Button>
            </div>
          );
        }

        if (task.status === "failed") {
          return <Button size="small" danger icon={<RefreshCw size={12} />}>重试</Button>;
        }

        return <span className="text-[12px] text-[#F97316]">处理中</span>;
      },
    },
  ];

  return (
    <PageShell
      title="任务记录"
      description="查看所有视频生成任务的状态、结果和下载记录"
      actions={
        <Button type="primary" onClick={() => navigate("/image-video/tasks")}>
          文图生视频任务页
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="当前筛选任务" value={tasks.length} color="#E8E9F0" icon={Play} />
        <MetricCard label="生成成功" value={successCount} color="#4ADE80" icon={CheckCircle2} />
        <MetricCard label="生成中/排队" value={activeCount} color="#F97316" icon={Clock} />
        <MetricCard label="生成失败" value={failedCount} color="#EF4444" icon={AlertCircle} />
      </div>

      <div className="mt-6 rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <Input
            allowClear
            className="max-w-xs"
            prefix={<Search size={14} />}
            placeholder="搜索任务..."
            value={filter.keyword}
            onChange={(event) => setFilter((value) => ({ ...value, keyword: event.target.value }))}
          />
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Segmented
              size="small"
              value={filter.type}
              options={["全部", "商品视频", "爆款改编", "图文视频"]}
              onChange={(value) => setFilter((current) => ({ ...current, type: value as TaskFilter["type"] }))}
            />
            <Segmented
              size="small"
              value={filter.statusLabel}
              options={["全部", "生成成功", "生成中", "排队中", "生成失败"]}
              onChange={(value) => setFilter((current) => ({ ...current, statusLabel: value as TaskFilter["statusLabel"] }))}
            />
          </div>
        </div>

        <Table
          rowKey="id"
          size="middle"
          columns={columns}
          dataSource={tasks}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1060 }}
        />
      </div>
    </PageShell>
  );
}
