"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MatchScoreBadgeProps {
  /** Match score percentage (0-100) */
  score: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to animate the score on mount */
  animate?: boolean;
  /** Show label below score */
  showLabel?: boolean;
  /** Theme for text color contrast */
  theme?: "light" | "dark";
  /** Custom className */
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: "w-12 h-12",
    ring: 44,
    strokeWidth: 3,
    fontSize: "text-xs",
    labelSize: "text-[8px]",
  },
  md: {
    container: "w-16 h-16",
    ring: 60,
    strokeWidth: 4,
    fontSize: "text-sm",
    labelSize: "text-[10px]",
  },
  lg: {
    container: "w-24 h-24",
    ring: 88,
    strokeWidth: 5,
    fontSize: "text-xl",
    labelSize: "text-xs",
  },
};

export function MatchScoreBadge({
  score,
  size = "md",
  animate = true,
  showLabel = true,
  theme = "light",
  className,
}: MatchScoreBadgeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const config = SIZE_CONFIG[size];

  // Calculate ring dimensions
  const radius = (config.ring - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Animate score counting up
  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animate]);

  // Color based on score
  const getScoreColor = () => {
    if (theme === "dark") return "text-white";
    if (score >= 90) return "text-accent-success";
    if (score >= 75) return "text-primary";
    if (score >= 60) return "text-secondary";
    return "text-muted-foreground";
  };

  const getRingColor = () => {
    if (score >= 90) return "stroke-accent-success";
    if (score >= 75) return "stroke-primary";
    if (score >= 60) return "stroke-secondary";
    return "stroke-muted-foreground";
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        config.container,
        className
      )}
    >
      {/* Background ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={config.ring}
        height={config.ring}
        viewBox={`0 0 ${config.ring} ${config.ring}`}
      >
        <circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={config.ring / 2}
          cy={config.ring / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={getRingColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animate ? 1 : 0, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Score text */}
      <div className="relative flex flex-col items-center justify-center">
        <motion.span
          className={cn("font-bold leading-none", config.fontSize, getScoreColor())}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {displayScore}%
        </motion.span>
        {showLabel && (
          <motion.span
            className={cn("text-muted-foreground uppercase tracking-wider", config.labelSize)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Match
          </motion.span>
        )}
      </div>
    </div>
  );
}

export default MatchScoreBadge;
