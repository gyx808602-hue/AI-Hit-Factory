import { Alert, Button, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteDigitalHumanVideoMutation,
  useDigitalHumanVideoDetail,
  useRefreshDigitalHumanVideoMutation,
} from "../features/digital-human/video/hooks";
import { getDigitalHumanVideoStatusMeta } from "../features/digital-human/video/status";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

export function DigitalHumanVideoTaskDetailPage() {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const detailQuery = useDigitalHumanVideoDetail(taskId);
  const refreshMutation = useRefreshDigitalHumanVideoMutation();
  const deleteMutation = useDeleteDigitalHumanVideoMutation();

  const task = detailQuery.data;
  const statusMeta = task ? getDigitalHumanVideoStatusMeta(task) : null;

  function handleDelete() {
    if (!taskId) {
      return;
    }

    if (!window.confirm(`确认删除任务 ${taskId} 吗？`)) {
      return;
    }

    deleteMutation.mutate(taskId, {
      onSuccess: () => {
        navigate("/digital-humans/videos");
      },
    });
  }

  return (
    <PageShell
      title={task?.name || "数字人视频详情"}
      description="查看数字人视频任务状态、结果信息，并执行刷新与删除动作。"
      actions={
        <div className="flex gap-2">
          <Button onClick={() => navigate("/digital-humans/videos")}>返回任务列表</Button>
          <Button onClick={() => refreshMutation.mutate(taskId ?? "")}>刷新状态</Button>
          <Button danger onClick={handleDelete}>
            删除任务
          </Button>
        </div>
      }
    >
      {detailQuery.isLoading ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 text-[13px] text-[var(--text-muted)]">
          数字人视频详情加载中...
        </div>
      ) : detailQuery.isError ? (
        <Alert type="error" showIcon message={(detailQuery.error as Error)?.message || "详情加载失败"} />
      ) : !task || !statusMeta ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6">
          <Empty description="未找到数字人视频详情" />
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

            <h2 className="m-0 text-[18px] font-semibold text-[var(--text-primary)]">{task.name}</h2>
            <div className="mt-3 text-[13px] text-[var(--text-muted)]">当前进度 {task.progress ?? 0}%</div>

            {task.errReason ? <div className="mt-5"><Alert type="error" showIcon message={task.errReason} /></div> : null}
            {task.errorMessage ? (
              <div className="mt-3">
                <Alert type="warning" showIcon message={task.errorMessage} />
              </div>
            ) : null}
          </section>

          <aside className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <h3 className="m-0 text-[16px] font-semibold text-[var(--text-primary)]">结果信息</h3>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="text-[var(--text-secondary)]">状态：{statusMeta.label}</div>
              <div className="text-[var(--text-secondary)]">数字人 ID：{task.personId}</div>
              {typeof task.duration === "number" ? (
                <div className="text-[var(--text-secondary)]">时长：{task.duration} 秒</div>
              ) : null}

              {task.coverUrl ? (
                <a href={task.coverUrl} target="_blank" rel="noreferrer" className="block text-[#22D3EE]">
                  查看封面图
                </a>
              ) : null}

              {task.subtitleUrl ? (
                <a href={task.subtitleUrl} target="_blank" rel="noreferrer" className="block text-[#22D3EE]">
                  查看字幕文件
                </a>
              ) : null}

              {task.videoUrl ? (
                <a href={task.videoUrl} target="_blank" rel="noreferrer" className="block text-[#22D3EE]">
                  查看结果视频
                </a>
              ) : (
                <div className="text-[var(--text-muted)]">结果视频尚未生成完成</div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
