import { FieldValues, Path, UseFormReturn } from "react-hook-form";

/**
 * Base field props interface that all form fields should extend
 */
export interface BaseFieldProps<T extends FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>;
  /** Field name with type safety */
  name: Path<T>;
  /** Field label text */
  label: string;
  /** Optional field description */
  description?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Auto focus the field */
  autoFocus?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Select field option interface
 */
export interface SelectOption {
  /** Option value */
  value: string | number;
  /** Option display label */
  label: string;
  /** Optional icon or emoji */
  icon?: string;
  /** Optional color for visual indicators */
  color?: string;
  /** Whether option is disabled */
  disabled?: boolean;
}

/**
 * Radio group field props
 */
export interface RadioGroupFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Available options */
  options: SelectOption[];
  /** Layout direction */
  direction?: "horizontal" | "vertical";
}

/**
 * Select field props
 */
export interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Available options */
  options: SelectOption[];
  /** Placeholder text when no option is selected */
  placeholder?: string;
}

/**
 * Currency field props
 */
export interface CurrencyFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Currency symbol (default: "R$") */
  currencySymbol?: string;
  /** Whether to show currency symbol */
  showSymbol?: boolean;
}

/**
 * Number field props
 */
export interface NumberFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
}

/**
 * Date field props
 */
export interface DateFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Minimum date (ISO string) */
  min?: string;
  /** Maximum date (ISO string) */
  max?: string;
}

/**
 * Text area field props
 */
export interface TextAreaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Number of rows */
  rows?: number;
  /** Maximum length */
  maxLength?: number;
  /** Resize behavior */
  resize?: "none" | "vertical" | "horizontal" | "both";
}

/**
 * File input field props
 */
export interface FileInputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Accepted file types */
  accept?: string;
  /** Multiple file selection */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Custom file validation function */
  validateFile?: (file: File) => string | null;
}