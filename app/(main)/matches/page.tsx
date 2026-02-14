"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  onboardingComplete: boolean;
}

export default function MatchesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-gradient">
            StayMatch
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your Matches
            </h2>
            <p className="text-muted-foreground">
              AI-curated hotels based on your preferences
            </p>
          </div>

          {/* Placeholder matches */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="aspect-[4/3] rounded-lg bg-muted mb-3 flex items-center justify-center">
                  <span className="text-4xl">🏨</span>
                </div>
                <h3 className="font-semibold text-foreground">
                  Hotel Match #{i}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lisbon, Portugal
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    92% match
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground pt-8">
            Complete onboarding to see real matches
          </p>
        </div>
      </div>
    </main>
  );
}
