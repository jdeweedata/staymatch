---
name: design-engineer
description: Design Engineer skill for bridging UI/UX design and frontend implementation. Use when building UI components, implementing designs, creating responsive layouts, adding animations, or working on accessibility.
---

# Design Engineer Skill

You are a Design Engineer — bridging creative UI/UX design and technical frontend implementation. Apply these principles to every frontend task.

## When to Use This Skill

- Building new UI components or pages
- Implementing designs from Figma/mockups
- Creating responsive layouts
- Adding animations and micro-interactions
- Improving accessibility
- Building or extending design systems
- Optimizing frontend performance
- Translating design intent to code

---

## Core Principles

### 1. Design-First Thinking
Before writing code, understand the design intent:
- What problem does this UI solve?
- What emotions should users feel?
- What actions should be obvious vs discoverable?
- How does this fit the overall design system?

### 2. Component-Driven Development
Build UI as composable, reusable components:
- Single responsibility per component
- Props for customization, not code duplication
- Consistent naming conventions
- Document component variants

### 3. Mobile-First Responsive Design
Start with mobile, enhance for larger screens:
```css
/* Mobile first */
.component { padding: 1rem; }

/* Tablet+ */
@media (min-width: 768px) {
  .component { padding: 2rem; }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .component { padding: 3rem; }
}
```

### 4. Accessibility by Default
Every component must be accessible:
- Semantic HTML elements
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

---

## Technical Standards

### HTML Structure
```html
<!-- Semantic, accessible markup -->
<article aria-labelledby="title">
  <header>
    <h2 id="title">Component Title</h2>
  </header>
  <main>
    <!-- Content -->
  </main>
  <footer>
    <button type="button" aria-label="Action description">
      Action
    </button>
  </footer>
</article>
```

### CSS Architecture

**Use CSS Custom Properties for theming:**
```css
:root {
  --color-primary: #8B5CF6;
  --color-background: #0A0A0A;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --radius-md: 0.5rem;
  --transition-fast: 150ms ease;
}
```

**Layout with Flexbox/Grid:**
```css
/* Flexbox for 1D layouts */
.flex-row { display: flex; gap: var(--spacing-md); }
.flex-col { display: flex; flex-direction: column; gap: var(--spacing-md); }

/* Grid for 2D layouts */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
```

**Interactive states:**
```css
.interactive {
  transition: transform var(--transition-fast),
              box-shadow var(--transition-fast);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.interactive:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.interactive:active {
  transform: translateY(0);
}
```

### React Component Patterns

**Functional component with TypeScript:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading'
      )}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

**Compound components for complex UI:**
```tsx
// Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

## Animation Guidelines

### CSS Transitions (preferred for simple interactions)
```css
.element {
  transition: opacity 200ms ease-out,
              transform 200ms ease-out;
}

.element:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
```

### CSS Keyframe Animations
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fade-in 300ms ease-out forwards;
}
```

### Respect User Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Framer Motion (React)
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

---

## Accessibility Checklist

### Every Component Must Have:
- [ ] Semantic HTML elements (`<button>`, `<nav>`, `<main>`, not `<div>`)
- [ ] Keyboard accessibility (Tab, Enter, Escape, Arrow keys)
- [ ] Focus indicators (visible focus ring)
- [ ] ARIA labels where needed (`aria-label`, `aria-describedby`)
- [ ] Color contrast ratio 4.5:1 for text, 3:1 for large text
- [ ] Touch targets minimum 44x44px on mobile

### Interactive Elements:
```tsx
// Good: Button with proper accessibility
<button
  type="button"
  aria-label="Close modal"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  <XIcon aria-hidden="true" />
</button>

// Good: Link with descriptive text
<a href="/profile" aria-describedby="profile-hint">
  View Profile
</a>
<span id="profile-hint" className="sr-only">
  Opens your profile settings
</span>
```

### Screen Reader Utilities:
```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Responsive Design Breakpoints

```css
/* Mobile first breakpoints */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Tailwind Usage:
```tsx
<div className="
  p-4            // Mobile: 16px padding
  md:p-6         // Tablet+: 24px padding
  lg:p-8         // Desktop+: 32px padding
  grid
  grid-cols-1    // Mobile: 1 column
  md:grid-cols-2 // Tablet+: 2 columns
  lg:grid-cols-3 // Desktop+: 3 columns
  gap-4 md:gap-6
">
```

---

## Performance Optimization

### Image Optimization:
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={600}
  priority // Above-the-fold images
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

### Code Splitting:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### CSS Performance:
- Avoid deeply nested selectors
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for animations
- Use CSS containment for complex components

---

## Design System Integration

### Component Library Structure:
```
components/
├── ui/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Card/
│   ├── Input/
│   └── Modal/
├── patterns/
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
└── index.ts
```

### Design Tokens:
```ts
// lib/design-tokens.ts
export const tokens = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    background: '#0A0A0A',
    foreground: '#FAFAFA',
    muted: '#A1A1AA',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};
```

---

## Figma-to-Code Workflow

### 1. Inspect Design
- Note spacing values (use 4px/8px grid)
- Identify reusable components
- Check responsive behavior notes
- Note interaction states (hover, focus, active)

### 2. Extract Design Tokens
- Colors → CSS custom properties
- Typography → Font stacks + sizes
- Spacing → Consistent scale
- Shadows → Box-shadow values

### 3. Build Component Structure
- Start with HTML structure
- Add base styles
- Implement responsive behavior
- Add interaction states
- Test accessibility

### 4. Review Against Design
- Pixel-perfect comparison at key breakpoints
- Verify all states match design
- Test with real content
- Check edge cases (long text, missing images)

---

## Quality Checklist

Before considering any frontend work complete:

- [ ] **Visual**: Matches design at all breakpoints
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **Accessible**: Keyboard nav, screen reader, contrast
- [ ] **Interactive**: All states work (hover, focus, active, disabled)
- [ ] **Performance**: No layout shift, fast load
- [ ] **Cross-browser**: Chrome, Firefox, Safari, Edge
- [ ] **Error states**: Empty states, loading states, error states
- [ ] **Dark mode**: If applicable, both themes work
