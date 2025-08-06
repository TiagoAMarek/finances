"use client";

import type { NextPage } from "next";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { ExpensesCard } from "./_components/ExpensesCard";
import { IncomesCard } from "./_components/IncomesCard";
import { TotalBalanceCard } from "./_components/TotalBalanceCard";
import { MonthlyBalanceCard } from "./_components/MonthlyBalanceCard";

const DashboardPage: NextPage = () => {
  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useTransactions();

  // Calcular receitas e despesas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyIncomes = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncomes - monthlyExpenses;

  // Calcular saldo total de todas as contas
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Receitas do Mês */}
        <IncomesCard monthlyIncomes={monthlyIncomes} />

        {/* Card 2: Despesas do Mês */}
        <ExpensesCard monthlyExpenses={monthlyExpenses} />

        {/* Card 3: Balanço Mensal */}
        <MonthlyBalanceCard monthlyBalance={monthlyBalance} />

        {/* Card 4: Saldo Total com Gráfico */}
        <TotalBalanceCard totalBalance={totalBalance} />
      </div>
    </div>
  );
};

export default DashboardPage;
