import { FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Textarea } from "@/features/shared/components/ui";

import type { BaseFieldProps } from "./types";

/**
 * Text area field component with consistent styling and RHF integration
 */
export function TextArea<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder,
  autoFocus = false,
  rows = 3,
  maxLength,
  resize = "vertical",
  "data-testid": testId,
}: BaseFieldProps<T> & {
  rows?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}) {
  return (
    <FormModalField
      description={description}
      form={form}
      label={label}
      name={name}
      required={required}
    >
      <Textarea
        autoFocus={autoFocus}
        className={`h-auto min-h-[80px] ${className || ""}`}
        data-testid={testId}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        style={{ resize }}
        {...form.register(name)}
      />
    </FormModalField>
  );
}