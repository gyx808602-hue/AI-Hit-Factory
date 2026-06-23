import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Segmented } from "antd";
import { ListTodo, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteTextImageVideoTask,
  getTextImageVideoTaskPage,
} from "../api/customer/text-image-video";
import type { TextImageVideoTask } from "../api/customer/text-image-video/types";
import { getTextImageVideoTaskStatusMeta } from "../features/text-image-video/status";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

type StatusFilter = "all" | "0" | "2" | "3";

const PAGE_SIZE = 10;

function useTaskPage(status: StatusFilter) {
  return useQuery({
    queryKey: ["text-image-video", "tasks", status],
    queryFn: () =>
      getTextImageVideoTaskPage({
        pageNum: 1,
        pageSize: PAGE_SIZE,
        status: status === "all" ? undefined : Number(status),
      }),
  });
}

function TaskCard({
  task,
  deleting,
  onView,
  onDelete,
}: {
  task: TextImageVideoTask;
  deleting: boolean;
  onView: (task: TextImageVideoTask) => void;
  onDelete: (task: TextImageVideoTask) => void;
}) {
  const statusMeta = getTextImageVideoTaskStatusMeta(task);

  return (
    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <StatusPill
            label={statusMeta.label}
            color={statusMeta.color}
            background={statusMeta.background}
            icon={statusMeta.icon}
          />
          <h3 className="m-0 text-[14px] font-medium text-[var(--text-primary)]">{task.prompt}</h3>
          <div className="text-[12px] text-[var(--text-muted)]">
            模型：{task.model || "seedance2.0"} · 进度：{task.progress ?? 0}%
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="small" onClick={() => onView(task)}>
            查看详情
          </Button>
          <Button
            size="small"
            danger
            icon={<Trash2 size={14} />}
            aria-label={`删除任务-${task.id}`}
            loading={deleting}
            disabled={deleting}
            onClick={() => onDelete(task)}
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TextImageVideoTasksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDeleteTaskId, setPendingDeleteTaskId] = useState<TextImageVideoTask["id"] | null>(null);
  const pendingDeleteTaskIdRef = useRef<TextImageVideoTask["id"] | null>(null);
  const taskPageQuery = useTaskPage(statusFilter);

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: TextImageVideoTask["id"]) => {
      pendingDeleteTaskIdRef.current = taskId;
      setPendingDeleteTaskId(taskId);
      try {
        await deleteTextImageVideoTask(taskId);
      } finally {
        if (pendingDeleteTaskIdRef.current === taskId) {
          pendingDeleteTaskIdRef.current = null;
        }
        setPendingDeleteTaskId((current) => (current === taskId ? null : current));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["text-image-video", "tasks"] });
    },
  });

  const tasks = taskPageQuery.data?.list ?? [];

  const metrics = useMemo(() => {
    const successCount = tasks.filter((item) => item.videoUrl).length;
    const failedCount = tasks.filter((item) => item.errReason || item.syncError).length;

    return {
      total: taskPageQuery.data?.total ?? 0,
      successCount,
      failedCount,
    };
  }, [taskPageQuery.data?.total, tasks]);

  function handleDelete(task: TextImageVideoTask) {
    if (pendingDeleteTaskIdRef.current === task.id) {
      return;
    }

    if (!window.confirm(`确定删除任务 ${task.id} 吗？`)) {
      return;
    }

    pendingDeleteTaskIdRef.current = task.id;
    setPendingDeleteTaskId(task.id);
    deleteTaskMutation.mutate(task.id);
  }

  return (
    <PageShell
      title="文图生视频任务"
      description="查看文图生视频任务状态、结果与失败原因。"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="任务总数" value={metrics.total} color="#E8E9F0" icon={ListTodo} />
        <MetricCard label="已完成" value={metrics.successCount} color="#4ADE80" icon={ListTodo} />
        <MetricCard label="失败任务" value={metrics.failedCount} color="#EF4444" icon={ListTodo} />
      </div>

      <div className="mt-6 rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
        <div className="mb-4">
          <Segmented
            value={statusFilter}
            options={[
              { label: "全部", value: "all" },
              { label: "排队中", value: "0" },
              { label: "已完成", value: "2" },
              { label: "生成失败", value: "3" },
            ]}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
          />
        </div>

        {taskPageQuery.isLoading ? (
          <div className="py-10 text-center text-[13px] text-[var(--text-muted)]">任务加载中...</div>
        ) : tasks.length === 0 ? (
          <Empty description="暂无任务" />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                deleting={pendingDeleteTaskId === task.id}
                onView={(item) => navigate(`/image-video/tasks/${item.id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
