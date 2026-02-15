"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TagOption {
  id: string;
  label: string;
  icon?: string;
}

export interface TagPickerProps {
  /** Available tag options */
  options: TagOption[];
  /** Currently selected tag IDs */
  selected: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Maximum number of selections (optional) */
  maxSelections?: number;
  /** Label shown above picker */
  label?: string;
  /** Additional className */
  className?: string;
}

export function TagPicker({
  options,
  selected,
  onChange,
  maxSelections,
  label,
  className,
}: TagPickerProps) {
  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      // Remove from selection
      onChange(selected.filter((s) => s !== id));
    } else {
      // Add to selection if within limit
      if (maxSelections && selected.length >= maxSelections) {
        return;
      }
      onChange([...selected, id]);
    }
  };

  const isAtLimit = maxSelections ? selected.length >= maxSelections : false;

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{label}</h3>
          {maxSelections && (
            <span className="text-xs text-text-secondary">
              {selected.length}/{maxSelections}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          const isDisabled = !isSelected && isAtLimit;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.id)}
              disabled={isDisabled}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium",
                "transition-all duration-200 border-2",
                "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1",
                isSelected
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-surface-secondary border-transparent text-text-secondary hover:border-border hover:text-foreground",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
              aria-pressed={isSelected}
            >
              {option.icon && <span className="text-base">{option.icon}</span>}
              <span>{option.label}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-0.5"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default TagPicker;
