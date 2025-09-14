import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { memo } from "react";

import { MetricCard } from "@/features/shared/components/ui";
import { Transaction } from "@/lib/schemas";

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
          description={`${incomeTransactions.length} ${incomeTransactions.length === 1 ? "transação" : "transações"}`}
          formatValue="currency"
          hoverEffect
          icon={TrendingUp}
          iconTheme="success"
          title="Total Receitas"
          value={totalIncomes}
          valueTheme="success"
        />
        <MetricCard
          description={`${expenseTransactions.length} ${expenseTransactions.length === 1 ? "transação" : "transações"}`}
          formatValue="currency"
          hoverEffect
          icon={TrendingDown}
          iconTheme="danger"
          title="Total Despesas"
          value={totalExpenses}
          valueTheme="danger"
        />
        <MetricCard
          description={`${expenseRatio.toFixed(1)}% de gastos sobre receitas`}
          formatValue="currency"
          hoverEffect
          icon={BarChart3}
          iconTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
          title="Saldo do Período"
          value={balance}
          valueTheme={(value) => (Number(value) >= 0 ? "primary" : "orange")}
        />
      </div>
    );
  },
);
