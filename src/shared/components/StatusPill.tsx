import type { LucideIcon } from "lucide-react";

type StatusPillProps = {
  label: string;
  color: string;
  background: string;
  icon?: LucideIcon;
};

export function StatusPill({ label, color, background, icon: Icon }: StatusPillProps) {
  return (
    <span
      className="inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px]"
      style={{ color, background }}
    >
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
}
