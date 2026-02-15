"use client";

import { forwardRef, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
import MatchScoreBadge from "./MatchScoreBadge";

export interface SwipeCardProps {
  /** Unique identifier for the card */
  id: string;
  /** Main image URL */
  imageUrl: string;
  /** Hotel/property name */
  title: string;
  /** Location text */
  location?: string;
  /** Price per night */
  price?: string;
  /** Rating (0-5) */
  rating?: number;
  /** Tags/amenities to display */
  tags?: string[];
  /** Match score percentage (0-100) */
  matchScore?: number;
  /** Called when card is swiped right (like) */
  onSwipeRight?: (id: string) => void;
  /** Called when card is swiped left (nope) */
  onSwipeLeft?: (id: string) => void;
  /** Called when card is tapped for more info */
  onTap?: (id: string) => void;
  /** Swipe threshold in pixels */
  swipeThreshold?: number;
  /** Whether this card is active (top of stack) */
  isActive?: boolean;
  /** Card z-index in stack */
  zIndex?: number;
  /** Scale for stacked cards behind */
  scale?: number;
  /** Y offset for stacked cards */
  yOffset?: number;
  className?: string;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_RANGE = 15; // degrees

export const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(
  (
    {
      id,
      imageUrl,
      title,
      location,
      price,
      rating,
      tags = [],
      matchScore,
      onSwipeRight,
      onSwipeLeft,
      onTap,
      swipeThreshold = SWIPE_THRESHOLD,
      isActive = true,
      zIndex = 0,
      scale = 1,
      yOffset = 0,
      className,
    },
    ref
  ) => {
    // Track drag state to prevent tap on swipe
    const isDragging = useRef(false);
    const dragStartPos = useRef({ x: 0, y: 0 });

    // Motion values for drag
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Transform drag position to rotation
    const rotate = useTransform(x, [-200, 200], [-ROTATION_RANGE, ROTATION_RANGE]);

    // Transform for like/nope indicator opacity
    const likeOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
    const nopeOpacity = useTransform(x, [-swipeThreshold, 0], [1, 0]);

    // Background overlay opacity based on drag distance
    const overlayOpacity = useTransform(
      x,
      [-swipeThreshold * 1.5, -swipeThreshold, 0, swipeThreshold, swipeThreshold * 1.5],
      [0.3, 0.15, 0, 0.15, 0.3]
    );

    // Handle drag start
    const handleDragStart = useCallback(() => {
      isDragging.current = true;
      dragStartPos.current = { x: x.get(), y: y.get() };
    }, [x, y]);

    // Handle drag end
    const handleDragEnd = useCallback(
      (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Check if swipe threshold met (position or velocity)
        if (offset > swipeThreshold || velocity > 500) {
          onSwipeRight?.(id);
        } else if (offset < -swipeThreshold || velocity < -500) {
          onSwipeLeft?.(id);
        }

        // Reset drag state after a short delay
        setTimeout(() => {
          isDragging.current = false;
        }, 100);
      },
      [id, onSwipeRight, onSwipeLeft, swipeThreshold]
    );

    // Handle tap (only if not dragging)
    const handleTap = useCallback(() => {
      if (!isDragging.current && isActive && onTap) {
        onTap(id);
      }
    }, [id, isActive, onTap]);

    // Star rating display
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
      <motion.div
        ref={ref}
        className={cn(
          "absolute inset-0 select-none touch-none",
          isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
          className
        )}
        style={{
          x: isActive ? x : 0,
          y: isActive ? y : 0,
          rotate: isActive ? rotate : 0,
          scale,
          zIndex,
          translateY: yOffset,
        }}
        drag={isActive ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale, opacity: 1, y: yOffset }}
        exit={{
          x: x.get() > 0 ? 300 : -300,
          opacity: 0,
          rotate: x.get() > 0 ? 20 : -20,
          transition: { duration: 0.3 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        role="article"
        aria-label={`${title}${location ? ` in ${location}` : ""}`}
      >
        {/* Card Container */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Like Indicator */}
          <motion.div
            className="absolute top-8 right-8 rotate-12 border-4 border-accent-success rounded-lg px-4 py-2 z-10"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-accent-success font-bold text-2xl tracking-wider">
              LIKE
            </span>
          </motion.div>

          {/* Nope Indicator */}
          <motion.div
            className="absolute top-8 left-8 -rotate-12 border-4 border-accent-error rounded-lg px-4 py-2 z-10"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-accent-error font-bold text-2xl tracking-wider">
              NOPE
            </span>
          </motion.div>

          {/* Swipe Direction Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-5"
            style={{
              opacity: overlayOpacity,
              background: useTransform(x, (val) =>
                val > 0
                  ? "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3))"
                  : "linear-gradient(270deg, transparent, rgba(239, 68, 68, 0.3))"
              ),
            }}
          />

          {/* Match Score Badge */}
          {matchScore !== undefined && matchScore > 0 && (
            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-full p-1">
              <MatchScoreBadge
                score={matchScore}
                size="sm"
                animate={isActive}
                showLabel={false}
                theme="dark"
              />
            </div>
          )}

          {/* Info Button */}
          {isActive && onTap && (
            <button
              onClick={handleTap}
              className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-sm rounded-full text-white
                         hover:bg-black/60 transition-colors z-20 pointer-events-auto"
              aria-label="View details"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <h2 className="font-display text-2xl font-bold text-white mb-1 drop-shadow-lg">
              {title}
            </h2>
            {location && (
              <p className="text-white/80 text-sm mb-3 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                {location}
              </p>
            )}

            {/* Rating & Price */}
            <div className="flex items-center justify-between">
              {rating != null && (
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="text-white/70 text-sm ml-1">
                    ({rating.toFixed(1)})
                  </span>
                </div>
              )}
              {price && (
                <div className="text-right">
                  <span className="text-white font-bold text-xl">{price}</span>
                  <span className="text-white/70 text-sm"> / night</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

SwipeCard.displayName = "SwipeCard";

export default SwipeCard;
