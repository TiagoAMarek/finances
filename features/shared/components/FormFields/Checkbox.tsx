import { Controller } from "react-hook-form";
import { Checkbox as UICheckbox } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import type { BaseFieldProps } from "./types";

/**
 * Checkbox field component with RHF integration
 */
export function Checkbox<T extends Record<string, any>>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  autoFocus = false,
  "data-testid": testId,
}: BaseFieldProps<T>) {
  return (
    <FormModalField
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <UICheckbox
            {...fieldProps}
            checked={value || false}
            onCheckedChange={onChange}
            disabled={disabled}
            autoFocus={autoFocus}
            data-testid={testId}
            className={className}
          />
        )}
      />
    </FormModalField>
  );
}