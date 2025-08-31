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
    format: (value: number) => {
      return numberFormatter.format(value);
    },
    parse: (value: string) => {
      const rawValue = parseInt(value.replace(/\D/g, ""), 10) || 0;

      return rawValue / 100;
    },
  };
}

/**
 * Default Brazilian currency formatter instance
 */
export const brazilianCurrencyFormatter = createBrazilianCurrencyFormatter();
