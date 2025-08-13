"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { ExpensesCard } from "./_components/ExpensesCard";
import { IncomesCard } from "./_components/IncomesCard";
import { TotalBalanceCard } from "./_components/TotalBalanceCard";
import { MonthlyBalanceCard } from "./_components/MonthlyBalanceCard";
import { AccountsOverview } from "./_components/AccountsOverview";
import { CreditCardsOverview } from "./_components/CreditCardsOverview";
import { BalanceEvolutionChart } from "./_components/BalanceEvolutionChart";
import { PageHeader } from "@/components/PageHeader";
import { QuickCreateButton } from "@/components/QuickCreateButton";
import { CreateTransactionModal } from "../transactions/_components/CreateTransactionModal";
import { Separator } from "@/components/ui/separator";
import { useTransactionActions } from "../transactions/_hooks/useTransactionActions";

const DashboardPage: NextPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: accounts = [] } = useAccounts();
  const { data: creditCards = [] } = useCreditCards();
  const { data: transactions = [] } = useTransactions();
  const { createTransaction, isCreating } = useTransactionActions();

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
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyBalance = monthlyIncomes - monthlyExpenses;

  // Calcular saldo total de todas as contas
  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance),
    0,
  );

  const handleCreateTransaction = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTransactionSubmit = async (data: {
    description: string;
    amount: string;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    category: string;
    accountId?: number;
    creditCardId?: number;
  }) => {
    await createTransaction(data);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças e transações recentes"
        action={
          <QuickCreateButton onClick={handleCreateTransaction}>
            Novo Lançamento
          </QuickCreateButton>
        }
      />

      <div className="space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="py-2 md:py-0">
            <IncomesCard monthlyIncomes={monthlyIncomes} />
          </div>
          <div className="py-2 md:py-0 md:px-8">
            <ExpensesCard monthlyExpenses={monthlyExpenses} />
          </div>
          <div className="py-2 md:py-0 md:px-8">
            <MonthlyBalanceCard monthlyBalance={monthlyBalance} />
          </div>
          <div className="py-2 md:py-0 md:px-8">
            <TotalBalanceCard totalBalance={totalBalance} />
          </div>
        </div>

        <Separator />

        {/* Gráfico de Evolução do Saldo */}
        <BalanceEvolutionChart totalBalance={totalBalance} />

        <Separator />

        {/* Visão Geral de Contas e Cartões */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
          <CreditCardsOverview creditCards={creditCards} />
        </div>
      </div>

      <CreateTransactionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTransactionSubmit}
        isLoading={isCreating}
      />
    </>
  );
};

export default DashboardPage;
