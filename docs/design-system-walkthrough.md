# StayMatch Design System — Walkthrough

## What Changed

Complete visual overhaul from a dark/purple theme to a clean, light hotel-booking app using brand colors:
- **White** (`#FFFFFF`) — backgrounds
- **Coral Red** (`#FF3859`) — primary accent
- **Dark Charcoal** (`#272823`) — text

## Files Modified

| File | Change |
|------|--------|
| [tailwind.config.ts](file:///home/staymatch.co/tailwind.config.ts) | New color tokens, semantic aliases, shadows, animations |
| [globals.css](file:///home/staymatch.co/app/globals.css) | Light theme CSS vars, component classes, utilities |
| [layout.tsx](file:///home/staymatch.co/app/layout.tsx) | Removed dark mode, white theme color |
| [page.tsx](file:///home/staymatch.co/app/page.tsx) | Full landing page with search, categories, cards, CTA |

## New Components

| Component | Purpose |
|-----------|---------|
| [Button.tsx](file:///home/staymatch.co/components/ui/Button.tsx) | 3 variants (primary/secondary/ghost), 3 sizes, loading state |
| [SearchBar.tsx](file:///home/staymatch.co/components/ui/SearchBar.tsx) | Search input with filter button |
| [CategoryPill.tsx](file:///home/staymatch.co/components/ui/CategoryPill.tsx) | Horizontal scroll destination selectors |
| [PropertyCard.tsx](file:///home/staymatch.co/components/ui/PropertyCard.tsx) | Standard + compact layouts with favorites |
| [BottomNav.tsx](file:///home/staymatch.co/components/ui/BottomNav.tsx) | 5-tab bottom navigation |

## Verification

**Build**: ✅ `npm run build` — 0 errors, compiled in 17.7s

**Visual**: Verified at `http://localhost:3001`:

````carousel
![Header with search bar and category pills](/home/staymatch.co/docs/landing-page-top.png)
<!-- slide -->
![Nearby Resort section with compact property cards](/home/staymatch.co/docs/landing-page-middle.png)
<!-- slide -->
![CTA banner and bottom navigation](/home/staymatch.co/docs/landing-page-bottom.png)
````

![Full interaction recording](/home/staymatch.co/docs/design-system-screenshots.webp)
