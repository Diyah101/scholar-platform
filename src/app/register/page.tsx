"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          data: { role: "student" },
        },
      });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.user?.identities && data.user.identities.length > 0) {
      setMessage(
        "Check your email to verify your account before logging in."
      );
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/90 p-6">
        <h1 className="text-xl font-semibold text-slate-50">
          Create your student account
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Start tracking scholarships and deadlines across Africa.
        </p>

        <form
          onSubmit={handleRegister}
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
          {message && (
            <p className="text-xs text-emerald-400">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-500 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

