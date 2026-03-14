import Link from "next/link";

export default function PartnerApplyPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0f] text-[#fafafa]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm text-white/70 hover:text-white"
        >
          ← Back to home
        </Link>
        <h1 className="mt-8 text-2xl font-semibold text-white">
          University Partner Application
        </h1>
        <p className="mt-2 text-white/70">
          Apply to submit scholarships and internships on Scholar Platform.
          Approval is required from our team.
        </p>
        <div className="mt-8 rounded-[10px] border border-white/[0.07] bg-[#161618] p-8 text-center text-sm text-white/50">
          Partner application form — coming in a later step.
        </div>
      </div>
    </div>
  );
}
