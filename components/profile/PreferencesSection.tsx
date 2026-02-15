"use client";

import { motion } from "framer-motion";
import { BUDGET_RANGES, STAR_RATINGS, type BudgetRange } from "@/lib/constants/preferences";

interface PreferencesSectionProps {
  budgetRange: string | undefined;
  minStarRating: number | undefined;
  onUpdateBudget: (budgetId: string) => void;
  onUpdateStarRating: (rating: number) => void;
  isSaving?: boolean;
}

export function PreferencesSection({
  budgetRange,
  minStarRating,
  onUpdateBudget,
  onUpdateStarRating,
  isSaving = false,
}: PreferencesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Budget Range */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Budget per night
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BUDGET_RANGES.map((range: BudgetRange) => {
            const isSelected = budgetRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onUpdateBudget(range.id)}
                disabled={isSaving}
                className={`
                  relative px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 border-2
                  focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1
                  ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-border text-text-secondary hover:border-primary/30 hover:text-foreground"
                  }
                  ${isSaving ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                {range.label}
                {isSelected && (
                  <motion.div
                    layoutId="budget-check"
                    className="absolute top-1 right-1"
                  >
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Minimum star rating
        </h3>
        <div className="flex gap-2">
          {STAR_RATINGS.map((rating) => {
            const isSelected = minStarRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onUpdateStarRating(rating)}
                disabled={isSaving}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200 border-2
                  focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1
                  ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-border text-text-secondary hover:border-primary/30 hover:text-foreground"
                  }
                  ${isSaving ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                <span>{rating}</span>
                <svg
                  className={`w-4 h-4 ${isSelected ? "text-primary" : "text-accent-warning"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-text-tertiary">+</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          We&apos;ll only show you hotels rated {minStarRating || 3} stars and above
        </p>
      </div>
    </motion.div>
  );
}

export default PreferencesSection;
