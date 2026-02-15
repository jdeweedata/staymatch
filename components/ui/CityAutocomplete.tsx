"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCitySearch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { City } from "@/lib/services/liteapi";

interface RecentSearch {
  cityCode: string;
  cityName: string;
  countryCode: string;
  searchedAt: string;
}

interface CityAutocompleteProps {
  value: City | null;
  onChange: (city: City | null) => void;
  placeholder?: string;
  className?: string;
  showRecent?: boolean;
}

export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Search cities...",
  className,
  showRecent = true,
}: CityAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isLoading, search, clear } = useCitySearch(300);

  // Fetch recent searches on mount (if authenticated)
  useEffect(() => {
    if (!showRecent) return;

    const fetchRecent = async () => {
      setIsLoadingRecent(true);
      try {
        const res = await fetch("/api/cities/recent");
        if (res.ok) {
          const data = await res.json();
          setRecentSearches(data.recentSearches || []);
        }
      } catch {
        // Ignore errors (user might not be authenticated)
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecent();
  }, [showRecent]);

  // Update input value when external value changes
  useEffect(() => {
    if (value) {
      setInputValue(value.name);
    }
  }, [value]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      search(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);
    },
    [search]
  );

  // Handle city selection
  const handleSelect = useCallback(
    async (city: City) => {
      setInputValue(city.name);
      onChange(city);
      setIsOpen(false);
      clear();

      // Add to recent searches
      if (showRecent) {
        try {
          await fetch("/api/cities/recent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cityCode: city.code,
              cityName: city.name,
              countryCode: city.countryCode,
            }),
          });
          // Refresh recent searches
          const res = await fetch("/api/cities/recent");
          if (res.ok) {
            const data = await res.json();
            setRecentSearches(data.recentSearches || []);
          }
        } catch {
          // Ignore errors
        }
      }
    },
    [onChange, clear, showRecent]
  );

  // Handle recent search selection
  const handleSelectRecent = useCallback(
    (recent: RecentSearch) => {
      const city: City = {
        code: recent.cityCode,
        name: recent.cityName,
        country: "",
        countryCode: recent.countryCode,
      };
      handleSelect(city);
    },
    [handleSelect]
  );

  // Handle clear recent searches
  const handleClearRecent = useCallback(async () => {
    try {
      await fetch("/api/cities/recent", { method: "DELETE" });
      setRecentSearches([]);
    } catch {
      // Ignore errors
    }
  }, []);

  // Handle clear input
  const handleClear = useCallback(() => {
    setInputValue("");
    onChange(null);
    clear();
    inputRef.current?.focus();
  }, [onChange, clear]);

  // Build combined list for keyboard navigation
  const allItems: Array<{ type: "recent" | "result"; data: City | RecentSearch }> = [];

  if (inputValue.length === 0 && recentSearches.length > 0) {
    recentSearches.forEach((r) => allItems.push({ type: "recent", data: r }));
  }

  results.forEach((r) => allItems.push({ type: "result", data: r }));

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setIsOpen(true);
          return;
        }
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < allItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < allItems.length) {
            const item = allItems[highlightedIndex];
            if (item.type === "recent") {
              handleSelectRecent(item.data as RecentSearch);
            } else {
              handleSelect(item.data as City);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, allItems, highlightedIndex, handleSelect, handleSelectRecent]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown =
    isOpen &&
    (results.length > 0 ||
      (inputValue.length === 0 && recentSearches.length > 0) ||
      isLoading);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-foreground"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-lg overflow-hidden max-h-72 overflow-y-auto"
          >
            {/* Loading */}
            {isLoading && (
              <div className="px-4 py-3 flex items-center gap-2 text-text-secondary">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Searching...
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading &&
              inputValue.length === 0 &&
              recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 flex items-center justify-between bg-surface-secondary">
                    <span className="text-xs font-medium text-text-secondary">
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={handleClearRecent}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((recent, index) => (
                    <button
                      key={recent.cityCode}
                      type="button"
                      onClick={() => handleSelectRecent(recent)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-surface-secondary transition-colors",
                        highlightedIndex === index && "bg-surface-secondary"
                      )}
                    >
                      <svg
                        className="w-4 h-4 text-text-tertiary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-foreground">{recent.cityName}</span>
                    </button>
                  ))}
                </div>
              )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div>
                {inputValue.length === 0 && recentSearches.length > 0 && (
                  <div className="px-4 py-2 bg-surface-secondary">
                    <span className="text-xs font-medium text-text-secondary">
                      Suggestions
                    </span>
                  </div>
                )}
                {results.map((city, index) => {
                  const itemIndex =
                    inputValue.length === 0
                      ? recentSearches.length + index
                      : index;
                  return (
                    <button
                      key={city.code}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-surface-secondary transition-colors",
                        highlightedIndex === itemIndex && "bg-surface-secondary"
                      )}
                    >
                      <svg
                        className="w-4 h-4 text-text-tertiary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                      <div>
                        <div className="text-foreground">{city.name}</div>
                        <div className="text-xs text-text-secondary">
                          {city.country || city.countryCode}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!isLoading &&
              inputValue.length >= 2 &&
              results.length === 0 && (
                <div className="px-4 py-6 text-center text-text-secondary">
                  <p>No cities found for &quot;{inputValue}&quot;</p>
                  <p className="text-xs mt-1">Try a different spelling</p>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CityAutocomplete;
