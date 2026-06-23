import { Alert, Button, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getDigitalHumanStatusMeta } from "../features/digital-human/status";
import {
  useDeleteDigitalHumanMutation,
  useDigitalHumanDetail,
  useRefreshDigitalHumanMutation,
} from "../features/digital-human/hooks";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

export function DigitalHumanDetailPage() {
  const navigate = useNavigate();
  const { humanId } = useParams<{ humanId: string }>();
  const detailQuery = useDigitalHumanDetail(humanId);
  const refreshMutation = useRefreshDigitalHumanMutation();
  const deleteMutation = useDeleteDigitalHumanMutation();

  const human = detailQuery.data;
  const statusMeta = human ? getDigitalHumanStatusMeta(human) : null;

  function handleDelete() {
    if (!humanId) {
      return;
    }

    if (!window.confirm(`确认删除数字人 ${humanId} 吗？`)) {
      return;
    }

    deleteMutation.mutate(humanId, {
      onSuccess: () => {
        navigate("/digital-humans");
      },
    });
  }

  return (
    <PageShell
      title={human?.name || "数字人详情"}
      description="查看数字人训练状态、结果信息，并执行刷新与删除动作。"
      actions={
        <div className="flex gap-2">
          <Button onClick={() => navigate("/digital-humans")}>返回列表</Button>
          <Button onClick={() => refreshMutation.mutate(humanId ?? "")}>刷新状态</Button>
          <Button danger onClick={handleDelete}>
            删除数字人
          </Button>
        </div>
      }
    >
      {detailQuery.isLoading ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6 text-[13px] text-[var(--text-muted)]">
          数字人详情加载中...
        </div>
      ) : detailQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message={(detailQuery.error as Error)?.message || "详情加载失败"}
        />
      ) : !human || !statusMeta ? (
        <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-6">
          <Empty description="未找到数字人详情" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <div className="mb-4">
              <StatusPill
                label={statusMeta.label}
                color={statusMeta.color}
                background={statusMeta.background}
              />
            </div>

            <h2 className="m-0 text-[18px] font-semibold text-[var(--text-primary)]">
              {human.name}
            </h2>
            <div className="mt-3 text-[13px] text-[var(--text-muted)]">
              当前进度 {human.progress ?? 0}%
            </div>

            {(human.errReason || human.errorMessage) ? (
              <div className="mt-5 space-y-3">
                {human.errReason ? (
                  <Alert type="error" showIcon message={human.errReason} />
                ) : null}
                {human.errorMessage ? (
                  <Alert type="warning" showIcon message={human.errorMessage} />
                ) : null}
              </div>
            ) : null}
          </section>

          <aside className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <h3 className="m-0 text-[16px] font-semibold text-[var(--text-primary)]">结果信息</h3>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="text-[var(--text-secondary)]">训练状态：{statusMeta.label}</div>
              <div className="text-[var(--text-secondary)]">{human.progress ?? 0}%</div>
              <div className="text-[var(--text-secondary)]">
                尺寸：{human.width && human.height ? `${human.width} x ${human.height}` : "-"}
              </div>
              <div className="text-[var(--text-secondary)]">
                4K 支持：{human.support4k ? "支持" : "未知"}
              </div>

              {human.previewImageUrl ? (
                <a
                  href={human.previewImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[#22D3EE]"
                >
                  查看预览图
                </a>
              ) : null}

              {human.previewVideoUrl ? (
                <a
                  href={human.previewVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[#22D3EE]"
                >
                  查看预览视频
                </a>
              ) : (
                <div className="text-[var(--text-muted)]">预览视频尚未生成</div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
