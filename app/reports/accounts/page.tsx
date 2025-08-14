"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { IncomeVsExpenseChart } from "../../dashboard/_components/IncomeVsExpenseChart";
import { ExpenseCategoriesChart } from "../../dashboard/_components/ExpenseCategoriesChart";
import { AdvancedExpenseAnalysis } from "../../dashboard/_components/AdvancedExpenseAnalysis";
import { PeriodSelector } from "../_components/PeriodSelector";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountsAnalysisPage: NextPage = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();

  const isLoading = isLoadingAccounts || isLoadingTransactions;

  // Estados dos filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filtrar dados específicos para contas
  const getAccountData = () => {
    return transactions.filter(t => {
      if (t.accountId === null) return false;

      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  };

  const accountTransactions = getAccountData();

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Análise por Contas Bancárias"
          description="Performance detalhada das suas contas bancárias"
          action={<Skeleton className="h-9 w-32" />}
          iconColor="text-blue-500"
          icon={Wallet}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Análise por Contas Bancárias"
        description="Performance detalhada das suas contas bancárias"
        action={
          <div className="flex items-center gap-3">
            <PeriodSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        }
        iconColor="text-blue-500"
        icon={Wallet}
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Análise Avançada */}
        <AdvancedExpenseAnalysis
          transactions={accountTransactions}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedAccountId={null}
          selectedCreditCardId={null}
        />

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <IncomeVsExpenseChart
            transactions={accountTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
          <ExpenseCategoriesChart
            transactions={accountTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
        </div>
      </div>
    </>
  );
};

export default AccountsAnalysisPage;
