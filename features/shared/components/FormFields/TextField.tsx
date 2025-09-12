import { Input } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
import type { BaseFieldProps } from "./types";

/**
 * Text input field component with consistent styling and RHF integration
 */
export function TextField<T extends Record<string, any>>({
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Input
        type={type}
        placeholder={placeholder}
        className={`h-11 ${className || ""}`}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        data-testid={testId}
        {...form.register(name)}
      />
    </FormModalField>
  );
}