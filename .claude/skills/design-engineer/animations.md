---
name: animations
description: Implement smooth CSS and JavaScript animations, micro-interactions, and motion design. Use when adding transitions, loading states, scroll animations, or interactive feedback.
---

# Animation & Motion Design

Create performant, accessible animations that enhance user experience.

## Performance Rules

### Use GPU-Accelerated Properties Only
```css
/* GOOD - GPU accelerated, no layout/paint */
transform: translateX(100px);
transform: scale(1.1);
transform: rotate(45deg);
opacity: 0.5;

/* AVOID - Triggers layout/paint */
left: 100px;      /* Use transform: translateX() */
width: 200px;     /* Use transform: scale() */
margin: 20px;     /* Use transform */
```

### Animation Timing Functions
```css
/* Easing presets */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Decelerate */
--ease-in: cubic-bezier(0.7, 0, 0.84, 0);       /* Accelerate */
--ease-in-out: cubic-bezier(0.87, 0, 0.13, 1);  /* Smooth */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful */
```

---

## Common Animation Patterns

### Fade In
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fade-in 200ms var(--ease-out) forwards;
}
```

### Slide Up (for modals, toasts)
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slide-up 300ms var(--ease-out) forwards;
}
```

### Scale In (for popovers, dropdowns)
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scale-in 150ms var(--ease-out) forwards;
  transform-origin: top center;
}
```

### Shake (for errors)
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.shake {
  animation: shake 400ms ease-in-out;
}
```

### Pulse (for loading)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### Spin (for loaders)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
```

---

## Micro-Interactions

### Button Press
```css
.btn {
  transition: transform 100ms ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(1px);
}
```

### Card Hover
```css
.card {
  transition: transform 200ms var(--ease-out),
              box-shadow 200ms var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

### Input Focus
```css
.input {
  transition: border-color 150ms ease,
              box-shadow 150ms ease;
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
```

### Toggle Switch
```css
.toggle-thumb {
  transition: transform 200ms var(--ease-out);
}

.toggle[data-state="checked"] .toggle-thumb {
  transform: translateX(20px);
}
```

---

## React Animation Libraries

### Framer Motion
```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Basic animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
>
  Content
</motion.div>

// List animation
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>

// Gesture animations
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### CSS Transition Group (lightweight)
```tsx
// For simple enter/exit animations
<div className={cn(
  'transition-all duration-200',
  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
)}>
  Content
</div>
```

---

## Swipe Animations (for StayMatch)

### Swipe Card Animation
```tsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

function SwipeCard({ onSwipe, children }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe(info.offset.x > 0 ? 'right' : 'left');
        }
      }}
      className="absolute w-full cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}
```

### Like/Nope Indicators
```tsx
const likeOpacity = useTransform(x, [0, 100], [0, 1]);
const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

<motion.div
  style={{ opacity: likeOpacity }}
  className="absolute top-8 right-8 text-green-500 font-bold text-2xl"
>
  LIKE
</motion.div>

<motion.div
  style={{ opacity: nopeOpacity }}
  className="absolute top-8 left-8 text-red-500 font-bold text-2xl"
>
  NOPE
</motion.div>
```

---

## Accessibility

### Always Respect User Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### React Hook for Reduced Motion
```tsx
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

// Usage
const prefersReduced = usePrefersReducedMotion();
const animationDuration = prefersReduced ? 0 : 200;
```

---

## Loading States

### Skeleton Loader
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-muted) 25%,
    var(--color-border) 50%,
    var(--color-muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}
```

### Spinner
```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

  return (
    <svg
      className={cn('animate-spin', sizes[size])}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

---

## Performance Checklist

- [ ] Only animate `transform` and `opacity`
- [ ] Use `will-change` sparingly (only when needed)
- [ ] Keep animations under 300ms for interactions
- [ ] Use `requestAnimationFrame` for JS animations
- [ ] Debounce scroll-triggered animations
- [ ] Test on low-end devices
- [ ] Respect `prefers-reduced-motion`
