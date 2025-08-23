import { memo } from "react";
import { Transaction } from "@/lib/schemas";
import { MetricCard } from "@/components/ui/metric-card";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface TransactionsMetricsGridProps {
  transactions: Transaction[];
}

export const TransactionsMetricsGrid = memo<TransactionsMetricsGridProps>(
  function TransactionsMetricsGrid({ transactions }) {
    // Calculate metrics
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );

    const totalIncomes = incomeTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0,
    );

    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0,
    );

    const balance = totalIncomes - totalExpenses;

    const expenseRatio =
      totalIncomes > 0 ? (totalExpenses / totalIncomes) * 100 : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Receitas"
          value={totalIncomes}
          description={`${incomeTransactions.length} ${incomeTransactions.length === 1 ? "transação" : "transações"}`}
          icon={TrendingUp}
          iconTheme="success"
          valueTheme="success"
          formatValue="currency"
          hoverEffect
        />
        <MetricCard
          title="Total Despesas"
          value={totalExpenses}
          description={`${expenseTransactions.length} ${expenseTransactions.length === 1 ? "transação" : "transações"}`}
          icon={TrendingDown}
          iconTheme="danger"
          valueTheme="danger"
          formatValue="currency"
          hoverEffect
        />
        <MetricCard
          title="Saldo do Período"
          value={balance}
          description={`${expenseRatio.toFixed(1)}% de gastos sobre receitas`}
          icon={BarChart3}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          formatValue="currency"
          hoverEffect
        />
      </div>
    );
  },
);
