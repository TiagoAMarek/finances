import { FieldValues } from "react-hook-form";
import { Input } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Input
        type="file"
        placeholder={placeholder}
        className={`h-11 ${className || ""}`}
        disabled={disabled}
        autoFocus={autoFocus}
        accept={accept}
        multiple={multiple}
        data-testid={testId}
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