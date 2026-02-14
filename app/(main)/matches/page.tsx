"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import MatchScoreBadge from "@/components/ui/MatchScoreBadge";

interface User {
  id: string;
  email: string;
  name: string | null;
  onboardingComplete: boolean;
}

// Sample matched hotels - in production these come from the API based on taste vector
const matchedHotels = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    title: "Boutique Ocean Villa",
    location: "Bali, Indonesia",
    rating: 4.8,
    price: 245,
    matchScore: 94,
    matchReasons: ["Beachfront", "Pool", "Fast WiFi"],
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    title: "Urban Loft Hotel",
    location: "Lisbon, Portugal",
    rating: 4.5,
    price: 189,
    matchScore: 91,
    matchReasons: ["City Center", "Coworking", "Rooftop"],
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    title: "Modern Design Hotel",
    location: "Bangkok, Thailand",
    rating: 4.6,
    price: 175,
    matchScore: 96,
    matchReasons: ["Design", "500Mbps WiFi", "Pool"],
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    title: "Riverside Boutique Inn",
    location: "Hoi An, Vietnam",
    rating: 4.5,
    price: 85,
    matchScore: 89,
    matchReasons: ["Boutique", "Great Value", "Central"],
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    title: "Mountain Retreat Lodge",
    location: "Chiang Mai, Thailand",
    rating: 4.7,
    price: 95,
    matchScore: 87,
    matchReasons: ["Nature", "Quiet", "Breakfast"],
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    title: "Historic City Hotel",
    location: "Porto, Portugal",
    rating: 4.4,
    price: 145,
    matchScore: 82,
    matchReasons: ["Historic", "Central", "Restaurant"],
  },
];

export default function MatchesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("match");

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
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading your matches...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        {/* Mobile header */}
        <div className="lg:hidden max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">Your Matches</h1>
              <p className="text-xs text-text-secondary">AI-curated just for you</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-surface-secondary transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#272823" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold"
                title="Sign out"
              >
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block lg:ml-[220px]">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Your Matches</h1>
              <p className="text-sm text-text-secondary">Hotels matched to your taste profile</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                Sign out
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content (offset for sidebar on desktop) */}
      <div className="lg:ml-[220px]">
        <div className="max-w-lg lg:max-w-7xl mx-auto px-5 lg:px-8 py-6">
          {/* Match summary */}
          <div className="mb-6 lg:mb-8 animate-fade-in">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF3859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground">{matchedHotels.length} Perfect Matches</p>
                <p className="text-sm text-text-secondary">Based on your swipe preferences</p>
              </div>
            </div>
          </div>

          {/* Matched hotels grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-fade-in delay-100">
            {matchedHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => router.push("/booking")}
                className="cursor-pointer group"
              >
                <div className="card hover:shadow-card-hover transition-all duration-300">
                  {/* Image with match score */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                    <img
                      src={hotel.image}
                      alt={hotel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <MatchScoreBadge score={hotel.matchScore} size="sm" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite
                      }}
                      className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#272823" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {hotel.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-accent-warning">★</span>
                        <span className="font-medium text-foreground">{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-2 flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {hotel.location}
                    </p>

                    {/* Match reasons */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hotel.matchReasons.map((reason, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">${hotel.price}</span>
                      <span className="text-sm text-text-secondary">/ night</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state / CTA */}
          {!user?.onboardingComplete && (
            <div className="mt-8 text-center animate-fade-in delay-200">
              <div className="inline-flex flex-col items-center p-6 bg-surface-secondary rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3859" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Want better matches?</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Complete onboarding to refine your taste profile
                </p>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="btn-primary"
                >
                  Continue Swiping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
