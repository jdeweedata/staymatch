"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Called when the sheet should close */
  onClose: () => void;
  /** Sheet content */
  children: React.ReactNode;
  /** Title shown in the header */
  title?: string;
  /** Snap points as percentages of viewport height (default: [0.5, 0.9]) */
  snapPoints?: number[];
  /** Initial snap point index (default: 0) */
  initialSnap?: number;
  /** Whether to show the drag handle */
  showHandle?: boolean;
  /** Custom className for the sheet */
  className?: string;
}

const DRAG_CLOSE_THRESHOLD = 100;

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.6, 0.92],
  initialSnap = 0,
  showHandle = true,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const backdropOpacity = useTransform(y, [0, 300], [1, 0]);

  // Calculate heights from snap points
  const getSnapHeight = (index: number) => {
    if (typeof window === "undefined") return 500;
    return window.innerHeight * snapPoints[Math.min(index, snapPoints.length - 1)];
  };

  // Handle drag end - snap or close
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const offset = info.offset.y;
      const velocity = info.velocity.y;

      // Close if dragged down past threshold or fast downward velocity
      if (offset > DRAG_CLOSE_THRESHOLD || velocity > 500) {
        onClose();
        return;
      }

      // Snap to nearest point based on position
      // For now, just reset to initial position
      y.set(0);
    },
    [onClose, y]
  );

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const focusableElements = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ opacity: backdropOpacity }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border rounded-t-3xl shadow-2xl",
              "flex flex-col max-h-[92vh]",
              className
            )}
            style={{ y, height: getSnapHeight(initialSnap) }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "sheet-title" : undefined}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <h2
                  id="sheet-title"
                  className="font-display text-lg font-semibold text-foreground"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;
