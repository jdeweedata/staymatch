"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  /** Selected check-in date */
  checkIn: Date | null;
  /** Selected check-out date */
  checkOut: Date | null;
  /** Called when dates change */
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  /** Minimum selectable date (default: today) */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Custom className */
  className?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DatePicker({
  checkIn,
  checkOut,
  onChange,
  minDate = new Date(),
  maxDate,
  className,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = checkIn || new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");

  // Get days in month
  const getDaysInMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }, []);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (Date | null)[] = [];

    // Add empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  }, [currentMonth, getDaysInMonth, getFirstDayOfMonth]);

  // Check if date is disabled
  const isDisabled = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate < today) return true;
    if (minDate && compareDate < minDate) return true;
    if (maxDate && compareDate > maxDate) return true;
    return false;
  }, [minDate, maxDate]);

  // Check if date is selected
  const isSelected = useCallback((date: Date) => {
    if (!date) return false;
    const dateStr = date.toDateString();
    return checkIn?.toDateString() === dateStr || checkOut?.toDateString() === dateStr;
  }, [checkIn, checkOut]);

  // Check if date is in range
  const isInRange = useCallback((date: Date) => {
    if (!checkIn || !checkOut || !date) return false;
    return date > checkIn && date < checkOut;
  }, [checkIn, checkOut]);

  // Handle date selection
  const handleDateClick = useCallback((date: Date) => {
    if (isDisabled(date)) return;

    if (selecting === "checkIn") {
      onChange(date, null);
      setSelecting("checkOut");
    } else {
      if (checkIn && date <= checkIn) {
        // If selected date is before check-in, reset
        onChange(date, null);
        setSelecting("checkOut");
      } else {
        onChange(checkIn, date);
        setSelecting("checkIn");
      }
    }
  }, [selecting, checkIn, onChange, isDisabled]);

  // Navigate months
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }, [currentMonth]);

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  return (
    <div className={cn("bg-muted rounded-xl p-4", className)}>
      {/* Date Selection Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelecting("checkIn")}
          className={cn(
            "flex-1 p-3 rounded-lg text-left transition-all",
            selecting === "checkIn"
              ? "bg-primary/20 border-2 border-primary"
              : "bg-card border-2 border-transparent hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground mb-1">Check-in</p>
          <p className={cn(
            "font-medium",
            checkIn ? "text-foreground" : "text-muted-foreground"
          )}>
            {formatDate(checkIn)}
          </p>
        </button>
        <button
          onClick={() => setSelecting("checkOut")}
          className={cn(
            "flex-1 p-3 rounded-lg text-left transition-all",
            selecting === "checkOut"
              ? "bg-primary/20 border-2 border-primary"
              : "bg-card border-2 border-transparent hover:border-border"
          )}
        >
          <p className="text-xs text-muted-foreground mb-1">Check-out</p>
          <p className={cn(
            "font-medium",
            checkOut ? "text-foreground" : "text-muted-foreground"
          )}>
            {formatDate(checkOut)}
          </p>
        </button>
      </div>

      {/* Nights indicator */}
      {nights > 0 && (
        <div className="text-center text-sm text-muted-foreground mb-4">
          {nights} night{nights !== 1 ? "s" : ""}
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-lg hover:bg-card transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-medium text-foreground">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-card transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disabled = isDisabled(date);
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const isCheckIn = checkIn?.toDateString() === date.toDateString();
            const isCheckOut = checkOut?.toDateString() === date.toDateString();

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                  disabled && "text-muted-foreground/30 cursor-not-allowed",
                  !disabled && !selected && !inRange && "hover:bg-card text-foreground",
                  inRange && "bg-primary/10 text-foreground",
                  selected && "bg-primary text-white",
                  isCheckIn && checkOut && "rounded-r-none",
                  isCheckOut && checkIn && "rounded-l-none",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default DatePicker;
