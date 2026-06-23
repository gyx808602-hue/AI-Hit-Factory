import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Input, Segmented, Switch } from 'antd'
import {
  CheckCircle2,
  Image as ImageIcon,
  LayoutGrid,
  Play,
  Plus,
  Trash2,
  Type,
  Wand2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage } from '../api/aigc/uploads'
import { createTextImageVideoTask } from '../api/customer/text-image-video'
import {
  createDefaultTextImageVideoFormValues,
  mapTextImageVideoFormValuesToCreatePayload,
} from '../features/text-image-video/form'
import { PageShell } from '../shared/components/PageShell'

type InputMode = 'text' | 'image' | 'mixed'
type OutputMode = 'slideshow' | 'remix' | 'digital-human'
type VideoOptionKey = 'voiceover' | 'subtitle' | 'bgm'

type UploadedImage = {
  name: string
  url: string
}

const VIDEO_STYLES = ['种草', '测评', '温情', '促销', '专业'] as const
const VIDEO_TYPES = [
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

const OUTPUT_MODE_OPTIONS: Array<{
  value: OutputMode
  title: string
  description: string
  accent: string
}> = [
  {
    value: 'slideshow',
    title: '图文轮播视频',
    description:
      '图片轮播 + 动态字幕 + 配音 + BGM，适合多图商品展示、海报内容快速成片。',
    accent: '#7C5CFC',
  },
  {
    value: 'remix',
    title: '混剪短视频',
    description:
      '自动剪辑、分镜字幕、配音 + BGM，适合商品图搭配视频素材做节奏混剪。',
    accent: '#F97316',
  },
  {
    value: 'digital-human',
    title: '数字人口播视频',
    description:
      '数字人讲解 + 图文辅助 + 字幕，适合品牌介绍、知识讲解和专业说明。',
    accent: '#22D3EE',
  },
]

const OPTION_LABELS: Array<{ key: VideoOptionKey; label: string }> = [
  { key: 'voiceover', label: '自动配音' },
  { key: 'subtitle', label: '自动字幕' },
  { key: 'bgm', label: '添加 BGM' },
]

export function ImageVideoPage() {
  const navigate = useNavigate()
  const [inputMode, setInputMode] = useState<InputMode>('mixed')
  const [outputMode, setOutputMode] = useState<OutputMode>('slideshow')
  const [topic, setTopic] = useState('办公室养生茶推荐，上班族必备')
  const [selectedStyle, setSelectedStyle] = useState<string>('种草')
  const [formValues, setFormValues] = useState(() =>
    createDefaultTextImageVideoFormValues(),
  )
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [videoOptions, setVideoOptions] = useState<
    Record<VideoOptionKey, boolean>
  >({
    voiceover: true,
    subtitle: true,
    bgm: false,
  })
  const [errors, setErrors] = useState<{ prompt?: string; imageUrls?: string }>(
    {},
  )

  const createTaskMutation = useMutation({
    mutationFn: () =>
      createTextImageVideoTask(
        mapTextImageVideoFormValuesToCreatePayload(formValues),
      ),
    onSuccess: (task) => {
      navigate(`/image-video/tasks/${task.id}`)
    },
  })

  const promptLength = useMemo(
    () => formValues.prompt.trim().length,
    [formValues.prompt],
  )
  const previewTitle = topic.trim() || '图文视频预览'

  async function handleImageUpload(files: FileList | null) {
    if (!files?.length) {
      return
    }

    setUploadingImages(true)
    try {
      const results = await Promise.all(
        Array.from(files).map((file) => uploadImage(file)),
      )
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
      setErrors((current) => ({ ...current, imageUrls: undefined }))
    } finally {
      setUploadingImages(false)
    }
  }

  function handleRemoveImage(url: string) {
    // 删除图片时要同时同步展示列表和表单真实值，
    // 否则界面看起来删掉了，但提交给后端的 imageUrls 仍会残留。
    setUploadedImages((current) => current.filter((item) => item.url !== url))
    setFormValues((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((item) => item !== url),
    }))
  }

  function validateForm() {
    const nextErrors: { prompt?: string; imageUrls?: string } = {}

    if (
      !formValues.prompt.trim() &&
      (inputMode === 'text' || inputMode === 'mixed')
    ) {
      nextErrors.prompt = '请输入视频提示词'
    }

    if (formValues.imageUrls.length === 0 && inputMode !== 'text') {
      nextErrors.imageUrls = '请先上传至少一张参考图'
    }

    setErrors(nextErrors)
    console.log('nextErrors', nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleGenerate() {
    if (!validateForm()) {
      return
    }

    createTaskMutation.mutate()
  }

  function toggleVideoOption(key: VideoOptionKey, checked: boolean) {
    setVideoOptions((current) => ({ ...current, [key]: checked }))
  }

  return (
    <PageShell
      title="图文生成视频"
      description="文字、图片、图文混合一键转视频，适合详情页、种草文案、海报内容快速成片。"
      actions={
        <Button onClick={() => navigate('/image-video/tasks')}>
          {/* 中文显式入口，补齐任务页导航闭环 */}
          查看任务列表
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_336px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                  输入方式
                </label>
                {/* <Segmented
                  block
                  value={inputMode}
                  options={[
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
                  ]}
                  onChange={(value) => setInputMode(value as InputMode)}
                /> */}
              </div>
              <div className="flex flex-wrap gap-2">
                {VIDEO_TYPES.map((style) => {
                  const active = inputMode === style.value

                  return (
                    <button
                      key={style.value}
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
                      onClick={() => setInputMode(style.value)}
                    >
                      {style.label}
                    </button>
                  )
                })}
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
                  value={topic}
                  placeholder="请输入视频主题"
                  onChange={(event) => setTopic(event.target.value)}
                  size="large"
                />
              </div>

              {(inputMode === 'text' || inputMode === 'mixed') && (
                <div>
                  <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                    输入文案
                  </label>
                  <Input.TextArea
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
                </div>
              )}

              {(inputMode === 'image' || inputMode === 'mixed') && (
                <div>
                  <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                    上传图片
                  </label>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                    {uploadedImages.map((item, index) => (
                      <div
                        key={item.url}
                        className="relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-2 text-center"
                        style={{
                          background:
                            index % 2 === 0
                              ? 'linear-gradient(180deg, rgba(34,211,238,0.12), rgba(26,27,40,1))'
                              : 'linear-gradient(180deg, rgba(124,92,252,0.12), rgba(26,27,40,1))',
                        }}
                      >
                        <ImageIcon
                          size={16}
                          className="text-[var(--text-muted)]"
                        />
                        <span className="line-clamp-2 text-[11px] text-[var(--text-secondary)]">
                          {item.name}
                        </span>
                        <button
                          type="button"
                          aria-label={`删除图片-${item.name}`}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70"
                          onClick={() => handleRemoveImage(item.url)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] text-[var(--text-muted)] transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
                      <Plus size={18} />
                      <input
                        data-testid="image-video-upload-input"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          void handleImageUpload(event.target.files)
                        }}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                    {uploadingImages
                      ? '图片上传中...'
                      : uploadedImages.length > 0
                        ? `已上传 ${uploadedImages.length} 张，推荐 3-8 张，支持 JPG、PNG、WebP`
                        : '推荐 1-10 张，支持 JPG、PNG、WebP'}
                  </p>
                  {errors.imageUrls ? (
                    <p className="mt-2 text-[12px] text-[#EF4444]">
                      {errors.imageUrls}
                    </p>
                  ) : null}
                </div>
              )}

              {/* <div>
                <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                  视频风格 <span className="text-[#EF4444]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_STYLES.map((style) => {
                    const active = selectedStyle === style

                    return (
                      <button
                        key={style}
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
                        onClick={() => setSelectedStyle(style)}
                      >
                        {style}
                      </button>
                    )
                  })}
                </div>
              </div> */}

              {/* <div>
                <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">
                  输出方式 <span className="text-[#EF4444]">*</span>
                </label>
                <div className="space-y-3">
                  {OUTPUT_MODE_OPTIONS.map((option) => {
                    const active = outputMode === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition"
                        style={{
                          borderColor: active
                            ? `${option.accent}55`
                            : 'var(--line-subtle)',
                          background: active
                            ? `${option.accent}12`
                            : 'var(--card-bg)',
                        }}
                        onClick={() => setOutputMode(option.value)}
                      >
                        <span
                          className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: active
                              ? option.accent
                              : 'var(--muted-bg)',
                            border: active
                              ? 'none'
                              : '1px solid var(--line-subtle)',
                          }}
                        >
                          {active ? (
                            <CheckCircle2 size={11} color="#fff" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium text-[var(--text-primary)]">
                            {option.title}
                          </span>
                          <span className="mt-1 block text-[12px] leading-5 text-[var(--text-muted)]">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div> 
              </div>*/}

              {/* <div className="grid gap-3 md:grid-cols-3">
                {OPTION_LABELS.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between rounded-2xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] px-4 py-3"
                  >
                    <span className="text-[12px] text-[var(--text-secondary)]">
                      {option.label}
                    </span>
                    <Switch
                      size="small"
                      checked={videoOptions[option.key]}
                      onChange={(checked) =>
                        toggleVideoOption(option.key, checked)
                      }
                    />
                  </div>
                ))}
              </div> */}

              {createTaskMutation.error ? (
                <Alert
                  message="任务创建失败，请稍后重试"
                  type="error"
                  showIcon
                />
              ) : null}

              <Button
                type="primary"
                size="large"
                block
                icon={<Wand2 size={16} />}
                loading={createTaskMutation.isPending}
                onClick={handleGenerate}
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

        <aside className="space-y-4">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            视频预览
          </h2>
          <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <div className="flex aspect-[9/16] min-h-[420px] items-center justify-center overflow-hidden rounded-[20px] border border-[var(--line-subtle)] bg-[linear-gradient(180deg,#151726_0%,#11121A_100%)]">
              {createTaskMutation.isSuccess ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#22D3EE]/15">
                    <Play size={20} className="text-[#22D3EE]" />
                  </div>
                  <p className="m-0 text-[13px] text-[var(--text-primary)]">
                    {previewTitle}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    {
                      OUTPUT_MODE_OPTIONS.find(
                        (item) => item.value === outputMode,
                      )?.title
                    }
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

            {/* <div className="mt-4 rounded-2xl border border-[var(--line-subtle)] bg-[var(--muted-bg)] p-4">
              <div className="text-[12px] text-[var(--text-secondary)]">
                当前配置
              </div>
              <div className="mt-3 space-y-2 text-[12px] text-[var(--text-muted)]">
                <div className="flex items-center justify-between gap-3">
                  <span>视频主题</span>
                  <span className="max-w-[180px] truncate text-[var(--text-secondary)]">
                    {previewTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>视频风格</span>
                  <span className="text-[var(--text-secondary)]">
                    {selectedStyle}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>输出方式</span>
                  <span className="text-[var(--text-secondary)]">
                    {
                      OUTPUT_MODE_OPTIONS.find(
                        (item) => item.value === outputMode,
                      )?.title
                    }
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
