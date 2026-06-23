import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  change?: string;
  color: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, change, color, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4 lg:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: `${color}1A` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        {change && (
          <span className="rounded px-1.5 py-0.5 text-[11px] text-[#4ADE80] [background:rgba(74,222,128,0.1)]">
            {change}
          </span>
        )}
      </div>
      <div className="text-[24px] font-bold leading-none text-[var(--text-primary)]">{value}</div>
      <div className="mt-1 text-[12px] text-[var(--text-muted)]">{label}</div>
    </div>
  );
}
