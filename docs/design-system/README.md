# StayMatch Design System

> Brand overhaul implemented on **2026-02-14**

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| 🔴 Coral Red | `#FF3859` | Primary accent, CTAs, active states |
| ⚪ White | `#FFFFFF` | Backgrounds, cards, surfaces |
| ⚫ Charcoal | `#272823` | Text, icons, headings |

## Typography

- **DM Sans** — body text and UI
- **Playfair Display** — display headings
- **JetBrains Mono** — code and data

## Components

| Component | Path | Description |
|-----------|------|-------------|
| Button | `components/ui/Button.tsx` | Primary, secondary, ghost variants · sm/md/lg sizes |
| SearchBar | `components/ui/SearchBar.tsx` | Search input with filter action button |
| CategoryPill | `components/ui/CategoryPill.tsx` | Horizontal scrolling destination selectors |
| PropertyCard | `components/ui/PropertyCard.tsx` | Standard (vertical) and compact (horizontal) layouts |
| BottomNav | `components/ui/BottomNav.tsx` | 5-tab fixed bottom navigation |
| SwipeCard | `components/ui/SwipeCard.tsx` | Tinder-style hotel swipe card (existing, updated) |
| MatchScoreBadge | `components/ui/MatchScoreBadge.tsx` | Circular match percentage indicator |
| BottomSheet | `components/ui/BottomSheet.tsx` | Pull-up detail sheet |
| MatchReasons | `components/ui/MatchReasons.tsx` | "Why this matches" explanation list |

## Design Tokens

All tokens are defined in [`tailwind.config.ts`](../../tailwind.config.ts) and [`globals.css`](../../app/globals.css).

### Shadows
- `shadow-card` — subtle card elevation
- `shadow-card-hover` — hover lift effect
- `shadow-float` — floating elements
- `shadow-nav` — bottom nav bar

### Border Radius
- `rounded-xl` (1rem) — buttons
- `rounded-2xl` (1.25rem) — cards, images
- `rounded-full` — badges, pills, avatars

### CSS Utilities
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` — button presets
- `.card` / `.card-flat` — card containers
- `.badge` / `.badge-primary` / `.badge-success` — status badges
- `.text-gradient` — coral gradient text
- `.glass` — glassmorphism backdrop
- `.no-scrollbar` — hide scrollbar for horizontal scroll areas

## Media

Screenshots and recordings from implementation are in the [`media/`](media/) folder.

## Documentation

- [Walkthrough](walkthrough.md) — implementation log covering both mobile and desktop layouts, with screenshots and recordings

