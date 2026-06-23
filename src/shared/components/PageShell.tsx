import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, actions, children }: PageShellProps) {
  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="m-0 text-[24px] font-semibold leading-8 text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{description}</p>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
