import { Button, Input, Radio, Segmented, Steps, Tag } from "antd";
import { Check, ChevronLeft, ChevronRight, Play, Plus, Sparkles, Upload, Wand2 } from "lucide-react";
import { useState } from "react";
import { PageShell } from "../shared/components/PageShell";

type Step = 0 | 1 | 2 | 3;
type VideoMode = "digital-human" | "remix" | "ai-generate";

const categories = ["食品", "美妆", "服装", "家居", "数码", "健康"];
const styles = ["种草", "测评", "剧情", "促销", "专业讲解"];
const highlights = ["智能恒温技术，保温 12 小时", "316 不锈钢内胆，安全无味", "便携防漏设计，随用随带"];
const storyboard = [
  { time: "0-3秒", desc: "画面：保温杯特写，蒸汽飘起 / 字幕：还在喝冷掉的茶？" },
  { time: "3-8秒", desc: "画面：上班族倒茶，12小时后打开仍冒热气" },
  { time: "8-12秒", desc: "画面：产品细节展示，316不锈钢、真空层、防漏盖" },
  { time: "12-15秒", desc: "画面：产品正面 + 价格 / 字幕：点击购买，今日限时优惠！" },
];

export function ProductVideoPage() {
  const [step, setStep] = useState<Step>(0);
  const [category, setCategory] = useState("家居");
  const [style, setStyle] = useState("种草");
  const [videoMode, setVideoMode] = useState<VideoMode>("digital-human");
  const [showResult, setShowResult] = useState(false);
  const [generating, setGenerating] = useState(false);

  const next = () => setStep((value) => Math.min(3, value + 1) as Step);
  const prev = () => setStep((value) => Math.max(0, value - 1) as Step);

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setShowResult(true);
    }, 800);
  };

  if (showResult) {
    return (
      <PageShell title="视频生成结果" description="生成成功后可预览、下载、复制发布文案或保存到素材库">
        <Button className="mb-4" icon={<ChevronLeft size={14} />} onClick={() => setShowResult(false)}>
          返回编辑
        </Button>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex aspect-[9/16] max-h-[calc(100vh-180px)] min-h-[420px] items-center justify-center rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)]">
            <div className="text-center">
              <Play size={40} className="mx-auto mb-3 text-[#7C5CFC]" />
              <p className="text-[12px] text-[var(--text-muted)]">15秒 · 9:16</p>
            </div>
          </div>
          <div className="space-y-4">
            <InfoBlock title="视频标题">【测评】这款保温杯凭什么卖爆了？12小时真的热！</InfoBlock>
            <InfoBlock title="口播文案">
              上班族必看！这款智能保温杯，早上装好热茶，下班还是热的，精准控温，316 不锈钢内胆无异味。
            </InfoBlock>
            <InfoBlock title="发布文案">
              上班族必备！这款保温杯真的太好用了，12小时保温不是说说而已 #好物推荐 #保温杯
            </InfoBlock>
            <div className="flex flex-wrap gap-2">
              {["#好物推荐", "#保温杯测评", "#上班族必备", "#智能保温"].map((tag) => (
                <Tag key={tag} color="purple">{tag}</Tag>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button type="primary">下载视频</Button>
              <Button>保存到素材库</Button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="商品视频生成" description="上传商品资料，AI 自动提取卖点，生成 15 秒短视频">
      <div className="mb-8 max-w-3xl">
        <Steps
          current={step}
          items={[
            { title: "上传商品" },
            { title: "确认卖点" },
            { title: "查看脚本" },
            { title: "生成视频" },
          ]}
        />
      </div>

      <div className="max-w-3xl space-y-5">
        {step === 0 && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">商品名称</label>
                <Input defaultValue="智能恒温保温杯" />
              </div>
              <div>
                <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">商品类目</label>
                <Segmented value={category} options={categories} onChange={(value) => setCategory(String(value))} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">商品图片</label>
              <div className="rounded-xl border-2 border-dashed border-[#7C5CFC]/30 bg-[#7C5CFC]/5 p-8 text-center">
                <Upload size={28} className="mx-auto mb-2 text-[#7C5CFC]" />
                <p className="text-[13px] text-[var(--text-secondary)]">点击上传商品图片</p>
                <div className="mt-3 flex justify-center gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-12 w-12 rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)]" />
                  ))}
                  <button className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-[var(--line-subtle)]">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
            <Input.TextArea rows={3} placeholder="可粘贴商品详情页文案，帮助 AI 更好地提取卖点..." />
          </>
        )}

        {step === 1 && (
          <>
            <div className="rounded-xl border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 p-4 text-[13px] text-[var(--text-secondary)]">
              AI 已从商品资料中提取卖点，你可以编辑、增删内容。
            </div>
            {["核心卖点", "功能卖点", "情绪卖点", "风险提示"].map((label, index) => (
              <div key={label} className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
                <div className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">{label}</div>
                <div className="flex flex-wrap gap-2">
                  {(index === 3 ? ["避免使用“最好”“第一”等绝对化表述"] : highlights).map((item) => (
                    <Tag key={item} color={index === 3 ? "red" : "purple"}>{item}</Tag>
                  ))}
                  <Button size="small" icon={<Plus size={12} />}>添加</Button>
                </div>
              </div>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <InfoBlock title="视频标题">【测评】这款保温杯凭什么卖爆了？12小时真的热！</InfoBlock>
            <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
              <div className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">分镜脚本</div>
              <div className="space-y-3">
                {storyboard.map((item) => (
                  <div key={item.time} className="grid gap-3 sm:grid-cols-[64px_minmax(0,1fr)]">
                    <div className="flex h-12 items-center justify-center rounded-lg bg-[var(--muted-bg)] text-[11px] text-[var(--text-muted)]">
                      {item.time}
                    </div>
                    <div className="rounded-lg bg-[var(--muted-bg)] p-3 text-[12px] leading-5 text-[var(--text-secondary)]">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <InfoBlock title="口播文案">上班族必看！这款智能保温杯，早上装好热茶，下班还是热的。</InfoBlock>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="mb-2 block text-[13px] text-[var(--text-secondary)]">生成模式</label>
              <Radio.Group value={videoMode} onChange={(event) => setVideoMode(event.target.value)}>
                <Radio.Button value="digital-human">数字人生成</Radio.Button>
                <Radio.Button value="remix">混剪生成</Radio.Button>
                <Radio.Button value="ai-generate">AI 自动生成</Radio.Button>
              </Radio.Group>
            </div>
            <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
              {videoMode === "digital-human" && <Radio.Group defaultValue="小雅·专家型" options={["小雅·专家型", "小美·导购型", "老陈·老板型"]} />}
              {videoMode === "remix" && <Segmented options={["快节奏", "种草", "测评", "温情", "促销"]} defaultValue="种草" />}
              {videoMode === "ai-generate" && <Input.TextArea rows={3} defaultValue="一个上班族女生在办公室使用这个保温杯，阳光透过窗户照进来" />}
            </div>
          </>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          {step > 0 && <Button icon={<ChevronLeft size={14} />} onClick={prev}>返回</Button>}
          {step < 3 && <Button type="primary" icon={<Sparkles size={14} />} onClick={next}>下一步 <ChevronRight size={14} /></Button>}
          {step === 3 && <Button type="primary" icon={<Wand2 size={14} />} loading={generating} onClick={generate}>开始生成视频</Button>}
        </div>
      </div>
    </PageShell>
  );
}

function InfoBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
      <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[var(--text-secondary)]">
        <Check size={13} />
        {title}
      </div>
      <p className="m-0 text-[13px] leading-6 text-[var(--text-primary)]">{children}</p>
    </div>
  );
}
