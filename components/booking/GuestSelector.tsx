"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

export interface GuestCount {
  adults: number;
  children: number;
  rooms: number;
}

export interface GuestSelectorProps {
  /** Current guest selection */
  value: GuestCount;
  /** Called when guest count changes */
  onChange: (value: GuestCount) => void;
  /** Maximum adults per room */
  maxAdults?: number;
  /** Maximum children per room */
  maxChildren?: number;
  /** Maximum rooms */
  maxRooms?: number;
  /** Custom className */
  className?: string;
}

interface CounterProps {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

function Counter({ label, description, value, min = 0, max = 10, onChange }: CounterProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => canDecrement && onChange(value - 1)}
          disabled={!canDecrement}
          className={cn(
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
            canDecrement
              ? "border-border hover:border-primary hover:text-primary"
              : "border-border/50 text-muted-foreground/30 cursor-not-allowed"
          )}
          aria-label={`Decrease ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-8 text-center font-medium text-foreground">{value}</span>
        <button
          onClick={() => canIncrement && onChange(value + 1)}
          disabled={!canIncrement}
          className={cn(
            "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
            canIncrement
              ? "border-border hover:border-primary hover:text-primary"
              : "border-border/50 text-muted-foreground/30 cursor-not-allowed"
          )}
          aria-label={`Increase ${label}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function GuestSelector({
  value,
  onChange,
  maxAdults = 6,
  maxChildren = 4,
  maxRooms = 4,
  className,
}: GuestSelectorProps) {
  const handleAdultsChange = useCallback((adults: number) => {
    onChange({ ...value, adults });
  }, [value, onChange]);

  const handleChildrenChange = useCallback((children: number) => {
    onChange({ ...value, children });
  }, [value, onChange]);

  const handleRoomsChange = useCallback((rooms: number) => {
    onChange({ ...value, rooms });
  }, [value, onChange]);

  // Summary text
  const getSummary = () => {
    const parts = [];
    parts.push(`${value.adults} adult${value.adults !== 1 ? "s" : ""}`);
    if (value.children > 0) {
      parts.push(`${value.children} child${value.children !== 1 ? "ren" : ""}`);
    }
    parts.push(`${value.rooms} room${value.rooms !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  return (
    <div className={cn("bg-muted rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">Guests & Rooms</h3>
        <span className="text-sm text-muted-foreground">{getSummary()}</span>
      </div>

      <div className="divide-y divide-border">
        <Counter
          label="Adults"
          description="Age 13+"
          value={value.adults}
          min={1}
          max={maxAdults}
          onChange={handleAdultsChange}
        />
        <Counter
          label="Children"
          description="Age 0-12"
          value={value.children}
          min={0}
          max={maxChildren}
          onChange={handleChildrenChange}
        />
        <Counter
          label="Rooms"
          value={value.rooms}
          min={1}
          max={maxRooms}
          onChange={handleRoomsChange}
        />
      </div>
    </div>
  );
}

export default GuestSelector;
