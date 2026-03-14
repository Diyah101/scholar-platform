import Link from "next/link";
import Image from "next/image";
import type { Opportunity } from "@/lib/types";

function formatDeadline(deadline: string) {
  const d = new Date(deadline);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

function daysUntil(deadline: string): number {
  const end = new Date(deadline).getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end - now) / (24 * 60 * 60 * 1000)));
}

type OpportunityCardProps = {
  opportunity: Opportunity;
  /** Show compact layout for featured sections */
  compact?: boolean;
  /** If false, Set Reminder and Save link to login */
  isAuthenticated?: boolean;
};

export function OpportunityCard({
  opportunity: o,
  compact = false,
  isAuthenticated = false,
}: OpportunityCardProps) {
  const days = daysUntil(o.deadline);

  return (
    <article
      className={`flex flex-col rounded-[10px] border border-white/[0.07] bg-[#161618] transition hover:border-[#3b82f6]/40 ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-start gap-3">
        {o.logo_url ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
            <Image
              src={o.logo_url}
              alt=""
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[10px] font-mono uppercase text-white/50">
            {o.type.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/50">
            {o.type}
          </p>
          <h3 className="mt-0.5 font-semibold text-white line-clamp-2">
            {o.title}
          </h3>
          <p className="mt-1 text-xs text-white/60">—</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-[20px] border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-white/80">
          {o.country}
        </span>
        {o.field && (
          <span className="inline-flex items-center rounded-[20px] border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-2.5 py-1 text-xs text-[#93c5fd]">
            {o.field}
          </span>
        )}
        {o.degree_level && (
          <span className="inline-flex items-center rounded-[20px] border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            {o.degree_level}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <div>
          <span className="font-mono text-white/50">Deadline </span>
          <span className="font-mono font-medium text-white">
            {formatDeadline(o.deadline)}
          </span>
          {days <= 30 && (
            <span className="ml-2 font-mono text-[#fbbf24]">
              ({days}d left)
            </span>
          )}
        </div>
        {o.award_amount != null && (
          <span className="font-mono text-[#4ade80]">
            {formatAmount(o.award_amount)}
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/opportunity/${o.id}`}
            className="inline-flex items-center justify-center rounded-[8px] bg-[#3b82f6] px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
          >
            View Details
          </Link>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Save
              </button>
              <Link
                href={`/opportunity/${o.id}#reminder`}
                className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Set Reminder
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/login?redirectTo=${encodeURIComponent(`/opportunity/${o.id}`)}`}
                className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Save
              </Link>
              <Link
                href={`/login?redirectTo=${encodeURIComponent(`/opportunity/${o.id}#reminder`)}`}
                className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Set Reminder
              </Link>
            </>
          )}
        </div>
      )}
    </article>
  );
}
