import { Controller, FieldValues } from "react-hook-form";
import { RadioGroup as UIRadioGroup, RadioGroupItem } from "@/features/shared/components/ui";
import { FormModalField } from "@/features/shared/components/FormModal";
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
      form={form}
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <UIRadioGroup
            value={field.value?.toString() || ""}
            onValueChange={(value) => {
              // Try to convert to original type if possible
              const originalValue = options.find(opt => opt.value.toString() === value)?.value;
              field.onChange(originalValue);
            }}
            disabled={disabled}
            className={`${direction === "horizontal" ? "flex flex-row space-x-4" : "space-y-3"} ${className || ""}`}
            data-testid={testId}
          >
            {options.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${name}-${option.value}`}
                  disabled={option.disabled || disabled}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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