import { FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Input } from "@/features/shared/components/ui";

import type { BaseFieldProps } from "./types";

/**
 * Text input field component with consistent styling and RHF integration
 */
export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder,
  autoFocus = false,
  type = "text",
  maxLength,
  minLength,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  type?: "text" | "email" | "password" | "tel" | "url";
  maxLength?: number;
  minLength?: number;
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
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        type={type}
        {...form.register(name)}
      />
    </FormModalField>
  );
}