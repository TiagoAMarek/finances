import { FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { Input } from "@/features/shared/components/ui";

import type { BaseFieldProps } from "./types";

/**
 * File input field component with consistent styling and RHF integration
 */
export function FileInput<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder,
  autoFocus = false,
  accept,
  multiple = false,
  maxSize,
  validateFile,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  validateFile?: (file: File) => string | null;
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
        accept={accept}
        autoFocus={autoFocus}
        className={`h-11 ${className || ""}`}
        data-testid={testId}
        disabled={disabled}
        multiple={multiple}
        placeholder={placeholder}
        type="file"
        {...form.register(name, {
          validate: (files: FileList | null) => {
            if (!files || files.length === 0) return true;

            const fileList = Array.from(files);
            for (const file of fileList) {
              if (maxSize && file.size > maxSize) {
                return `Arquivo ${file.name} é muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`;
              }

              if (validateFile) {
                const error = validateFile(file);
                if (error) return error;
              }
            }

            return true;
          },
        })}
      />
    </FormModalField>
  );
}