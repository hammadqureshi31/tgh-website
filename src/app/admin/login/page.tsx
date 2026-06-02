"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message ||
            "Failed to sign in. Please check your credentials.",
        );
        return;
      }

      const nextUrl = searchParams.get("next") || "/admin/blog";
      router.push(nextUrl);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-luxury-midnight flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-playfair text-4xl font-bold text-luxury-ivory mb-2">
            Admin Access
          </h1>
          <p className="text-luxury-pearl font-outfit text-sm tracking-luxury">
            The Gentry's House
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-luxury-ivory font-outfit text-sm mb-3"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-graphite text-luxury-ivory placeholder-luxury-graphite font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-luxury-ivory font-outfit text-sm mb-3"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-luxury-charcoal border border-luxury-graphite text-luxury-ivory placeholder-luxury-graphite font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors disabled:opacity-50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-200 font-outfit text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm tracking-luxury hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-luxury-graphite font-outfit text-xs tracking-luxury mt-8">
          Admin portal for The Gentry's House
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-midnight flex items-center justify-center text-luxury-ivory">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
