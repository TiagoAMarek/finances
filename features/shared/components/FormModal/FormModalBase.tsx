import { memo, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MODAL_SIZE_CLASSES, DEFAULT_MODAL_CONFIG } from "./constants";
import type { FormModalProps } from "./types";

/**
 * Base FormModal component - container for all form modals
 * Optimized with memoization and configuration-based styling
 */
export const FormModalBase = memo<FormModalProps>(function FormModal({
  open,
  onOpenChange,
  variant = DEFAULT_MODAL_CONFIG.variant,
  size = DEFAULT_MODAL_CONFIG.size,
  trigger,
  children,
}) {
  // Memoized dialog content with size-based styling
  const dialogContent = useMemo(
    () => (
      <DialogContent
        className={`${MODAL_SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </DialogContent>
    ),
    [size, children],
  );

  // Memoized dialog component based on variant
  const dialogComponent = useMemo(() => {
    if (variant === "create" && trigger) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          {dialogContent}
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }, [variant, trigger, open, onOpenChange, dialogContent]);

  return dialogComponent;
});
