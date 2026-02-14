# framer-motion Swipe Pattern

Reusable pattern for Tinder-style swipe cards with gesture recognition.

## Core Setup

```tsx
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

// Motion values for drag position
const x = useMotionValue(0);
const y = useMotionValue(0);

// Transform drag to rotation (natural tilt effect)
const rotate = useTransform(x, [-200, 200], [-15, 15]);

// Transform for indicator opacity
const likeOpacity = useTransform(x, [0, 100], [0, 1]);
const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
```

## Drag Handler

```tsx
const handleDragEnd = useCallback(
  (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Check position OR velocity for swipe detection
    if (offset > 100 || velocity > 500) {
      onSwipeRight?.(id);
    } else if (offset < -100 || velocity < -500) {
      onSwipeLeft?.(id);
    }
  },
  [id, onSwipeRight, onSwipeLeft]
);
```

## Motion Div Props

```tsx
<motion.div
  style={{ x, y, rotate }}
  drag="x"
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  dragElastic={0.9}
  onDragEnd={handleDragEnd}
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{
    x: x.get() > 0 ? 300 : -300,
    opacity: 0,
    rotate: x.get() > 0 ? 20 : -20,
    transition: { duration: 0.3 },
  }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
/>
```

## Stack Management

```tsx
// AnimatePresence with popLayout for smooth exits
<AnimatePresence mode="popLayout">
  {visibleItems.map((item, index) => (
    <SwipeCard
      key={item.id}
      isActive={index === 0}
      zIndex={visibleItems.length - 1 - index}
      scale={1 - index * 0.05}
      yOffset={index * 8}
    />
  ))}
</AnimatePresence>
```

## Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `dragElastic` | 0.9 | Natural spring-back feel |
| `swipeThreshold` | 100px | Position threshold for swipe |
| `velocityThreshold` | 500 | Speed threshold for fast swipes |
| `rotationRange` | 15deg | Max rotation during drag |
| `stackOffset` | 8px | Y offset per stacked card |
| `stackScale` | 0.05 | Scale reduction per card |
