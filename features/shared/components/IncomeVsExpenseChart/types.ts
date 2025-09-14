import { PeriodType } from "@/lib/chart-utils";
import { Transaction } from "@/lib/schemas";

/**
 * Date filter configuration
 */
export interface DateFilter {
  selectedMonth: number;
  selectedYear: number;
}

/**
 * Account and credit card filter configuration
 */
export interface AccountFilter {
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

/**
 * Props for IncomeVsExpenseChart component
 */
export interface IncomeVsExpenseChartProps {
  /** Array of transactions to display in the chart */
  transactions: Transaction[];

  /** Type of period to display (determines chart granularity) */
  periodType?: PeriodType;

  /** Date filter configuration (preferred over individual month/year props) */
  dateFilter?: DateFilter;

  /** Account filter configuration */
  accountFilter?: AccountFilter;
}

/**
 * Chart totals display data
 */
export interface ChartTotals {
  totalIncomes: number;
  totalExpenses: number;
  netBalance: number;
}

/**
 * Chart summary props for the summary section
 */
export interface ChartSummaryProps {
  totals: ChartTotals;
  className?: string;
}
