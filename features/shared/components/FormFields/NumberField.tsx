import { FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Input } from "@/features/shared/components/ui";

import type { BaseFieldProps } from "./types";

/**
 * Number input field component with consistent styling and RHF integration
 */
export function NumberField<T extends FieldValues>({
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
  step,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  min?: number;
  max?: number;
  step?: number;
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
        step={step}
        type="number"
        {...form.register(name, {
          valueAsNumber: true,
        })}
      />
    </FormModalField>
  );
}