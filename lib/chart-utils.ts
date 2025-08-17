import { Transaction } from "@/lib/schemas";

/**
 * Chart data point interface for income vs expense charts
 */
export interface ChartDataPoint {
  month: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

/**
 * Filter configuration for transactions
 */
export interface TransactionFilter {
  accountId?: number | null;
  creditCardId?: number | null;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Period type for chart data generation
 */
export type PeriodType =
  | "current-month"
  | "7-days"
  | "3-months"
  | "custom"
  | "6-months";

/**
 * Chart configuration for different period types
 */
export interface ChartConfig {
  periodType: PeriodType;
  selectedMonth?: number;
  selectedYear?: number;
}

/**
 * Applies account and credit card filters to transactions
 */
export function applyTransactionFilters(
  transactions: Transaction[],
  filter: TransactionFilter,
): Transaction[] {
  let filtered = transactions;

  if (filter.accountId !== null && filter.accountId !== undefined) {
    filtered = filtered.filter((t) => t.accountId === filter.accountId);
  }

  if (filter.creditCardId !== null && filter.creditCardId !== undefined) {
    filtered = filtered.filter((t) => t.creditCardId === filter.creditCardId);
  }

  if (filter.startDate && filter.endDate) {
    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= filter.startDate! &&
        transactionDate <= filter.endDate!
      );
    });
  }

  return filtered;
}

/**
 * Calculates income and expense totals from transactions
 */
export function calculateTransactionTotals(transactions: Transaction[]) {
  const incomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return {
    incomes,
    expenses,
    balance: incomes - expenses,
  };
}

/**
 * Creates a chart data point from transactions for a specific period
 */
export function createChartDataPoint(
  transactions: Transaction[],
  label: string,
  filter?: TransactionFilter,
): ChartDataPoint {
  const filteredTransactions = filter
    ? applyTransactionFilters(transactions, filter)
    : transactions;

  const { incomes, expenses, balance } =
    calculateTransactionTotals(filteredTransactions);

  return {
    month: label,
    receitas: incomes,
    despesas: expenses,
    saldo: balance,
  };
}

/**
 * Formats currency values for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Gets the start and end dates for a specific week in a month
 */
export function getWeekDates(year: number, month: number, week: number) {
  const startOfMonth = new Date(year, month, 1);
  const firstDay = startOfMonth.getDay(); // 0 = sunday

  const weekStart = new Date(year, month, 1 + (week - 1) * 7 - firstDay);
  const weekEnd = new Date(year, month, week * 7 - firstDay);

  // Adjust to not exceed month boundaries
  const endOfMonth = new Date(year, month + 1, 0);
  if (weekStart < startOfMonth) weekStart.setTime(startOfMonth.getTime());
  if (weekEnd > endOfMonth) weekEnd.setTime(endOfMonth.getTime());

  return { weekStart, weekEnd };
}

/**
 * Gets the number of weeks in a specific month
 */
export function getWeeksInMonth(year: number, month: number): number {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const firstDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const totalDays = firstDay + daysInMonth;

  return Math.ceil(totalDays / 7);
}

/**
 * Gets day name in Portuguese
 */
export function getDayName(dayIndex: number): string {
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return dayNames[dayIndex];
}

/**
 * Gets month name in Portuguese (short format)
 */
export function getMonthName(date: Date): string {
  return date.toLocaleDateString("pt-BR", { month: "short" });
}

/**
 * Gets month name in Portuguese (long format) with capitalized first letter
 */
export function getMonthNameLong(date: Date): string {
  const monthName = date.toLocaleDateString("pt-BR", { month: "long" });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
}

/**
 * Filters transactions by date range
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
): Transaction[] {
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

/**
 * Filters transactions by specific month and year
 */
export function filterTransactionsByMonth(
  transactions: Transaction[],
  month: number,
  year: number,
): Transaction[] {
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === month &&
      transactionDate.getFullYear() === year
    );
  });
}
