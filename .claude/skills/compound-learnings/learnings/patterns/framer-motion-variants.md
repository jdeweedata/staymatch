# framer-motion Variants Typing Pattern

## Problem

When defining animation variants in TypeScript, the `ease` property causes type errors:

```tsx
// ❌ TypeScript Error
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeOut",  // Type 'string' is not assignable to type 'Easing'
    },
  },
};
```

## Solution

Use `as const` assertion to narrow the string literal type:

```tsx
// ✅ Correct
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeOut" as const,
    },
  },
};
```

## Alternative: Type Annotation

```tsx
import type { Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeOut",
    },
  },
};
```

## Valid Easing Values

```tsx
type Easing =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "circIn"
  | "circOut"
  | "circInOut"
  | "backIn"
  | "backOut"
  | "backInOut"
  | "anticipate"
  | number[]  // cubic-bezier: [0.42, 0, 0.58, 1]
```

## Common Patterns

### Container with Stagger

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};
```

### Scroll-Triggered Reveal

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={itemVariants}
>
```

## When to Apply

- Any `transition.ease` property in variants
- Any typed Variants object
- Both `initial/animate` inline and variants patterns
