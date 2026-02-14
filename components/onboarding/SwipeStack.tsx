"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "@/components/ui/SwipeCard";
import { cn } from "@/lib/utils";

export interface SwipeItem {
  id: string;
  imageUrl: string;
  title: string;
  location?: string;
  price?: string;
  rating?: number;
  tags?: string[];
  matchScore?: number;
}

export interface SwipeStackProps {
  /** Array of items to display in the stack */
  items: SwipeItem[];
  /** Called when an item is swiped right (liked) */
  onSwipeRight?: (item: SwipeItem) => void;
  /** Called when an item is swiped left (disliked) */
  onSwipeLeft?: (item: SwipeItem) => void;
  /** Called when an item is tapped for details */
  onTap?: (item: SwipeItem) => void;
  /** Called when all items have been swiped */
  onComplete?: (results: { liked: SwipeItem[]; disliked: SwipeItem[] }) => void;
  /** Called when undo button is clicked (before local state is restored) */
  onUndo?: () => void;
  /** Number of cards visible in the stack */
  visibleCards?: number;
  /** Custom className */
  className?: string;
}

export function SwipeStack({
  items,
  onSwipeRight,
  onSwipeLeft,
  onTap,
  onComplete,
  onUndo,
  visibleCards = 3,
  className,
}: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<SwipeItem[]>([]);
  const [disliked, setDisliked] = useState<SwipeItem[]>([]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(currentIndex, currentIndex + visibleCards);
  }, [items, currentIndex, visibleCards]);

  // Handle swipe right (like)
  const handleSwipeRight = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        const newLiked = [...liked, item];
        setLiked(newLiked);
        onSwipeRight?.(item);

        // Move to next card
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Check if complete
        if (nextIndex >= items.length) {
          onComplete?.({ liked: newLiked, disliked });
        }
      }
    },
    [items, liked, disliked, currentIndex, onSwipeRight, onComplete]
  );

  // Handle swipe left (nope)
  const handleSwipeLeft = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        const newDisliked = [...disliked, item];
        setDisliked(newDisliked);
        onSwipeLeft?.(item);

        // Move to next card
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Check if complete
        if (nextIndex >= items.length) {
          onComplete?.({ liked, disliked: newDisliked });
        }
      }
    },
    [items, liked, disliked, currentIndex, onSwipeLeft, onComplete]
  );

  // Handle tap for details
  const handleTap = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        onTap?.(item);
      }
    },
    [items, onTap]
  );

  // Handle button clicks for accessibility
  const handleLikeClick = useCallback(() => {
    if (visibleItems.length > 0) {
      handleSwipeRight(visibleItems[0].id);
    }
  }, [visibleItems, handleSwipeRight]);

  const handleNopeClick = useCallback(() => {
    if (visibleItems.length > 0) {
      handleSwipeLeft(visibleItems[0].id);
    }
  }, [visibleItems, handleSwipeLeft]);

  // Progress indicator
  const progress = items.length > 0 ? (currentIndex / items.length) * 100 : 0;

  // Empty state
  if (visibleItems.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full text-center px-6",
          className
        )}
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          All Done!
        </h2>
        <p className="text-muted-foreground mb-4">
          You&apos;ve swiped through all {items.length} properties
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-accent-success">
            {liked.length} liked
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-accent-error">
            {disliked.length} passed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {currentIndex + 1} of {items.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative flex-1 mx-4 my-2">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => {
            const isActive = index === 0;
            const stackIndex = visibleItems.length - 1 - index;

            return (
              <SwipeCard
                key={item.id}
                {...item}
                isActive={isActive}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onTap={handleTap}
                zIndex={stackIndex}
                scale={1 - index * 0.05}
                yOffset={index * 8}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 py-6 px-4">
        {/* Nope Button */}
        <button
          onClick={handleNopeClick}
          className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center
                     hover:bg-accent-error/10 hover:border-accent-error transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-accent-error focus:ring-offset-2 focus:ring-offset-background
                     active:scale-95"
          aria-label="Pass on this property"
        >
          <svg
            className="w-8 h-8 text-accent-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Undo Button (optional) */}
        <button
          onClick={() => {
            if (currentIndex > 0) {
              onUndo?.();
              setCurrentIndex(currentIndex - 1);
              // Remove from liked/disliked
              const lastItem = items[currentIndex - 1];
              setLiked((prev) => prev.filter((i) => i.id !== lastItem.id));
              setDisliked((prev) => prev.filter((i) => i.id !== lastItem.id));
            }
          }}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center
                     hover:bg-muted/80 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Undo last swipe"
        >
          <svg
            className="w-5 h-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center
                     hover:bg-accent-success/10 hover:border-accent-success transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-accent-success focus:ring-offset-2 focus:ring-offset-background
                     active:scale-95"
          aria-label="Like this property"
        >
          <svg
            className="w-8 h-8 text-accent-success"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="flex justify-center gap-4 pb-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-muted rounded border border-border">←</kbd>
          Pass
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-muted rounded border border-border">→</kbd>
          Like
        </span>
      </div>
    </div>
  );
}

export default SwipeStack;
