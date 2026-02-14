---
name: accessibility-check
description: Checklist and guide for ensuring WCAG 2.1 AA/AAA compliance.
---

# Accessibility (a11y) Check

Ensure all interfaces are inclusive and usable by everyone.

## 1. Semantic HTML

-   Use `<button>` for actions, `<a>` for navigation.
-   Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<aside>` for landmarks.
-   Use `<h1>` through `<h6>` for correct heading hierarchy.
-   Use `<ul>`/`<ol>` for lists.

## 2. Forms

-   Every input must have a visible `<label>` or `aria-label`/`aria-labelledby`.
-   Error messages must be associated with inputs via `aria-describedby`.
-   Required fields should have `aria-required="true"`.

## 3. Keyboard Navigation

-   **Focus**: All interactive elements must be focusable via `Tab`.
-   **Visual Focus**: Focus indicators must be visible (custom or default outline).
-   **Order**: Tab order must match logical reading order.
-   **Traps**: Modals/drawers should trap focus while open.

## 4. Images & Media

-   All informational images needs descriptive `alt` text.
-   Decorative images should have `alt=""`.

## 5. Colors & Contrast

-   **Contrast**: Text vs. background must meet 4.5:1 (AA) or 7:1 (AAA).
-   **Color Meaning**: Don't rely on color alone to convey info (use icons/text too).

## 6. ARIA Usage

-   **Rule #1**: Only use ARIA when native HTML doesn't suffice.
-   **Roles**: Use valid ARIA roles (e.g., `role="dialog"`, `role="tablist"`).
-   **States**: Update `aria-expanded`, `aria-selected`, `aria-hidden` dynamically.

## Quick Audit Command (Conceptual)

When verifying, ask yourself:
1.  Can I use this with only a keyboard?
2.  Can I use this with a screen reader (e.g., VoiceOver/NVDA)?
3.  Does it work at 200% zoom?
