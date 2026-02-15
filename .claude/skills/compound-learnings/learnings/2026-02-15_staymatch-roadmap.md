# StayMatch Roadmap Analysis Learnings

**Date**: 2026-02-15
**Context**: Adapted roadmap-advisor skill for StayMatch platform analysis

## Summary

Performed quick roadmap scan of StayMatch codebase. Identified 10 priority features, 5 quick wins, and critical gaps in user retention and data collection flows.

## Codebase State (Snapshot)

| Metric | Count |
|--------|-------|
| Database tables | 9 |
| API routes | 17 |
| Components | 17 |
| Services | 12 |
| Pages | 9 |

### Database Models
User, Session, Swipe, HotelCache, HotelImage, Booking, Contribution, ContributionPhoto, DiscountCode

### Key Services
- `lib/services/liteapi.ts` - Full booking flow (rates, prebook, confirm, cancel)
- `lib/services/embeddings.ts` - OpenAI taste vector generation
- `lib/services/truth-score.ts` - Post-stay data aggregation
- `lib/cache/redis.ts` - Upstash caching layer

## Maturity Assessment

| Domain | Score | Gap |
|--------|-------|-----|
| Matching Engine | 6/10 | Missing semantic search, explanations |
| Booking Flow | 8/10 | Complete, needs confirmation emails |
| Truth Engine | 5/10 | Schema ready, no contribution prompting |
| User Experience | 4/10 | No profile, no favorites, no notifications |
| Search/Discovery | 3/10 | Hardcoded cities, no filters |
| Analytics | 2/10 | No admin dashboard |

## Top 10 Priorities (Ranked)

1. **User Profile & Preferences Page** (S, 3-5d) - Users can't see/edit what they taught the system
2. **Saved/Favorites List** (S, 2-3d) - No wishlist for trip planning
3. **Post-Stay Contribution Email Prompts** (M, 5-8d) - Truth Engine starves without data
4. **City/Destination Search** (S, 2-3d) - Hardcoded cities block real usage
5. **Match Explanation Cards** (M, 5-8d) - Users don't understand AI reasoning
6. **Filter UI** (S-M, 3-5d) - Can't narrow by budget/amenities
7. **Booking Confirmation Emails** (S, 2-3d) - Professional trust signal
8. **My Matches Dashboard** (M, 5-8d) - Core value prop screen after onboarding
9. **Truth Score in SwipeCard** (XS, 2h) - Quick win, differentiator
10. **Basic Admin Dashboard** (M-L, 1-2w) - Operational visibility

## Quick Wins Identified

| Feature | Effort | Files |
|---------|--------|-------|
| TruthScoreBadge in SwipeCard | 2h | SwipeCard.tsx |
| Logout button in nav | 1h | BottomNav.tsx |
| Match score on /matches cards | 2h | matches/page.tsx |
| Loading states in booking | 3h | booking/page.tsx |
| 404 page | 1h | app/not-found.tsx |

## Critical Dependencies

```
Email Provider → Contribution Prompts
             → Booking Confirmations
             → Future notifications

City Search → Filter UI
```

## Key Learnings

### 1. Domain Adaptation Works
The roadmap-advisor skill was designed for CircleTel (ISP) but the methodology is domain-agnostic:
- Inventory scan (schema, APIs, components, services)
- Benchmark comparison (swap ISP → Travel standards)
- Priority scoring formula
- Dependency mapping

### 2. Priority Score Formula
```
PRIORITY = (Business × 0.4) + (Customer × 0.3) + (Enablement × 0.2) - (Complexity × 0.1)
```
Produces intuitive rankings that match gut feel.

### 3. StayMatch Strategic Insights
- **Booking flow is solid** - LiteAPI integration complete, don't touch
- **User retention is weak** - No profile, favorites, or notifications
- **Data moat can't compound** - Contribution prompting missing
- **Email provider is critical path** - Blocks 3+ features

### 4. Travel Platform Table Stakes
These are missing but expected by users:
- City search with autocomplete
- Filter by price/amenities/stars
- Saved/favorites list
- Confirmation emails

## Not Recommended (This Quarter)

| Feature | Reason |
|---------|--------|
| Map View | Requires geo-indexing, defer until search matures |
| Social Sharing | Low ROI until trip planning exists |
| Multi-language | Premature; focus on English for nomad ICP |
| Native App | Web MVP needs validation first |

## Recommended Sprint

**Week 1:**
- User Profile & Preferences (#1)
- City Search Autocomplete (#4)
- Quick wins 1-3

**Week 2:**
- Saved/Favorites List (#2)
- Email Provider + Booking Confirmation (#7)
- Filter UI basics (#6)

## Follow-up Actions

- [ ] Implement User Profile page
- [ ] Set up email provider (Resend recommended)
- [ ] Add TruthScoreBadge to SwipeCard (quick win)
- [ ] Create city search endpoint using LiteAPI getCities
