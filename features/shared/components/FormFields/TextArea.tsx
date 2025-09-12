import { FieldValues } from "react-hook-form";
import { Textarea } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Textarea
        placeholder={placeholder}
        className={`h-auto min-h-[80px] ${className || ""}`}
        disabled={disabled}
        autoFocus={autoFocus}
        rows={rows}
        maxLength={maxLength}
        style={{ resize }}
        data-testid={testId}
        {...form.register(name)}
      />
    </FormModalField>
  );
}