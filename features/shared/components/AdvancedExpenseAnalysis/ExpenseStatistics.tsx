import { memo } from "react";

import { ExpenseStatistics as ExpenseStatsType } from "@/lib/expense-utils";
import { formatCurrency } from "@/lib/expense-utils";

/**
 * Props for the expense statistics component
 */
interface ExpenseStatisticsProps {
  statistics: ExpenseStatsType;
  className?: string;
}

/**
 * Individual statistic card component
 */
interface StatisticCardProps {
  label: string;
  value: number;
  colorClass: string;
}

const StatisticCard = memo<StatisticCardProps>(function StatisticCard({
  label,
  value,
  colorClass,
}) {
  return (
    <div className={`text-center p-2 ${colorClass} rounded-lg border`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{formatCurrency(value)}</p>
    </div>
  );
});

/**
 * Statistics display component for expense analysis
 *
 * Features:
 * - Displays key expense metrics (max, min, average, total)
 * - Responsive grid layout
 * - Consistent color coding for different metric types
 * - Optimized with React.memo for performance
 */
export const ExpenseStatistics = memo<ExpenseStatisticsProps>(
  function ExpenseStatistics({ statistics, className = "" }) {
    const { max, min, average, total } = statistics;

    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 px-2 ${className}`}
      >
        <StatisticCard
          colorClass="bg-red-500/10 text-red-600 dark:text-red-400"
          label="Maior"
          value={max}
        />
        <StatisticCard
          colorClass="bg-green-500/10 text-green-600 dark:text-green-400"
          label="Menor"
          value={min}
        />
        <StatisticCard
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          label="Média"
          value={average}
        />
        <StatisticCard
          colorClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          label="Total"
          value={total}
        />
      </div>
    );
  },
);
