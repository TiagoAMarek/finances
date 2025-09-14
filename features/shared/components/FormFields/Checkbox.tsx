import { Controller, FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Checkbox as UICheckbox } from "@/features/shared/components/ui/checkbox";

import type { BaseFieldProps } from "./types";

/**
 * Checkbox field component with RHF integration
 */
export function Checkbox<T extends FieldValues>({
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
      description={description}
      form={form}
      label={label}
      name={name}
      required={required}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <UICheckbox
            {...fieldProps}
            autoFocus={autoFocus}
            checked={value || false}
            className={className}
            data-testid={testId}
            disabled={disabled}
            onCheckedChange={onChange}
          />
        )}
      />
    </FormModalField>
  );
}
