---
name: accessibility
description: Implement WCAG-compliant accessible interfaces. Use when building forms, modals, navigation, or any interactive components to ensure keyboard navigation, screen reader support, and inclusive design.
---

# Accessibility (a11y) Skill

Build inclusive interfaces that work for everyone — keyboard users, screen reader users, and users with visual, motor, or cognitive differences.

## Core Principles

1. **Perceivable** — Content must be presentable in ways users can perceive
2. **Operable** — Interface must be navigable via keyboard and assistive tech
3. **Understandable** — Content and operation must be clear
4. **Robust** — Content must work across browsers and assistive technologies

---

## Semantic HTML

### Use the Right Elements

```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- Main content -->
<main id="main-content">
  <article>
    <header>
      <h1>Page Title</h1>
    </header>
    <section aria-labelledby="section-heading">
      <h2 id="section-heading">Section</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<!-- Footer -->
<footer>
  <p>&copy; 2024 Company</p>
</footer>
```

### Heading Hierarchy

```html
<!-- Correct: Logical hierarchy -->
<h1>Page Title</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

<!-- Wrong: Skipping levels -->
<h1>Page Title</h1>
  <h3>Section</h3>  <!-- Should be h2 -->
```

---

## Keyboard Navigation

### Focus Management

```tsx
// Focus trap for modals
function Modal({ open, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Store previously focused element
    const previousFocus = document.activeElement as HTMLElement;

    // Focus first focusable element in modal
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable?.[0] as HTMLElement)?.focus();

    // Restore focus on close
    return () => previousFocus?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {children}
    </div>
  );
}
```

### Skip Link

```tsx
// First element in body
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

### Keyboard Handlers

```tsx
// Arrow key navigation for menus
function Menu({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        items[activeIndex].onClick();
        break;
    }
  };

  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={i === activeIndex ? 0 : -1}
          aria-selected={i === activeIndex}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

---

## ARIA Attributes

### Common Patterns

```tsx
// Buttons that control visibility
<button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  aria-haspopup="true"
>
  Menu
</button>
<div id="dropdown-menu" hidden={!isOpen}>
  ...
</div>

// Loading states
<button aria-busy={loading} disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Error states
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <span id="email-error" role="alert">{error}</span>}

// Required fields
<label>
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input required aria-required="true" />
```

### Live Regions

```tsx
// Announce dynamic content to screen readers
<div role="status" aria-live="polite" aria-atomic="true">
  {message}
</div>

// For urgent updates
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## Forms

### Accessible Form Pattern

```tsx
<form onSubmit={handleSubmit} noValidate>
  {/* Text input */}
  <div>
    <label htmlFor="email">
      Email address
      <span aria-hidden="true" className="text-red-500">*</span>
    </label>
    <input
      id="email"
      type="email"
      required
      aria-required="true"
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? 'email-error' : 'email-hint'}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <p id="email-hint" className="text-sm text-muted-foreground">
      We'll never share your email
    </p>
    {errors.email && (
      <p id="email-error" role="alert" className="text-sm text-red-500">
        {errors.email}
      </p>
    )}
  </div>

  {/* Checkbox */}
  <div>
    <input
      id="terms"
      type="checkbox"
      required
      aria-required="true"
      checked={terms}
      onChange={(e) => setTerms(e.target.checked)}
    />
    <label htmlFor="terms">
      I agree to the <a href="/terms">Terms of Service</a>
    </label>
  </div>

  {/* Submit */}
  <button type="submit" disabled={submitting}>
    {submitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### Field Groups

```tsx
<fieldset>
  <legend>Shipping Address</legend>
  <div>
    <label htmlFor="street">Street</label>
    <input id="street" />
  </div>
  <div>
    <label htmlFor="city">City</label>
    <input id="city" />
  </div>
</fieldset>
```

---

## Color & Contrast

### Minimum Contrast Ratios (WCAG AA)

- **Normal text**: 4.5:1
- **Large text** (18pt+ or 14pt bold): 3:1
- **UI components**: 3:1

### Don't Rely on Color Alone

```tsx
// Bad: Only color indicates error
<input className={error ? 'border-red-500' : 'border-gray-300'} />

// Good: Color + icon + text
<div>
  <input
    className={cn(
      'border',
      error ? 'border-red-500' : 'border-gray-300'
    )}
    aria-invalid={!!error}
    aria-describedby={error ? 'error-msg' : undefined}
  />
  {error && (
    <p id="error-msg" className="flex items-center gap-1 text-red-500">
      <AlertIcon aria-hidden="true" />
      {error}
    </p>
  )}
</div>
```

---

## Images & Icons

### Informative Images

```tsx
// Informative: Describe the image
<img src="/chart.png" alt="Sales increased 25% in Q4 2024" />

// Decorative: Empty alt
<img src="/decoration.png" alt="" />

// Complex: Use figure + figcaption
<figure>
  <img src="/chart.png" alt="Quarterly sales chart" />
  <figcaption>
    Sales increased 25% in Q4 compared to Q3...
  </figcaption>
</figure>
```

### Icon Buttons

```tsx
// Icon-only button: Add aria-label
<button aria-label="Close menu">
  <XIcon aria-hidden="true" />
</button>

// Icon with visible text: Hide icon from SR
<button>
  <TrashIcon aria-hidden="true" />
  Delete
</button>
```

---

## Screen Reader Utilities

```css
/* Visually hidden but accessible */
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

/* Show on focus (for skip links) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Touch Targets

```css
/* Minimum 44x44px touch targets */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Increase clickable area without changing visual size */
.clickable-area {
  position: relative;
}

.clickable-area::before {
  content: '';
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -8px;
}
```

---

## Testing Checklist

### Manual Testing

- [ ] Navigate entire page with Tab key
- [ ] All interactive elements have visible focus indicator
- [ ] Forms work without mouse
- [ ] Modals trap focus and return focus on close
- [ ] Skip link works

### Screen Reader Testing

- [ ] Page has logical heading structure
- [ ] Images have appropriate alt text
- [ ] Form labels are announced
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

### Automated Testing

```bash
# Install axe-core for testing
npm install @axe-core/react

# Or use browser extensions:
# - axe DevTools
# - WAVE
# - Lighthouse Accessibility audit
```

```tsx
// React testing with axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Quick Reference

| Element | Required Accessibility |
|---------|----------------------|
| Button | `aria-label` if icon-only, `aria-pressed` for toggles |
| Link | Descriptive text, `aria-current="page"` for current |
| Input | Associated `<label>`, `aria-invalid`, `aria-describedby` |
| Modal | `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap |
| Menu | `role="menu"`, `role="menuitem"`, arrow key navigation |
| Tab | `role="tablist"`, `role="tab"`, `aria-selected` |
| Alert | `role="alert"`, `aria-live="assertive"` |
| Loading | `aria-busy`, `role="status"` |
