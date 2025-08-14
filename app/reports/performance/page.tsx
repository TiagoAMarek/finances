"use client";

import { PageHeader } from "@/components/PageHeader";
import { AccountCardFilter } from "@/components/AccountCardFilter";
import { FilterState } from "@/hooks/useAccountCardFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { ArrowLeft, ChartLine } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { MonthlyPerformanceCards } from "../../dashboard/_components/MonthlyPerformanceCards";
import { WeeklyBalanceChart } from "../../dashboard/_components/WeeklyBalanceChart";
import { WeeklyIncomeVsExpenseChart } from "../../dashboard/_components/WeeklyIncomeVsExpenseChart";
import { PeriodSelector } from "../_components/PeriodSelector";

const PerformancePage: NextPage = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } = useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();

  const isLoading = isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;

  // Estados dos filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [accountCardFilters, setAccountCardFilters] = useState<FilterState>({
    accounts: [],
    creditCards: []
  });

  // Calcular dados filtrados
  const getFilteredTransactions = () => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const dateMatch = (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
      
      // Aplicar filtros de conta/cartão
      const accountMatch = t.accountId ? accountCardFilters.accounts.includes(t.accountId) : true;
      const cardMatch = t.creditCardId ? accountCardFilters.creditCards.includes(t.creditCardId) : true;
      
      return dateMatch && (accountMatch || cardMatch);
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const monthlyIncomes = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyBalance = monthlyIncomes - monthlyExpenses;

  // Calcular saldo total de todas as contas
  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance),
    0,
  );

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Performance Financeira"
          description="Análise da evolução das suas finanças ao longo do tempo"
          action={<Skeleton className="h-9 w-32" />}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
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
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            <AccountCardFilter
              accounts={accounts}
              creditCards={creditCards}
              onFiltersChange={setAccountCardFilters}
            />
            <PeriodSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        }
        description="Análise da evolução das suas finanças ao longo do mês"
        icon={ChartLine}
        iconColor="text-purple-500"
        title="Performance Mensal"
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Cards de Performance Mensais */}
        <MonthlyPerformanceCards
          transactions={filteredTransactions}
          monthlyIncomes={monthlyIncomes}
          monthlyExpenses={monthlyExpenses}
          monthlyBalance={monthlyBalance}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedAccountId={null}
          selectedCreditCardId={null}
        />

        {/* Gráficos de Evolução Semanal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <WeeklyBalanceChart
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            totalBalance={totalBalance}
          />
          <WeeklyIncomeVsExpenseChart
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </>
  );
};

export default PerformancePage;

