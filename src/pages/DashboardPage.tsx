import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Image,
  Play,
  Repeat2,
  RefreshCw,
  TrendingUp,
  User2,
  Video,
} from "lucide-react";
import { PageShell } from "../shared/components/PageShell";
import { MetricCard } from "../shared/components/MetricCard";
import { StatusPill } from "../shared/components/StatusPill";
import { generationTasks } from "../features/workspace/mockData";

const metrics = [
  { label: "今日生成视频", value: 24, change: "+8", icon: Video, color: "#7C5CFC" },
  { label: "累计生成视频", value: "1,286", change: "+24", icon: TrendingUp, color: "#F97316" },
  { label: "数字人数量", value: 6, change: "+1", icon: User2, color: "#22D3EE" },
  { label: "素材总数", value: 342, change: "+18", icon: Image, color: "#4ADE80" },
];

const quickActions = [
  {
    title: "商品视频生成",
    desc: "上传商品资料，AI 自动提取卖点，生成 15 秒短视频",
    icon: Video,
    color: "#7C5CFC",
    tag: "核心功能",
  },
  {
    title: "爆款视频改编",
    desc: "分析爆款结构，换人物/换商品/仿爆款，原创改编生成",
    icon: Repeat2,
    color: "#F97316",
    tag: "热门",
  },
  {
    title: "图文生成视频",
    desc: "文字/图片/图文混合一键转视频，支持轮播、混剪、数字人",
    icon: Image,
    color: "#22D3EE",
  },
  {
    title: "管理数字人",
    desc: "添加、编辑、切换数字人，作为公共能力跨场景复用",
    icon: User2,
    color: "#4ADE80",
  },
];

const statusView = {
  success: { label: "生成成功", color: "#4ADE80", bg: "rgba(74,222,128,0.1)", icon: CheckCircle2 },
  processing: { label: "生成中", color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: Clock },
  queued: { label: "排队中", color: "#22D3EE", bg: "rgba(34,211,238,0.1)", icon: Clock },
  failed: { label: "生成失败", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertCircle },
  cancelled: { label: "已取消", color: "#6B6C80", bg: "rgba(107,108,128,0.1)", icon: AlertCircle },
};

export function DashboardPage() {
  return (
    <PageShell title="工作台" description="欢迎回来！今天又是高产的一天">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-[18px] font-semibold text-[var(--text-primary)]">快速开始</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                className="group rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#7C5CFC]/50 lg:p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${action.color}, ${action.color}CC)` }}
                  >
                    <Icon size={20} color="#fff" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-medium text-[var(--text-primary)]">
                        {action.title}
                      </span>
                      {action.tag && (
                        <span className="rounded bg-[#7C5CFC]/20 px-1.5 py-0.5 text-[10px] text-[#9B7FFF]">
                          {action.tag}
                        </span>
                      )}
                    </div>
                    <p className="m-0 text-[12px] leading-5 text-[var(--text-muted)]">{action.desc}</p>
                  </div>
                  <ChevronRight size={14} className="mt-1 shrink-0 text-[var(--text-muted)]" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-[18px] font-semibold text-[var(--text-primary)]">最近任务</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)]">
          {generationTasks.slice(0, 5).map((task, index) => {
            const status = statusView[task.status];

            return (
              <div
                key={task.id}
                className="flex min-w-0 flex-col gap-3 border-b border-[var(--line-subtle)] px-4 py-4 last:border-b-0 md:flex-row md:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-9 w-[52px] shrink-0 items-center justify-center rounded-lg bg-[var(--muted-bg)]">
                    <Play size={12} className="text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
                      {task.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                      {task.type} · {index + 2}分钟前
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusPill label={status.label} color={status.color} background={status.bg} icon={status.icon} />
                  {task.status === "success" && (
                    <button className="inline-flex items-center gap-1 rounded-lg bg-[#7C5CFC]/10 px-2.5 py-1.5 text-[12px] text-[#9B7FFF]">
                      <Download size={11} /> 下载
                    </button>
                  )}
                  {task.status === "failed" && (
                    <button className="inline-flex items-center gap-1 rounded-lg bg-[#EF4444]/10 px-2.5 py-1.5 text-[12px] text-[#EF4444]">
                      <RefreshCw size={11} /> 重试
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
