"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import CategoryPill from "@/components/ui/CategoryPill";
import PropertyCard from "@/components/ui/PropertyCard";
import BottomNav from "@/components/ui/BottomNav";

// Hotel data shape from LiteAPI
interface HotelData {
    id?: string;
    name: string;
    image?: string;
    main_photo?: string;
    city?: string;
    country?: string;
    starRating?: number;
    price?: number;
    currency?: string;
}

// Define interface for the data passed from Server Component
interface LandingPageData {
    recommended: HotelData[];
    nearby: HotelData[];
}

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

export default function HomePage({ recommended, nearby }: LandingPageData) {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("bali");
    const [activeNav, setActiveNav] = useState("explore");

    // Map backend data to PropertyCard props
    const mapHotelToCard = (hotel: HotelData) => ({
        image: hotel.image || hotel.main_photo || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", // Fallback
        title: hotel.name,
        location: hotel.city || hotel.country || "Unknown Location",
        rating: hotel.starRating || 4.5,
        price: Math.round(hotel.price ?? 0),
        currency: hotel.currency === "USD" ? "$" : hotel.currency,
        period: "night",
        badge: undefined,
    });

    return (
        <main className="min-h-screen bg-background pb-24 lg:pb-0 font-sans">
            {/* ─── Desktop Header ─── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
                {/* Mobile header */}
                <div className="lg:hidden max-w-lg mx-auto px-5 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs text-text-secondary mb-1">Welcome back 👋</p>
                            <Image
                                src="/staymatch_logo.svg"
                                alt="StayMatch"
                                width={140}
                                height={30}
                                className="h-8 w-auto"
                            />
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
                            <button
                                type="button"
                                onClick={() => router.push("/onboarding")}
                                className="bg-white text-primary font-semibold px-7 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-md hover:shadow-lg cursor-pointer"
                            >
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
                            <button
                                onClick={() => router.push("/onboarding")}
                                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                            >
                                See All
                            </button>
                        </div>
                        {/* Mobile: horizontal scroll · Desktop: responsive grid */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
                            {recommended.length > 0 ? (
                                recommended.map((hotel, i) => (
                                    <div key={i} onClick={() => router.push("/booking")} className="cursor-pointer">
                                        <PropertyCard {...mapHotelToCard(hotel)} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No recommended hotels found at the moment.</div>
                            )}
                        </div>
                    </section>

                    {/* ─── Nearby Resort ─── */}
                    <section className="mt-8 lg:mt-10 mb-6 animate-fade-in delay-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base lg:text-lg font-bold text-foreground">
                                Nearby Resort
                            </h2>
                            <button
                                onClick={() => router.push("/onboarding")}
                                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                            >
                                See All
                            </button>
                        </div>
                        {/* Mobile: vertical list · Desktop: 2-column grid */}
                        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
                            {nearby.length > 0 ? (
                                nearby.map((hotel, i) => (
                                    <div key={i} onClick={() => router.push("/booking")} className="cursor-pointer">
                                        <PropertyCard {...mapHotelToCard(hotel)} compact />
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No nearby resorts found.</div>
                            )}
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
                                <button
                                    type="button"
                                    onClick={() => router.push("/onboarding")}
                                    className="bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors text-sm cursor-pointer"
                                >
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
