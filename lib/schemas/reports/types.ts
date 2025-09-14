import { z } from "zod";
import { MonthlySummarySchema, MonthlySummaryRequestSchema } from "./monthly-summary";

// Entity types (API responses)
export type MonthlySummary = z.infer<typeof MonthlySummarySchema>;

// Input types (for forms and API requests)
export type MonthlySummaryRequestInput = z.infer<typeof MonthlySummaryRequestSchema>;