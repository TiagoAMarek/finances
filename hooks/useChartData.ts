import { useMemo } from "react";
import { Transaction } from "@/lib/schemas";
import {
  ChartDataPoint,
  TransactionFilter,
  ChartConfig,
  createChartDataPoint,
  getWeekDates,
  getWeeksInMonth,
  getDayName,
  getMonthName,
  getMonthNameLong,
  filterTransactionsByDateRange,
  filterTransactionsByMonth,
} from "@/lib/chart-utils";

/**
 * Hook for generating daily chart data (last 7 days)
 */
export function useDailyChartData(
  transactions: Transaction[],
  filter: TransactionFilter = {},
): ChartDataPoint[] {
  return useMemo(() => {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayName = getDayName(date.getDay());
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );

      const dayTransactions = filterTransactionsByDateRange(
        transactions,
        dayStart,
        dayEnd,
      );

      const chartPoint = createChartDataPoint(dayTransactions, dayName, filter);

      data.push(chartPoint);
    }

    return data;
  }, [transactions, filter]);
}

/**
 * Hook for generating weekly chart data for a specific month
 */
export function useWeeklyChartData(
  transactions: Transaction[],
  year: number,
  month: number,
  filter: TransactionFilter = {},
): ChartDataPoint[] {
  return useMemo(() => {
    const data: ChartDataPoint[] = [];
    const weeks = getWeeksInMonth(year, month);

    for (let week = 1; week <= weeks; week++) {
      const { weekStart, weekEnd } = getWeekDates(year, month, week);

      const weekTransactions = filterTransactionsByDateRange(
        transactions,
        weekStart,
        weekEnd,
      );

      const chartPoint = createChartDataPoint(
        weekTransactions,
        `Sem ${week}`,
        filter,
      );

      data.push(chartPoint);
    }

    return data;
  }, [transactions, year, month, filter]);
}

/**
 * Hook for generating monthly chart data for multiple months
 */
export function useMonthlyChartData(
  transactions: Transaction[],
  monthsCount: number,
  filter: TransactionFilter = {},
): ChartDataPoint[] {
  return useMemo(() => {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = getMonthName(date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      const monthTransactions = filterTransactionsByMonth(
        transactions,
        monthIndex,
        year,
      );

      const chartPoint = createChartDataPoint(
        monthTransactions,
        `${month} ${year}`,
        filter,
      );

      data.push(chartPoint);
    }

    return data;
  }, [transactions, monthsCount, filter]);
}

/**
 * Hook for generating chart data for a single specific month
 */
export function useSingleMonthChartData(
  transactions: Transaction[],
  year: number,
  month: number,
  filter: TransactionFilter = {},
): ChartDataPoint[] {
  return useMemo(() => {
    const date = new Date(year, month, 1);
    const monthName = getMonthName(date);

    const monthTransactions = filterTransactionsByMonth(
      transactions,
      month,
      year,
    );

    const chartPoint = createChartDataPoint(
      monthTransactions,
      monthName,
      filter,
    );

    return [chartPoint];
  }, [transactions, year, month, filter]);
}

/**
 * Main hook for generating chart data based on configuration
 */
export function useIncomeVsExpenseChartData(
  transactions: Transaction[],
  config: ChartConfig,
  filter: TransactionFilter = {},
): ChartDataPoint[] {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate data based on period type
  const dailyData = useDailyChartData(transactions, filter);
  const threeMonthsData = useMonthlyChartData(transactions, 3, filter);
  const sixMonthsData = useMonthlyChartData(transactions, 6, filter);

  const weeklyData = useWeeklyChartData(
    transactions,
    config.selectedYear || currentYear,
    config.selectedMonth ?? currentMonth,
    filter,
  );

  const singleMonthData = useSingleMonthChartData(
    transactions,
    config.selectedYear || currentYear,
    config.selectedMonth ?? currentMonth,
    filter,
  );

  return useMemo(() => {
    switch (config.periodType) {
      case "7-days":
        return dailyData;

      case "3-months":
        return threeMonthsData;

      case "current-month":
        return weeklyData;

      case "custom":
        if (
          config.selectedMonth !== undefined &&
          config.selectedYear !== undefined
        ) {
          // Check if it's current month for weekly view
          if (
            config.selectedMonth === currentMonth &&
            config.selectedYear === currentYear
          ) {
            return weeklyData;
          }
          // Single month view for past months
          return singleMonthData;
        }
        return sixMonthsData;

      case "6-months":
        return sixMonthsData;

      default:
        // If month/year are provided but no explicit periodType, treat as custom
        if (
          config.selectedMonth !== undefined &&
          config.selectedYear !== undefined
        ) {
          if (
            config.selectedMonth === currentMonth &&
            config.selectedYear === currentYear
          ) {
            return weeklyData;
          }
          return singleMonthData;
        }
        return sixMonthsData;
    }
  }, [
    config.periodType,
    config.selectedMonth,
    config.selectedYear,
    dailyData,
    threeMonthsData,
    weeklyData,
    singleMonthData,
    sixMonthsData,
    currentMonth,
    currentYear,
  ]);
}

/**
 * Hook for generating chart description based on configuration
 */
export function useChartDescription(config: ChartConfig): string {
  return useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    switch (config.periodType) {
      case "7-days":
        return "Últimos 7 dias - visão diária";

      case "3-months":
        return "Últimos 3 meses - visão mensal";

      case "current-month":
        const currentMonthDate = new Date(currentYear, currentMonth, 1);
        const currentMonthName = getMonthNameLong(currentMonthDate);
        return `${currentMonthName} ${currentYear} - visão semanal`;

      case "custom":
        if (
          config.selectedMonth !== undefined &&
          config.selectedYear !== undefined
        ) {
          const date = new Date(config.selectedYear, config.selectedMonth, 1);
          const monthName = getMonthNameLong(date);

          if (
            config.selectedMonth === currentMonth &&
            config.selectedYear === currentYear
          ) {
            return `${monthName} ${config.selectedYear} - visão semanal`;
          }

          return `${monthName} ${config.selectedYear}`;
        }
        return "Comparativo mensal dos últimos 6 meses";

      case "6-months":
        return "Comparativo mensal dos últimos 6 meses";

      default:
        // If month/year are provided but no explicit periodType, treat as custom
        if (
          config.selectedMonth !== undefined &&
          config.selectedYear !== undefined
        ) {
          const date = new Date(config.selectedYear, config.selectedMonth, 1);
          const monthName = getMonthNameLong(date);

          if (
            config.selectedMonth === currentMonth &&
            config.selectedYear === currentYear
          ) {
            return `${monthName} ${config.selectedYear} - visão semanal`;
          }

          return `${monthName} ${config.selectedYear}`;
        }
        return "Comparativo mensal dos últimos 6 meses";
    }
  }, [config.periodType, config.selectedMonth, config.selectedYear]);
}

/**
 * Hook for calculating chart totals
 */
export function useChartTotals(chartData: ChartDataPoint[]) {
  return useMemo(() => {
    const totalIncomes = chartData.reduce(
      (sum, point) => sum + point.receitas,
      0,
    );
    const totalExpenses = chartData.reduce(
      (sum, point) => sum + point.despesas,
      0,
    );
    const netBalance = totalIncomes - totalExpenses;

    return {
      totalIncomes,
      totalExpenses,
      netBalance,
    };
  }, [chartData]);
}
