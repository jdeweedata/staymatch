"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SwipeStatsProps {
  totalSwipes: number;
  likes: number;
  dislikes: number;
  likeRatio: number;
  topLikedAmenities: string[];
}

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 800;
      const steps = 30;
      const stepDuration = duration / steps;
      const increment = value / steps;

      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span>{displayValue}</span>;
}

export function SwipeStats({
  totalSwipes,
  likes,
  dislikes,
  likeRatio,
  topLikedAmenities,
}: SwipeStatsProps) {
  const hasEnoughData = totalSwipes >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-surface-secondary to-white rounded-2xl p-5 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Match Insights</h2>
        <span className="text-xs text-text-tertiary bg-white px-2 py-1 rounded-full">
          From your swipes
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            <AnimatedNumber value={totalSwipes} />
          </div>
          <div className="text-xs text-text-secondary">Total Swipes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent-success">
            <AnimatedNumber value={likes} delay={100} />
          </div>
          <div className="text-xs text-text-secondary">Likes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-tertiary">
            <AnimatedNumber value={dislikes} delay={200} />
          </div>
          <div className="text-xs text-text-secondary">Passes</div>
        </div>
      </div>

      {/* Like Ratio Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-text-secondary">Selectivity</span>
          <span className="font-medium text-foreground">{likeRatio}% like rate</span>
        </div>
        <div className="h-2 bg-border/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${likeRatio}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-accent-success rounded-full"
          />
        </div>
      </div>

      {/* Top Preferences */}
      {hasEnoughData && topLikedAmenities.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-text-secondary mb-2">
            Top preferences learned
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topLikedAmenities.slice(0, 5).map((amenity, i) => (
              <motion.span
                key={amenity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="px-2.5 py-1 bg-white border border-border rounded-full text-xs text-foreground"
              >
                {amenity}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Retake Quiz Link */}
      <Link
        href="/onboarding"
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary/5 rounded-xl transition-colors"
      >
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Retake taste quiz
      </Link>
    </motion.div>
  );
}

export default SwipeStats;
