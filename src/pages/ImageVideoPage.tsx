import { Button, Input, Segmented, Switch } from "antd";
import { CheckCircle2, Image as ImageIcon, LayoutGrid, Play, Plus, Type, Wand2 } from "lucide-react";
import { useState } from "react";
import { PageShell } from "../shared/components/PageShell";

type InputMode = "text" | "image" | "mixed";
type OutputMode = "slideshow" | "remix" | "digital-human";

const videoStyles = ["种草", "测评", "温情", "促销", "专业"];

export function ImageVideoPage() {
  const [inputMode, setInputMode] = useState<InputMode>("mixed");
  const [outputMode, setOutputMode] = useState<OutputMode>("slideshow");
  const [selectedStyle, setSelectedStyle] = useState("种草");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 800);
  };

  return (
    <PageShell title="图文生成视频" description="文字/图片/图文混合一键转视频，适合详情页、文案、海报快速成片">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div>
            <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">输入方式</label>
            <Segmented
              value={inputMode}
              options={[
                { value: "text", label: "文字输入", icon: <Type size={14} /> },
                { value: "image", label: "图片上传", icon: <ImageIcon size={14} /> },
                { value: "mixed", label: "图文混合", icon: <LayoutGrid size={14} /> },
              ]}
              onChange={(value) => setInputMode(value as InputMode)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">视频主题</label>
              <Input defaultValue="办公室养生茶推荐，上班族必备" />
            </div>
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">视频风格</label>
              <div className="flex flex-wrap gap-2">
                {videoStyles.map((style) => (
                  <Button
                    key={style}
                    type={selectedStyle === style ? "primary" : "default"}
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {(inputMode === "text" || inputMode === "mixed") && (
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">输入文案</label>
              <Input.TextArea
                rows={6}
                defaultValue="这款养生茶真的太适合上班族了！由多种草本精制而成，每天早晨泡一杯，清甜不苦涩，香气怡人。办公室里同事都在问我喝的什么，现在已经一起团购了。"
              />
              <div className="mt-1 text-right text-[11px] text-[var(--text-muted)]">136 / 500 字</div>
            </div>
          )}

          {(inputMode === "image" || inputMode === "mixed") && (
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">上传图片</label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex aspect-square items-center justify-center rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)]"
                  >
                    <ImageIcon size={16} className="text-[var(--text-muted)]" />
                  </div>
                ))}
                <button className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[var(--line-subtle)] text-[var(--text-muted)]">
                  <Plus size={18} />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">推荐 3-8 张，支持 JPG、PNG</p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">输出方式</label>
            <div className="grid gap-3 lg:grid-cols-3">
              {[
                { id: "slideshow", title: "图文轮播视频", desc: "图片轮播 + 动态字幕 + 配音", color: "#7C5CFC" },
                { id: "remix", title: "混剪短视频", desc: "自动剪辑、分镜字幕、配音 + BGM", color: "#F97316" },
                { id: "digital-human", title: "数字人口播视频", desc: "数字人讲解 + 图文辅助 + 字幕", color: "#22D3EE" },
              ].map((item) => (
                <button
                  key={item.id}
                  className="rounded-xl border p-4 text-left"
                  style={{
                    borderColor: outputMode === item.id ? `${item.color}70` : "var(--line-subtle)",
                    background: outputMode === item.id ? `${item.color}12` : "var(--card-bg)",
                  }}
                  onClick={() => setOutputMode(item.id as OutputMode)}
                >
                  <div className="mb-1 flex items-center gap-2 text-[13px] font-medium text-[var(--text-primary)]">
                    {outputMode === item.id && <CheckCircle2 size={14} style={{ color: item.color }} />}
                    {item.title}
                  </div>
                  <p className="m-0 text-[12px] leading-5 text-[var(--text-muted)]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {["自动配音", "自动字幕", "添加 BGM"].map((label, index) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] bg-[var(--card-bg)] p-3">
                <span className="text-[12px] text-[var(--text-secondary)]">{label}</span>
                <Switch defaultChecked={index < 2} />
              </div>
            ))}
          </div>

          <Button type="primary" size="large" block icon={<Wand2 size={16} />} loading={generating} onClick={handleGenerate}>
            开始生成视频
          </Button>
        </section>

        <aside className="space-y-4">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">视频预览</h2>
          <div className="flex aspect-[9/16] max-h-[calc(100vh-180px)] min-h-[360px] items-center justify-center rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)]">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#22D3EE]/15">
                <Play size={20} className="text-[#22D3EE]" />
              </div>
              <p className="m-0 text-[12px] text-[var(--text-muted)]">
                {generated ? "图文轮播视频 · 15秒 · 9:16" : generating ? "AI 生成中..." : "视频将在此预览"}
              </p>
            </div>
          </div>
          {generated && (
            <div className="grid gap-2">
              <Button type="primary">下载视频</Button>
              <Button>保存到素材库</Button>
            </div>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
