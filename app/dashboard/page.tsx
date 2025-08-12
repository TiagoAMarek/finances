"use client";

import type { NextPage } from "next";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { ExpensesCard } from "./_components/ExpensesCard";
import { IncomesCard } from "./_components/IncomesCard";
import { TotalBalanceCard } from "./_components/TotalBalanceCard";
import { MonthlyBalanceCard } from "./_components/MonthlyBalanceCard";
import { AccountsOverview } from "./_components/AccountsOverview";
import { CreditCardsOverview } from "./_components/CreditCardsOverview";
import { PageHeader } from "@/components/PageHeader";
import { QuickCreateButton } from "@/components/QuickCreateButton";
import { Separator } from "@/components/ui/separator";

const DashboardPage: NextPage = () => {
  const { data: accounts = [] } = useAccounts();
  const { data: creditCards = [] } = useCreditCards();
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
    // TODO: Implementar modal/dialog para criar transação
    console.log("Criar nova transação");
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças e transações recentes"
        action={
          <QuickCreateButton onClick={handleCreateTransaction}>
            Criar Transação
          </QuickCreateButton>
        }
      />

      <div className="space-y-6 p-4 lg:p-6">
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

        {/* Visão Geral de Contas e Cartões */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
          <CreditCardsOverview creditCards={creditCards} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
