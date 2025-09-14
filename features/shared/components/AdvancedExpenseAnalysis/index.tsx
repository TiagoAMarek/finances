import { memo } from "react";

import { useExpenseAnalysis } from "@/features/reports/hooks/ui/useExpenseAnalysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";

import { EmptyExpenseState } from "./EmptyExpenseState";
import { ExpenseAnalysisChart } from "./ExpenseAnalysisChart";
import { ExpenseStatistics } from "./ExpenseStatistics";
import { AdvancedExpenseAnalysisProps } from "./types";

/**
 * Advanced Expense Analysis Component - Refactored for performance and maintainability
 *
 * Features:
 * - Modular architecture with specialized subcomponents
 * - Custom hooks for data processing and business logic
 * - Performance optimizations with memoization
 * - Consistent error handling and empty states
 * - Leverages existing chart utilities for code reuse
 */
export const AdvancedExpenseAnalysis = memo<AdvancedExpenseAnalysisProps>(
  function AdvancedExpenseAnalysis({
    transactions,
    selectedMonth,
    selectedYear,
    selectedAccountId,
    selectedCreditCardId,
    periodFilter = "3months",
  }) {
    // Use the custom hook for all data processing
    const analysisData = useExpenseAnalysis({
      transactions,
      periodFilter,
      selectedMonth,
      selectedYear,
      selectedAccountId,
      selectedCreditCardId,
    });

    const { formattedChartData, statistics, isEmpty, periodDescription } =
      analysisData;

    // Show empty state if no expense data is available
    if (isEmpty) {
      return <EmptyExpenseState periodDescription={periodDescription} />;
    }

    // Render the main analysis card with chart and statistics
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Tendência de Gastos
          </CardTitle>
          <CardDescription>
            Evolução dos gastos ao longo do período
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ExpenseAnalysisChart data={formattedChartData} />
          {formattedChartData.length > 0 && (
            <ExpenseStatistics statistics={statistics} />
          )}
        </CardContent>
      </Card>
    );
  },
);
