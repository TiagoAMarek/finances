import * as React from "react";
import { forwardRef, useEffect, useState } from "react";

import { Input } from "./input";
import { formatCurrencyInput, removeCurrencyMask } from "@/lib/utils";

export interface BrazilianCurrencyInputProps
  extends Omit<React.ComponentProps<typeof Input>, 'type'> {
  currencySymbol?: string;
}

const BrazilianCurrencyInput = forwardRef<
  HTMLInputElement,
  BrazilianCurrencyInputProps
>(({ onChange, value, currencySymbol = "R$", placeholder = "0,00", ...props }, ref) => {
  const [displayValue, setDisplayValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setDisplayValue(formatted);

    // Convert back to decimal format for form state
    const decimalValue = removeCurrencyMask(formatted);

    // Create a new event with the decimal value for react-hook-form
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: decimalValue,
      },
    };

    onChange?.(syntheticEvent);
  };

  // Initialize display value from form value
  useEffect(() => {
    if (value && typeof value === 'string') {
      // If value is already formatted (contains comma), use it as is
      if (value.includes(',')) {
        setDisplayValue(value);
      } else {
        // Convert decimal value to formatted display
        const numericValue = parseFloat(value) || 0;
        setDisplayValue(formatCurrencyInput((numericValue * 100).toString()));
      }
    } else if (!value) {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="h-11 pl-10"
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
        {currencySymbol}
      </span>
    </div>
  );
});

BrazilianCurrencyInput.displayName = "BrazilianCurrencyInput";

export { BrazilianCurrencyInput };