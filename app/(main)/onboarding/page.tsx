"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SwipeStack, { SwipeItem } from "@/components/onboarding/SwipeStack";
import HotelDetailSheet, { HotelDetail } from "@/components/hotels/HotelDetailSheet";
import { useSwipes } from "@/lib/hooks";

// Extended hotel data for detail sheet
// In production, these come from LiteAPI with full details
interface ExtendedHotel extends SwipeItem {
  description: string;
  images: string[];
  amenities: string[];
  reviewCount: number;
  checkIn: string;
  checkOut: string;
  highlights?: string[];
  matchReasons?: string[];
}

const SAMPLE_HOTELS: ExtendedHotel[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    title: "Boutique Ocean Villa",
    location: "Bali, Indonesia",
    price: "$245",
    rating: 4.8,
    tags: ["Beachfront", "Pool", "Spa"],
    matchScore: 94,
    description: "Wake up to the sound of waves in this stunning beachfront villa. Featuring private pool, outdoor shower, and direct beach access. Perfect for digital nomads seeking paradise.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    ],
    amenities: ["Beachfront", "Pool", "Spa", "Free WiFi", "Air Conditioning", "Room Service"],
    reviewCount: 342,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    highlights: ["Infinity Pool", "Sunset Views", "Beach Club Access"],
    matchReasons: [
      "Matches your preference for beachfront properties",
      "Has the pool access you typically look for",
      "Strong WiFi for remote work (85 Mbps verified)",
    ],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    title: "Urban Loft Hotel",
    location: "Lisbon, Portugal",
    price: "$189",
    rating: 4.5,
    tags: ["City Center", "Rooftop Bar", "Coworking"],
    matchScore: 91,
    description: "Modern loft-style rooms in the heart of Lisbon. Walk to historic sites, trendy restaurants, and vibrant nightlife. Coworking space included for remote workers.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    ],
    amenities: ["City Center", "Rooftop Bar", "Coworking", "Fast WiFi", "Gym", "Breakfast"],
    reviewCount: 521,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    highlights: ["Rooftop Views", "Digital Nomad Friendly", "Historic District"],
    matchReasons: [
      "Dedicated coworking space like you prefer",
      "Central location matches your exploration style",
      "Price within your typical range",
    ],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    title: "Mountain Retreat Lodge",
    location: "Chiang Mai, Thailand",
    price: "$95",
    rating: 4.7,
    tags: ["Nature", "Quiet", "Breakfast"],
    matchScore: 87,
    description: "Escape to the mountains of Northern Thailand. This peaceful retreat offers stunning views, organic breakfast, and a perfect environment for focused work.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    ],
    amenities: ["Nature", "Quiet", "Breakfast", "Free WiFi", "Terrace", "Parking"],
    reviewCount: 189,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    highlights: ["Mountain Views", "Organic Food", "Meditation Space"],
    matchReasons: [
      "Quiet environment you've liked before",
      "Great value within your budget",
      "Breakfast included saves time",
    ],
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    title: "Luxury Beach Resort",
    location: "Phuket, Thailand",
    price: "$320",
    rating: 4.9,
    tags: ["5-Star", "Private Beach", "Gym"],
    matchScore: 78,
    description: "Five-star luxury on Thailand's most beautiful coastline. Private beach, world-class spa, and exceptional dining. The ultimate tropical escape.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    amenities: ["5-Star", "Private Beach", "Gym", "Spa", "Pool", "Concierge", "Restaurant"],
    reviewCount: 856,
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    highlights: ["Private Beach", "Butler Service", "Award-Winning Spa"],
    matchReasons: [
      "Beach access matches your preference",
      "Gym available for your fitness routine",
      "Higher price point than usual, but top-rated",
    ],
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    title: "Historic City Hotel",
    location: "Porto, Portugal",
    price: "$145",
    rating: 4.4,
    tags: ["Historic", "Restaurant", "Central"],
    matchScore: 82,
    description: "Stay in a beautifully restored 18th-century building in Porto's UNESCO district. Original architecture meets modern comfort.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    ],
    amenities: ["Historic", "Restaurant", "Central", "Free WiFi", "Bar", "Breakfast"],
    reviewCount: 412,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    highlights: ["UNESCO Heritage Site", "River Views", "Wine Cellar"],
    matchReasons: [
      "Central location for easy exploration",
      "Historic character you appreciate",
      "On-site restaurant for convenience",
    ],
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    title: "Modern Design Hotel",
    location: "Bangkok, Thailand",
    price: "$175",
    rating: 4.6,
    tags: ["Design", "Pool", "Fast WiFi"],
    matchScore: 96,
    description: "Award-winning design hotel in Bangkok's creative district. Perfect blend of style and functionality with lightning-fast internet.",
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    ],
    amenities: ["Design", "Pool", "Fast WiFi", "Coworking", "Gym", "Restaurant"],
    reviewCount: 328,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    highlights: ["Design Award Winner", "Rooftop Pool", "500 Mbps WiFi"],
    matchReasons: [
      "500 Mbps WiFi - perfect for video calls",
      "Design aesthetic matches your taste",
      "Coworking space available on-site",
    ],
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    title: "Tropical Garden Resort",
    location: "Ubud, Bali",
    price: "$210",
    rating: 4.8,
    tags: ["Yoga", "Vegan", "Meditation"],
    matchScore: 73,
    description: "Immerse yourself in Balinese wellness culture. Daily yoga classes, plant-based cuisine, and lush tropical gardens for complete rejuvenation.",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    amenities: ["Yoga", "Vegan", "Meditation", "Spa", "Pool", "Nature"],
    reviewCount: 267,
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    highlights: ["Daily Yoga", "Organic Garden", "Rice Terrace Views"],
    matchReasons: [
      "Nature setting for relaxation",
      "Pool access included",
      "Wellness focus may interest you",
    ],
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    title: "Riverside Boutique Inn",
    location: "Hoi An, Vietnam",
    price: "$85",
    rating: 4.5,
    tags: ["Riverside", "Bikes", "Tours"],
    matchScore: 89,
    description: "Charming boutique inn on the Thu Bon River. Free bicycles to explore the ancient town, and cooking classes to learn Vietnamese cuisine.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    ],
    amenities: ["Riverside", "Bikes", "Tours", "Breakfast", "Free WiFi", "Laundry"],
    reviewCount: 198,
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    highlights: ["Free Bicycles", "Cooking Classes", "Ancient Town"],
    matchReasons: [
      "Excellent value at $85/night",
      "Boutique experience you prefer",
      "Free bikes for local exploration",
    ],
  },
  {
    id: "9",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    title: "Minimalist Art Hotel",
    location: "Mexico City, Mexico",
    price: "$165",
    rating: 4.6,
    tags: ["Art", "Minimalist", "Terrace"],
    matchScore: 85,
    description: "Contemporary art hotel in Roma Norte. Curated gallery spaces, minimalist rooms, and a rooftop terrace with city views.",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    ],
    amenities: ["Art", "Minimalist", "Terrace", "Bar", "Free WiFi", "Restaurant"],
    reviewCount: 156,
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    highlights: ["Art Gallery", "Rooftop Bar", "Roma Norte Location"],
    matchReasons: [
      "Minimalist design you appreciate",
      "Roma Norte - trendy neighborhood",
      "Rooftop terrace for evening relaxation",
    ],
  },
  {
    id: "10",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    title: "Grand Palace Hotel",
    location: "Singapore",
    price: "$280",
    rating: 4.7,
    tags: ["Luxury", "Pool", "Concierge"],
    matchScore: 81,
    description: "Iconic luxury hotel in the heart of Singapore. Legendary service, stunning pool, and walking distance to Marina Bay.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    ],
    amenities: ["Luxury", "Pool", "Concierge", "Spa", "Gym", "Restaurant", "Bar"],
    reviewCount: 1203,
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    highlights: ["Marina Bay Views", "Award-Winning Restaurant", "Infinity Pool"],
    matchReasons: [
      "Pool access you consistently prefer",
      "Central Singapore location",
      "High rating from 1,200+ reviews",
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const swipeStackRef = useRef<HTMLDivElement>(null);
  const { swipe, undo, getProgress, error } = useSwipes();

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
  const getHotelDetail = (item: SwipeItem): HotelDetail => {
    const extended = SAMPLE_HOTELS.find((h) => h.id === item.id);
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
  };

  // Handle tap to open detail sheet
  const handleTap = useCallback((item: SwipeItem) => {
    setSelectedHotel(getHotelDetail(item));
    setIsDetailOpen(true);
  }, []);

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
    <main className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
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
          <p className="text-xs text-muted-foreground">
            Swipe to teach us your style
          </p>
        </div>

        <button
          onClick={() => router.push("/matches")}
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Swipe Stack */}
      <div ref={swipeStackRef} className="flex-1 overflow-hidden">
        <SwipeStack
          items={SAMPLE_HOTELS}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onTap={handleTap}
          onComplete={handleComplete}
          visibleCards={3}
        />
      </div>

      {/* Hotel Detail Sheet */}
      <HotelDetailSheet
        hotel={selectedHotel}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onLike={(hotel) => {
          // Like and close
          const item = SAMPLE_HOTELS.find((h) => h.id === hotel.id);
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
        <div className="fixed bottom-4 left-4 right-4 bg-accent-error text-white px-4 py-3 rounded-lg text-sm z-50">
          {error}
        </div>
      )}
    </main>
  );
}
