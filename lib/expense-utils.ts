import { Transaction } from "@/lib/schemas";

import {
  formatCurrency,
  applyTransactionFilters,
  TransactionFilter,
} from "./chart-utils";

/**
 * Expense Analysis Utility Functions
 *
 * Specialized utilities for expense analysis and trend generation,
 * building on the foundation of chart-utils.ts
 */

// Types for expense analysis
export interface ExpenseChartPoint {
  period: string;
  total: number;
  transactions: number;
  averagePerTransaction: number;
}

export interface ExpenseStatistics {
  max: number;
  min: number;
  average: number;
  total: number;
}

export type ExpensePeriodFilter = "3months" | "6months" | "12months";

export interface ExpenseAnalysisConfig {
  periodFilter: ExpensePeriodFilter;
  selectedMonth?: number;
  selectedYear?: number;
}

/**
 * Filters transactions for expense analysis
 */
export function filterExpenseTransactions(
  transactions: Transaction[],
  filter: TransactionFilter,
): Transaction[] {
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  return applyTransactionFilters(expenseTransactions, filter);
}

/**
 * Filters transactions by period for expense analysis
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  config: ExpenseAnalysisConfig,
): Transaction[] {
  const { periodFilter } = config;
  const now = new Date();

  switch (periodFilter) {
    case "3months": {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= threeMonthsAgo && transactionDate <= now;
      });
    }

    case "6months": {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= sixMonthsAgo && transactionDate <= now;
      });
    }

    case "12months":
    default: {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(now.getMonth() - 12);
      return transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= twelveMonthsAgo && transactionDate <= now;
      });
    }
  }
}

/**
 * Calculates total expenses for a set of transactions
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

/**
 * Creates an expense chart point from transactions
 */
export function createExpenseChartPoint(
  period: string,
  transactions: Transaction[],
): ExpenseChartPoint {
  const total = calculateTotalExpenses(transactions);
  const transactionCount = transactions.length;
  const averagePerTransaction =
    transactionCount > 0 ? total / transactionCount : 0;

  return {
    period,
    total,
    transactions: transactionCount,
    averagePerTransaction,
  };
}

/**
 * Generates chart data for the last 7 periods of 7 days
 */
export function generateSevenDayPeriodsData(
  transactions: Transaction[],
): ExpenseChartPoint[] {
  const data: ExpenseChartPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - i * 7);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const periodTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const periodLabel = `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;
    data.push(createExpenseChartPoint(periodLabel, periodTransactions));
  }

  return data;
}

/**
 * Generates chart data for the last 3 months
 */
export function generateThreeMonthsData(
  transactions: Transaction[],
): ExpenseChartPoint[] {
  const data: ExpenseChartPoint[] = [];

  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });

    const monthLabel = date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });
    data.push(createExpenseChartPoint(monthLabel, monthTransactions));
  }

  return data;
}

/**
 * Generates weekly breakdown data for a specific month
 */
export function generateMonthlyWeeksData(
  transactions: Transaction[],
  targetMonth: number,
  targetYear: number,
): ExpenseChartPoint[] {
  const data: ExpenseChartPoint[] = [];
  const startOfMonth = new Date(targetYear, targetMonth, 1);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

  let currentWeekStart = new Date(startOfMonth);
  let weekNumber = 1;

  while (currentWeekStart <= endOfMonth) {
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    // Don't exceed month boundary
    if (currentWeekEnd > endOfMonth) {
      currentWeekEnd.setTime(endOfMonth.getTime());
    }

    const weekTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= currentWeekStart && transactionDate <= currentWeekEnd
      );
    });

    data.push(createExpenseChartPoint(`Sem ${weekNumber}`, weekTransactions));

    // Move to next week
    currentWeekStart = new Date(currentWeekEnd);
    currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
    weekNumber++;
  }

  return data;
}

/**
 * Generates expense trend data based on period configuration
 */
export function generateExpenseTrendData(
  transactions: Transaction[],
  config: ExpenseAnalysisConfig,
): ExpenseChartPoint[] {
  const { periodFilter } = config;

  switch (periodFilter) {
    case "3months":
      return generateThreeMonthsData(transactions);

    case "6months": {
      const data: ExpenseChartPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthTransactions = transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        });

        const monthLabel = date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
        data.push(createExpenseChartPoint(monthLabel, monthTransactions));
      }
      return data;
    }

    case "12months":
    default: {
      const data: ExpenseChartPoint[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();

        const monthTransactions = transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        });

        const monthLabel = date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
        data.push(createExpenseChartPoint(monthLabel, monthTransactions));
      }
      return data;
    }
  }
}

/**
 * Calculates statistics for expense data
 */
export function calculateExpenseStatistics(
  chartData: ExpenseChartPoint[],
): ExpenseStatistics {
  if (chartData.length === 0) {
    return { max: 0, min: 0, average: 0, total: 0 };
  }

  const totals = chartData.map((d) => d.total);
  const max = Math.max(...totals);
  const min = Math.min(...totals);
  const total = totals.reduce((sum, value) => sum + value, 0);
  const average = total / chartData.length;

  return { max, min, average, total };
}

/**
 * Gets period description for display
 */
export function getExpensePeriodDescription(
  periodFilter: ExpensePeriodFilter,
): string {
  switch (periodFilter) {
    case "3months":
      return "nos últimos 3 meses";
    case "6months":
      return "nos últimos 6 meses";
    case "12months":
    default:
      return "nos últimos 12 meses";
  }
}

/**
 * Formats expense chart data for Recharts consumption
 */
export function formatExpenseChartData(chartData: ExpenseChartPoint[]) {
  return chartData.map((point) => ({
    month: point.period,
    total: point.total,
    transactions: point.transactions,
  }));
}

// Re-export commonly used utilities from chart-utils
export { formatCurrency };
