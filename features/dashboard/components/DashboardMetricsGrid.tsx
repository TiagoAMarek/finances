import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { memo } from "react";

import { MonthlyMetrics } from "@/features/dashboard/utils/dashboard-calculations";
import { MetricCard } from "@/features/shared/components/ui";

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
        <MetricCard
          description={new Date().toLocaleDateString("pt-BR", {
            month: "long",
          })}
          formatValue="currency"
          icon={TrendingUp}
          iconTheme="success"
          title="Receitas do Mês"
          value={monthlyMetrics.incomes}
          valueTheme="success"
        />
        <MetricCard
          description={new Date().toLocaleDateString("pt-BR", {
            month: "long",
          })}
          formatValue="currency"
          icon={TrendingDown}
          iconTheme="danger"
          title="Despesas do Mês"
          value={monthlyMetrics.expenses}
          valueTheme="danger"
        />
        <MetricCard
          description={(value) =>
            Number(value) >= 0 ? "Superávit no mês" : "Déficit no mês"
          }
          formatValue="currency"
          icon={BarChart3}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          title="Balanço Mensal"
          value={monthlyMetrics.balance}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
        />
        <MetricCard
          description="Todas as contas"
          formatValue="currency"
          icon={Wallet}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
          title="Saldo Total"
          value={totalBalance}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
        />
      </div>
    );
  },
);
