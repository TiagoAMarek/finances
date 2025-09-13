import { FieldValues } from "react-hook-form";
import { Input } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Input
        type="number"
        placeholder={placeholder}
        className={`h-11 ${className || ""}`}
        disabled={disabled}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
        data-testid={testId}
        {...form.register(name, {
          valueAsNumber: true,
        })}
      />
    </FormModalField>
  );
}