/**
 * Generic formatter interface for input components
 * Separates display formatting from underlying form data
 */
export interface Formatter<T = string> {
  /**
   * Converts raw form value to display format
   * @param value - Raw value from form state
   * @returns Formatted string for display in input
   */
  format: (value: T) => string;

  /**
   * Converts formatted display value back to raw form value
   * @param value - Formatted string from input
   * @returns Raw value for form state
   */
  parse: (value: string) => T;
}

/**
 * Options for currency formatter
 */
export interface CurrencyFormatterOptions {
  /** Currency symbol to display (default: "R$") */
  currencySymbol?: string;
  /** Locale for number formatting (default: "pt-BR") */
  locale?: string;
  /** Currency code (default: "BRL") */
  currency?: string;
}