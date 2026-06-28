import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Card, Empty, Form, Image, Input, InputNumber, Progress, Space, Spin, Tag, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import { ArrowLeft, AudioLines, FileImage, RefreshCw, Sparkles, UploadCloud, Video } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
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
const materialsStepRequiredFields: Array<keyof VideoRemixTaskFormValues> = [
  'referenceVideoUrl',
  'productInfo',
  'voiceoverScript',
  'direction',
]
const promptStepRequiredFields: Array<keyof VideoRemixTaskFormValues> = ['editablePrompt']

type TaskAction = 'generate-prompt' | 'generate-video' | 'refresh'
type DetailStep = 'materials' | 'prompt' | 'video'

const stepItems: Array<{ key: DetailStep; title: string; description: string }> = [
  {
    key: 'materials',
    title: '素材上传和配置',
    description: '先补素材，再整理改编方向和内容输入。',
  },
  {
    key: 'prompt',
    title: '提示词',
    description: '生成提示词后可本地修改预览。',
  },
  {
    key: 'video',
    title: '视频生成',
    description: '查看进度、新老视频对比与最终结果。',
  },
]

function mergeTaskIntoCache(
  queryClient: ReturnType<typeof useQueryClient>,
  taskId: string,
  nextTask: VideoRemixTask,
) {
  queryClient.setQueryData(detailQueryKey(taskId), nextTask)
}

function mergeTaskDetailPreservingGeneratedState(
  previousTask: VideoRemixTask | undefined,
  nextTask: VideoRemixTask,
) {
  if (!previousTask) {
    return nextTask
  }

  return {
    ...previousTask,
    ...nextTask,
    form: {
      ...previousTask.form,
      ...nextTask.form,
    },
  }
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-4 w-[3px] rounded-full bg-[#2563EB]" />
      <h2 className="m-0 text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
    </div>
  )
}

function splitAssetUrls(value?: string) {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function removeAssetUrl(value?: string, targetUrl?: string) {
  return splitAssetUrls(value)
    .filter((url) => url !== targetUrl)
    .join('\n')
}

function AssetPreviewGrid({
  title,
  emptyDescription,
  tagLabel,
  removeLabel,
  previewTestId,
  urls,
  onRemove,
}: {
  title: string
  emptyDescription: string
  tagLabel: string
  removeLabel: string
  previewTestId: string
  urls: string[]
  onRemove: (url: string) => void
}) {
  return (
    <div className="space-y-3">
      <div className="text-[12px] text-[var(--text-muted)]">{title}</div>
      {urls.length > 0 ? (
        <div
          data-testid={previewTestId === 'video-remix-product-image-preview' ? 'video-remix-product-image-grid' : 'video-remix-character-image-grid'}
          className="grid grid-cols-[repeat(auto-fill,minmax(140px,180px))] gap-3"
        >
          {urls.map((url, index) => (
            <Card
              key={url}
              size="small"
              className="overflow-hidden border border-[var(--line-subtle)]"
              styles={{ body: { padding: 10 } }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Tag color="blue" className="m-0">
                  {tagLabel} {index + 1}
                </Tag>
                <Button type="text" danger size="small" onClick={() => onRemove(url)}>
                  {removeLabel}
                </Button>
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--muted-bg)]">
                <Image
                  src={url}
                  alt={`${tagLabel}${index + 1}`}
                  preview
                  className="h-full w-full object-cover"
                  fallback={url}
                />
                <img data-testid={previewTestId} className="hidden" src={url} alt={`${tagLabel}预览`} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] px-4 py-6">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDescription} />
        </div>
      )}
    </div>
  )
}

function UploadTrigger({
  testId,
  accept,
  multiple,
  onUpload,
  children,
}: {
  testId: string
  accept?: string
  multiple?: boolean
  onUpload: (files: File[]) => Promise<void>
  children: ReactNode
}) {
  const uploadProps: UploadProps = {
    accept,
    multiple,
    showUploadList: false,
    beforeUpload: async (file, fileList) => {
      const nextFiles = ((fileList?.length ? fileList : [file]) as File[]).filter(Boolean)
      const firstFile = nextFiles[0]

      if (!firstFile) {
        return Upload.LIST_IGNORE
      }

      const currentFileToken = `${file.name}:${file.size}:${file.lastModified}`
      const firstFileToken = `${firstFile.name}:${firstFile.size}:${firstFile.lastModified}`

      if (currentFileToken !== firstFileToken) {
        return Upload.LIST_IGNORE
      }

      await onUpload(nextFiles)
      return Upload.LIST_IGNORE
    },
  }

  return (
    <Upload {...uploadProps}>
      <div data-testid={testId}>{children}</div>
    </Upload>
  )
}

function StepNavigation({
  currentStep,
  onChange,
}: {
  currentStep: DetailStep
  onChange: (step: DetailStep) => void
}) {
  return (
    <div className="mb-6 grid gap-3 lg:grid-cols-3">
      {stepItems.map((step, index) => {
        const active = step.key === currentStep

        return (
          <button
            key={step.key}
            type="button"
            className="rounded-2xl border p-4 text-left transition"
            style={{
              borderColor: active ? '#2563EB55' : 'var(--line-subtle)',
              background: active ? 'rgba(37,99,235,0.08)' : 'var(--card-bg)',
            }}
            onClick={() => onChange(step.key)}
          >
            <div className="mb-2 text-[12px] font-semibold text-[#2563EB]">步骤 {index + 1}</div>
            <div className="text-[14px] font-semibold text-[var(--text-primary)]">{step.title}</div>
            <div className="mt-1 text-[12px] leading-5 text-[var(--text-muted)]">{step.description}</div>
          </button>
        )
      })}
    </div>
  )
}

function StepActions({
  currentStep,
  saving,
  onPrev,
  onNext,
}: {
  currentStep: DetailStep
  saving?: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const currentIndex = stepItems.findIndex((item) => item.key === currentStep)

  return (
    <div
      data-testid="video-remix-step-actions"
      className="sticky bottom-0 z-20 -mx-5 mt-8 border-t border-[var(--line-subtle)] bg-[var(--card-bg)]/95 px-5 py-4 backdrop-blur"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {currentIndex > 0 ? (
          <Button onClick={onPrev}>上一步</Button>
        ) : (
          <span className="text-[12px] text-[var(--text-muted)]">已在第一步</span>
        )}
        <div className="flex gap-2">
          {currentIndex < stepItems.length - 1 ? (
            <Button loading={saving} onClick={onNext}>
              下一步
            </Button>
          ) : null}
          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}

function VideoPreviewCard({
  title,
  testId,
  videoUrl,
  emptyText,
}: {
  title: string
  testId: string
  videoUrl?: string
  emptyText: string
}) {
  return (
    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[13px] font-medium text-[var(--text-primary)]">{title}</div>
        {videoUrl ? <Tag color="processing">已就绪</Tag> : null}
      </div>
      <div data-testid={testId} className="aspect-video overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-black/80">
        {videoUrl ? (
          <video className="h-full w-full object-contain" controls src={videoUrl} />
        ) : (
          <div className="flex h-full items-center justify-center text-[12px] text-white/65">{emptyText}</div>
        )}
      </div>
    </div>
  )
}

function StepContentHint({ text }: { text: string }) {
  return <div className="text-[12px] leading-5 text-[var(--text-muted)]">{text}</div>
}

function ActionSuccessAlert({ messageText }: { messageText: string }) {
  return <Alert className="mb-4" type="success" showIcon title={messageText} />
}

function ActionErrorAlert({
  errorText,
}: {
  errorText: string
}) {
  return <Alert className="mb-4" type="error" showIcon title="操作失败" description={errorText} />
}

function PageErrorAlert({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return <Alert type="error" showIcon title={title} description={description} />
}

function PageMissingAlert({ text }: { text: string }) {
  return <Alert type="error" showIcon title={text} />
}

export function VideoRemixTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm<VideoRemixTaskFormValues>()
  const [currentStep, setCurrentStep] = useState<DetailStep>('materials')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [pendingAction, setPendingAction] = useState<TaskAction | null>(null)
  const [stepSubmitting, setStepSubmitting] = useState(false)
  const [uploadingField, setUploadingField] = useState<keyof VideoRemixTaskFormValues | null>(null)

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

  useEffect(() => {
    if (!actionSuccess) {
      return
    }

    void message.success(actionSuccess)
    setActionSuccess('')
  }, [actionSuccess])

  useEffect(() => {
    if (!actionError) {
      return
    }

    void message.error(actionError)
    setActionError('')
  }, [actionError])

  async function saveCurrentFormValues(fieldNames?: Array<keyof VideoRemixTaskFormValues>) {
    if (!taskId) {
      throw new Error('任务 ID 不存在')
    }

    const currentEditablePrompt = String(form.getFieldValue('editablePrompt') ?? '')
    if (fieldNames?.length) {
      await form.validateFields(fieldNames as string[])
    } else {
      await form.validateFields()
    }

    const fullValues = form.getFieldsValue(true) as VideoRemixTaskFormValues
    const nextTask = await saveVideoRemixTaskForm(taskId, mapFormValuesToSavePayload(fullValues))
    const mergedTask = mergeTaskDetailPreservingGeneratedState(task, nextTask)

    mergeTaskIntoCache(queryClient, taskId, mergedTask)
    clearVideoRemixTaskDraft(taskId)
    form.setFieldsValue({
      ...mapTaskDetailToFormValues(mergedTask),
      editablePrompt: currentEditablePrompt || mergedTask.generatedPrompt || '',
    })
    setActionError('')

    return mergedTask
  }

  async function handleStepChange(nextStep: DetailStep) {
    const currentIndex = stepItems.findIndex((item) => item.key === currentStep)
    const nextIndex = stepItems.findIndex((item) => item.key === nextStep)

    if (nextIndex === currentIndex) {
      return
    }

    if (nextIndex < currentIndex) {
      setCurrentStep(nextStep)
      return
    }

    try {
      setStepSubmitting(true)
      const requiredFields =
        currentStep === 'materials'
          ? materialsStepRequiredFields
          : currentStep === 'prompt'
            ? promptStepRequiredFields
            : undefined
      await saveCurrentFormValues(requiredFields)
      setActionSuccess('任务信息已保存')
      setCurrentStep(nextStep)
    } catch (error) {
      if (error instanceof Error && error.message) {
        setActionSuccess('')
        setActionError(error.message)
      }
    } finally {
      setStepSubmitting(false)
    }
  }

  function handleAiGenerate(field: 'productInfo' | 'voiceoverScript') {
    const fieldLabel = field === 'productInfo' ? '产品信息' : '口播文案'
    message.info(`${fieldLabel}的 AI 自动生成功能待接入，后续会结合已上传素材自动识别生成。`)
  }

  const saveMutation = useMutation({
    mutationFn: async (values: VideoRemixTaskFormValues) => {
      form.setFieldsValue(values)
      return saveCurrentFormValues()
    },
    onSuccess: () => {
      setActionSuccess('任务信息已保存')
    },
    onError: (error: Error) => {
      setActionSuccess('')
      setActionError(error.message)
    },
  })

  const actionMutation = useMutation({
    mutationFn: async (action: TaskAction) => {
      setPendingAction(action)

      if (!taskId) {
        throw new Error('任务 ID 不存在')
      }

      if (action === 'generate-prompt') {
        await saveCurrentFormValues(materialsStepRequiredFields)
        return generateVideoRemixTaskPrompt(taskId)
      }

      if (action === 'generate-video') {
        return generateVideoRemixTaskVideo(taskId)
      }

      return refreshVideoRemixTask(taskId)
    },
    onSuccess: (task, action) => {
      setPendingAction(null)

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
            ? '已提交生成视频任务'
            : '任务状态已更新',
      )
    },
    onError: (error: Error) => {
      setPendingAction(null)
      setActionSuccess('')
      setActionError(error.message)
    },
  })

  async function handleUploadFiles(
    files: File[],
    field: keyof VideoRemixTaskFormValues,
    mode: 'replace' | 'append',
    uploader: typeof uploadVideo,
  ) {
    if (!files.length) {
      return
    }

    try {
      setActionError('')
      setUploadingField(field)
      const uploadResults = await Promise.all(files.map((file) => uploader(file)))
      const currentValue = String(form.getFieldValue(field) ?? '').trim()
      const nextUrls = uploadResults.map((item) => item.url).join('\n')
      const nextValue = mode === 'append' && currentValue ? `${currentValue}\n${nextUrls}` : nextUrls
      form.setFieldValue(field, nextValue)
      setActionSuccess(`已上传 ${uploadResults.map((item) => item.originalFilename).join('、')}`)
    } catch (error) {
      setActionSuccess('')
      setActionError((error as Error).message)
    } finally {
      setUploadingField((currentField) => (currentField === field ? null : currentField))
    }
  }

  const task = detailQuery.data
  const statusMeta = useMemo(() => getVideoRemixTaskStatusMeta(task ?? {}), [task])
  const referenceVideoUrl = Form.useWatch('referenceVideoUrl', form)
  const editablePrompt = Form.useWatch('editablePrompt', form)
  const audioUrl = Form.useWatch('audioUrl', form)
  const productImageUrlsText = Form.useWatch('productImageUrlsText', form)
  const characterImageUrlsText = Form.useWatch('characterImageUrlsText', form)
  const productImageUrls = useMemo(() => splitAssetUrls(productImageUrlsText), [productImageUrlsText])
  const characterImageUrls = useMemo(
    () => splitAssetUrls(characterImageUrlsText),
    [characterImageUrlsText],
  )

  if (!taskId) {
    return <PageMissingAlert text="缺少任务 ID" />
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
        <PageErrorAlert
          title="任务详情加载失败"
          description={detailQuery.isError ? (detailQuery.error as Error).message : '任务不存在'}
        />
      </PageShell>
    )
  }

  const currentIndex = stepItems.findIndex((item) => item.key === currentStep)

  return (
    <PageShell
      title={task.name || '追爆任务详情'}
      description="新建任务后，可在这里继续补齐任务信息、素材与生成指令。"
      actions={
        <div className="flex gap-2">
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate('/viral-remix/tasks')}>
            返回列表
          </Button>
          <Button
            icon={<RefreshCw size={14} />}
            loading={pendingAction === 'refresh'}
            onClick={() => actionMutation.mutate('refresh')}
          >
            刷新详情
          </Button>
        </div>
      }
    >
      <Form<VideoRemixTaskFormValues>
        form={form}
        className="flex h-full min-h-0 flex-col"
        layout="vertical"
        onFinish={(values) => saveMutation.mutate(values)}
      >
        <div
          data-testid="video-remix-detail-panel"
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 lg:min-h-[720px]"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-[18px] font-semibold text-[var(--text-primary)]">编辑视频追爆任务</div>
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

          <StepNavigation currentStep={currentStep} onChange={(step) => void handleStepChange(step)} />

          <div data-testid="video-remix-step-scroll-body" className="min-h-0 flex-1 overflow-y-auto pr-1">
          {currentStep === 'materials' ? (
            <div data-testid="video-remix-step-materials" className="space-y-6 pb-28">
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
                  <Form.Item name="generationDuration" label="总时长(秒)">
                    <InputNumber min={5} max={120} className="w-full" />
                  </Form.Item>
                </div>

                <Form.Item name="remark" label="备注">
                  <Input.TextArea rows={2} maxLength={512} placeholder="可选，记录任务备注" />
                </Form.Item>
              </section>

              <section data-testid="video-remix-assets-section" className="space-y-5">
                <SectionTitle title="素材" />

                <Form.Item name="referenceVideoUrl" hidden rules={[{ required: true, message: '请先上传参考视频' }]}>
                  <Input />
                </Form.Item>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--text-primary)]">参考视频</div>
                      <StepContentHint text="先上传一条参考视频，后续提示词和视频生成都会基于它继续处理。" />
                    </div>
                    <UploadTrigger
                      testId="video-remix-reference-video-upload-input"
                      accept="video/mp4,video/quicktime,video/webm"
                      onUpload={(files) => handleUploadFiles(files, 'referenceVideoUrl', 'replace', uploadVideo)}
                    >
                      <Button loading={uploadingField === 'referenceVideoUrl'} icon={<Video size={14} />}>上传视频</Button>
                    </UploadTrigger>
                  </div>

                  {referenceVideoUrl ? (
                    <div
                      data-testid="video-remix-reference-video-preview-shell"
                      className="max-w-[320px] rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="text-[12px] text-[var(--text-muted)]">参考视频预览</div>
                        <Tag color="processing">已上传</Tag>
                      </div>
                      <div
                        data-testid="video-remix-reference-video-preview-wrapper"
                        className="aspect-video overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-black/80"
                      >
                        <video
                          data-testid="video-remix-reference-video-preview"
                          className="h-full w-full object-contain"
                          controls
                          src={referenceVideoUrl}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] px-4 py-6">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无参考视频，请先上传素材。" />
                    </div>
                  )}
                </div>

                <Form.Item name="productImageUrlsText" hidden>
                  <Input.TextArea />
                </Form.Item>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--text-primary)]">商品图</div>
                      <StepContentHint text="至少上传 1 张商品图，素材会用于后续内容生成和视频合成。" />
                    </div>
                    <UploadTrigger
                      testId="video-remix-product-image-upload-input"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onUpload={(files) => handleUploadFiles(files, 'productImageUrlsText', 'append', uploadImage)}
                    >
                      <Button loading={uploadingField === 'productImageUrlsText'} icon={<FileImage size={14} />}>上传商品图</Button>
                    </UploadTrigger>
                  </div>

                  <AssetPreviewGrid
                    title="商品图素材面板"
                    emptyDescription="暂无商品图，请先上传素材。"
                    tagLabel="商品图"
                    removeLabel="删除商品图"
                    previewTestId="video-remix-product-image-preview"
                    urls={productImageUrls}
                    onRemove={(url) =>
                      form.setFieldValue('productImageUrlsText', removeAssetUrl(productImageUrlsText, url))
                    }
                  />
                </div>

                <Form.Item name="characterImageUrlsText" hidden>
                  <Input.TextArea />
                </Form.Item>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--text-primary)]">人物图</div>
                      <StepContentHint text="可选上传人物图，不上传时默认继续沿用参考视频中的人物形象。" />
                    </div>
                    <UploadTrigger
                      testId="video-remix-character-image-upload-input"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onUpload={(files) =>
                        handleUploadFiles(files, 'characterImageUrlsText', 'append', uploadImage)
                      }
                    >
                      <Button loading={uploadingField === 'characterImageUrlsText'} icon={<UploadCloud size={14} />}>上传人物图</Button>
                    </UploadTrigger>
                  </div>

                  <AssetPreviewGrid
                    title="人物图素材面板"
                    emptyDescription="暂无人物图，系统将默认使用原视频人物。"
                    tagLabel="人物图"
                    removeLabel="删除人物图"
                    previewTestId="video-remix-character-image-preview"
                    urls={characterImageUrls}
                    onRemove={(url) =>
                      form.setFieldValue('characterImageUrlsText', removeAssetUrl(characterImageUrlsText, url))
                    }
                  />
                </div>

                <Form.Item name="audioUrl" hidden>
                  <Input />
                </Form.Item>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--text-primary)]">参考音频</div>
                      <StepContentHint text="可选上传音频素材，用于辅助后续口播内容和节奏控制。" />
                    </div>
                    <UploadTrigger
                      testId="video-remix-audio-upload-input"
                      accept="audio/*"
                      onUpload={(files) => handleUploadFiles(files, 'audioUrl', 'replace', uploadAudio)}
                    >
                      <Button loading={uploadingField === 'audioUrl'} icon={<AudioLines size={14} />}>上传音频</Button>
                    </UploadTrigger>
                  </div>

                  {audioUrl ? (
                    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="text-[12px] text-[var(--text-muted)]">参考音频预览</div>
                        <div className="flex items-center gap-2">
                          <Tag color="processing">已上传</Tag>
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => form.setFieldValue('audioUrl', '')}
                          >
                            删除音频
                          </Button>
                        </div>
                      </div>
                      <audio
                        data-testid="video-remix-reference-audio-preview"
                        className="w-full"
                        controls
                        src={audioUrl}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] px-4 py-6">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无参考音频，可按需上传。" />
                    </div>
                  )}
                </div>
              </section>

              <section data-testid="video-remix-direction-section">
                <SectionTitle title="内容方向" />
                <Space orientation="vertical" size={16} className="flex">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-[14px] font-medium text-[var(--text-primary)]">产品信息</div>
                      <Button
                        className="shrink-0"
                        type="dashed"
                        icon={<Sparkles size={14} />}
                        onClick={() => handleAiGenerate('productInfo')}
                      >
                        AI 自动生成
                      </Button>
                    </div>
                    <Form.Item
                      label="产品信息"
                      name="productInfo"
                      rules={[{ required: true, message: '请填写产品信息' }]}
                    >
                      <Input.TextArea rows={4} placeholder="填写产品卖点、受众、场景、利益点等信息" />
                    </Form.Item>
                  </div>

                  <div
                    data-testid="video-remix-direction-horizontal-fields"
                    className="grid gap-4 xl:grid-cols-2"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="text-[14px] font-medium text-[var(--text-primary)]">口播文案</div>
                        <Button
                          className="shrink-0"
                          type="dashed"
                          icon={<Sparkles size={14} />}
                          onClick={() => handleAiGenerate('voiceoverScript')}
                        >
                          AI 自动生成
                        </Button>
                      </div>
                      <Form.Item
                        label="口播文案"
                        name="voiceoverScript"
                        rules={[{ required: true, message: '请填写口播文案' }]}
                      >
                        <Input.TextArea rows={4} placeholder="若已有脚本，可在这里直接填写" />
                      </Form.Item>
                    </div>

                    <div>
                      <div className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">复刻方向</div>
                      <Form.Item
                        label="复刻方向"
                        name="direction"
                        rules={[{ required: true, message: '请填写复刻方向' }]}
                      >
                        <Input.TextArea rows={4} placeholder="保留哪些结构、替换什么内容、输出什么改编风格" />
                      </Form.Item>
                      <StepContentHint text="你想要生成的视频达到怎样的效果，比如：不换背景，更换产品和人物肖像。" />
                    </div>
                  </div>
                </Space>
              </section>
            </div>
          ) : null}

          {currentStep === 'prompt' ? (
            <div data-testid="video-remix-step-prompt" className="space-y-6">
              <SectionTitle title="提示词" />
              <Alert
                className="mb-4"
                type="info"
                showIcon
                title="当前版本先支持本地编辑预览"
                description="由于后端暂未提供独立的可编辑 Prompt 保存接口，当前修改主要用于前端预览和后续能力预留。"
              />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <Form.Item
                    name="editablePrompt"
                    label="生成的 Prompt"
                    rules={[
                      {
                        validator: async (_, value) => {
                          if (String(value ?? '').trim()) {
                            return
                          }

                          throw new Error('请先生成或填写 Prompt')
                        },
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={12}
                      placeholder={task.generatedPrompt ? undefined : '当前还没有生成 Prompt'}
                    />
                  </Form.Item>

                <Card size="small" className="border border-[var(--line-subtle)] bg-[var(--muted-bg)]">
                  <div className="space-y-2 text-[12px] text-[var(--text-secondary)]">
                    <div className="font-semibold text-[var(--text-primary)]">Prompt 状态</div>
                    <div>状态：{statusMeta.label}</div>
                    <div>进度：{task.progress ?? 0}%</div>
                    <div>Prompt 服务：{task.promptProvider || '-'}</div>
                    <div>
                      校验结果：
                      {typeof task.promptCheckPass === 'boolean'
                        ? task.promptCheckPass
                          ? '通过'
                          : '未通过'
                        : '-'}
                    </div>
                  </div>
                </Card>
              </div>

              {pendingAction === 'generate-prompt' || statusMeta.resultState === 'processing' ? (
                <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4">
                  <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">提示词生成进度</div>
                  <Progress percent={task.progress ?? 0} status="active" />
                </div>
              ) : null}

              {!editablePrompt ? (
                <Alert
                  type="warning"
                  showIcon
                  title="当前还没有生成 Prompt"
                  description="请先生成提示词，再决定是否需要调整。"
                />
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  loading={pendingAction === 'generate-prompt'}
                  onClick={() => actionMutation.mutate('generate-prompt')}
                >
                  生成 Prompt
                </Button>
              </div>
            </div>
          ) : null}

          {currentStep === 'video' ? (
            <div data-testid="video-remix-step-video" className="space-y-6">
              <SectionTitle title="视频生成" />

              <div className="grid gap-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                  <div className="mb-2 text-[13px] font-medium text-[var(--text-primary)]">任务进度</div>
                  <Progress
                    percent={task.progress ?? 0}
                    status={pendingAction === 'generate-video' ? 'active' : 'normal'}
                  />
                </div>
                <div className="space-y-2 text-[12px] text-[var(--text-secondary)]">
                  <div>状态：{statusMeta.label}</div>
                  <div>外部任务号：{task.externalTaskId || '-'}</div>
                  <div>失败原因：{task.errReason || '-'}</div>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <VideoPreviewCard
                  title="参考视频"
                  testId="video-remix-reference-video-compare"
                  videoUrl={referenceVideoUrl}
                  emptyText="暂无参考视频"
                />
                <VideoPreviewCard
                  title="生成结果"
                  testId="video-remix-generated-video-preview-wrapper"
                  videoUrl={task.videoUrl}
                  emptyText="暂未生成视频"
                />
              </div>

              {task.videoUrl ? (
                <video data-testid="video-remix-generated-video-preview" className="hidden" src={task.videoUrl} />
              ) : null}

              <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4 text-[12px] text-[var(--text-secondary)]">
                <div>视频地址：{task.videoUrl || '-'}</div>
                <div>封面地址：{task.coverUrl || '-'}</div>
                <div>时长：{task.duration ? `${task.duration} 秒` : '-'}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  loading={pendingAction === 'generate-prompt'}
                  onClick={() => actionMutation.mutate('generate-prompt')}
                >
                  生成 Prompt
                </Button>
                <Button
                  disabled={!task.generatedPrompt}
                  loading={pendingAction === 'generate-video'}
                  onClick={() => actionMutation.mutate('generate-video')}
                >
                  生成视频
                </Button>
              </div>
            </div>
          ) : null}
          </div>

          <div className="pt-2">
            <StepActions
              currentStep={currentStep}
              saving={stepSubmitting || saveMutation.isPending}
              onPrev={() => void handleStepChange(stepItems[currentIndex - 1]?.key ?? currentStep)}
              onNext={() => void handleStepChange(stepItems[currentIndex + 1]?.key ?? currentStep)}
            />
          </div>
        </div>
      </Form>
    </PageShell>
  )
}
