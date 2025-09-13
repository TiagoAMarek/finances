import { useMemo } from "react";
import { FieldValues, FieldError, get } from "react-hook-form";
import { FormField } from "../ui/form-field";
import type { FieldValidationState, FormModalFieldProps } from "./types";

/**
 * Enhanced FormModal Field with react-hook-form integration
 * Optimized with memoized validation state calculation and type-safe field paths
 */
export function FormModalField<T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  children,
}: FormModalFieldProps<T>) {
  const {
    formState: { errors, touchedFields },
    watch,
  } = form;

  // Memoized field validation state with proper type safety using react-hook-form's get utility
  const fieldValidation = useMemo<FieldValidationState>(() => {
    // Type-safe error access using react-hook-form's get utility
    const fieldError = get(errors, name) as FieldError | undefined;
    const isTouched = Boolean(get(touchedFields, name));
    const watchedValue = watch(name);
    const isValid = isTouched && !fieldError && !!watchedValue;

    return {
      error: fieldError?.message,
      isValid,
      isTouched,
    };
  }, [errors, name, touchedFields, watch]);

  return (
    <FormField
      label={label}
      error={fieldValidation.error}
      isValid={fieldValidation.isValid}
      required={required}
      description={description}
    >
      {children}
    </FormField>
  );
}
