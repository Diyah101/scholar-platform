import { createClient } from "@supabase/supabase-js";
import type { Opportunity } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type BrowseParams = {
  q?: string;
  country?: string;
  field?: string;
  degree_level?: string;
  type?: "scholarship" | "internship";
  sort?: "deadline_asc" | "deadline_desc" | "newest";
  page?: number;
  perPage?: number;
};

export type BrowseResult = {
  opportunities: Opportunity[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** Fetch approved opportunities with filters and pagination. Uses anon client so RLS allows public read of approved. */
export async function fetchOpportunities(
  params: BrowseParams = {}
): Promise<BrowseResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.min(50, params.perPage ?? 12);

  const client = createClient(supabaseUrl, supabaseAnonKey);

  let query = client
    .from("opportunities")
    .select("id,title,description,type,country,field,degree_level,deadline,award_amount,eligibility,application_link,logo_url,status,submitted_by,created_at,updated_at", {
      count: "exact",
    })
    .eq("status", "approved");

  if (params.type) {
    query = query.eq("type", params.type);
  }
  if (params.country) {
    query = query.eq("country", params.country);
  }
  if (params.field) {
    query = query.eq("field", params.field);
  }
  if (params.degree_level) {
    query = query.eq("degree_level", params.degree_level);
  }
  if (params.q?.trim()) {
    const term = params.q.trim();
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,country.ilike.%${term}%,field.ilike.%${term}%`
    );
  }

  switch (params.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "deadline_desc":
      query = query.order("deadline", { ascending: false });
      break;
    default:
      query = query.order("deadline", { ascending: true });
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    opportunities: (data ?? []) as Opportunity[],
    total,
    page,
    perPage,
    totalPages,
  };
}

/** Fetch a single approved opportunity by id. */
export async function fetchOpportunityById(
  id: string
): Promise<Opportunity | null> {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await client
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !data) return null;
  return data as Opportunity;
}

/** Featured opportunities for landing: 3 soonest deadlines. */
export async function fetchFeaturedOpportunities(): Promise<Opportunity[]> {
  const { opportunities } = await fetchOpportunities({
    sort: "deadline_asc",
    perPage: 3,
    page: 1,
  });
  return opportunities;
}

export type FilterOptions = {
  countries: string[];
  fields: string[];
  degreeLevels: string[];
};

/** Distinct filter values from approved opportunities. */
export async function fetchFilterOptions(): Promise<FilterOptions> {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await client
    .from("opportunities")
    .select("country, field, degree_level")
    .eq("status", "approved");

  if (error) return { countries: [], fields: [], degreeLevels: [] };

  const countries = [...new Set((data ?? []).map((r) => r.country).filter(Boolean))].sort();
  const fields = [...new Set((data ?? []).map((r) => r.field).filter(Boolean))].sort();
  const degreeLevels = [...new Set((data ?? []).map((r) => r.degree_level).filter(Boolean))].sort();

  return { countries, fields, degreeLevels };
}
