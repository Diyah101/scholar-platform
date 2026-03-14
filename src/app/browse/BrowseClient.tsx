"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import type { BrowseResult, FilterOptions } from "@/lib/opportunities";
import { OpportunityCard } from "../components/OpportunityCard";

const PER_PAGE = 12;
const SORT_OPTIONS = [
  { value: "deadline_asc", label: "Deadline soonest" },
  { value: "deadline_desc", label: "Deadline latest" },
  { value: "newest", label: "Newest first" },
] as const;

type BrowseClientProps = {
  initialResult: BrowseResult;
  filterOptions: FilterOptions;
  isAuthenticated: boolean;
};

export function BrowseClient({
  initialResult,
  filterOptions,
  isAuthenticated,
}: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value == null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.delete("page"); // reset to page 1 when filters change
      router.push(`/browse?${next.toString()}`);
    },
    [router, searchParams]
  );

  const setPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("page", String(page));
      router.push(`/browse?${next.toString()}`);
    },
    [router, searchParams]
  );

  const q = searchParams.get("q") ?? "";
  const country = searchParams.get("country") ?? "all";
  const field = searchParams.get("field") ?? "all";
  const degree_level = searchParams.get("degree_level") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const sort = searchParams.get("sort") ?? "deadline_asc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const { opportunities, total, totalPages } = initialResult;
  const { countries, fields, degreeLevels } = filterOptions;

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-[#fafafa]">
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0e0e0f]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <svg
                    aria-hidden
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search by title, country, or field..."
                  value={q}
                  onChange={(e) => setParam("q", e.target.value || null)}
                  className="h-10 w-full rounded-[8px] border border-white/[0.07] bg-[#161618] pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-3">
              <FilterSelect
                label="Country"
                value={country}
                options={["all", ...countries]}
                onChange={(v) => setParam("country", v)}
              />
              <FilterSelect
                label="Field"
                value={field}
                options={["all", ...fields]}
                onChange={(v) => setParam("field", v)}
              />
              <FilterSelect
                label="Degree"
                value={degree_level}
                options={["all", ...degreeLevels]}
                onChange={(v) => setParam("degree_level", v)}
              />
              <select
                value={type}
                onChange={(e) => setParam("type", e.target.value)}
                className="rounded-[8px] border border-white/[0.07] bg-[#161618] px-3 py-2 text-xs font-mono text-white focus:border-[#3b82f6] focus:outline-none"
              >
                <option value="all">All types</option>
                <option value="scholarship">Scholarship</option>
                <option value="internship">Internship</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="rounded-[8px] border border-white/[0.07] bg-[#161618] px-3 py-2 text-xs font-mono text-white focus:border-[#3b82f6] focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-white/60">
          Showing{" "}
          <span className="font-medium text-white">
            {total === 0
              ? 0
              : `${(page - 1) * PER_PAGE + 1}-${Math.min(page * PER_PAGE, total)}`}
          </span>{" "}
          of <span className="font-medium text-white">{total}</span>{" "}
          opportunities
        </p>

        {opportunities.length === 0 ? (
          <div className="mt-8 rounded-[10px] border border-dashed border-white/10 bg-[#161618]/50 py-16 text-center">
            <p className="font-medium text-white/80">
              No opportunities match your filters.
            </p>
            <p className="mt-1 text-sm text-white/50">
              Try changing filters or search terms.
            </p>
            <Link
              href="/browse"
              className="mt-4 inline-block text-sm text-[#3b82f6] hover:underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((o) => (
                <OpportunityCard
                  key={o.id}
                  opportunity={o}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-[8px] border border-white/[0.07] bg-[#161618] px-3 py-2 text-sm text-white disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-3 py-2 font-mono text-sm text-white/60">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-[8px] border border-white/[0.07] bg-[#161618] px-3 py-2 text-sm text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-mono uppercase tracking-wider text-white/50">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[8px] border border-white/[0.07] bg-[#161618] px-3 py-2 text-xs font-mono text-white focus:border-[#3b82f6] focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "all" ? "All" : opt}
          </option>
        ))}
      </select>
    </label>
  );
}
