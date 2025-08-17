import { memo } from "react";
import { formatCurrency } from "@/lib/chart-utils";
import { ChartSummaryProps } from "./types";

/**
 * Chart summary component that displays income, expense, and balance totals
 */
export const ChartSummary = memo<ChartSummaryProps>(({ totals, className }) => {
  const { totalIncomes, totalExpenses, netBalance } = totals;

  return (
    <div className={`flex items-center gap-4 text-sm ${className || ""}`}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded"></div>
        <span>Total: {formatCurrency(totalIncomes)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded"></div>
        <span>Total: {formatCurrency(totalExpenses)}</span>
      </div>
      <div
        className={`font-medium ${
          netBalance >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        Saldo: {formatCurrency(netBalance)}
      </div>
    </div>
  );
});

ChartSummary.displayName = "ChartSummary";
