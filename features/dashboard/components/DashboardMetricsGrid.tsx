import { MonthlyMetrics } from "@/features/dashboard/utils/dashboard-calculations";
import { MetricCard } from "@/features/shared/components/ui";
import { BarChart3, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { memo } from "react";

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
          title="Receitas do Mês"
          value={monthlyMetrics.incomes}
          description={new Date().toLocaleDateString("pt-BR", {
            month: "long",
          })}
          icon={TrendingUp}
          iconTheme="success"
          valueTheme="success"
          formatValue="currency"
        />
        <MetricCard
          title="Despesas do Mês"
          value={monthlyMetrics.expenses}
          description={new Date().toLocaleDateString("pt-BR", {
            month: "long",
          })}
          icon={TrendingDown}
          iconTheme="danger"
          valueTheme="danger"
          formatValue="currency"
        />
        <MetricCard
          title="Balanço Mensal"
          value={monthlyMetrics.balance}
          description={(value) =>
            Number(value) >= 0 ? "Superávit no mês" : "Déficit no mês"
          }
          icon={BarChart3}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          formatValue="currency"
        />
        <MetricCard
          title="Saldo Total"
          value={totalBalance}
          description="Todas as contas"
          icon={Wallet}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "neutral")}
          formatValue="currency"
        />
      </div>
    );
  },
);
