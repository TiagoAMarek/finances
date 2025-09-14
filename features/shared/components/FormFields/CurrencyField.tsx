import { Controller, FieldValues } from "react-hook-form";

import { FormModalField } from "@/features/shared/components/FormModal";
import { FormattedInput } from "@/features/shared/components/ui";
import { brazilianCurrencyFormatter } from "@/lib/formatters";

import type { BaseFieldProps } from "./types";

/**
 * Currency input field component with Brazilian formatting and RHF integration
 */
export function CurrencyField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  placeholder = "0,00",
  autoFocus = false,
  currencySymbol = "R$",
  showSymbol = true,
  "data-testid": testId,
}: BaseFieldProps<T> & {
  currencySymbol?: string;
  showSymbol?: boolean;
}) {
  return (
    <FormModalField
      description={description}
      form={form}
      label={label}
      name={name}
      required={required}
    >
      <div className="relative">
        {showSymbol && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            {currencySymbol}
          </span>
        )}
        <Controller
          control={form.control}
          name={name}
          render={({ field: { ...fieldProps } }) => (
            <FormattedInput
              {...fieldProps}
              autoFocus={autoFocus}
              className={`h-11 ${showSymbol ? "pl-10" : ""} ${className || ""}`}
              control={form.control}
              data-testid={testId}
              disabled={disabled}
              formatter={brazilianCurrencyFormatter}
              name={name}
              placeholder={placeholder}
            />
          )}
        />
      </div>
    </FormModalField>
  );
}