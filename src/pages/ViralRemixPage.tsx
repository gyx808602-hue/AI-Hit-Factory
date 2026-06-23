import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Input, Radio, Upload } from "antd";
import { CheckCircle2, Play, ShoppingBag, UploadCloud, User2, Wand2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVideoRemixTask } from "../api/aigc/video-remix-tasks";
import type { VideoRemixTask, VideoRemixTaskCreateRequest } from "../api/aigc/video-remix-tasks/types";
import { uploadImage, uploadVideo } from "../api/aigc/uploads";
import { writeVideoRemixTaskDraft } from "../features/video-remix/form";
import { PageShell } from "../shared/components/PageShell";

type RemixMode = "replace-person" | "replace-product" | "imitate";

const analysisResult = [
  ["开头钩子", "前 3 秒用“打工人必看”钩子制造身份认同感，配合快速剪切字幕"],
  ["视频结构", "痛点引入 -> 商品出场 -> 功能展示 -> 价格与行动号召"],
  ["镜头节奏", "4 个镜头，平均每镜 3.5 秒，切换节奏偏快"],
  ["文案风格", "口语化种草风格，情绪词密度高，痛点描述直白"],
  ["商品表达", "商品露出 2 次，第 1 次侧面展示，第 2 次正面 + 价格标签"],
  ["行动引导", "结尾用限时标签增加紧迫感"],
];

export function ViralRemixPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RemixMode>("replace-person");
  const [uploaded, setUploaded] = useState(false);
  const [taskName, setTaskName] = useState("追爆任务");
  const [taskRemark, setTaskRemark] = useState("");
  const [sourceVideoName, setSourceVideoName] = useState("爆款视频示例.mp4");
  const [sourceVideoMeta, setSourceVideoMeta] = useState("15 秒 · 已上传");
  const [sourceVideoUrl, setSourceVideoUrl] = useState("");
  const [replaceProductName, setReplaceProductName] = useState("");
  const [replaceProductImageName, setReplaceProductImageName] = useState<string | null>(null);
  const [replaceProductImageUrl, setReplaceProductImageUrl] = useState("");
  const [imitateProductInfo, setImitateProductInfo] = useState("");
  const [sourceVideoUploading, setSourceVideoUploading] = useState(false);
  const [replaceProductImageUploading, setReplaceProductImageUploading] = useState(false);
  const [actionError, setActionError] = useState("");

  const createTaskMutation = useMutation<VideoRemixTask, Error, VideoRemixTaskCreateRequest>({
    mutationFn: (payload) => createVideoRemixTask(payload),
    onSuccess: (task) => {
      const taskId = String(task.id);
      const directionMap: Record<RemixMode, string> = {
        "replace-person": "保留原视频结构，替换出镜人物并输出数字人改编版本",
        "replace-product": "保留爆款结构，替换为当前商品并强化商品卖点露出",
        imitate: "学习爆款结构并结合当前商品做原创改编生成",
      };

      writeVideoRemixTaskDraft(taskId, {
        name: taskName.trim() || task.name,
        remark: taskRemark.trim(),
        targetVideoModel: "wan2.7-r2v",
        referenceVideoUrl: sourceVideoUrl,
        videoMetaSummary: analysisResult.map(([label, value]) => `${label}: ${value}`).join("\n"),
        productImageUrlsText: replaceProductImageUrl,
        productInfo: replaceProductName || imitateProductInfo,
        direction: directionMap[mode],
        generationDuration: 15,
      });
      setActionError("");
      navigate(`/viral-remix/tasks/${task.id}`);
    },
    onError: (error: Error) => {
      setActionError(error.message);
    },
  });

  async function handleSourceVideoUpload(file: File) {
    setSourceVideoUploading(true);
    try {
      const result = await uploadVideo(file);
      setUploaded(true);
      setTaskName(result.originalFilename.replace(/\.[^.]+$/, "") || "追爆任务");
      setSourceVideoName(result.originalFilename);
      setSourceVideoMeta("已上传到 AIGC 素材服务");
      setSourceVideoUrl(result.url);
    } finally {
      setSourceVideoUploading(false);
    }

    return false;
  }

  async function handleReplaceProductImageUpload(file: File) {
    setReplaceProductImageUploading(true);
    try {
      const result = await uploadImage(file);
      setReplaceProductImageName(result.originalFilename);
      setReplaceProductImageUrl(result.url);
    } finally {
      setReplaceProductImageUploading(false);
    }

    return false;
  }

  function handleRemoveReplaceProductImage() {
    // 删除时同步清空文件名和 URL，
    // 避免界面删掉后后续任务仍继续引用旧商品图。
    setReplaceProductImageName(null);
    setReplaceProductImageUrl("");
  }

  return (
    <PageShell title="爆款视频改编" description="分析爆款结构，先创建持久化任务，再进入详情页继续编辑、生成与回看。">
      {actionError ? (
        <Alert className="mb-6" type="error" showIcon message="创建任务失败" description={actionError} />
      ) : null}

      <Alert
        className="mb-6"
        type="warning"
        showIcon
        message="原创改编声明"
        description="本功能提供爆款结构分析与原创改编生成能力，帮助商家学习优秀内容结构并结合自己的商品进行二次创作。请确保您拥有源视频的使用权限。"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-5">
          <div>
            <h2 className="mb-3 text-[16px] font-semibold text-[var(--text-primary)]">上传爆款视频</h2>
            {!uploaded ? (
              <Upload.Dragger
                multiple={false}
                showUploadList={false}
                beforeUpload={handleSourceVideoUpload}
                data-testid="viral-source-upload"
              >
                <div className="py-8">
                  <UploadCloud size={36} className="mx-auto mb-3 text-[#F97316]" />
                  <input
                    data-testid="viral-source-upload-input"
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleSourceVideoUpload(file);
                      }
                    }}
                  />
                  <p className="text-[13px] text-[var(--text-secondary)]">
                    {sourceVideoUploading ? "上传中..." : "点击或拖拽上传爆款视频"}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">支持 MP4、MOV，建议 15-60 秒，最大 200MB</p>
                </div>
              </Upload.Dragger>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--muted-bg)]">
                  <Play size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-[var(--text-primary)]">{sourceVideoName}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{sourceVideoMeta}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#4ADE80]">
                  <CheckCircle2 size={13} /> 分析完成
                </span>
              </div>
            )}
          </div>

          {uploaded ? (
            <div>
              <h2 className="mb-3 text-[16px] font-semibold text-[var(--text-primary)]">爆款结构分析</h2>
              <div className="overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)]">
                {analysisResult.map(([label, value]) => (
                  <div key={label} className="grid gap-2 border-b border-[var(--line-subtle)] px-4 py-3 last:border-b-0 sm:grid-cols-[88px_minmax(0,1fr)]">
                    <span className="text-[12px] text-[var(--text-muted)]">{label}</span>
                    <span className="text-[12px] leading-5 text-[var(--text-secondary)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">创建追爆任务</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="任务名称" value={taskName} onChange={(event) => setTaskName(event.target.value)} />
            <Input placeholder="任务备注（选填）" value={taskRemark} onChange={(event) => setTaskRemark(event.target.value)} />
          </div>

          <div className="grid gap-3">
            {[
              { id: "replace-person", title: "换人物", desc: "保留视频结构，替换出镜人物为数字人", icon: User2, color: "#7C5CFC" },
              { id: "replace-product", title: "换商品", desc: "保留爆款结构，替换为自己的商品内容", icon: ShoppingBag, color: "#F97316" },
              { id: "imitate", title: "仿爆款生成", desc: "学习结构节奏，结合自己商品原创生成", icon: Wand2, color: "#22D3EE" },
            ].map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  data-testid={`remix-mode-${item.id}`}
                  className="rounded-xl border p-4 text-left"
                  style={{
                    borderColor: active ? `${item.color}70` : "var(--line-subtle)",
                    background: active ? `${item.color}12` : "var(--card-bg)",
                  }}
                  onClick={() => setMode(item.id as RemixMode)}
                >
                  <div className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${item.color}20` }}>
                      <Icon size={16} style={{ color: item.color }} />
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-[var(--text-primary)]">{item.title}</span>
                      <span className="text-[12px] text-[var(--text-muted)]">{item.desc}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
            {mode === "replace-person" ? (
              <div className="space-y-4">
                <Radio.Group defaultValue="小雅·专家型" options={["小雅·专家型", "小美·导购型"]} />
                <Radio.Group defaultValue="AI 重写文案" options={["保留原文案", "AI 重写文案", "保留原背景"]} />
              </div>
            ) : null}

            {mode === "replace-product" ? (
              <div className="space-y-4">
                <Input placeholder="新商品名称" value={replaceProductName} onChange={(event) => setReplaceProductName(event.target.value)} />
                <Upload.Dragger showUploadList={false} beforeUpload={handleReplaceProductImageUpload}>
                  <div className="space-y-2">
                    <input
                      data-testid="viral-product-image-upload-input"
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handleReplaceProductImageUpload(file);
                        }
                      }}
                    />
                    <span>{replaceProductImageUploading ? "上传中..." : "+ 上传商品图"}</span>
                    {replaceProductImageName ? (
                      <div className="text-[12px] text-[var(--text-secondary)]">{replaceProductImageName}</div>
                    ) : null}
                  </div>
                </Upload.Dragger>
                {replaceProductImageName ? (
                  <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)] px-3 py-2">
                    <span className="text-[12px] text-[var(--text-secondary)]">{replaceProductImageName}</span>
                    <button
                      type="button"
                      aria-label={`删除商品图-${replaceProductImageName}`}
                      className="rounded-full bg-black/65 px-2 py-1 text-[11px] text-white transition hover:bg-black/80"
                      onClick={handleRemoveReplaceProductImage}
                    >
                      删除
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {mode === "imitate" ? (
              <div className="space-y-4">
                <Input placeholder="你的商品名称，如：智能保温杯" value={replaceProductName} onChange={(event) => setReplaceProductName(event.target.value)} />
                <Input.TextArea rows={3} placeholder="输入商品核心卖点..." value={imitateProductInfo} onChange={(event) => setImitateProductInfo(event.target.value)} />
              </div>
            ) : null}
          </div>

          {uploaded ? (
            <Button
              type="primary"
              size="large"
              block
              icon={<Wand2 size={16} />}
              loading={createTaskMutation.isPending}
              onClick={() =>
                createTaskMutation.mutate({
                  name: taskName.trim() || "追爆任务",
                  remark: taskRemark.trim() || undefined,
                })
              }
            >
              创建追爆任务
            </Button>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}
