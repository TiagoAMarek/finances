import { useMemo } from "react";
import { Transaction } from "@/lib/schemas";
import { TransactionFilter } from "@/lib/chart-utils";
import {
  ExpenseChartPoint,
  ExpenseStatistics,
  ExpenseAnalysisConfig,
  ExpensePeriodFilter,
  filterExpenseTransactions,
  filterTransactionsByPeriod,
  generateExpenseTrendData,
  calculateExpenseStatistics,
  formatExpenseChartData,
  getExpensePeriodDescription,
} from "@/lib/expense-utils";

/**
 * Hook return type for expense analysis data
 */
export interface ExpenseAnalysisData {
  chartData: ExpenseChartPoint[];
  formattedChartData: Array<{
    month: string;
    total: number;
    transactions: number;
  }>;
  statistics: ExpenseStatistics;
  isEmpty: boolean;
  periodDescription: string;
}

/**
 * Props for the expense analysis hook
 */
export interface UseExpenseAnalysisProps {
  transactions: Transaction[];
  periodFilter?: ExpensePeriodFilter;
  selectedMonth?: number;
  selectedYear?: number;
  selectedAccountId?: number | null;
  selectedCreditCardId?: number | null;
}

/**
 * Custom hook for expense analysis data processing
 * 
 * Handles all business logic for expense trend analysis including:
 * - Transaction filtering by account/credit card
 * - Period-based data generation
 * - Statistical calculations
 * - Data formatting for chart consumption
 */
export function useExpenseAnalysis({
  transactions,
  periodFilter = "currentMonth",
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: UseExpenseAnalysisProps): ExpenseAnalysisData {
  // Create transaction filter object
  const transactionFilter: TransactionFilter = useMemo(
    () => ({
      accountId: selectedAccountId,
      creditCardId: selectedCreditCardId,
    }),
    [selectedAccountId, selectedCreditCardId],
  );

  // Create analysis configuration
  const config: ExpenseAnalysisConfig = useMemo(
    () => ({
      periodFilter,
      selectedMonth,
      selectedYear,
    }),
    [periodFilter, selectedMonth, selectedYear],
  );

  // Filter expense transactions by account/credit card
  const filteredExpenseTransactions = useMemo(
    () => filterExpenseTransactions(transactions, transactionFilter),
    [transactions, transactionFilter],
  );

  // Filter transactions by period
  const periodFilteredTransactions = useMemo(
    () => filterTransactionsByPeriod(filteredExpenseTransactions, config),
    [filteredExpenseTransactions, config],
  );

  // Generate chart data based on period configuration
  const chartData = useMemo(
    () => generateExpenseTrendData(filteredExpenseTransactions, config),
    [filteredExpenseTransactions, config],
  );

  // Calculate statistics from chart data
  const statistics = useMemo(
    () => calculateExpenseStatistics(chartData),
    [chartData],
  );

  // Format chart data for Recharts consumption
  const formattedChartData = useMemo(
    () => formatExpenseChartData(chartData),
    [chartData],
  );

  // Generate period description
  const periodDescription = useMemo(
    () => getExpensePeriodDescription(periodFilter),
    [periodFilter],
  );

  // Determine if data is empty
  const isEmpty = useMemo(
    () => periodFilteredTransactions.length === 0,
    [periodFilteredTransactions],
  );

  return {
    chartData,
    formattedChartData,
    statistics,
    isEmpty,
    periodDescription,
  };
}

/**
 * Hook for getting filtered expense transactions
 * 
 * Useful for components that only need the filtered transaction data
 * without the full analysis processing
 */
export function useFilteredExpenseTransactions({
  transactions,
  periodFilter = "currentMonth",
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: UseExpenseAnalysisProps): Transaction[] {
  const transactionFilter: TransactionFilter = useMemo(
    () => ({
      accountId: selectedAccountId,
      creditCardId: selectedCreditCardId,
    }),
    [selectedAccountId, selectedCreditCardId],
  );

  const config: ExpenseAnalysisConfig = useMemo(
    () => ({
      periodFilter,
      selectedMonth,
      selectedYear,
    }),
    [periodFilter, selectedMonth, selectedYear],
  );

  const filteredExpenseTransactions = useMemo(
    () => filterExpenseTransactions(transactions, transactionFilter),
    [transactions, transactionFilter],
  );

  return useMemo(
    () => filterTransactionsByPeriod(filteredExpenseTransactions, config),
    [filteredExpenseTransactions, config],
  );
}

/**
 * Hook for expense statistics only
 * 
 * Lightweight hook for components that only need statistical data
 */
export function useExpenseStatistics({
  transactions,
  periodFilter = "currentMonth",
  selectedMonth,
  selectedYear,
  selectedAccountId,
  selectedCreditCardId,
}: UseExpenseAnalysisProps): {
  statistics: ExpenseStatistics;
  isEmpty: boolean;
} {
  const analysisData = useExpenseAnalysis({
    transactions,
    periodFilter,
    selectedMonth,
    selectedYear,
    selectedAccountId,
    selectedCreditCardId,
  });

  return {
    statistics: analysisData.statistics,
    isEmpty: analysisData.isEmpty,
  };
}