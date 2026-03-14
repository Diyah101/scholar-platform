"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const redirectTo =
    searchParams.get("redirectTo") ?? "/dashboard";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(redirectTo);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error: signInError } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/90 p-6">
        <h1 className="text-xl font-semibold text-slate-50">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to Scholar Platform to manage your opportunities.
        </p>

        <form
          onSubmit={handleEmailLogin}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-0 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-0 focus:border-blue-500"
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-500 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-sm font-medium text-slate-100"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          New here?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:underline"
          >
            Create a student account
          </Link>
        </p>
      </div>
    </div>
  );
}

