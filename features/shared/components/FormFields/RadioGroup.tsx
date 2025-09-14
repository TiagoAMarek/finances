import { Controller, FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { RadioGroup as UIRadioGroup, RadioGroupItem } from "@/features/shared/components/ui";

import type { BaseFieldProps, SelectOption } from "./types";

/**
 * Radio group field component with RHF integration
 */
export function RadioGroup<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  options,
  direction = "vertical",
  "data-testid": testId,
}: BaseFieldProps<T> & {
  options: SelectOption[];
  direction?: "horizontal" | "vertical";
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
          <UIRadioGroup
            className={`${direction === "horizontal" ? "flex flex-row space-x-4" : "space-y-3"} ${className || ""}`}
            data-testid={testId}
            disabled={disabled}
            value={field.value?.toString() || ""}
            onValueChange={(value) => {
              // Try to convert to original type if possible
              const originalValue = options.find(opt => opt.value.toString() === value)?.value;
              field.onChange(originalValue);
            }}
          >
            {options.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem
                  disabled={option.disabled || disabled}
                  id={`${name}-${option.value}`}
                  value={option.value.toString()}
                />
                <label
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor={`${name}-${option.value}`}
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
                </label>
              </div>
            ))}
          </UIRadioGroup>
        )}
      />
    </FormModalField>
  );
}