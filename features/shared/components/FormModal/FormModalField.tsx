import { useMemo } from "react";
import { FormField } from "../ui/form-field";
import type { FieldValidationState, FormModalFieldProps } from "./types";


/**
 * Enhanced FormModal Field with react-hook-form integration
 * Optimized with memoized validation state calculation
 */
export function FormModalField({
  form,
  name,
  label,
  description,
  required = false,
  children,
}: FormModalFieldProps) {
  const {
    formState: { errors, touchedFields },
    watch,
  } = form;

  // Memoized field validation state to prevent unnecessary recalculations
  const fieldValidation = useMemo<FieldValidationState>(() => {
    const fieldError = errors[name];
    const isTouched = name in touchedFields;
    const watchedValue = watch(name);
    const isValid = isTouched && !fieldError && !!watchedValue;

    return {
      error:
        typeof fieldError?.message === "string"
          ? fieldError.message
          : undefined,
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
