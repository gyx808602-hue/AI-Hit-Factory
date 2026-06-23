import { Alert, Button, Input, Radio, Upload } from "antd";
import { CheckCircle2, Play, ShoppingBag, UploadCloud, User2, Wand2 } from "lucide-react";
import { useState } from "react";
import { PageShell } from "../shared/components/PageShell";

type RemixMode = "replace-person" | "replace-product" | "imitate";

const analysisResult = [
  ["开头钩子", "前 3 秒用“打工人必看”钩子，制造身份认同感，配合快速剪切字幕"],
  ["视频结构", "痛点引入 -> 产品出场 -> 功能展示 -> 价格与行动号召"],
  ["镜头节奏", "4 个镜头，平均每镜 3.5 秒，切换节奏偏快"],
  ["文案风格", "口语化种草风格，情绪词密度高，痛点描述直白"],
  ["商品表达", "产品露出 2 次，第 1 次侧面展示，第 2 次正面+价格标签"],
  ["行动引导", "结尾用限时标签增加紧迫感"],
];

export function ViralRemixPage() {
  const [mode, setMode] = useState<RemixMode>("replace-person");
  const [uploaded, setUploaded] = useState(false);
  const [generated, setGenerated] = useState(false);

  return (
    <PageShell title="爆款视频改编" description="分析爆款结构，原创改编生成，强调内容创作，拒绝搬运">
      <Alert
        className="mb-6"
        type="warning"
        showIcon
        title="原创改编声明"
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
                beforeUpload={() => {
                  setUploaded(true);
                  return false;
                }}
              >
                <div className="py-8">
                  <UploadCloud size={36} className="mx-auto mb-3 text-[#F97316]" />
                  <p className="text-[13px] text-[var(--text-secondary)]">点击或拖拽上传爆款视频</p>
                  <p className="text-[11px] text-[var(--text-muted)]">支持 MP4、MOV，建议 15-60 秒，最大 200MB</p>
                </div>
              </Upload.Dragger>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--muted-bg)]">
                  <Play size={16} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-[var(--text-primary)]">爆款视频示例.mp4</div>
                  <div className="text-[11px] text-[var(--text-muted)]">15秒 · 12.4MB · 9:16</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#4ADE80]">
                  <CheckCircle2 size={13} /> 分析完成
                </span>
              </div>
            )}
          </div>

          {uploaded && (
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
          )}
        </section>

        <section className="space-y-5">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">选择改编方式</h2>
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
            {mode === "replace-person" && (
              <div className="space-y-4">
                <Radio.Group defaultValue="小雅·专家型" options={["小雅·专家型", "小美·导购型"]} />
                <Radio.Group defaultValue="AI 重写文案" options={["保留原文案", "AI 重写文案", "保留原背景"]} />
              </div>
            )}
            {mode === "replace-product" && (
              <div className="space-y-4">
                <Input placeholder="新商品名称" />
                <Upload.Dragger showUploadList={false}>+ 上传商品图</Upload.Dragger>
              </div>
            )}
            {mode === "imitate" && (
              <div className="space-y-4">
                <Input placeholder="你的商品名称，如：智能保温杯" />
                <Input.TextArea rows={3} placeholder="输入商品核心卖点..." />
              </div>
            )}
          </div>

          {uploaded && (
            <Button type="primary" size="large" block icon={<Wand2 size={16} />} onClick={() => setGenerated(true)}>
              开始改编生成
            </Button>
          )}

          {generated && (
            <div className="rounded-xl border border-[#4ADE80]/30 bg-[#4ADE80]/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-[13px] text-[#4ADE80]">
                <CheckCircle2 size={15} /> 改编视频生成成功
              </div>
              <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-[var(--muted-bg)]">
                <Play size={24} className="text-[var(--text-muted)]" />
              </div>
              <Button type="primary" block>下载视频</Button>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
