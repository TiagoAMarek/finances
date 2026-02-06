import { z } from "zod";

import { VALIDATION_MESSAGES, requiredMessage, formatMessage } from "@/lib/validation-messages";

// Re-export validation utilities for easy access from schemas
export { VALIDATION_MESSAGES, requiredMessage, formatMessage };

/**
 * Validates financial amount as a positive decimal string with up to 2 decimal places
 * Accepts formats like: "123", "123.45", "0.5"
 * Rejects: negative numbers, non-numeric strings, more than 2 decimals
 */
export function validAmount(fieldName?: string) {
  let message: string = VALIDATION_MESSAGES.required.amount;
  
  // Type-safe field name lookup
  if (fieldName) {
    const validFields: Record<string, string> = VALIDATION_MESSAGES.required;
    message = validFields[fieldName] || VALIDATION_MESSAGES.required.amount;
  }
    
  return z
    .string()
    .min(1, message)
    .regex(/^\d+(\.\d{1,2})?$/, VALIDATION_MESSAGES.format.amount)
    .refine((val) => parseFloat(val) > 0, VALIDATION_MESSAGES.format.amountPositive);
}