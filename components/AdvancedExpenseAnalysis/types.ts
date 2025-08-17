import { Transaction } from "@/lib/schemas";
import { ExpensePeriodFilter } from "@/lib/expense-utils";

/**
 * Type definitions for AdvancedExpenseAnalysis components
 */

/**
 * Props for the main AdvancedExpenseAnalysis component
 */
export interface AdvancedExpenseAnalysisProps {
  transactions: Transaction[];
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
  periodFilter?: ExpensePeriodFilter;
  isLoading?: boolean;
}

/**
 * Filter configuration for expense analysis
 */
export interface ExpenseFilter {
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

/**
 * Date configuration for expense analysis
 */
export interface ExpenseDateConfig {
  selectedMonth?: number;
  selectedYear?: number;
}