import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
} from 'antd'
import {
  ArrowLeft,
  AudioLines,
  CheckCircle2,
  FileImage,
  RefreshCw,
  UploadCloud,
  Video,
} from 'lucide-react'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  checkVideoRemixTaskPrompt,
  generateVideoRemixTaskPrompt,
  generateVideoRemixTaskVideo,
  getVideoRemixTaskDetail,
  refreshVideoRemixTask,
  saveVideoRemixTaskForm,
} from '../api/aigc/video-remix-tasks'
import type { VideoRemixTask } from '../api/aigc/video-remix-tasks/types'
import { uploadAudio, uploadImage, uploadVideo } from '../api/aigc/uploads'
import {
  clearVideoRemixTaskDraft,
  mapFormValuesToSavePayload,
  mapTaskDetailToFormValues,
  readVideoRemixTaskDraft,
  type VideoRemixTaskFormValues,
} from '../features/video-remix/form'
import { getVideoRemixTaskStatusMeta } from '../features/video-remix/status'
import { PageShell } from '../shared/components/PageShell'
import { StatusPill } from '../shared/components/StatusPill'

const detailQueryKey = (taskId: string) => ['video-remix-task-detail', taskId]

type UploadMode = 'replace' | 'append'

function mergeTaskIntoCache(
  queryClient: ReturnType<typeof useQueryClient>,
  taskId: string,
  nextTask: VideoRemixTask,
) {
  queryClient.setQueryData(detailQueryKey(taskId), nextTask)
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-4 w-[3px] rounded-full bg-[#2563EB]" />
      <h2 className="m-0 text-[15px] font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
    </div>
  )
}

function UploadField({
  value,
  placeholder,
  buttonLabel,
  buttonIcon,
  onClick,
}: {
  value?: string
  placeholder: string
  buttonLabel: string
  buttonIcon: React.ReactNode
  onClick: () => void
}) {
  return (
    <Space.Compact className="w-full">
      <Input value={value} placeholder={placeholder} readOnly />
      <Button icon={buttonIcon} onClick={onClick}>
        {buttonLabel}
      </Button>
    </Space.Compact>
  )
}

function splitAssetUrls(value?: string) {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function VideoRemixTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm<VideoRemixTaskFormValues>()
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const referenceVideoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const characterImageInputRef = useRef<HTMLInputElement>(null)

  const detailQuery = useQuery({
    queryKey: detailQueryKey(taskId ?? ''),
    queryFn: () => getVideoRemixTaskDetail(taskId ?? ''),
    enabled: Boolean(taskId),
  })

  useEffect(() => {
    if (!detailQuery.data || !taskId) {
      return
    }

    const draft = readVideoRemixTaskDraft(taskId)
    form.setFieldsValue({
      ...mapTaskDetailToFormValues(detailQuery.data),
      ...draft,
    })
  }, [detailQuery.data, form, taskId])

  const saveMutation = useMutation({
    mutationFn: (values: VideoRemixTaskFormValues) =>
      saveVideoRemixTaskForm(taskId ?? '', mapFormValuesToSavePayload(values)),
    onSuccess: (task) => {
      if (!taskId) {
        return
      }

      mergeTaskIntoCache(queryClient, taskId, task)
      clearVideoRemixTaskDraft(taskId)
      setActionError('')
      setActionSuccess('任务信息已保存')
    },
    onError: (error: Error) => {
      setActionSuccess('')
      setActionError(error.message)
    },
  })

  const actionMutation = useMutation({
    mutationFn: async (
      action: 'check-prompt' | 'generate-prompt' | 'generate-video' | 'refresh',
    ) => {
      if (!taskId) {
        throw new Error('任务 ID 不存在')
      }

      if (action === 'check-prompt') {
        return checkVideoRemixTaskPrompt(taskId)
      }

      if (action === 'generate-prompt') {
        return generateVideoRemixTaskPrompt(taskId)
      }

      if (action === 'generate-video') {
        return generateVideoRemixTaskVideo(taskId)
      }

      return refreshVideoRemixTask(taskId)
    },
    onSuccess: (task, action) => {
      if (!taskId) {
        return
      }

      mergeTaskIntoCache(queryClient, taskId, task)
      form.setFieldsValue(mapTaskDetailToFormValues(task))
      setActionError('')
      setActionSuccess(
        action === 'refresh'
          ? '任务详情已刷新'
          : action === 'generate-video'
            ? '已提交生成视频动作'
            : '任务状态已更新',
      )
    },
    onError: (error: Error) => {
      setActionSuccess('')
      setActionError(error.message)
    },
  })

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
    field: keyof VideoRemixTaskFormValues,
    mode: UploadMode,
    uploader: typeof uploadVideo,
  ) {
    const files = event.target.files
    const file = files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    try {
      setActionError('')
      const result = await uploader(file)
      const currentValue = form.getFieldValue(field) ?? ''
      const nextValue =
        mode === 'append' && currentValue
          ? `${String(currentValue).trim()}\n${result.url}`
          : result.url
      form.setFieldValue(field, nextValue)
      setActionSuccess(`已上传 ${result.originalFilename}`)
    } catch (error) {
      setActionSuccess('')
      setActionError((error as Error).message)
    }
  }

  const task = detailQuery.data
  const statusMeta = useMemo(
    () => getVideoRemixTaskStatusMeta(task ?? {}),
    [task],
  )
  const referenceVideoUrl = Form.useWatch('referenceVideoUrl', form)
  const productImageUrlsText = Form.useWatch('productImageUrlsText', form)
  const characterImageUrlsText = Form.useWatch('characterImageUrlsText', form)
  const productImageUrls = useMemo(
    () => splitAssetUrls(productImageUrlsText),
    [productImageUrlsText],
  )
  const characterImageUrls = useMemo(
    () => splitAssetUrls(characterImageUrlsText),
    [characterImageUrlsText],
  )

  if (!taskId) {
    return <Alert type="error" showIcon message="缺少任务 ID" />
  }

  if (detailQuery.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin />
      </div>
    )
  }

  if (detailQuery.isError || !task) {
    return (
      <PageShell title="追爆任务详情" description="未能加载当前任务详情。">
        <Alert
          type="error"
          showIcon
          message="任务详情加载失败"
          description={
            detailQuery.isError
              ? (detailQuery.error as Error).message
              : '任务不存在'
          }
        />
      </PageShell>
    )
  }

  return (
    <PageShell
      title={task.name || '追爆任务详情'}
      description="新建任务后，可在这里继续补齐任务信息、素材与生成指令。"
      actions={
        <div className="flex gap-2">
          <Button
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate('/viral-remix/tasks')}
          >
            返回列表
          </Button>
          <Button
            icon={<RefreshCw size={14} />}
            loading={actionMutation.isPending}
            onClick={() => actionMutation.mutate('refresh')}
          >
            刷新详情
          </Button>
        </div>
      }
    >
      {actionError ? (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="操作失败"
          description={actionError}
        />
      ) : null}
      {actionSuccess ? (
        <Alert
          className="mb-4"
          type="success"
          showIcon
          message={actionSuccess}
        />
      ) : null}

      <Form<VideoRemixTaskFormValues>
        form={form}
        layout="vertical"
        onFinish={(values) => saveMutation.mutate(values)}
      >
        <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-[18px] font-semibold text-[var(--text-primary)]">
                编辑视频追爆任务
              </div>
              <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                保存后会持久化到服务端，可随时重新进入继续编辑。
              </div>
            </div>
            <StatusPill
              label={statusMeta.label}
              color={statusMeta.color}
              background={statusMeta.background}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <section data-testid="video-remix-basic-section">
                <SectionTitle title="基础信息" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Form.Item
                    name="name"
                    label="任务名称"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                  >
                    <Input maxLength={128} placeholder="请输入任务名称" />
                  </Form.Item>
                  <Form.Item
                    name="targetVideoModel"
                    label="目标模型"
                    rules={[{ required: true, message: '请选择目标视频模型' }]}
                  >
                    <Select
                      options={[
                        { value: 'wan2.7-r2v', label: 'Wan 2.7' },
                        { value: 'seedance2.0', label: 'SeeDance 2.0' },
                        { value: 'wan2.1-i2v', label: 'Wan 2.1' },
                      ]}
                    />
                  </Form.Item>
                </div>

                <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                  <Form.Item name="generationDuration" label="总时长(秒)">
                    <InputNumber min={5} max={120} className="w-full" />
                  </Form.Item>
                  <Form.Item name="remark" label="备注">
                    <Input.TextArea
                      rows={2}
                      maxLength={512}
                      placeholder="可选，记录任务备注"
                    />
                  </Form.Item>
                </div>
              </section>

              <section data-testid="video-remix-direction-section">
                <SectionTitle title="内容方向" />
                <Form.Item name="productInfo" label="产品信息">
                  <Input.TextArea
                    rows={4}
                    placeholder="填写产品卖点、受众、场景、利益点等信息"
                  />
                </Form.Item>
                <Form.Item name="voiceoverScript" label="口播文案">
                  <Input.TextArea
                    rows={4}
                    placeholder="若已有脚本，可在这里直接填写"
                  />
                </Form.Item>
                <Form.Item name="direction" label="复刻方向">
                  <Input.TextArea
                    rows={3}
                    placeholder="保留哪些结构、替换什么内容、输出什么改编风格"
                  />
                </Form.Item>
              </section>
            </div>

            <section data-testid="video-remix-assets-section">
              <SectionTitle title="素材" />
              <Form.Item
                name="referenceVideoUrl"
                label="参考视频"
                rules={[{ required: true, message: '请提供参考视频' }]}
              >
                <UploadField
                  value={form.getFieldValue('referenceVideoUrl')}
                  placeholder="上传或粘贴参考视频 URL"
                  buttonLabel="选择文件"
                  buttonIcon={<Video size={14} />}
                  onClick={() => referenceVideoInputRef.current?.click()}
                />
              </Form.Item>
              <input
                ref={referenceVideoInputRef}
                type="file"
                className="hidden"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(event) =>
                  void handleUpload(
                    event,
                    'referenceVideoUrl',
                    'replace',
                    uploadVideo,
                  )
                }
              />

              {referenceVideoUrl ? (
                <div className="mb-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3">
                  <div className="mb-2 text-[12px] text-[var(--text-muted)]">
                    参考视频预览
                  </div>
                  <video
                    data-testid="video-remix-reference-video-preview"
                    className="w-full rounded-lg border border-[var(--line-subtle)]"
                    controls
                    src={referenceVideoUrl}
                  />
                </div>
              ) : null}

              <Form.Item name="videoMetaSummary" label="视频摘要">
                <Input.TextArea
                  rows={4}
                  placeholder="提炼视频节奏、镜头和文案结构摘要（可选）"
                />
              </Form.Item>

              <Form.Item name="productImageUrlsText" label="商品图">
                <div className="space-y-2">
                  <Button
                    icon={<FileImage size={14} />}
                    onClick={() => productImageInputRef.current?.click()}
                  >
                    选择文件
                  </Button>
                  <Input.TextArea
                    rows={3}
                    placeholder="粘贴 URL 后按回车添加，或通过上传补充"
                  />
                  <div className="text-[12px] text-[var(--text-muted)]">
                    至少上传 1 张商品图
                  </div>
                </div>
              </Form.Item>
              <input
                ref={productImageInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  void handleUpload(
                    event,
                    'productImageUrlsText',
                    'append',
                    uploadImage,
                  )
                }
              />

              {productImageUrls.length > 0 ? (
                <div className="mb-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3">
                  <div className="mb-2 text-[12px] text-[var(--text-muted)]">
                    商品图预览
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {productImageUrls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-lg border border-[var(--line-subtle)] bg-white"
                      >
                        <img
                          data-testid="video-remix-product-image-preview"
                          className="h-28 w-full object-cover"
                          src={url}
                          alt="商品图预览"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <Form.Item name="characterImageUrlsText" label="人物图">
                <div className="space-y-2">
                  <Button
                    icon={<UploadCloud size={14} />}
                    onClick={() => characterImageInputRef.current?.click()}
                  >
                    选择文件
                  </Button>
                  <Input.TextArea
                    rows={3}
                    placeholder="可选，粘贴 URL 或上传人物素材图"
                  />
                  <div className="text-[12px] text-[var(--text-muted)]">
                    可选，不上传则使用原视频人物
                  </div>
                </div>
              </Form.Item>
              <input
                ref={characterImageInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  void handleUpload(
                    event,
                    'characterImageUrlsText',
                    'append',
                    uploadImage,
                  )
                }
              />

              {characterImageUrls.length > 0 ? (
                <div className="mb-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3">
                  <div className="mb-2 text-[12px] text-[var(--text-muted)]">
                    人物图预览
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {characterImageUrls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-lg border border-[var(--line-subtle)] bg-white"
                      >
                        <img
                          data-testid="video-remix-character-image-preview"
                          className="h-28 w-full object-cover"
                          src={url}
                          alt="人物图预览"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <Form.Item name="audioUrl" label="参考音频">
                <UploadField
                  value={form.getFieldValue('audioUrl')}
                  placeholder="上传或粘贴参考音频 URL"
                  buttonLabel="选择文件"
                  buttonIcon={<AudioLines size={14} />}
                  onClick={() => audioInputRef.current?.click()}
                />
              </Form.Item>
              <input
                ref={audioInputRef}
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={(event) =>
                  void handleUpload(event, 'audioUrl', 'replace', uploadAudio)
                }
              />
            </section>
          </div>

          <section
            data-testid="video-remix-prompt-section"
            className="mt-8 border-t border-[var(--line-subtle)] pt-6"
          >
            <SectionTitle title="Prompt 与结果" />
            <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="mb-2 text-[12px] text-[var(--text-muted)]">
                  生成的 Prompt
                </div>
                <div className="whitespace-pre-wrap rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3 text-[12px] leading-6 text-[var(--text-secondary)]">
                  {task.generatedPrompt || '当前还没有生成 Prompt'}
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3 text-[12px] text-[var(--text-secondary)]">
                <div>状态：{statusMeta.label}</div>
                <div>进度：{task.progress ?? 0}%</div>
                <div>Prompt 服务：{task.promptProvider || '-'}</div>
                <div>Prompt 模型：{task.promptModel || '-'}</div>
                <div>
                  视频模型：{task.videoModel || task.targetVideoModel || '-'}
                </div>
                <div>外部任务号：{task.externalTaskId || '-'}</div>
                <div>
                  校验结果：
                  {typeof task.promptCheckPass === 'boolean'
                    ? task.promptCheckPass
                      ? '通过'
                      : '未通过'
                    : '-'}
                </div>
              </div>
            </div>

            {statusMeta.resultState === 'success' ? (
              <div className="mb-4 space-y-2 rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4 text-[12px] text-[var(--text-secondary)]">
                {task.videoUrl ? (
                  <video
                    className="mb-3 w-full rounded-lg border border-[var(--line-subtle)]"
                    controls
                    src={task.videoUrl}
                  />
                ) : null}
                <div>视频地址：{task.videoUrl || '-'}</div>
                <div>封面地址：{task.coverUrl || '-'}</div>
                <div>时长：{task.duration ? `${task.duration} 秒` : '-'}</div>
              </div>
            ) : null}

            {statusMeta.resultState === 'failed' ? (
              <Alert
                className="mb-4"
                type="error"
                showIcon
                message="生成失败"
                description={task.errReason || '任务执行失败，请稍后刷新重试'}
              />
            ) : null}

            {statusMeta.resultState === 'processing' ? (
              <Alert
                className="mb-4"
                type="info"
                showIcon
                message="任务处理中"
                description="服务端仍在处理当前任务，可以稍后点击刷新详情查看最新状态。"
              />
            ) : null}

            {statusMeta.resultState === 'empty' ? (
              <Alert
                className="mb-4"
                type="warning"
                showIcon
                message="暂未生成结果"
                description="请先补齐任务信息并保存，再生成 Prompt 与视频。"
              />
            ) : null}

            <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--line-subtle)] pt-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!statusMeta.canGeneratePrompt}
                  loading={actionMutation.isPending}
                  onClick={() => actionMutation.mutate('generate-prompt')}
                >
                  生成 Prompt
                </Button>
                {/* <Button
                  disabled={!statusMeta.canCheckPrompt}
                  loading={actionMutation.isPending}
                  onClick={() => actionMutation.mutate("check-prompt")}
                >
                  检查通过
                </Button>
                <Button
                  disabled={!statusMeta.canGenerateVideo}
                  loading={actionMutation.isPending}
                  onClick={() => actionMutation.mutate("generate-video")}
                >
                  生成视频
                </Button>
                <Button loading={actionMutation.isPending} onClick={() => actionMutation.mutate("refresh")}>
                  刷新详情
                </Button> */}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate('/viral-remix/tasks')}>
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saveMutation.isPending}
                >
                  保存
                </Button>
              </div>
            </div>
          </section>
        </div>
      </Form>
    </PageShell>
  )
}
