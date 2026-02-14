/**
 * User preference caching utilities
 *
 * Caches user taste vectors and preferences to speed up matching
 */

import { cacheKey, setCache, getCache, deleteCache, CACHE_TTL, CACHE_PREFIX } from "./redis";

interface UserTasteVector {
  vector: number[];
  updatedAt: string;
}

interface UserPreferences {
  dealBreakers: string[];
  priceRange: { min: number; max: number };
  preferredAmenities: string[];
  noiseToleranceLow: boolean;
  updatedAt: string;
}

/**
 * Cache user taste vector (embedding)
 */
export async function cacheUserTasteVector(
  userId: string,
  vector: number[]
): Promise<void> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "taste");
  const data: UserTasteVector = {
    vector,
    updatedAt: new Date().toISOString(),
  };
  await setCache(key, data, CACHE_TTL.USER_PREFERENCES);
}

/**
 * Get cached user taste vector
 */
export async function getCachedUserTasteVector(
  userId: string
): Promise<number[] | null> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "taste");
  const data = await getCache<UserTasteVector>(key);
  return data?.vector ?? null;
}

/**
 * Cache user preferences
 */
export async function cacheUserPreferences(
  userId: string,
  preferences: Omit<UserPreferences, "updatedAt">
): Promise<void> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "prefs");
  const data: UserPreferences = {
    ...preferences,
    updatedAt: new Date().toISOString(),
  };
  await setCache(key, data, CACHE_TTL.USER_PREFERENCES);
}

/**
 * Get cached user preferences
 */
export async function getCachedUserPreferences(
  userId: string
): Promise<UserPreferences | null> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "prefs");
  return getCache<UserPreferences>(key);
}

/**
 * Invalidate all user cache (on logout or preference update)
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await deleteCache(cacheKey(CACHE_PREFIX.USER, userId, "taste"));
  await deleteCache(cacheKey(CACHE_PREFIX.USER, userId, "prefs"));
}

/**
 * Cache match results for a user + search combination
 */
export async function cacheMatchResults(
  userId: string,
  searchHash: string,
  matches: unknown[]
): Promise<void> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "matches", searchHash);
  // Match results cached for 5 minutes (same as rates)
  await setCache(key, matches, 60 * 5);
}

/**
 * Get cached match results
 */
export async function getCachedMatchResults(
  userId: string,
  searchHash: string
): Promise<unknown[] | null> {
  const key = cacheKey(CACHE_PREFIX.USER, userId, "matches", searchHash);
  return getCache<unknown[]>(key);
}
