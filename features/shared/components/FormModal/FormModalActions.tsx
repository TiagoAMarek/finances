import { useMemo, useCallback } from "react";
import { FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { DEFAULT_MODAL_CONFIG } from "./constants";
import { getLoadingText, renderIcon, isFormValid } from "./utils";
import type { FormModalActionsProps } from "./types";

/**
 * Unified FormModal Actions - handles both traditional and hook form approaches
 * Automatically detects form instance and applies appropriate validation logic
 */
function FormModalActionsImpl<T extends FieldValues = FieldValues>({
  onCancel,
  cancelText = DEFAULT_MODAL_CONFIG.cancelText,
  submitText,
  submitIcon,
  isLoading,
  isDisabled = false,
  form,
}: FormModalActionsProps<T>) {
  // Memoized loading text calculation
  const loadingText = useMemo(() => getLoadingText(submitText), [submitText]);

  // Memoized submit icon rendering
  const submitIconComponent = useMemo(
    () => submitIcon ? renderIcon(submitIcon, "h-4 w-4") : null,
    [submitIcon]
  );

  // Extract form validity state if form is provided
  const { isValid } = form?.formState || {};

  // Memoized form validation state
  const formValidation = useMemo(() => {
    if (!form) return { isFormProvided: false, isFormValid: true };
    return {
      isFormProvided: true,
      isFormValid: isValid,
    };
  }, [form, isValid]);

  // Memoized submit button disabled state
  const isSubmitDisabled = useMemo(() => {
    if (isLoading) return true;
    if (formValidation.isFormProvided) return !formValidation.isFormValid;
    return isDisabled;
  }, [isLoading, formValidation.isFormProvided, formValidation.isFormValid, isDisabled]);

  // Memoized cancel handler to prevent unnecessary re-renders
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        className="flex-1"
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="flex-1"
      >
        {isLoading ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {submitIconComponent}
            {submitText}
          </>
        )}
      </Button>
    </div>
  );
}

// Export as generic component
export const FormModalActions = FormModalActionsImpl;
