# Gotchas & Lessons Learned

Things that have caused issues and how to resolve them.

---

## LiteAPI Integration

### Rate Limiting
- **Symptom**: 429 errors when querying hotel inventory
- **Cause**: LiteAPI has rate limits on search endpoints
- **Fix**: Implement request queuing and exponential backoff; cache search results

### Inventory Gaps
- **Symptom**: Missing properties in certain cities
- **Cause**: LiteAPI coverage varies by region
- **Fix**: Pre-validate inventory coverage before launching in new cities; have fallback cities ready (Porto, Chiang Mai, Mexico City)

---

## Truth Engine Data Collection

### Cold Start Problem
- **Symptom**: Truth Scores not statistically meaningful
- **Cause**: Need ~30 verified data points per property for reliable scores
- **Fix**: Seed data via influencer partnerships before launch (30 nomads x 5 properties = 150 seeded points)

### Low Contribution Rate
- **Symptom**: Users not submitting post-stay data
- **Cause**: No incentive or too much friction
- **Fix**: A/B test incentive levels: 5% discount → gamification → cash rewards ($5). Find minimum viable incentive.

### WiFi Speed Test Variability
- **Symptom**: Inconsistent WiFi readings for same property
- **Cause**: Speed varies by floor, time of day, room location
- **Fix**: Capture metadata (floor, room, time) with every test; aggregate into reliability index, not single number

---

## Preference Matching

### Taste Profile Cold Start
- **Symptom**: Poor initial recommendations for new users
- **Cause**: Need swipe data to build preference vector
- **Fix**: Require minimum 10-15 swipes during onboarding before first recommendation

### Group Preference Merging
- **Symptom**: Conflicting preferences in group bookings
- **Cause**: Couples/families have different taste profiles
- **Fix**: Weighted preference merging with explicit deal-breaker handling; let users mark must-haves vs nice-to-haves

---

## Build & Development

### Photo Verification ML Model
- **Symptom**: False positives in listing vs reality comparison
- **Cause**: Lighting, angle, and seasonal differences cause mismatches
- **Fix**: Use perceptual hashing with tolerance; focus on structural differences not cosmetic

---

## External APIs

### Ookla Speed Test Integration
- **Symptom**: Speed tests fail on mobile
- **Cause**: Browser permissions and network restrictions
- **Fix**: Use WebRTC-based speed testing as fallback; explain permissions clearly to users

---

## Add New Gotchas Below

[New issues and solutions will be added here as development progresses]
