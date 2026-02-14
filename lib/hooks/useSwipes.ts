"use client";

import { useState, useCallback } from "react";

/**
 * Response from POST /api/swipes
 */
export interface SwipeResponse {
  id: string;
  count: number;
  isComplete: boolean;
}

/**
 * Response from GET /api/swipes
 */
export interface ProgressResponse {
  count: number;
  liked: number;
  disliked: number;
  isComplete: boolean;
}

/**
 * Valid swipe directions
 */
export type SwipeDirection = "LEFT" | "RIGHT" | "SUPER_LIKE";

/**
 * Return type for useSwipes hook
 */
export interface UseSwipesReturn {
  /** ID of the most recent swipe (for undo) */
  lastSwipeId: string | null;
  /** Loading state for any operation */
  isLoading: boolean;
  /** Error message from the last failed operation */
  error: string | null;
  /** Record a swipe - returns response or null on error */
  swipe: (hotelImageId: string, direction: SwipeDirection) => Promise<SwipeResponse | null>;
  /** Undo the last swipe - returns true on success, false on error */
  undo: () => Promise<boolean>;
  /** Get current swipe progress - returns response or null on error */
  getProgress: () => Promise<ProgressResponse | null>;
}

/**
 * Hook for interacting with the swipe API
 *
 * Provides methods for recording swipes, undoing the last swipe,
 * and getting swipe progress during onboarding.
 *
 * @example
 * ```tsx
 * const { swipe, undo, getProgress, isLoading, error, lastSwipeId } = useSwipes();
 *
 * // Record a swipe
 * const result = await swipe("hotel-image-123", "RIGHT");
 * if (result?.isComplete) {
 *   // Onboarding complete!
 * }
 *
 * // Undo last swipe
 * if (lastSwipeId) {
 *   await undo();
 * }
 * ```
 */
export function useSwipes(): UseSwipesReturn {
  const [lastSwipeId, setLastSwipeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Record a swipe for a hotel image
   */
  const swipe = useCallback(
    async (hotelImageId: string, direction: SwipeDirection): Promise<SwipeResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/swipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hotelImageId, direction }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          const errorMessage = data.error || `Failed to record swipe (${response.status})`;
          setError(errorMessage);
          return null;
        }

        const data: SwipeResponse = await response.json();
        setLastSwipeId(data.id);
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to record swipe";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Undo the last swipe
   */
  const undo = useCallback(async (): Promise<boolean> => {
    if (!lastSwipeId) {
      setError("No swipe to undo");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/swipes/${lastSwipeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || `Failed to undo swipe (${response.status})`;
        setError(errorMessage);
        return false;
      }

      // Clear lastSwipeId after successful undo
      setLastSwipeId(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to undo swipe";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [lastSwipeId]);

  /**
   * Get current swipe progress
   */
  const getProgress = useCallback(async (): Promise<ProgressResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/swipes", {
        method: "GET",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || `Failed to get progress (${response.status})`;
        setError(errorMessage);
        return null;
      }

      const data: ProgressResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get progress";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    lastSwipeId,
    isLoading,
    error,
    swipe,
    undo,
    getProgress,
  };
}

export default useSwipes;
