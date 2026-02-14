"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MatchReason {
  /** Icon or emoji for the reason */
  icon?: string;
  /** The preference category */
  category: string;
  /** Description of why it matches */
  description: string;
  /** Match strength (0-100) */
  strength?: number;
}

export interface MatchReasonsProps {
  /** List of match reasons */
  reasons: MatchReason[];
  /** Whether to animate on mount */
  animate?: boolean;
  /** Compact mode for card overlay */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

// Default icons for common categories
const CATEGORY_ICONS: Record<string, string> = {
  location: "📍",
  price: "💰",
  amenities: "✨",
  style: "🎨",
  vibe: "🌟",
  wifi: "📶",
  quiet: "🤫",
  nature: "🌿",
  beach: "🏖️",
  pool: "🏊",
  food: "🍽️",
  workspace: "💻",
  luxury: "👑",
  wellness: "🧘",
  nightlife: "🌙",
  culture: "🏛️",
  adventure: "🏔️",
  romantic: "💕",
  social: "👥",
  privacy: "🔒",
};

const getIcon = (category: string, customIcon?: string): string => {
  if (customIcon) return customIcon;
  const lower = category.toLowerCase();
  return CATEGORY_ICONS[lower] || "✓";
};

export function MatchReasons({
  reasons,
  animate = true,
  compact = false,
  className,
}: MatchReasonsProps) {
  if (reasons.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (compact) {
    // Compact mode: horizontal chips
    return (
      <motion.div
        className={cn("flex flex-wrap gap-1.5", className)}
        variants={animate ? containerVariants : undefined}
        initial={animate ? "hidden" : undefined}
        animate={animate ? "visible" : undefined}
      >
        {reasons.slice(0, 3).map((reason, index) => (
          <motion.div
            key={index}
            variants={animate ? itemVariants : undefined}
            className="flex items-center gap-1 px-2 py-1 bg-primary/20 backdrop-blur-sm rounded-full"
          >
            <span className="text-xs">{getIcon(reason.category, reason.icon)}</span>
            <span className="text-xs text-white font-medium">{reason.category}</span>
          </motion.div>
        ))}
        {reasons.length > 3 && (
          <motion.div
            variants={animate ? itemVariants : undefined}
            className="flex items-center px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full"
          >
            <span className="text-xs text-white/80">+{reasons.length - 3} more</span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Full mode: vertical list with descriptions
  return (
    <motion.div
      className={cn(
        "bg-primary/10 border border-primary/20 rounded-xl p-4",
        className
      )}
      variants={animate ? containerVariants : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "visible" : undefined}
    >
      <h3 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
        <span>✨</span> Why this fits you
      </h3>
      <ul className="space-y-2.5">
        {reasons.map((reason, index) => (
          <motion.li
            key={index}
            variants={animate ? itemVariants : undefined}
            className="flex items-start gap-3"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">
              {getIcon(reason.category, reason.icon)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {reason.category}
                </span>
                {reason.strength !== undefined && (
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${reason.strength}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {reason.strength}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {reason.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default MatchReasons;
