"use client";

import { useMemo, useState } from "react";

type Scholarship = {
  id: number;
  title: string;
  country: string;
  field: string;
  deadline: string;
};

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 1,
    title: "Mandela Leaders Scholarship",
    country: "South Africa",
    field: "Public Policy",
    deadline: "2026-04-30",
  },
  {
    id: 2,
    title: "Lagos Tech Innovators Fund",
    country: "Nigeria",
    field: "Computer Science",
    deadline: "2026-05-15",
  },
  {
    id: 3,
    title: "Kigali Women in STEM Grant",
    country: "Rwanda",
    field: "Engineering",
    deadline: "2026-06-01",
  },
  {
    id: 4,
    title: "Accra Future Founders Scholarship",
    country: "Ghana",
    field: "Business",
    deadline: "2026-05-05",
  },
  {
    id: 5,
    title: "Cairo Health Impact Award",
    country: "Egypt",
    field: "Health Sciences",
    deadline: "2026-07-10",
  },
  {
    id: 6,
    title: "Nairobi Green Cities Fellowship",
    country: "Kenya",
    field: "Environmental Studies",
    deadline: "2026-04-18",
  },
];

function formatDeadline(dateString: string) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [fieldFilter, setFieldFilter] = useState("All");
  const [activeScholarship, setActiveScholarship] = useState<Scholarship | null>(null);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminders, setReminders] = useState<
    { scholarshipId: number; email: string; createdAt: string }[]
  >([]);

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(SCHOLARSHIPS.map((s) => s.country)))],
    []
  );

  const fields = useMemo(
    () => ["All", ...Array.from(new Set(SCHOLARSHIPS.map((s) => s.field)))],
    []
  );

  const filteredScholarships = useMemo(
    () =>
      SCHOLARSHIPS.filter((s) => {
        const matchesSearch =
          !search.trim() ||
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.country.toLowerCase().includes(search.toLowerCase()) ||
          s.field.toLowerCase().includes(search.toLowerCase());

        const matchesCountry =
          countryFilter === "All" || s.country === countryFilter;

        const matchesField =
          fieldFilter === "All" || s.field === fieldFilter;

        return matchesSearch && matchesCountry && matchesField;
      }),
    [search, countryFilter, fieldFilter]
  );

  const handleOpenReminder = (scholarship: Scholarship) => {
    setActiveScholarship(scholarship);
    setReminderEmail("");
  };

  const handleCloseReminder = () => {
    setActiveScholarship(null);
    setReminderEmail("");
  };

  const handleSubmitReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeScholarship || !reminderEmail.trim()) return;

    setReminders((prev) => [
      ...prev,
      {
        scholarshipId: activeScholarship.id,
        email: reminderEmail.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);

    handleCloseReminder();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 antialiased">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-30 border-b border-slate-900/80 bg-slate-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/90 text-xs font-semibold text-slate-50 shadow-sm">
              SP
            </div>
            <span className="text-sm font-medium tracking-tight text-slate-100">
              Scholar Platform
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="#browse"
              className="text-slate-300 transition hover:text-slate-50"
            >
              Browse
            </a>
            <a
              href="#signup"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-100 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Built for African students
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Scholar Platform
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
              Find your opportunity. Search and filter curated scholarships
              across Africa in one clean, focused dashboard.
            </p>
          </div>
        </header>

        {/* Search + Filters */}
        <section
          id="browse"
          className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                >
                  <path
                    d="M15.5 15.5 20 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships by name, country, or field"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <FilterSelect
                label="Country"
                value={countryFilter}
                onChange={setCountryFilter}
                options={countries}
              />
              <FilterSelect
                label="Field"
                value={fieldFilter}
                onChange={setFieldFilter}
                options={fields}
              />
            </div>
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-200">
                {filteredScholarships.length}
              </span>{" "}
              scholarships
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-8 flex-1">
          {filteredScholarships.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/80 py-16 text-center">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  No scholarships match your filters yet.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try clearing one of the filters or searching with fewer
                  keywords.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredScholarships.map((s) => (
                <article
                  key={s.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/70 hover:bg-slate-900 hover:shadow-[0_22px_70px_rgba(15,23,42,0.9)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-semibold text-slate-50 line-clamp-2">
                        {s.title}
                      </h2>
                      <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-emerald-300">
                        Open
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        {s.country}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-1 text-indigo-200">
                        {s.field}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-col text-[0.7rem] text-slate-400">
                      <span>Deadline</span>
                      <span className="mt-0.5 text-xs font-medium text-slate-100">
                        {formatDeadline(s.deadline)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenReminder(s)}
                      className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      Set Reminder
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Reminder Modal */}
        {activeScholarship && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-50">
                    Set a reminder
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    We’ll keep this email stored locally for now. In production,
                    you’d connect this to your notification service.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseReminder}
                  className="rounded-full p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
                  aria-label="Close"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
                <p className="font-medium text-slate-100">
                  {activeScholarship.title}
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-400">
                  {activeScholarship.country} · {activeScholarship.field} ·
                  Deadline:{" "}
                  <span className="font-medium text-slate-100">
                    {formatDeadline(activeScholarship.deadline)}
                  </span>
                </p>
              </div>

              <form
                onSubmit={handleSubmitReminder}
                className="mt-4 space-y-4"
                id="signup"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="reminder-email"
                    className="text-xs font-medium text-slate-200"
                  >
                    Email address
                  </label>
                  <input
                    id="reminder-email"
                    type="email"
                    required
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.7rem] text-slate-500">
                    This reminder is stored in your browser state only.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCloseReminder}
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-[0.7rem] text-slate-300">
      <span className="uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs font-medium text-slate-100 outline-none focus-visible:ring-0"
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-slate-900 text-slate-100"
          >
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

