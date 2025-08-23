"use client";

import { FilterState } from "@/features/accounts/hooks/ui";
import { PeriodSelector } from "@/features/reports/components";
import {
  AccountCardFilter,
  AdvancedExpenseAnalysis,
  IncomeVsExpenseChart,
  MonthlyPerformanceCards,
  PageHeader,
} from "@/features/shared/components";
import { Skeleton } from "@/features/shared/components/ui";
import { useFilteredTransactions } from "@/features/transactions";
import { ChartLine } from "lucide-react";
import type { NextPage } from "next";
import { useState } from "react";

const PerformancePage: NextPage = () => {
  // Estados dos filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [accountCardFilters, setAccountCardFilters] = useState<FilterState>({
    accounts: [],
    creditCards: [],
  });

  // Usar hook para buscar e filtrar dados com filtros coordenados
  const { filteredTransactions, accounts, creditCards, isLoading } =
    useFilteredTransactions({
      accountCardFilters,
      dateFilter: { selectedMonth, selectedYear },
    });

  const monthlyIncomes = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyBalance = monthlyIncomes - monthlyExpenses;

  // Extrair primeiro ID selecionado (ou null se nenhum)
  const selectedAccountId =
    accountCardFilters.accounts.length > 0
      ? accountCardFilters.accounts[0]
      : null;
  const selectedCreditCardId =
    accountCardFilters.creditCards.length > 0
      ? accountCardFilters.creditCards[0]
      : null;

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
          <IncomeVsExpenseChart
            transactions={filteredTransactions}
            periodType="current-month"
            dateFilter={{
              selectedMonth,
              selectedYear,
            }}
          />
          <AdvancedExpenseAnalysis
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={selectedAccountId}
            selectedCreditCardId={selectedCreditCardId}
          />
        </div>
      </div>
    </>
  );
};

export default PerformancePage;
