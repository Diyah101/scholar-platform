import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchOpportunityById, fetchOpportunities } from "@/lib/opportunities";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { OpportunityCard } from "@/app/components/OpportunityCard";
import { CopyLinkButton } from "@/app/components/CopyLinkButton";

type PageProps = { params: Promise<{ id: string }> };

export default async function OpportunityPage({ params }: PageProps) {
  const { id } = await params;
  const [opportunity, supabase] = await Promise.all([
    fetchOpportunityById(id),
    createSupabaseServerClient(),
  ]);

  if (!opportunity) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  const related =
    opportunity.field
      ? (
          await fetchOpportunities({
            field: opportunity.field,
            perPage: 4,
            page: 1,
            sort: "deadline_asc",
          })
        ).opportunities.filter((o) => o.id !== id).slice(0, 3)
      : [];

  const deadline = new Date(opportunity.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-[#fafafa]">
      <div className="border-b border-white/[0.07] bg-[#0e0e0f]">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/browse"
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back to browse
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          {opportunity.logo_url ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-white/5">
              <Image
                src={opportunity.logo_url}
                alt=""
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] bg-white/5 font-mono text-xs uppercase text-white/50">
              {opportunity.type.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-white/50">
              {opportunity.type}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              {opportunity.title}
            </h1>
            <p className="mt-1 text-sm text-white/60">—</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-[20px] border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/80">
            {opportunity.country}
          </span>
          {opportunity.field && (
            <span className="rounded-[20px] border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-3 py-1.5 text-xs text-[#93c5fd]">
              {opportunity.field}
            </span>
          )}
          {opportunity.degree_level && (
            <span className="rounded-[20px] border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              {opportunity.degree_level}
            </span>
          )}
        </div>

        <div className="mt-8 rounded-[10px] border border-[#fbbf24]/30 bg-[#fbbf24]/5 p-4">
          <p className="font-mono text-xs text-[#fbbf24]">Deadline</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {deadline.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {daysLeft > 0 && (
            <p className="mt-1 font-mono text-sm text-white/70">
              {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
            </p>
          )}
        </div>

        {opportunity.award_amount != null && (
          <p className="mt-4 font-mono text-sm text-[#4ade80]">
            Award: ${opportunity.award_amount.toLocaleString()}
          </p>
        )}

        <div className="mt-6 prose prose-invert max-w-none">
          <h2 className="text-lg font-semibold text-white">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
            {opportunity.description}
          </p>
          {opportunity.eligibility && (
            <>
              <h2 className="mt-6 text-lg font-semibold text-white">
                Eligibility
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
                {opportunity.eligibility}
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={opportunity.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[10px] bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Apply now →
          </a>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="rounded-[10px] border border-white/10 bg-[#161618] px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                Save
              </button>
              <Link
                href={`/dashboard?reminder=${opportunity.id}`}
                className="rounded-[10px] border border-white/10 bg-[#161618] px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                Set Reminder
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/login?redirectTo=${encodeURIComponent(`/opportunity/${opportunity.id}`)}`}
                className="rounded-[10px] border border-white/10 bg-[#161618] px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                Save
              </Link>
              <Link
                href={`/login?redirectTo=${encodeURIComponent(`/opportunity/${opportunity.id}#reminder`)}`}
                className="rounded-[10px] border border-white/10 bg-[#161618] px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
              >
                Set Reminder
              </Link>
            </>
          )}
          <CopyLinkButton path={`/opportunity/${opportunity.id}`} />
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-white">
              Related opportunities
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o) => (
                <OpportunityCard
                  key={o.id}
                  opportunity={o}
                  compact
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

