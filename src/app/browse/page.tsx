import { Suspense } from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import {
  fetchOpportunities,
  fetchFilterOptions,
  type BrowseParams,
} from "@/lib/opportunities";
import { BrowseClient } from "./BrowseClient";

const PER_PAGE = 12;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : undefined;
  const country =
    typeof params.country === "string" && params.country !== "all"
      ? params.country
      : undefined;
  const field =
    typeof params.field === "string" && params.field !== "all"
      ? params.field
      : undefined;
  const degree_level =
    typeof params.degree_level === "string" && params.degree_level !== "all"
      ? params.degree_level
      : undefined;
  const type =
    typeof params.type === "string" &&
    (params.type === "scholarship" || params.type === "internship")
      ? params.type
      : undefined;
  const sort =
    typeof params.sort === "string" &&
    ["deadline_asc", "deadline_desc", "newest"].includes(params.sort)
      ? params.sort
      : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  const browseParams: BrowseParams = {
    q,
    country,
    field,
    degree_level,
    type,
    sort,
    page: Number.isFinite(page) ? page : 1,
    perPage: PER_PAGE,
  };

  const [result, filterOptions, supabase] = await Promise.all([
    fetchOpportunities(browseParams),
    fetchFilterOptions(),
    createSupabaseServerClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <>
      <div className="border-b border-white/[0.07] bg-[#0e0e0f]">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center bg-[#0e0e0f] text-white/50">
            Loading…
          </div>
        }
      >
        <BrowseClient
          initialResult={result}
          filterOptions={filterOptions}
          isAuthenticated={isAuthenticated}
        />
      </Suspense>
    </>
  );
}
