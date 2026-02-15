"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BottomSheet from "@/components/ui/BottomSheet";
import TruthScoreBadge from "@/components/ui/TruthScoreBadge";
import { cn } from "@/lib/utils";

export interface HotelDetail {
  id: string;
  name: string;
  location: string;
  description?: string;
  price: string;
  rating: number;
  reviewCount?: number;
  images: string[];
  amenities: string[];
  highlights?: string[];
  checkIn?: string;
  checkOut?: string;
  matchScore?: number;
  matchReasons?: string[];
  truthScore?: number | null;
  truthConfidence?: number | null;
  contributionCount?: number;
  avgWifiDownload?: number | null;
  avgWifiUpload?: number | null;
  avgNoiseLevel?: number | null;
  verifiedAmenities?: Array<{ name: string; verified: boolean }>;
}

export interface HotelDetailSheetProps {
  hotel: HotelDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onBook?: (hotel: HotelDetail) => void;
  onLike?: (hotel: HotelDetail) => void;
}

// Amenity icons mapping
const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  "free wifi": "📶",
  "fast wifi": "📶",
  pool: "🏊",
  "swimming pool": "🏊",
  gym: "💪",
  fitness: "💪",
  spa: "🧖",
  restaurant: "🍽️",
  bar: "🍸",
  "rooftop bar": "🍸",
  parking: "🅿️",
  "free parking": "🅿️",
  breakfast: "🥐",
  "free breakfast": "🥐",
  "air conditioning": "❄️",
  ac: "❄️",
  beach: "🏖️",
  beachfront: "🏖️",
  "private beach": "🏖️",
  balcony: "🌅",
  terrace: "🌅",
  kitchen: "🍳",
  laundry: "🧺",
  concierge: "🛎️",
  "room service": "🛎️",
  "pet friendly": "🐕",
  pets: "🐕",
  coworking: "💻",
  workspace: "💻",
  yoga: "🧘",
  meditation: "🧘",
  bikes: "🚲",
  tours: "🗺️",
  nature: "🌿",
  quiet: "🤫",
  historic: "🏛️",
  design: "✨",
  art: "🎨",
  luxury: "👑",
  "5-star": "⭐",
  minimalist: "◻️",
  vegan: "🥗",
  central: "📍",
  "city center": "📍",
};

const getAmenityIcon = (amenity: string): string => {
  const lower = amenity.toLowerCase();
  return AMENITY_ICONS[lower] || "✓";
};

export function HotelDetailSheet({
  hotel,
  isOpen,
  onClose,
  onBook,
  onLike,
}: HotelDetailSheetProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!hotel) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={cn(
          "text-sm",
          i < Math.floor(rating) ? "text-accent-warning" : "text-muted-foreground"
        )}
      >
        {i < Math.floor(rating) ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[0.85, 0.95]}>
      <div className="flex flex-col">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-[16/10] overflow-hidden">
            <motion.img
              key={activeImageIndex}
              src={hotel.images[activeImageIndex]}
              alt={`${hotel.name} - Image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Image indicators */}
          {hotel.images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === activeImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Match Score Badge */}
          {hotel.matchScore && (
            <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
              <span className="font-bold">{hotel.matchScore}%</span>
              <span className="text-white/80 text-sm ml-1">Match</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {hotel.name}
              </h2>
              <div className="text-right shrink-0">
                <span className="text-foreground font-bold text-xl">{hotel.price}</span>
                <span className="text-muted-foreground text-sm"> / night</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-muted-foreground">{hotel.location}</span>
            </div>

            {hotel.rating != null && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">{renderStars(hotel.rating)}</div>
                <span className="text-foreground font-medium">{hotel.rating.toFixed(1)}</span>
                {hotel.reviewCount && (
                  <span className="text-muted-foreground text-sm">
                    ({hotel.reviewCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Match Reasons */}
          {hotel.matchReasons && hotel.matchReasons.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                <span>✨</span> Why this fits you
              </h3>
              <ul className="space-y-1.5">
                {hotel.matchReasons.map((reason, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verified Guest Data (Truth Engine) */}
          {hotel.truthScore != null && (hotel.contributionCount ?? 0) > 0 && (
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Verified Guest Data
                </h3>
                <TruthScoreBadge score={hotel.truthScore} contributionCount={hotel.contributionCount} size="md" />
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Based on {hotel.contributionCount} verified guest{(hotel.contributionCount ?? 0) !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {hotel.avgWifiDownload != null && (
                  <div className="bg-background rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">WiFi Speed</p>
                    <p className="text-sm font-bold text-foreground">{hotel.avgWifiDownload.toFixed(0)} Mbps</p>
                    {hotel.avgWifiUpload != null && (
                      <p className="text-[10px] text-muted-foreground">↑ {hotel.avgWifiUpload.toFixed(0)} Mbps</p>
                    )}
                  </div>
                )}
                {hotel.avgNoiseLevel != null && (
                  <div className="bg-background rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Noise Level</p>
                    <p className="text-sm font-bold text-foreground">
                      {hotel.avgNoiseLevel <= 2 ? "Quiet" : hotel.avgNoiseLevel <= 3.5 ? "Moderate" : "Noisy"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{hotel.avgNoiseLevel.toFixed(1)} / 5</p>
                  </div>
                )}
              </div>

              {hotel.verifiedAmenities && hotel.verifiedAmenities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hotel.verifiedAmenities.map((amenity) => (
                    <span
                      key={amenity.name}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        amenity.verified
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-red-50 text-red-600 ring-1 ring-red-200"
                      )}
                    >
                      {amenity.verified ? "✓" : "✗"} {amenity.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {hotel.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
              <p className="text-foreground leading-relaxed">{hotel.description}</p>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {hotel.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                >
                  <span className="text-base">{getAmenityIcon(amenity)}</span>
                  <span className="text-sm text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in/out */}
          {(hotel.checkIn || hotel.checkOut) && (
            <div className="flex gap-4">
              {hotel.checkIn && (
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="text-foreground font-medium">{hotel.checkIn}</p>
                </div>
              )}
              {hotel.checkOut && (
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="text-foreground font-medium">{hotel.checkOut}</p>
                </div>
              )}
            </div>
          )}

          {/* Highlights */}
          {hotel.highlights && hotel.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Highlights</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3 safe-bottom">
          {onLike && (
            <button
              onClick={() => onLike(hotel)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5 text-accent-success"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Save
            </button>
          )}
          {onBook && (
            <button
              onClick={() => onBook(hotel)}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              Book Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

export default HotelDetailSheet;
