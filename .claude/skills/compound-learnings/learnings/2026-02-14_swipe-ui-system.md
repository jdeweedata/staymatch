# Swipe UI System Learnings

**Date**: 2026-02-14
**Project**: StayMatch
**Components Built**: SwipeCard, SwipeStack, BottomSheet, HotelDetailSheet, MatchScoreBadge, MatchReasons

## Summary

Built complete swipe-based onboarding UI for hotel matching. Tinder-style card swiping with gesture recognition, detail bottom sheets, and match score visualization.

## Key Decisions

### 1. framer-motion for Gestures
- Chose framer-motion over react-spring or manual touch handlers
- Better DX with `useMotionValue`, `useTransform`, `drag` prop
- Built-in physics for spring animations

### 2. Emoji Icons over Icon Library
- Created 40+ category → emoji mappings for amenities
- No bundle size increase from icon library
- Universal recognition across cultures

### 3. Animated Score Ring
- SVG circles with `strokeDasharray` animation
- More engaging than static badge
- Color thresholds create instant visual feedback

## Patterns Extracted

See `patterns/framer-motion-swipe.md` and `patterns/bottom-sheet.md`

## Time Estimates for Future

| Task | Time |
|------|------|
| Swipe card from scratch | ~3 hours |
| Swipe card using pattern | ~45 min |
| Bottom sheet from scratch | ~2 hours |
| Bottom sheet using pattern | ~30 min |
| Score badge | ~30 min |

## Integration Notes

- SwipeStack manages card state, SwipeCard handles gestures
- BottomSheet is generic, HotelDetailSheet is domain-specific
- Match score/reasons can be null during onboarding (no profile yet)
