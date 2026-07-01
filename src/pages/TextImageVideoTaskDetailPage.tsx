import { useQuery } from '@tanstack/react-query'
import { Alert, Button, Empty, Progress } from 'antd'
import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTextImageVideoTaskDetail } from '../api/customer/text-image-video'
import { mapTaskDetailToFormValues } from '../features/text-image-video/form'
import { getTextImageVideoTaskStatusMeta } from '../features/text-image-video/status'
import { PageShell } from '../shared/components/PageShell'
import { StatusPill } from '../shared/components/StatusPill'

const POLL_INTERVAL = 5000

function PreviewImageCard({
  imageUrl,
  testId,
}: {
  imageUrl: string
  testId: string
}) {
  return (
    <a
      href={imageUrl}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-white"
    >
      <img
        data-testid={testId}
        src={imageUrl}
        alt="图片预览"
        className="h-28 w-full object-cover"
      />
    </a>
  )
}

export function TextImageVideoTaskDetailPage() {
  const navigate = useNavigate()
  const { taskId } = useParams()

  const taskDetailQuery = useQuery({
    queryKey: ['text-image-video', 'task-detail', taskId],
    enabled: Boolean(taskId),
    queryFn: () => getTextImageVideoTaskDetail(taskId!, { silentError: true }),
    refetchInterval: (query) => {
      const task = query.state.data

      if (!task) {
        return false
      }

      const statusMeta = getTextImageVideoTaskStatusMeta(task)
      return statusMeta.resultState === 'processing' ? POLL_INTERVAL : false
    },
  })

  const task = taskDetailQuery.data
  const statusMeta = task ? getTextImageVideoTaskStatusMeta(task) : null
  const formValues = useMemo(
    () => (task ? mapTaskDetailToFormValues(task) : null),
    [task],
  )

  return (
    <PageShell
      title="文图生视频详情"
      description="恢复查看任务输入、状态与结果。"
      actions={
        <div className="flex items-center gap-2">
          <Button
            data-testid="text-image-video-back-button"
            onClick={() => navigate('/image-video/tasks')}
          >
            返回任务列表
          </Button>
          {/* <Button
            icon={<RefreshCw size={14} />}
            onClick={() => taskDetailQuery.refetch()}
          >
            刷新详情
          </Button> */}
        </div>
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
            message={
              (taskDetailQuery.error as Error)?.message || '任务详情加载失败'
            }
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
              {/* 模型：{formValues.model} · */}
              进度：{task.progress ?? 0}%
            </div>

            {statusMeta.resultState === 'processing' ? (
              <div className="mt-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4">
                <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">
                  生成进度
                </div>
                <Progress percent={task.progress ?? 0} status="active" />
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 text-[12px] text-[var(--text-muted)]">
                  参考图
                </div>
                {formValues.imageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {formValues.imageUrls.map((imageUrl) => (
                      <PreviewImageCard
                        key={imageUrl}
                        imageUrl={imageUrl}
                        testId="text-image-video-reference-preview"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[var(--line-subtle)] px-3 py-4 text-[12px] text-[var(--text-muted)]">
                    暂无参考图
                  </div>
                )}
              </div>

              {task.errReason ? (
                <Alert message={task.errReason} type="error" showIcon />
              ) : null}
              {task.syncError ? (
                <Alert message={task.syncError} type="warning" showIcon />
              ) : null}
            </div>
          </section>

          <aside className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <h3 className="m-0 text-[16px] font-semibold text-[var(--text-primary)]">
              结果信息
            </h3>
            <div className="mt-4 space-y-4 text-[13px]">
              <div className="text-[var(--text-secondary)]">
                状态：{statusMeta.label}
              </div>
              {typeof task.duration === 'number' ? (
                <div className="text-[var(--text-secondary)]">
                  时长：{task.duration} 秒
                </div>
              ) : null}

              {task.coverUrl ? (
                <div className="space-y-2">
                  <div className="text-[12px] text-[var(--text-muted)]">
                    封面图预览
                  </div>
                  <PreviewImageCard
                    imageUrl={task.coverUrl}
                    testId="text-image-video-cover-preview"
                  />
                  <a
                    data-testid="text-image-video-cover-download"
                    href={task.coverUrl}
                    download
                    className="inline-flex text-[13px] text-[#22D3EE]"
                  >
                    下载封面图
                  </a>
                </div>
              ) : null}

              {task.videoUrl ? (
                <div className="space-y-2">
                  <div className="text-[12px] text-[var(--text-muted)]">
                    结果视频预览
                  </div>
                  <video
                    data-testid="text-image-video-result-video-preview"
                    className="w-full rounded-xl border border-[var(--line-subtle)]"
                    controls
                    src={task.videoUrl}
                  />
                  <a
                    data-testid="text-image-video-video-download"
                    href={task.videoUrl}
                    download
                    className="inline-flex text-[13px] text-[#22D3EE]"
                  >
                    下载结果视频
                  </a>
                </div>
              ) : (
                <div className="text-[var(--text-muted)]">
                  视频结果尚未生成完成
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  )
}
