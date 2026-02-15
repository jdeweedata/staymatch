"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginError {
  error: string;
  code?: string;
  debug?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<LoginError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError({
          error: data.error || "Login failed",
          code: data.code,
          debug: data.debug,
        });
        return;
      }

      // Redirect based on onboarding status
      if (data.user.onboardingComplete) {
        router.push("/matches");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError({
        error:
          err instanceof Error
            ? err.message
            : "Login failed. Check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Welcome back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-accent-error/10 border border-accent-error/20 text-sm">
            <p className="text-accent-error font-medium">{error.error}</p>
            {error.code && (
              <p className="text-accent-error/70 text-xs mt-1">
                Error code: {error.code}
              </p>
            )}
            {error.debug && (
              <details className="mt-2">
                <summary className="text-accent-error/60 text-xs cursor-pointer hover:text-accent-error/80">
                  Technical details
                </summary>
                <pre className="text-accent-error/50 text-xs mt-1 whitespace-pre-wrap break-all font-mono">
                  {error.debug}
                </pre>
              </details>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
