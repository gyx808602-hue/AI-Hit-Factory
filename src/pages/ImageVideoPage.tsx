import { useMutation } from '@tanstack/react-query'
import { Button, Card, Empty, Image, Input, Tag } from 'antd'
import {
  Image as ImageIcon,
  LayoutGrid,
  Play,
  Type,
  Upload,
  Wand2,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../api/aigc/uploads'
import {
  createTextImageVideoTask,
  generateTextImageVideoPrompt,
} from '../api/customer/text-image-video'
import type { TextImageVideoPromptInputMode } from '../api/customer/text-image-video/types'
import {
  createDefaultTextImageVideoFormValues,
  mapTextImageVideoFormValuesToCreatePayload,
} from '../features/text-image-video/form'
import { PageShell } from '../shared/components/PageShell'

type InputMode = TextImageVideoPromptInputMode

type UploadedImage = {
  name: string
  url: string
}

type FormErrors = {
  topic?: string
  prompt?: string
  imageUrls?: string
  promptGeneration?: string
}

const INPUT_MODE_OPTIONS = [
  {
    value: 'text',
    label: '文字输入',
    icon: <Type size={14} />,
  },
  {
    value: 'image',
    label: '图片上传',
    icon: <ImageIcon size={14} />,
  },
  {
    value: 'mixed',
    label: '图文混合',
    icon: <LayoutGrid size={14} />,
  },
] as const

function UploadButtonTrigger({
  uploading,
  onUpload,
}: {
  uploading: boolean
  onUpload: (files: File[]) => Promise<void>
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="shrink-0">
      <input
        ref={inputRef}
        data-testid="image-video-upload-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          if (files.length > 0) {
            void onUpload(files)
          }
          event.currentTarget.value = ''
        }}
      />
      <Button
        type="default"
        loading={uploading}
        icon={<Upload size={14} />}
        onClick={() => inputRef.current?.click()}
      >
        上传图片
      </Button>
    </div>
  )
}

function EmptyAssetPanel() {
  return (
    <div
      data-testid="image-video-empty-panel"
      className="rounded-2xl border border-dashed border-[var(--line-subtle)] bg-[rgba(255,255,255,0.02)] px-6 py-10"
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无商品图，请先上传素材。"
      />
    </div>
  )
}

function AssetPreviewGrid({
  items,
  onRemove,
}: {
  items: UploadedImage[]
  onRemove: (url: string) => void
}) {
  if (items.length === 0) {
    return <EmptyAssetPanel />
  }

  return (
    <div className="space-y-3">
      {/* <div className="text-[12px] text-[var(--text-muted)]">商品图素材面板</div> */}
      <div
        data-testid="image-video-uploaded-grid"
        className="grid grid-cols-[repeat(auto-fill,minmax(170px,200px))] gap-4"
      >
        {items.map((item, index) => (
          <Card
            key={`${item.url}-${index}`}
            size="small"
            className="overflow-hidden rounded-2xl border border-[#2F3E8A] bg-[rgba(15,23,42,0.28)]"
            styles={{ body: { padding: 0 } }}
            data-testid="image-video-uploaded-item"
          >
            <div className="flex items-center justify-between gap-2 px-3 pt-3">
              <Tag color="blue" className="m-0">
                图片 {index + 1}
              </Tag>
              <Button
                type="text"
                danger
                size="small"
                aria-label={`删除商品图-${item.name}`}
                onClick={() => onRemove(item.url)}
              >
                删除图片
              </Button>
            </div>
            <div className="p-3 pt-2">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--muted-bg)]">
                <Image
                  src={item.url}
                  alt={`图片${index + 1}`}
                  preview
                  className="h-full w-full object-cover"
                  fallback={item.url}
                />
                <img
                  data-testid="image-video-uploaded-preview"
                  className="hidden"
                  src={item.url}
                  alt={`图片预览${index + 1}`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ImageVideoPage() {
  const navigate = useNavigate()
  const [inputMode, setInputMode] = useState<InputMode>('mixed')
  const [formValues, setFormValues] = useState(() =>
    createDefaultTextImageVideoFormValues(),
  )
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const createTaskMutation = useMutation({
    mutationFn: () =>
      createTextImageVideoTask(
        mapTextImageVideoFormValuesToCreatePayload(formValues),
      ),
    onSuccess: (task) => {
      navigate(`/image-video/tasks/${task.id}`)
    },
  })

  const generatePromptMutation = useMutation({
    mutationFn: () =>
      generateTextImageVideoPrompt({
        topic: formValues.topic.trim(),
        imageUrls: formValues.imageUrls,
        inputMode,
      }),
    onSuccess: ({ prompt }) => {
      setFormValues((current) => ({
        ...current,
        prompt,
      }))
      setErrors((current) => ({
        ...current,
        prompt: undefined,
        promptGeneration: undefined,
      }))
    },
    onError: (error: Error) => {
      setErrors((current) => ({
        ...current,
        promptGeneration: error.message,
      }))
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (files: File[]) =>
      Promise.all(files.map((file) => uploadImage(file))),
    onSuccess: (results) => {
      setUploadedImages((current) => [
        ...current,
        ...results.map((item) => ({
          name: item.originalFilename,
          url: item.url,
        })),
      ])
      setFormValues((current) => ({
        ...current,
        imageUrls: [...current.imageUrls, ...results.map((item) => item.url)],
      }))
      setErrors((current) => ({
        ...current,
        imageUrls: undefined,
        promptGeneration: undefined,
      }))
    },
  })

  const promptLength = useMemo(
    () => formValues.prompt.trim().length,
    [formValues.prompt],
  )
  const previewTitle = formValues.topic.trim() || '图文视频预览'
  const requiresImages = inputMode !== 'text'

  async function handleImageUpload(files: File[]) {
    if (!files.length) {
      return
    }

    await uploadImageMutation.mutateAsync(files)
  }

  function handleRemoveImage(url: string) {
    setUploadedImages((current) => current.filter((item) => item.url !== url))
    setFormValues((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((item) => item !== url),
    }))
  }

  function validatePromptGeneration() {
    const nextErrors: FormErrors = {}

    if (!formValues.topic.trim()) {
      nextErrors.topic = '请输入视频主题'
    }

    if (requiresImages && formValues.imageUrls.length === 0) {
      nextErrors.imageUrls = '请先上传至少一张参考图'
    }

    setErrors((current) => ({
      ...current,
      ...nextErrors,
      promptGeneration: undefined,
    }))

    return Object.keys(nextErrors).length === 0
  }

  function validateCreateTask() {
    const nextErrors: FormErrors = {}

    if (!formValues.topic.trim()) {
      nextErrors.topic = '请输入视频主题'
    }

    if (!formValues.prompt.trim()) {
      nextErrors.prompt = '请输入视频提示词'
    }

    if (requiresImages && formValues.imageUrls.length === 0) {
      nextErrors.imageUrls = '请先上传至少一张参考图'
    }

    setErrors((current) => ({
      ...current,
      ...nextErrors,
    }))

    return Object.keys(nextErrors).length === 0
  }

  function handleGeneratePrompt() {
    if (!validatePromptGeneration()) {
      return
    }

    generatePromptMutation.mutate()
  }

  function handleGenerateVideo() {
    if (!validateCreateTask()) {
      return
    }

    createTaskMutation.mutate()
  }

  return (
    <PageShell
      title="图文生成视频"
      description="文字、图片、图文混合一键转视频，适合详情页、种草文案、海报内容快速成片。"
      actions={
        <Button onClick={() => navigate('/image-video/tasks')}>
          查看任务列表
        </Button>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="grid min-h-0 flex-1 items-start gap-6 overflow-y-auto pr-1 xl:grid-cols-[minmax(0,1fr)_336px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                    输入方式
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INPUT_MODE_OPTIONS.map((option) => {
                      const active = inputMode === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className="rounded-xl border px-4 py-2 text-[13px] transition"
                          style={{
                            borderColor: active
                              ? 'rgba(34,211,238,0.45)'
                              : 'var(--line-subtle)',
                            background: active
                              ? 'rgba(34,211,238,0.16)'
                              : 'var(--muted-bg)',
                            color: active ? '#22D3EE' : 'var(--text-secondary)',
                          }}
                          onClick={() => setInputMode(option.value)}
                        >
                          <span className="inline-flex items-center gap-2">
                            {option.icon}
                            {option.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="image-video-topic"
                    className="mb-2 block text-[13px] text-[var(--text-secondary)]"
                  >
                    视频主题 <span className="text-[#EF4444]">*</span>
                  </label>
                  <Input
                    id="image-video-topic"
                    value={formValues.topic}
                    placeholder="请输入视频主题"
                    onChange={(event) => {
                      const topic = event.target.value
                      setFormValues((current) => ({ ...current, topic }))
                      if (topic.trim()) {
                        setErrors((current) => ({
                          ...current,
                          topic: undefined,
                        }))
                      }
                    }}
                    size="large"
                  />
                  {errors.topic ? (
                    <p className="mt-2 text-[12px] text-[#EF4444]">
                      {errors.topic}
                    </p>
                  ) : null}
                </div>

                {requiresImages ? (
                  <div
                    data-testid="image-video-upload-section"
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-medium text-[var(--text-primary)]">
                          上传图片 <span className="text-[#EF4444]">*</span>
                        </div>
                        <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                          推荐1-10张，支持JPG、PNG、WebP
                        </div>
                      </div>
                      <UploadButtonTrigger
                        uploading={uploadImageMutation.isPending}
                        onUpload={handleImageUpload}
                      />
                    </div>

                    <AssetPreviewGrid
                      items={uploadedImages}
                      onRemove={handleRemoveImage}
                    />

                    {errors.imageUrls ? (
                      <p className="mt-2 text-[12px] text-[#EF4444]">
                        {errors.imageUrls}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div data-testid="image-video-prompt-section">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <label
                      htmlFor="image-video-prompt"
                      className="block text-[13px] text-[var(--text-secondary)]"
                    >
                      输入文案 <span className="text-[#EF4444]">*</span>
                    </label>
                    {/* <Button
                      type="dashed"
                      loading={generatePromptMutation.isPending}
                      onClick={handleGeneratePrompt}
                    >
                      AI 生成文案
                    </Button> */}
                  </div>
                  <Input.TextArea
                    id="image-video-prompt"
                    rows={6}
                    placeholder="请输入视频提示词，例如：生成一条茶饮种草短视频"
                    value={formValues.prompt}
                    onChange={(event) => {
                      const prompt = event.target.value
                      setFormValues((current) => ({ ...current, prompt }))
                      if (prompt.trim()) {
                        setErrors((current) => ({
                          ...current,
                          prompt: undefined,
                        }))
                      }
                    }}
                  />
                  <div className="mt-1 text-right text-[11px] text-[var(--text-muted)]">
                    {promptLength} / 500 字
                  </div>
                  {errors.prompt ? (
                    <p className="mt-2 text-[12px] text-[#EF4444]">
                      {errors.prompt}
                    </p>
                  ) : null}
                  {errors.promptGeneration ? (
                    <p className="mt-2 text-[12px] text-[#EF4444]">
                      {errors.promptGeneration}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<Wand2 size={16} />}
                  loading={createTaskMutation.isPending}
                  onClick={handleGenerateVideo}
                  className="!h-[48px] !rounded-xl !border-0 !text-[14px] !font-semibold"
                  style={{
                    background:
                      'linear-gradient(135deg, #22D3EE 0%, #38BDF8 100%)',
                    color: '#0C0D14',
                  }}
                >
                  开始生成视频
                </Button>
              </div>
            </div>
          </section>

          <aside className="self-start">
            <div
              data-testid="image-video-preview-card"
              className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
            >
              <h2 className="mb-4 text-[16px] font-semibold text-[var(--text-primary)]">
                视频预览
              </h2>
              <div className="flex aspect-[9/16] min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] border border-[var(--line-subtle)] bg-[linear-gradient(180deg,#151726_0%,#11121A_100%)]">
                {createTaskMutation.isSuccess ? (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#22D3EE]/15">
                      <Play size={20} className="text-[#22D3EE]" />
                    </div>
                    <p className="m-0 text-[13px] text-[var(--text-primary)]">
                      {previewTitle}
                    </p>
                    <p className="mt-2 text-[11px] text-[#4ADE80]">
                      任务创建成功，正在进入详情页
                    </p>
                  </div>
                ) : createTaskMutation.isPending ? (
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#22D3EE]/20 border-t-[#22D3EE]" />
                    <p className="m-0 text-[12px] text-[var(--text-muted)]">
                      AI 正在创建任务...
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#22D3EE]/15">
                      <Play size={20} className="text-[#22D3EE]" />
                    </div>
                    <p className="m-0 text-[13px] text-[var(--text-primary)]">
                      视频将在此预览
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      创建后将跳转到任务详情页查看状态与结果
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
