import { memo, useMemo } from "react";

import {
  useChartDescription,
  useChartTotals,
  useIncomeVsExpenseChartData,
} from "@/features/reports/hooks/ui/useChartData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui";
import { TransactionFilter } from "@/lib/chart-utils";

import { Chart } from "./IncomeVsExpenseChart/Chart";
import { ChartSummary } from "./IncomeVsExpenseChart/ChartSummary";
import { IncomeVsExpenseChartProps } from "./IncomeVsExpenseChart/types";

/**
 * Income vs Expense Chart Component - Displays financial data in various time periods
 *
 * Features:
 * - Multiple period types: daily (7 days), weekly (current month), monthly (3-6 months)
 * - Account and credit card filtering
 * - Automatic granularity selection based on period
 * - Optimized performance with memoization
 */
export const IncomeVsExpenseChart = memo<IncomeVsExpenseChartProps>(
  function IncomeVsExpenseChart({
    transactions,
    periodType = "6-months",
    dateFilter,
    accountFilter,
  }) {
    const effectiveDateFilter = useMemo(() => {
      if (dateFilter) {
        return dateFilter;
      }
      return undefined;
    }, [dateFilter]);

    const effectiveAccountFilter = useMemo(() => {
      if (accountFilter) {
        return accountFilter;
      }

      return {};
    }, [accountFilter]);

    // Create chart configuration
    const chartConfig = useMemo(
      () => ({
        periodType,
        selectedMonth: effectiveDateFilter?.selectedMonth,
        selectedYear: effectiveDateFilter?.selectedYear,
      }),
      [periodType, effectiveDateFilter],
    );

    // Create transaction filter
    const transactionFilter: TransactionFilter = useMemo(
      () => ({
        accountId: effectiveAccountFilter.selectedAccountId,
        creditCardId: effectiveAccountFilter.selectedCreditCardId,
      }),
      [effectiveAccountFilter],
    );

    // Generate chart data using custom hooks
    const chartData = useIncomeVsExpenseChartData(
      transactions,
      chartConfig,
      transactionFilter,
    );

    // Generate chart description
    const description = useChartDescription(chartConfig);

    // Calculate totals
    const totals = useChartTotals(chartData);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Receitas vs Despesas
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          <ChartSummary totals={totals} />
        </CardHeader>
        <CardContent>
          <Chart data={chartData} height={200} />
        </CardContent>
      </Card>
    );
  },
);
