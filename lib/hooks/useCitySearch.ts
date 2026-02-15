"use client";

import { useState, useEffect, useCallback } from "react";
import type { City } from "@/lib/services/liteapi";

interface UseCitySearchResult {
  results: City[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clear: () => void;
}

export function useCitySearch(debounceMs = 300): UseCitySearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear results if query is too short
    if (query.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/cities/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 10 }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to search cities");
        }

        const data = await response.json();
        setResults(data.cities || []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, ignore
          return;
        }
        console.error("City search error:", err);
        setError("Failed to search cities");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs]);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clear };
}

export default useCitySearch;
