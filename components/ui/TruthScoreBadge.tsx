"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TruthScoreBadgeProps {
    /** Truth Score value (0-100) */
    score: number | null;
    /** Number of verified contributions */
    contributionCount?: number;
    /** Size variant */
    size?: "sm" | "md" | "lg";
    /** Custom className */
    className?: string;
}

const SIZE_CONFIG = {
    sm: {
        container: "px-1.5 py-0.5 gap-1",
        icon: "w-3 h-3",
        text: "text-[10px]",
        label: "text-[8px]",
    },
    md: {
        container: "px-2 py-1 gap-1.5",
        icon: "w-4 h-4",
        text: "text-xs",
        label: "text-[10px]",
    },
    lg: {
        container: "px-3 py-1.5 gap-2",
        icon: "w-5 h-5",
        text: "text-sm",
        label: "text-xs",
    },
};

function getScoreStyle(score: number | null) {
    if (score === null) return { bg: "bg-gray-100", text: "text-gray-400", ring: "ring-gray-200" };
    if (score >= 80) return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };
    if (score >= 60) return { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" };
    return { bg: "bg-gray-100", text: "text-gray-500", ring: "ring-gray-200" };
}

export function TruthScoreBadge({
    score,
    contributionCount = 0,
    size = "md",
    className,
}: TruthScoreBadgeProps) {
    const config = SIZE_CONFIG[size];
    const style = getScoreStyle(score);

    if (score === null && contributionCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "inline-flex items-center rounded-full ring-1",
                config.container,
                style.bg,
                style.ring,
                className
            )}
            title={
                contributionCount > 0
                    ? `Based on ${contributionCount} verified guest${contributionCount !== 1 ? "s" : ""}`
                    : "No verified data yet"
            }
        >
            {/* Shield/check icon */}
            <svg
                className={cn(config.icon, style.text)}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                {score !== null && score >= 60 && (
                    <path d="M9 12l2 2 4-4" />
                )}
            </svg>

            {/* Score text */}
            <span className={cn("font-bold leading-none", config.text, style.text)}>
                {score !== null ? score : "—"}
            </span>

            {/* Verified label for larger sizes */}
            {size === "lg" && contributionCount > 0 && (
                <span className={cn("font-medium opacity-70", config.label, style.text)}>
                    Verified
                </span>
            )}
        </motion.div>
    );
}

export default TruthScoreBadge;
