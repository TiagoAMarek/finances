import { Formatter } from "./types";

/**
 * Creates a Brazilian currency formatter that handles the conversion between
 * decimal string values (e.g., "123.45") and formatted display values (e.g., "123,45")
 */
export function createBrazilianCurrencyFormatter(): Formatter<string> {
  const numberFormatter = new Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL",
  });

  return {
    format: (value: string | number) => {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      return numberFormatter.format(numValue);
    },
    parse: (value: string) => {
      const rawValue = parseInt(value.replace(/\D/g, ""), 10) || 0;
      return (rawValue / 100).toString();
    },
  };
}

/**
 * Default Brazilian currency formatter instance
 */
export const brazilianCurrencyFormatter = createBrazilianCurrencyFormatter();
