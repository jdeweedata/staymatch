"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SwipeStack, { SwipeItem } from "@/components/onboarding/SwipeStack";
import HotelDetailSheet, { HotelDetail } from "@/components/hotels/HotelDetailSheet";
import BottomNav from "@/components/ui/BottomNav";
import { useSwipes } from "@/lib/hooks";

// Extended hotel data for detail sheet
interface ExtendedHotel extends SwipeItem {
  description: string;
  images: string[];
  amenities: string[];
  reviewCount?: number;
  checkIn?: string;
  checkOut?: string;
  highlights?: string[];
  matchReasons?: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("match");
  const [hotels, setHotels] = useState<ExtendedHotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const swipeStackRef = useRef<HTMLDivElement>(null);
  const { swipe, undo, getProgress, error } = useSwipes();

  // Fetch hotels from API on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetch("/api/hotels/swipe-deck");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load hotels");
        }

        if (!data.items || data.items.length === 0) {
          throw new Error("No hotels available. Please try again later.");
        }

        // Transform API response to ExtendedHotel format
        const transformedHotels: ExtendedHotel[] = data.items.map(
          (item: {
            id: string;
            hotelId: string;
            imageUrl: string;
            title: string;
            location: string;
            rating: number | null;
            price: string;
            tags: string[];
            matchScore: number;
            description: string;
            images: string[];
            amenities: string[];
          }) => ({
            id: item.id, // HotelImage ID for swipe API
            imageUrl: item.imageUrl,
            title: item.title,
            location: item.location,
            price: item.price,
            rating: item.rating,
            tags: item.tags,
            matchScore: item.matchScore,
            description: item.description,
            images: item.images,
            amenities: item.amenities,
            reviewCount: Math.floor(Math.random() * 500) + 100,
            checkIn: "3:00 PM",
            checkOut: "11:00 AM",
            matchReasons: [
              `Located in ${item.location.split(",")[0]}`,
              item.tags[0] ? `Features ${item.tags[0].toLowerCase()}` : null,
              item.rating && item.rating >= 4 ? `Highly rated (${item.rating} stars)` : null,
            ].filter(Boolean) as string[],
          })
        );

        setHotels(transformedHotels);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setLoadError(err instanceof Error ? err.message : "Failed to load hotels");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Check progress on mount - redirect if already complete
  useEffect(() => {
    const checkProgress = async () => {
      const progress = await getProgress();
      if (progress?.isComplete) {
        router.push("/matches");
      }
    };
    checkProgress();
  }, [getProgress, router]);

  // Convert SwipeItem to HotelDetail for the detail sheet
  const getHotelDetail = useCallback((item: SwipeItem): HotelDetail => {
    const extended = hotels.find((h) => h.id === item.id);
    return {
      id: item.id,
      name: item.title,
      location: item.location || "",
      description: extended?.description || "",
      price: item.price || "",
      rating: item.rating || 0,
      reviewCount: extended?.reviewCount || 0,
      images: extended?.images || [item.imageUrl],
      amenities: extended?.amenities || item.tags || [],
      highlights: extended?.highlights,
      checkIn: extended?.checkIn,
      checkOut: extended?.checkOut,
      matchScore: item.matchScore,
      matchReasons: extended?.matchReasons,
    };
  }, [hotels]);

  // Handle tap to open detail sheet
  const handleTap = useCallback((item: SwipeItem) => {
    setSelectedHotel(getHotelDetail(item));
    setIsDetailOpen(true);
  }, [getHotelDetail]);

  // Handle close detail sheet
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    // Clear selected hotel after animation
    setTimeout(() => setSelectedHotel(null), 300);
  }, []);

  // Handle swipe completion
  const handleComplete = useCallback(
    async (results: { liked: SwipeItem[]; disliked: SwipeItem[] }) => {
      setIsComplete(true);

      // In production: Send swipes to API to compute taste vector
      console.log("Swipe results:", results);

      // Store liked IDs in session for now
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "onboarding_likes",
          JSON.stringify(results.liked.map((h) => h.id))
        );
      }

      // Short delay then navigate
      setTimeout(() => {
        router.push("/matches");
      }, 2000);
    },
    [router]
  );

  // Track individual swipes (for analytics/API)
  const handleSwipeRight = useCallback(
    async (item: SwipeItem) => {
      console.log("Liked:", item.title);
      const result = await swipe(item.id, "RIGHT");
      if (result?.isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          router.push("/matches");
        }, 2000);
      }
    },
    [swipe, router]
  );

  const handleSwipeLeft = useCallback(
    async (item: SwipeItem) => {
      console.log("Passed:", item.title);
      await swipe(item.id, "LEFT");
    },
    [swipe]
  );

  const handleUndo = useCallback(async () => {
    await undo();
  }, [undo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keys when detail sheet is open
      if (isDetailOpen) return;

      // Simulate button clicks based on arrow keys
      if (e.key === "ArrowLeft") {
        const nopeBtn = document.querySelector('[aria-label="Pass on this property"]');
        if (nopeBtn instanceof HTMLButtonElement) {
          nopeBtn.click();
        }
      } else if (e.key === "ArrowRight") {
        const likeBtn = document.querySelector('[aria-label="Like this property"]');
        if (likeBtn instanceof HTMLButtonElement) {
          likeBtn.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailOpen]);

  return (
    <main className="h-screen flex flex-col bg-background lg:ml-[220px]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/50">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="text-center">
            <h1 className="font-display text-lg font-semibold text-foreground">
              Build Your Taste
            </h1>
            <p className="text-xs text-text-secondary">
              Swipe to teach us your style
            </p>
          </div>

          <button
            onClick={() => router.push("/matches")}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Build Your Taste</h1>
              <p className="text-sm text-text-secondary">Swipe through hotels to teach us your preferences</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/matches")}
            className="btn-secondary"
          >
            Skip for Now
          </button>
        </div>
      </header>

      {/* Swipe Stack */}
      <div ref={swipeStackRef} className="flex-1 overflow-hidden pb-20 lg:pb-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading hotels...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent-error/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-accent-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Unable to Load Hotels</h2>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : (
          <SwipeStack
            items={hotels}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onTap={handleTap}
            onComplete={handleComplete}
            onUndo={handleUndo}
            visibleCards={3}
          />
        )}
      </div>

      {/* Hotel Detail Sheet */}
      <HotelDetailSheet
        hotel={selectedHotel}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onLike={(hotel) => {
          // Like and close
          const item = hotels.find((h) => h.id === hotel.id);
          if (item) {
            handleSwipeRight(item);
          }
          handleCloseDetail();
        }}
      />

      {/* Loading overlay when complete */}
      {isComplete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground font-medium">
              Computing your taste profile...
            </p>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-24 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-accent-error text-white px-4 py-3 rounded-lg text-sm z-50">
          {error}
        </div>
      )}

      {/* Bottom navigation */}
      <BottomNav activeId={activeNav} onSelect={setActiveNav} />
    </main>
  );
}
