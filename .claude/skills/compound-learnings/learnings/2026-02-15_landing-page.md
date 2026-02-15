# Landing Page Implementation Learnings

**Date**: 2026-02-15
**Task**: Create marketing landing page for StayMatch

## What Was Built

Marketing landing page with 9 components:
- `LandingNav` - Sticky header with glass blur on scroll
- `Hero` - Main hero with animated SwipePreview
- `SwipePreview` - Phone mockup with auto-swiping cards
- `HowItWorks` - 3-step process with scroll animations
- `Features` - Value props using existing badges
- `SocialProof` - Animated stats + testimonials
- `FinalCTA` - Email capture with gradient
- `Footer` - Simple footer with links
- `LandingPage` - Composition component

## Key Patterns

### 1. framer-motion Variants Typing

**Problem**: TypeScript error with ease property
```
Type 'string' is not assignable to type 'Easing'
```

**Solution**: Use `as const` assertion
```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,  // ← Fix
    },
  },
};
```

### 2. Auth-Aware Root Route

```tsx
// app/page.tsx
export default async function Page() {
  const user = await getCurrentUser();
  if (user) redirect("/matches");
  return <LandingPage />;
}
```

Benefits:
- Clean separation of marketing vs app
- Server-side auth check
- No flash of wrong content

### 3. Animated Stat Counter

```tsx
function AnimatedStat({ value, suffix, label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);
  // ...
}
```

### 4. Auto-Swipe Demo Animation

```tsx
useEffect(() => {
  if (!isTop) return;

  const timeout = setTimeout(() => {
    const direction = Math.random() > 0.3 ? "right" : "left";
    const targetX = direction === "right" ? 300 : -300;

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: () => onSwipe(direction),
    });
  }, 2500);

  return () => clearTimeout(timeout);
}, [isTop, onSwipe, x]);
```

## Design Decisions

1. **Luxury-editorial aesthetic** - Playfair Display for headings, generous whitespace
2. **Phone mockup as hero visual** - Memorable, shows the product in action
3. **Reuse existing components** - MatchScoreBadge, TruthScoreBadge for consistency
4. **Scroll-triggered animations** - `whileInView` with `viewport={{ once: true }}`
5. **Staggered reveals** - `staggerChildren` in container variants

## Component Locations

```
components/landing/
├── LandingNav.tsx      # Header with logo, CTAs
├── Hero.tsx            # Main hero section
├── SwipePreview.tsx    # Animated phone mockup
├── HowItWorks.tsx      # 3-step process
├── Features.tsx        # Value propositions
├── SocialProof.tsx     # Stats + testimonials
├── FinalCTA.tsx        # Email capture
├── Footer.tsx          # Footer links
└── index.ts            # Barrel export
```

## Future Improvements

- Add actual email capture API endpoint
- Add A/B testing for headline copy
- Add video background option for hero
- Consider intersection observer for lazy loading
