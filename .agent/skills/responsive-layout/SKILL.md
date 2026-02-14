---
name: responsive-layout
description: Patterns and strategies for creating fluid, responsive layouts.
---

# Responsive Layout Patterns

Create interfaces that adapt gracefully to any screen size.

## 1. Mobile-First Approach

Start by designing/coding for the smallest screen, then use `min-width` media queries to enhance for larger screens.

```css
/* Base styles (Mobile) */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

## 2. Fluid Layouts

-   Use relative units (`%`, `fr`, `rem`, `vw/vh`) instead of fixed pixels for layout containers.
-   Use `max-width` to constrain content width on large screens.

## 3. CSS Grid & Flexbox

-   **Flexbox**: Best for 1D layouts (rows OR columns). allow wrapping with `flex-wrap: wrap`.
-   **Grid**: Best for 2D layouts. Use `repeat(auto-fit, minmax(300px, 1fr))` for fluid grids without media queries.

## 4. Container Queries

Use container queries to style components based on *their* size, not the screen size.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    flex-direction: row;
  }
}
```

## 5. Responsive Typography

-   Use `rem` for font sizes to respect user preferences.
-   Consider using `clamp()` for fluid scaling: `font-size: clamp(1rem, 2.5vw, 1.5rem);`.

## 6. Touch Targets

Ensure interactive elements are at least 44x44px (or roughly `3rem`) for touch usability on mobile.
