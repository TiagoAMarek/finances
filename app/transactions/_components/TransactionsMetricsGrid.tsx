import { memo } from "react";
import { Transaction } from "@/lib/schemas";
import { TotalIncomesMetricCard } from "./TotalIncomesMetricCard";
import { TotalExpensesMetricCard } from "./TotalExpensesMetricCard";
import { PeriodBalanceMetricCard } from "./PeriodBalanceMetricCard";

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

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalIncomesMetricCard
          totalIncomes={totalIncomes}
          transactionCount={incomeTransactions.length}
        />
        <TotalExpensesMetricCard
          totalExpenses={totalExpenses}
          transactionCount={expenseTransactions.length}
        />
        <PeriodBalanceMetricCard
          balance={balance}
          totalIncomes={totalIncomes}
          totalExpenses={totalExpenses}
        />
      </div>
    );
  },
);
