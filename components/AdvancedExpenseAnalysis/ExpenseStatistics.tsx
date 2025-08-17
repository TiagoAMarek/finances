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
      <p className="font-semibold">
        {formatCurrency(value)}
      </p>
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
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 px-2 ${className}`}>
        <StatisticCard
          label="Maior"
          value={max}
          colorClass="bg-red-500/10 text-red-600 dark:text-red-400"
        />
        <StatisticCard
          label="Menor"
          value={min}
          colorClass="bg-green-500/10 text-green-600 dark:text-green-400"
        />
        <StatisticCard
          label="Média"
          value={average}
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatisticCard
          label="Total"
          value={total}
          colorClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
      </div>
    );
  },
);