import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Empty } from "antd";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTextImageVideoTaskDetail } from "../api/customer/text-image-video";
import { mapTaskDetailToFormValues } from "../features/text-image-video/form";
import { getTextImageVideoTaskStatusMeta } from "../features/text-image-video/status";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

export function TextImageVideoTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const taskDetailQuery = useQuery({
    queryKey: ["text-image-video", "task-detail", taskId],
    enabled: Boolean(taskId),
    // 详情页已经有局部错误展示，这里关闭全局弹错，避免 message 和 Alert 重复提示。
    queryFn: () => getTextImageVideoTaskDetail(taskId!, { silentError: true }),
  });

  const task = taskDetailQuery.data;
  const statusMeta = task ? getTextImageVideoTaskStatusMeta(task) : null;
  const formValues = useMemo(() => (task ? mapTaskDetailToFormValues(task) : null), [task]);

  return (
    <PageShell
      title="文图生视频详情"
      description="恢复查看任务输入、状态与结果。"
      actions={
        <Button onClick={() => navigate("/image-video/tasks")}>
          {/* 保留详情页返回入口，避免用户只能依赖浏览器后退。 */}
          返回任务列表
        </Button>
      }
    >
      {taskDetailQuery.isLoading ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 text-[13px] text-[var(--text-muted)]">
          任务详情加载中...
        </div>
      ) : taskDetailQuery.isError ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6">
          <Alert
            type="error"
            showIcon
            message={(taskDetailQuery.error as Error)?.message || "任务详情加载失败"}
          />
        </div>
      ) : !task || !statusMeta || !formValues ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6">
          <Empty description="未找到任务详情" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <div className="mb-4">
              <StatusPill
                label={statusMeta.label}
                color={statusMeta.color}
                background={statusMeta.background}
                icon={statusMeta.icon}
              />
            </div>
            <h2 className="m-0 text-[18px] font-semibold text-[var(--text-primary)]">
              {formValues.prompt}
            </h2>
            <div className="mt-3 text-[13px] text-[var(--text-muted)]">
              模型：{formValues.model} · 进度：{task.progress ?? 0}%
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-2 text-[12px] text-[var(--text-muted)]">参考图</div>
                <div className="flex flex-wrap gap-2">
                  {formValues.imageUrls.map((imageUrl) => (
                    <a
                      key={imageUrl}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-[var(--line-subtle)] px-3 py-2 text-[12px] text-[var(--text-secondary)]"
                    >
                      {imageUrl}
                    </a>
                  ))}
                </div>
              </div>

              {task.errReason ? <Alert message={task.errReason} type="error" showIcon /> : null}
              {task.syncError ? <Alert message={task.syncError} type="warning" showIcon /> : null}
            </div>
          </section>

          <aside className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <h3 className="m-0 text-[16px] font-semibold text-[var(--text-primary)]">结果信息</h3>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="text-[var(--text-secondary)]">状态：{statusMeta.label}</div>
              {typeof task.duration === "number" ? (
                <div className="text-[var(--text-secondary)]">时长：{task.duration} 秒</div>
              ) : null}
              {task.coverUrl ? (
                <a href={task.coverUrl} target="_blank" rel="noreferrer" className="block text-[#22D3EE]">
                  查看封面图
                </a>
              ) : null}
              {task.videoUrl ? (
                <a href={task.videoUrl} target="_blank" rel="noreferrer" className="block text-[#22D3EE]">
                  查看结果视频
                </a>
              ) : (
                <div className="text-[var(--text-muted)]">视频结果尚未生成完成</div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
