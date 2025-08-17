import { memo } from "react";
import { MonthlyMetrics } from "../_utils/dashboard-calculations";
import { IncomesCard } from "./IncomesCard";
import { ExpensesCard } from "./ExpensesCard";
import { MonthlyBalanceCard } from "./MonthlyBalanceCard";
import { TotalBalanceCard } from "./TotalBalanceCard";

/**
 * Props for DashboardMetricsGrid component
 */
interface DashboardMetricsGridProps {
  monthlyMetrics: MonthlyMetrics;
  totalBalance: number;
}

/**
 * Dashboard metrics grid component
 *
 * Features:
 * - Encapsulates the 4 summary cards (Income, Expenses, Balance, Total)
 * - Single responsibility: display financial metrics
 * - Optimized with React.memo for performance
 * - Clean props interface with typed data
 * - Responsive grid layout
 */
export const DashboardMetricsGrid = memo<DashboardMetricsGridProps>(
  function DashboardMetricsGrid({ monthlyMetrics, totalBalance }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IncomesCard monthlyIncomes={monthlyMetrics.incomes} />
        <ExpensesCard monthlyExpenses={monthlyMetrics.expenses} />
        <MonthlyBalanceCard monthlyBalance={monthlyMetrics.balance} />
        <TotalBalanceCard totalBalance={totalBalance} />
      </div>
    );
  },
);
