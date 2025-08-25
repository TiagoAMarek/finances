import { memo, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MODAL_SIZE_CLASSES, DEFAULT_MODAL_CONFIG } from "./constants";
import type { FormModalProps } from "./types";

/**
 * Base FormModal component - container for all form modals
 * Optimized with memoization and configuration-based styling
 * Now includes escape hatches for Dialog and DialogContent customization
 */
export const FormModalBase = memo<FormModalProps>(function FormModal({
  open,
  onOpenChange,
  variant = DEFAULT_MODAL_CONFIG.variant,
  size = DEFAULT_MODAL_CONFIG.size,
  trigger,
  children,
  dialogProps = {},
  dialogContentProps = {},
}) {
  // Memoized dialog content with size-based styling and custom props
  const dialogContent = useMemo(
    () => (
      <DialogContent
        className={`${MODAL_SIZE_CLASSES[size]} max-h-[90vh] overflow-y-auto`}
        {...dialogContentProps}
      >
        {children}
      </DialogContent>
    ),
    [size, children, dialogContentProps],
  );

  // Memoized dialog component based on variant with escape hatch props
  const dialogComponent = useMemo(() => {
    if (variant === "create" && trigger) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          {dialogContent}
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...dialogProps}>
        {dialogContent}
      </Dialog>
    );
  }, [variant, trigger, open, onOpenChange, dialogContent, dialogProps]);

  return dialogComponent;
});
