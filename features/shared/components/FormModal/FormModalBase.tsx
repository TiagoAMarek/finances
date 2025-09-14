import { memo, useMemo, useState, useCallback } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import { MODAL_SIZE_CLASSES, DEFAULT_MODAL_CONFIG } from "./constants";
import type { FormModalProps } from "./types";

/**
 * Base FormModal component - container for all form modals
 * Optimized with memoization and configuration-based styling
 * Now includes escape hatches for Dialog and DialogContent customization
 */
export const FormModalBase = memo<FormModalProps & {
  form?: UseFormReturn<FieldValues>;
  confirmOnDirtyClose?: boolean;
}>(function FormModal({
  open,
  onOpenChange,
  variant = DEFAULT_MODAL_CONFIG.variant,
  size = DEFAULT_MODAL_CONFIG.size,
  trigger,
  children,
  confirmOnDirtyClose = false,
  form,
  dialogProps = {},
  dialogContentProps = {},
}) {
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);

  // Handle close with confirmation check
  const handleCloseAttempt = useCallback((closeAction: () => void) => {
    if (confirmOnDirtyClose && form?.formState.isDirty) {
      setShowConfirmClose(true);
      setPendingCloseAction(() => closeAction);
    } else {
      closeAction();
    }
  }, [confirmOnDirtyClose, form?.formState.isDirty]);

  // Handle confirmed close (discard changes)
  const handleConfirmClose = useCallback(() => {
    if (pendingCloseAction) {
      pendingCloseAction();
      setPendingCloseAction(null);
    }
    setShowConfirmClose(false);
  }, [pendingCloseAction]);

  // Handle cancel close (stay in modal)
  const handleCancelClose = useCallback(() => {
    setShowConfirmClose(false);
    setPendingCloseAction(null);
  }, []);

  // Enhanced onOpenChange with confirmation logic
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && open) {
      // Attempting to close
      handleCloseAttempt(() => onOpenChange(false));
    } else {
      // Opening or programmatic close
      onOpenChange(newOpen);
    }
  }, [open, onOpenChange, handleCloseAttempt]);

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
        <Dialog open={open} onOpenChange={handleOpenChange} {...dialogProps}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          {dialogContent}
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={handleOpenChange} {...dialogProps}>
        {dialogContent}
      </Dialog>
    );
  }, [variant, trigger, open, handleOpenChange, dialogContent, dialogProps]);

  return (
    <>
      {dialogComponent}

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Deseja realmente fechar sem salvar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
