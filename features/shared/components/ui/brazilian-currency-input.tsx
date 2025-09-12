import { brazilianCurrencyFormatter } from "@/lib/formatters";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormattedInput } from "./formatted-input";
import { ComponentProps } from "react";

export interface BrazilianCurrencyInputProps<TFieldValues extends FieldValues> 
  extends Omit<ComponentProps<'input'>, 'form'> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
}

/**
 * Brazilian currency input component with formatter pattern
 * Maintains the same API as before but uses the new formatter internally
 * 
 * For React Hook Form integration, prefer using FormattedInput with Controller pattern
 * This component is kept for backward compatibility and direct usage scenarios
 */
export function BrazilianCurrencyInput<TFieldValues extends FieldValues>({
  form,
  name,
  ...props
}: BrazilianCurrencyInputProps<TFieldValues>) {

  return (
    <div className="relative">
      <FormattedInput
        control={form.control}
        name={name}
        formatter={brazilianCurrencyFormatter}
        placeholder="0,00"
        className="h-11 pl-10"
        {...props}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
        R$
      </span>
    </div>
  );
};

