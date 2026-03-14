"use client";

export function CopyLinkButton({ path }: { path: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const url =
          typeof window !== "undefined" ? window.location.origin + path : "";
        void navigator.clipboard?.writeText(url);
      }}
      className="rounded-[10px] border border-white/10 bg-[#161618] px-4 py-2.5 text-sm text-white/80 hover:bg-white/5"
    >
      Share (copy link)
    </button>
  );
}
