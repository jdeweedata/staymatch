"use client";

import React, { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import CategoryPill from "@/components/ui/CategoryPill";
import PropertyCard from "@/components/ui/PropertyCard";
import BottomNav from "@/components/ui/BottomNav";

const categories = [
  {
    id: "lombok",
    label: "Lombok",
    image: "https://images.unsplash.com/photo-1570789210967-2cac24e2beee?w=200&q=80",
  },
  {
    id: "bali",
    label: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80",
  },
  {
    id: "raja-ampat",
    label: "Raja Ampat",
    image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=200&q=80",
  },
  {
    id: "lisbon",
    label: "Lisbon",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=200&q=80",
  },
  {
    id: "bangkok",
    label: "Bangkok",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=200&q=80",
  },
];

const recommendedProperties = [
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    title: "Citadines Berawa",
    location: "Bandung",
    rating: 4.9,
    price: 35,
  },
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    title: "The Bali Dream Villa",
    location: "Seminyak",
    rating: 4.8,
    price: 52,
  },
  {
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    title: "Sunset Beach Resort",
    location: "Kuta",
    rating: 4.7,
    price: 48,
  },
  {
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    title: "Marina Bay Hotel",
    location: "Jakarta",
    rating: 4.6,
    price: 42,
  },
];

const nearbyProperties = [
  {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    title: "Double Six Luxury",
    location: "DKI Jakarta",
    rating: 4.9,
    price: 35,
    badge: "Top Pick",
  },
  {
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80",
    title: "Grand Hyatt Resort",
    location: "Bali, Indonesia",
    rating: 4.8,
    price: 65,
  },
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    title: "The Ritz Residence",
    location: "Lisbon, Portugal",
    rating: 4.7,
    price: 78,
    badge: "New",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("bali");
  const [activeNav, setActiveNav] = useState("explore");

  return (
    <main className="min-h-screen bg-background pb-24 font-sans">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-text-secondary">Welcome back 👋</p>
              <h1 className="text-lg font-bold text-foreground">
                StayMatch
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-surface-secondary transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#272823"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
            </div>
          </div>
          <SearchBar />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        {/* ─── Explore Stay ─── */}
        <section className="mt-6 animate-fade-in">
          <h2 className="text-base font-bold text-foreground mb-3">
            Explore Stay
          </h2>
          <CategoryPill
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </section>

        {/* ─── Recommended ─── */}
        <section className="mt-8 animate-fade-in delay-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">
              Recommended
            </h2>
            <button className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
              See All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recommendedProperties.map((prop, i) => (
              <PropertyCard key={i} {...prop} />
            ))}
          </div>
        </section>

        {/* ─── Nearby Resort ─── */}
        <section className="mt-8 mb-6 animate-fade-in delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">
              Nearby Resort
            </h2>
            <button className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
              See All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {nearbyProperties.map((prop, i) => (
              <PropertyCard key={i} {...prop} compact />
            ))}
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="mb-8 animate-fade-in delay-300">
          <div className="relative bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-lg mb-1">
                Find Your Perfect Match
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Swipe through hotels to build your taste profile and get AI-curated matches.
              </p>
              <button className="bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm">
                Start Matching
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Bottom Nav ─── */}
      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
