// Preference options for profile page tag pickers

export interface PreferenceOption {
  id: string;
  label: string;
  icon: string;
}

export const DEAL_BREAKER_OPTIONS: PreferenceOption[] = [
  { id: "no-ac", label: "No air conditioning", icon: "❄️" },
  { id: "street-noise", label: "Street noise", icon: "🔊" },
  { id: "no-wifi", label: "Unreliable WiFi", icon: "📶" },
  { id: "slow-wifi", label: "Slow WiFi (<10 Mbps)", icon: "🐌" },
  { id: "shared-bathroom", label: "Shared bathroom", icon: "🚿" },
  { id: "no-workspace", label: "No workspace", icon: "💻" },
  { id: "far-from-center", label: "Far from center", icon: "📍" },
  { id: "no-elevator", label: "No elevator", icon: "🪜" },
  { id: "no-kitchen", label: "No kitchen access", icon: "🍳" },
  { id: "no-laundry", label: "No laundry", icon: "👕" },
  { id: "smoking-allowed", label: "Smoking allowed", icon: "🚬" },
  { id: "no-24h-checkin", label: "No 24h check-in", icon: "🕐" },
];

export const DELIGHT_FACTOR_OPTIONS: PreferenceOption[] = [
  { id: "rooftop", label: "Rooftop/terrace", icon: "🌅" },
  { id: "pool", label: "Pool", icon: "🏊" },
  { id: "city-view", label: "City view", icon: "🌆" },
  { id: "ocean-view", label: "Ocean view", icon: "🌊" },
  { id: "gym", label: "Gym/fitness", icon: "💪" },
  { id: "coworking", label: "Coworking space", icon: "👥" },
  { id: "fast-wifi", label: "Fast WiFi (50+ Mbps)", icon: "⚡" },
  { id: "spa", label: "Spa/wellness", icon: "🧖" },
  { id: "breakfast", label: "Breakfast included", icon: "🥐" },
  { id: "coffee-machine", label: "In-room coffee", icon: "☕" },
  { id: "balcony", label: "Private balcony", icon: "🌿" },
  { id: "bathtub", label: "Bathtub", icon: "🛁" },
  { id: "quiet-location", label: "Quiet location", icon: "🤫" },
  { id: "walkable", label: "Walkable area", icon: "🚶" },
];

export interface BudgetRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export const BUDGET_RANGES: BudgetRange[] = [
  { id: "budget", label: "$0-75/night", min: 0, max: 75 },
  { id: "mid", label: "$75-150/night", min: 75, max: 150 },
  { id: "upscale", label: "$150-300/night", min: 150, max: 300 },
  { id: "luxury", label: "$300+/night", min: 300, max: null },
];

export const STAR_RATINGS = [3, 4, 5] as const;
export type StarRating = (typeof STAR_RATINGS)[number];

// User preferences JSON structure
export interface UserPreferences {
  budgetRange?: string;
  minStarRating?: number;
  amenityPriorities?: string[];
}
