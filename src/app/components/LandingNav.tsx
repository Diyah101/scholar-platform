import Link from "next/link";

export function LandingNav() {
  return (
    <div className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0e0e0f]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6] text-xs font-semibold text-white">
            SP
          </div>
          <span className="text-sm font-medium tracking-tight text-[#fafafa]">
            Scholar Platform
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/browse"
            className="text-white/70 transition hover:text-white"
          >
            Browse
          </Link>
          <Link
            href="/login"
            className="text-white/70 transition hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/10 bg-[#161618] px-4 py-2 text-white transition hover:bg-[#3b82f6] hover:border-[#3b82f6]"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
}
