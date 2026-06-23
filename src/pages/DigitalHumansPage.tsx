import { Button, Input, Modal, Radio, Segmented } from "antd";
import { Ban, Check, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { digitalHumans, filterDigitalHumans } from "../features/workspace/mockData";
import type { DigitalHuman, DigitalHumanStatus } from "../features/workspace/types";
import { MetricCard } from "../shared/components/MetricCard";
import { PageShell } from "../shared/components/PageShell";

const colors = ["#7C5CFC", "#F97316", "#22D3EE", "#4ADE80", "#FB923C", "#A78BFA"];

export function DigitalHumansPage() {
  const [humans, setHumans] = useState<DigitalHuman[]>(digitalHumans);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | DigitalHumanStatus>("all");
  const [open, setOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftGender, setDraftGender] = useState<"女" | "男">("女");
  const [draftStyle, setDraftStyle] = useState("导购型");
  const [draftVoice, setDraftVoice] = useState("温柔女声");

  const filtered = useMemo(() => {
    const base = filterDigitalHumans({ search, status });
    const ids = new Set(base.map((item) => item.id));
    return humans.filter((item) => ids.has(item.id) || (!digitalHumans.some((mock) => mock.id === item.id) && (!search || item.name.includes(search)) && (status === "all" || item.status === status)));
  }, [humans, search, status]);

  const addHuman = () => {
    if (!draftName.trim()) return;

    setHumans((current) => [
      {
        id: Date.now(),
        name: draftName.trim(),
        type: "系统模板",
        gender: draftGender,
        style: draftStyle,
        voice: draftVoice,
        status: "启用",
        color: colors[current.length % colors.length],
      },
      ...current,
    ]);
    setDraftName("");
    setOpen(false);
  };

  const toggleStatus = (id: number) => {
    setHumans((current) =>
      current.map((human) =>
        human.id === id ? { ...human, status: human.status === "启用" ? "停用" : "启用" } : human,
      ),
    );
  };

  return (
    <PageShell
      title="数字人管理"
      description="管理平台数字人，可在多个视频生成场景中复用"
      actions={<Button type="primary" icon={<Plus size={14} />} onClick={() => setOpen(true)}>添加数字人</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="数字人总数" value={humans.length} color="#E8E9F0" icon={Play} />
        <MetricCard label="启用中" value={humans.filter((item) => item.status === "启用").length} color="#4ADE80" icon={Check} />
        <MetricCard label="已停用" value={humans.filter((item) => item.status === "停用").length} color="#6B6C80" icon={Ban} />
      </div>

      <div className="my-5 flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          allowClear
          className="max-w-xs"
          prefix={<Search size={14} />}
          placeholder="搜索数字人..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Segmented
          value={status}
          options={[
            { value: "all", label: "全部" },
            { value: "启用", label: "启用" },
            { value: "停用", label: "停用" },
          ]}
          onChange={(value) => setStatus(value as "all" | DigitalHumanStatus)}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {filtered.map((human) => (
          <div key={human.id} className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-bold"
                  style={{ background: `${human.color}25`, borderColor: `${human.color}60`, color: human.color }}
                >
                  {human.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-[var(--text-primary)]">{human.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {human.style} · {human.gender}
                  </div>
                </div>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[11px]"
                style={{
                  color: human.status === "启用" ? "#4ADE80" : "#6B6C80",
                  background: human.status === "启用" ? "rgba(74,222,128,0.1)" : "rgba(107,108,128,0.15)",
                }}
              >
                {human.status}
              </span>
            </div>

            <div className="mb-4 space-y-2 text-[12px]">
              <div className="flex justify-between gap-3">
                <span className="text-[var(--text-muted)]">类型</span>
                <span className="text-[var(--text-secondary)]">{human.type}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--text-muted)]">声音</span>
                <span className="text-[var(--text-secondary)]">{human.voice}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="flex-1" size="small" icon={<Play size={12} />}>预览</Button>
              <Button size="small" icon={<Pencil size={12} />} aria-label="编辑" />
              <Button
                size="small"
                icon={human.status === "启用" ? <Ban size={12} /> : <Check size={12} />}
                onClick={() => toggleStatus(human.id)}
                aria-label={human.status === "启用" ? "停用" : "启用"}
              />
              <Button
                size="small"
                danger
                icon={<Trash2 size={12} />}
                onClick={() => setHumans((current) => current.filter((item) => item.id !== human.id))}
                aria-label="删除"
              />
            </div>
          </div>
        ))}

        <button
          className="flex min-h-[198px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#7C5CFC]/30 text-[var(--text-muted)] transition hover:border-[#7C5CFC]/70"
          onClick={() => setOpen(true)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
            <Plus size={18} />
          </span>
          <span className="text-[13px]">添加数字人</span>
        </button>
      </div>

      <Modal
        title="添加数字人"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={addHuman}
        okText="确认添加"
        cancelText="取消"
        styles={{ body: { maxHeight: "calc(100vh - 220px)", overflowY: "auto" } }}
      >
        <div className="space-y-4 pt-2">
          <Input placeholder="数字人名称，如：小雅、老板陈" value={draftName} onChange={(event) => setDraftName(event.target.value)} />
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">性别</div>
            <Radio.Group value={draftGender} options={["女", "男"]} onChange={(event) => setDraftGender(event.target.value)} />
          </div>
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">人设风格</div>
            <Radio.Group value={draftStyle} options={["专家型", "导购型", "宝妈型", "老板型"]} onChange={(event) => setDraftStyle(event.target.value)} />
          </div>
          <div>
            <div className="mb-2 text-[13px] text-[var(--text-secondary)]">声音</div>
            <Radio.Group value={draftVoice} options={["温柔女声", "活泼女声", "亲切女声", "沉稳男声", "热情男声"]} onChange={(event) => setDraftVoice(event.target.value)} />
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
