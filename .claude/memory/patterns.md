# Codebase Patterns

Persistent patterns discovered in this codebase. These survive across sessions.

---

## Data Schema Patterns

### Truth Engine Data Types
```typescript
// Post-stay measurements (structured, not opinions)
interface TruthData {
  wifi_speed_down_mbps: number;
  wifi_speed_up_mbps: number;
  wifi_floor: string;           // "3rd floor, room 312"
  wifi_time_of_test: Date;
  noise_level_db: number;
  noise_source: 'street' | 'hvac' | 'neighbors' | 'bar';
  photo_verification: Image[];
  check_in_wait_minutes: number;
  accessibility_score: AccessibilityData;
}

// Aggregated property score
interface TruthScore {
  truth_score_overall: number;  // 0-100
  truth_confidence: number;     // 0-1 based on data points
  n_verified_stays: number;
  listing_accuracy_gap: number; // -1 to 1 (negative = overpromises)
  wifi_reliability_index: number;
  noise_profile: NoiseProfile;
  photo_reality_score: number;
}
```

### Taste Profile Patterns
```typescript
// User preference vector (persists across sessions)
interface TasteProfile {
  aesthetic_vector: number[];   // 128-dim embedding from swipes
  noise_tolerance: number;      // 0-1
  price_sensitivity_curve: (quality: number) => number;
  location_preference: string[];
  travel_persona: 'digital_nomad' | 'family' | 'romantic' | 'adventure';
  deal_breakers: string[];
  delight_factors: string[];
}
```

---

## API Patterns

### LiteAPI Integration
- Always cache search results (15-minute TTL)
- Implement retry with exponential backoff for rate limits
- Map LiteAPI property IDs to internal Truth Engine IDs

### Request/Response Format
```typescript
// Standard API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { cached: boolean; timestamp: Date };
}
```

---

## Component Patterns

### Swipe Card Component
- Use Framer Motion for swipe gestures
- Lazy load property images
- Preload next 2 cards for smooth UX

### Match Score Display
- Show overall score prominently (0-100)
- Confidence indicator if < 0.7
- "Why this matches" expandable section

---

## Data Flywheel Pattern

```
1. User books via StayMatch
   ↓ generates
2. Post-stay data collection (verified guest)
   ↓ enriches
3. Truth Score computed (ML aggregation)
   ↓ improves
4. AI recommendations get smarter
   ↓ attracts
5. More users book
   ↻ compounds
```

---

## Development Patterns

### Feature Flags
- Use for gradual rollout of Truth Engine features
- A/B test incentive mechanisms

### Caching Strategy
- Property data: 24h cache (stale-while-revalidate)
- Search results: 15m cache
- Truth Scores: 1h cache
- User taste profiles: no cache (real-time)

---

## Add New Patterns Below

[New patterns will be added here as discovered]
