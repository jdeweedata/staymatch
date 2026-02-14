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
  {
    id: "tokyo",
    label: "Tokyo",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
  },
  {
    id: "paris",
    label: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=80",
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
  {
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    title: "Oceanview Palace",
    location: "Nha Trang",
    rating: 4.9,
    price: 61,
  },
  {
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
    title: "Tropical Hideaway",
    location: "Phuket",
    rating: 4.5,
    price: 39,
  },
  {
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&q=80",
    title: "The Azure Resort",
    location: "Maldives",
    rating: 4.9,
    price: 120,
  },
  {
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    title: "Infinity Pool Villa",
    location: "Santorini",
    rating: 4.8,
    price: 95,
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
  {
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&q=80",
    title: "Skyline Boutique",
    location: "Bangkok, Thailand",
    rating: 4.6,
    price: 44,
  },
  {
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80",
    title: "Heritage Grand Hotel",
    location: "Paris, France",
    rating: 4.9,
    price: 110,
    badge: "Editor Pick",
  },
  {
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80",
    title: "Zen Garden Ryokan",
    location: "Kyoto, Japan",
    rating: 4.8,
    price: 88,
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("bali");
  const [activeNav, setActiveNav] = useState("explore");

  return (
    <main className="min-h-screen bg-background pb-24 lg:pb-0 font-sans">
      {/* ─── Desktop Header ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        {/* Mobile header */}
        <div className="lg:hidden max-w-lg mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-text-secondary">Welcome back 👋</p>
              <h1 className="text-lg font-bold text-foreground">StayMatch</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-surface-secondary transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#272823" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Desktop header */}
        <div className="hidden lg:block lg:ml-[220px]">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-6">
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 rounded-xl hover:bg-surface-secondary transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#272823" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main content area (offset for sidebar on desktop) ─── */}
      <div className="lg:ml-[220px]">
        {/* ─── Desktop Hero Banner ─── */}
        <section className="hidden lg:block max-w-7xl mx-auto px-8 pt-8">
          <div className="relative bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative z-10 max-w-xl">
              <p className="text-white/70 text-sm font-medium mb-2">Welcome back 👋</p>
              <h2 className="text-white font-bold text-3xl mb-3 leading-tight">
                Discover Your Perfect<br />
                Stay, Anywhere
              </h2>
              <p className="text-white/80 text-base mb-6 leading-relaxed">
                Swipe through hotels to build your taste profile and get AI-curated matches
                tailored just for you. No filters, no noise — just your perfect match.
              </p>
              <button className="bg-white text-primary font-semibold px-7 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-md hover:shadow-lg">
                Start Matching
              </button>
            </div>
          </div>
        </section>

        {/* Content container */}
        <div className="max-w-lg lg:max-w-7xl mx-auto px-5 lg:px-8">
          {/* ─── Explore Stay ─── */}
          <section className="mt-6 lg:mt-8 animate-fade-in">
            <h2 className="text-base lg:text-lg font-bold text-foreground mb-3 lg:mb-4">
              Explore Stay
            </h2>
            <CategoryPill
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
            />
          </section>

          {/* ─── Recommended ─── */}
          <section className="mt-8 lg:mt-10 animate-fade-in delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-lg font-bold text-foreground">
                Recommended
              </h2>
              <button className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                See All
              </button>
            </div>
            {/* Mobile: horizontal scroll · Desktop: responsive grid */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
              {recommendedProperties.map((prop, i) => (
                <PropertyCard key={i} {...prop} />
              ))}
            </div>
          </section>

          {/* ─── Nearby Resort ─── */}
          <section className="mt-8 lg:mt-10 mb-6 animate-fade-in delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base lg:text-lg font-bold text-foreground">
                Nearby Resort
              </h2>
              <button className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                See All
              </button>
            </div>
            {/* Mobile: vertical list · Desktop: 2-column grid */}
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
              {nearbyProperties.map((prop, i) => (
                <PropertyCard key={i} {...prop} compact />
              ))}
            </div>
          </section>

          {/* ─── CTA Banner (mobile only — desktop has hero) ─── */}
          <section className="mb-8 lg:hidden animate-fade-in delay-300">
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
      </div>

      {/* ─── Navigation (mobile bottom bar + desktop sidebar) ─── */}
      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
