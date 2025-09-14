import { z } from "zod";

// Monthly summary schema - reflecting API structure
export const MonthlySummarySchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  total_income: z.number(),
  total_expense: z.number(),
  balance: z.number(),
});

export const MonthlySummaryRequestSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});