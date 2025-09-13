import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const applyCurrencyMask = (value: string): string => {
  // Remove all non-numeric characters except comma and dot
  let cleaned = value.replace(/[^\d,]/g, '');

  // Convert comma to dot for internal processing
  cleaned = cleaned.replace(',', '.');

  // Parse as float and limit to 2 decimal places
  const numericValue = parseFloat(cleaned) || 0;

  // Format back to Brazilian format (comma as decimal separator)
  return numericValue.toFixed(2).replace('.', ',');
};

export const removeCurrencyMask = (maskedValue: string): string => {
  // Remove R$ and spaces
  const cleaned = maskedValue.replace(/[R$\s]/g, '');

  // Handle Brazilian number format: remove thousand separators (dots) and convert comma to dot
  // Example: "1.234,56" -> "1234.56"
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      // Remove dots (thousand separators) from integer part and combine with decimal part
      const integerPart = parts[0].replace(/\./g, '');
      const decimalPart = parts[1];
      return `${integerPart}.${decimalPart}`;
    }
  }

  // If no comma, just remove dots (thousand separators) - this handles integer values
  return cleaned.replace(/\./g, '');
};

export const formatCurrencyInput = (value: string): string => {
  // Remove any non-numeric characters except dots and commas
  const cleaned = value.replace(/[^\d.,]/g, '');

  if (!cleaned) return '';

  // If input already contains a comma (Brazilian format), preserve it
  if (cleaned.includes(',')) {
    // Split by comma to handle decimal part
    const parts = cleaned.split(',');
    if (parts.length === 2) {
      // Format the integer part with thousand separators if needed
      const integerPart = parts[0].replace(/\D/g, '');
      const decimalPart = parts[1].substring(0, 2); // Limit to 2 decimal places

      if (integerPart) {
        const formatted = parseInt(integerPart).toLocaleString('pt-BR');
        return decimalPart ? `${formatted},${decimalPart}` : formatted;
      }
      return decimalPart ? `0,${decimalPart}` : '';
    }
  }

  // If input contains a dot (likely decimal format like 123.45)
  if (cleaned.includes('.')) {
    const numericValue = parseFloat(cleaned);
    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  // If it's just digits, treat as integer with 2 decimal places
  const numericValue = parseInt(cleaned);
  if (!isNaN(numericValue)) {
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return '';
};
