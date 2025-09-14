import { FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Input } from "@/features/shared/components/ui";

import type { BaseFieldProps } from "./types";

/**
 * Date input field component with consistent styling and RHF integration
 */
export function DateField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder,
  autoFocus = false,
  min,
  max,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  min?: string;
  max?: string;
}) {
  return (
    <FormModalField
      description={description}
      form={form}
      label={label}
      name={name}
      required={required}
    >
      <Input
        autoFocus={autoFocus}
        className={`h-11 ${className || ""}`}
        data-testid={testId}
        disabled={disabled}
        max={max}
        min={min}
        placeholder={placeholder}
        type="date"
        {...form.register(name)}
      />
    </FormModalField>
  );
}