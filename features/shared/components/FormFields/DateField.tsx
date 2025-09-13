import { FieldValues } from "react-hook-form";
import { Input } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Input
        type="date"
        placeholder={placeholder}
        className={`h-11 ${className || ""}`}
        disabled={disabled}
        autoFocus={autoFocus}
        min={min}
        max={max}
        data-testid={testId}
        {...form.register(name)}
      />
    </FormModalField>
  );
}