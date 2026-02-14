---
name: component-builder
description: Build production-ready React components with proper types, accessibility, and design system integration. Use when creating new UI components from scratch or from Figma designs.
---

# Component Builder

Build production-ready React components following design engineering best practices.

## Component Template

```tsx
// components/ui/[ComponentName]/[ComponentName].tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// 1. Define props interface
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary variant affects visual style */
  variant?: 'default' | 'primary' | 'secondary';
  /** Size affects padding and font size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state shows spinner */
  loading?: boolean;
}

// 2. Define variant styles
const variants = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// 3. Build component with forwardRef
export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  (
    {
      variant = 'default',
      size = 'md',
      disabled = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-primary focus-visible:ring-offset-2',
          // Variant styles
          variants[variant],
          sizes[size],
          // State styles
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'relative',
          // Custom classes
          className
        )}
        aria-disabled={disabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner className="w-4 h-4" />
          </span>
        )}
        <span className={cn(loading && 'invisible')}>{children}</span>
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

## Component Checklist

### Structure
- [ ] TypeScript interface for all props
- [ ] forwardRef for DOM access
- [ ] Spread remaining props
- [ ] className composition with cn()

### Variants
- [ ] Default variant defined
- [ ] Size variants (sm, md, lg)
- [ ] State variants (disabled, loading, error)

### Accessibility
- [ ] Semantic HTML element
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation
- [ ] Focus visible indicator

### Styling
- [ ] CSS custom properties for theming
- [ ] Responsive by default
- [ ] Dark mode support
- [ ] Transition for interactive states

### Documentation
- [ ] JSDoc comments for props
- [ ] Usage examples
- [ ] Storybook story (if applicable)

---

## Common Patterns

### Button Component
```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={props.disabled || loading}
      className={cn(buttonVariants({ variant, size }))}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
);
```

### Input Component
```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label htmlFor={props.id} className="text-sm text-muted-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 rounded-lg border',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          error && 'border-red-500'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
);
```

### Card Component
```tsx
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border',
        'bg-card p-6',
        'transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Modal Component
```tsx
export function Modal({ open, onClose, title, children }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative bg-background rounded-xl p-6 max-w-md w-full mx-4">
        <h2 id="modal-title" className="text-xl font-semibold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close modal"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
}
```

---

## cn() Utility

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install dependencies:
```bash
npm install clsx tailwind-merge
```
