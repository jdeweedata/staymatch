---
name: design-system-utils
description: Utilities for working with design systems, tokens, and components.
---

# Design System Utilities

This skill provides utilities and guidelines for effectively working with the project's design system.

## 1. Finding Components

Before building a new component, always check if a similar one exists in the design system.

-   **Search**: Look for components in `components/ui`, `components/common`, or similar directories.
-   **Patterns**: Identify common UI patterns (cards, lists, forms) and see if there's a composite component available.

## 2. Using Tokens

Always use design tokens (variables) instead of hardcoded values for:

-   **Colors**: `text-primary`, `bg-surface`, `border-subtle`, etc.
-   **Spacing**: `spacing-4` (1rem), `spacing-2` (0.5rem), etc.
-   **Typography**: `text-xl`, `font-bold`, `leading-tight`.
-   **Shadows/Radius**: `shadow-md`, `rounded-lg`.

## 3. Extending Components

If a component *almost* fits your needs:

1.  **Composition**: Can you wrap it or slot content into it?
2.  **Props**: Can you add a prop to support the variation?
3.  **Variant**: Should you create a new variant (e.g., button variants)?
4.  **Fork**: Only fork/copy if the behavior is fundamentally different.

## 4. Checklist for Design System Usage

-   [ ] Used semantic tokens for colors (meaning over value).
-   [ ] Used standard spacing scale.
-   [ ] Used standard typography scale.
-   [ ] Checked for existing components before building new ones.
