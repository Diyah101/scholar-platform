import Link from "next/link";
import { fetchFeaturedOpportunities } from "@/lib/opportunities";
import { LandingNav } from "./components/LandingNav";
import { OpportunityCard } from "./components/OpportunityCard";

export default async function HomePage() {
  const featured = await fetchFeaturedOpportunities();

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-[#fafafa]">
      <LandingNav />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find your scholarship. Before the deadline.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Scholar Platform helps African students discover scholarships and
            internships, set deadline reminders, and get notified before
            opportunities close.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#3b82f6] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Browse Opportunities
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-[10px] border border-white/10 bg-[#161618] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Stats bar */}
        <section className="mt-16 grid grid-cols-2 gap-4 rounded-[10px] border border-white/[0.07] bg-[#161618] p-6 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white sm:text-3xl">—</p>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/50">
              Scholarships
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white sm:text-3xl">—</p>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/50">
              Countries
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white sm:text-3xl">—</p>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/50">
              Students helped
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white sm:text-3xl">—</p>
            <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/50">
              Reminders sent
            </p>
          </div>
        </section>

        {/* Featured opportunities */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-white">
            Featured opportunities
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Upcoming deadlines — apply before it’s too late.
          </p>
          {featured.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} compact />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[10px] border border-dashed border-white/10 bg-[#161618]/50 py-12 text-center text-sm text-white/50">
              No featured opportunities yet. Check back soon or{" "}
              <Link href="/browse" className="text-[#3b82f6] hover:underline">
                browse all
              </Link>
              .
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              href="/browse"
              className="text-sm font-medium text-[#3b82f6] hover:underline"
            >
              View all opportunities →
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-white">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="rounded-[10px] border border-white/[0.07] bg-[#161618] p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6]/20 text-sm font-mono font-semibold text-[#3b82f6]">
                1
              </span>
              <h3 className="mt-4 font-semibold text-white">
                Create your profile
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Sign up and add your country, field of study, and degree level
                so we can match you with relevant opportunities.
              </p>
            </div>
            <div className="rounded-[10px] border border-white/[0.07] bg-[#161618] p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6]/20 text-sm font-mono font-semibold text-[#3b82f6]">
                2
              </span>
              <h3 className="mt-4 font-semibold text-white">
                Browse & filter
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Search scholarships and internships by country, field, and
                deadline. Save your favourites.
              </p>
            </div>
            <div className="rounded-[10px] border border-white/[0.07] bg-[#161618] p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6]/20 text-sm font-mono font-semibold text-[#3b82f6]">
                3
              </span>
              <h3 className="mt-4 font-semibold text-white">
                Set reminders
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Get email and in-app reminders 30, 14, 7, and 1 day before
                deadlines so you never miss an application.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials placeholder */}
        <section className="mt-20">
          <h2 className="text-xl font-semibold text-white">
            What students say
          </h2>
          <div className="mt-6 rounded-[10px] border border-white/[0.07] bg-[#161618] p-8 text-center text-sm text-white/50">
            Testimonials section — coming soon.
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/[0.07] pt-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3b82f6] text-xs font-semibold text-white">
                SP
              </div>
              <span className="text-sm font-medium text-white/80">
                Scholar Platform
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <Link href="/browse" className="hover:text-white">
                Browse
              </Link>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link href="/register" className="hover:text-white">
                Sign Up
              </Link>
              <Link href="/partner/apply" className="hover:text-white">
                Partner with us
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} Scholar Platform. For African students.
          </p>
        </footer>
      </main>
    </div>
  );
}
