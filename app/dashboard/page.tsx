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
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactionActions } from "../transactions/_hooks/useTransactionActions";

const DashboardPage: NextPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } = useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  const { createTransaction, isCreating } = useTransactionActions();

  const isLoading = isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;

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

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Visão geral das suas finanças e transações recentes"
          action={<Skeleton className="h-9 w-32" />}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Loading Chart */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Loading Overview */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center justify-between p-3 rounded border">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-7 w-7 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

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

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IncomesCard monthlyIncomes={monthlyIncomes} />
          <ExpensesCard monthlyExpenses={monthlyExpenses} />
          <MonthlyBalanceCard monthlyBalance={monthlyBalance} />
          <TotalBalanceCard totalBalance={totalBalance} />
        </div>

        {/* Gráfico de Evolução do Saldo */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Evolução Financeira</h2>
          <BalanceEvolutionChart totalBalance={totalBalance} />
        </div>

        {/* Visão Geral de Contas e Cartões */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resumo de Contas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
            <CreditCardsOverview creditCards={creditCards} />
          </div>
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
