# Bottom Sheet Pattern

Reusable slide-up sheet with drag-to-dismiss and accessibility.

## Core Structure

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl"
        style={{ y, height: snapHeight }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.1, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto">{children}</div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## Drag-to-Dismiss Logic

```tsx
const DRAG_CLOSE_THRESHOLD = 100;

const handleDragEnd = useCallback(
  (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    if (offset > DRAG_CLOSE_THRESHOLD || velocity > 500) {
      onClose();
    }
  },
  [onClose]
);
```

## Accessibility Requirements

```tsx
// 1. Body scroll lock
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => { document.body.style.overflow = ""; };
}, [isOpen]);

// 2. Escape key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) onClose();
  };
  window.addEventListener("keydown", handleEscape);
  return () => window.removeEventListener("keydown", handleEscape);
}, [isOpen, onClose]);

// 3. Focus trap (focus first focusable on open)
useEffect(() => {
  if (isOpen && sheetRef.current) {
    const focusable = sheetRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable[0] as HTMLElement)?.focus();
  }
}, [isOpen]);

// 4. ARIA attributes
<motion.div
  role="dialog"
  aria-modal="true"
  aria-labelledby={title ? "sheet-title" : undefined}
/>
```

## Snap Points (Optional)

```tsx
const snapPoints = [0.6, 0.92]; // 60% and 92% of viewport height

const getSnapHeight = (index: number) => {
  return window.innerHeight * snapPoints[index];
};
```
