import * as React from "react";
import { forwardRef } from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "./input";
import { Formatter } from "@/lib/formatters";

/**
 * Props for FormattedInput component
 */
export interface FormattedInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;
  /** Field name for react-hook-form */
  name: TName;
  /** Formatter to handle value conversion */
  formatter: Formatter<string>;
}

/**
 * Generic formatted input component that works with any formatter
 * Integrates directly with React Hook Form using Controller pattern
 */
function FormattedInputImpl<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name, formatter, ...props }: FormattedInputProps<TFieldValues, TName>, ref: React.ForwardedRef<HTMLInputElement>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <Input
          {...fieldProps}
          {...props}
          ref={ref}
          value={formatter.format(value || "")}
          onChange={(e) => {
            const parsedValue = formatter.parse(e.target.value);
            onChange(parsedValue);
          }}
        />
      )}
    />
  );
}

export const FormattedInput = forwardRef(FormattedInputImpl) as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: FormattedInputProps<TFieldValues, TName> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof FormattedInputImpl> & { displayName?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(FormattedInput as any).displayName = "FormattedInput";