import { Controller, FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";

import type { BaseFieldProps, SelectOption } from "./types";

/**
 * Select field component with consistent styling and RHF integration
 */
export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder,
  options,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  options: SelectOption[];
  placeholder?: string;
}) {
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
        render={({ field }) => (
          <Select
            disabled={disabled}
            value={field.value?.toString() || ""}
            onValueChange={(value) => {
              // Try to convert to number if the original value was a number
              const originalValue = options.find(opt => opt.value.toString() === value)?.value;
              field.onChange(originalValue);
            }}
          >
            <SelectTrigger
              className={`h-11 ${className || ""}`}
              data-testid={testId}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value.toString()}
                  disabled={option.disabled}
                  value={option.value.toString()}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    {option.color && (
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormModalField>
  );
}