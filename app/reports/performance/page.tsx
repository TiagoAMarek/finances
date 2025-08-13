"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { WeeklyBalanceChart } from "../../dashboard/_components/WeeklyBalanceChart";
import { WeeklyIncomeVsExpenseChart } from "../../dashboard/_components/WeeklyIncomeVsExpenseChart";
import { MonthlyPerformanceCards } from "../../dashboard/_components/MonthlyPerformanceCards";
import { ComparativePerformanceCards } from "../../dashboard/_components/ComparativePerformanceCards";
import { PeriodSelector } from "../_components/PeriodSelector";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PerformancePage: NextPage = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } = useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();

  const isLoading = isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;

  // Estados dos filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calcular dados filtrados
  const getFilteredTransactions = () => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
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
        title="Performance Financeira"
        description="Análise da evolução das suas finanças ao longo do tempo"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/reports" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Relatórios
            </Link>
          </Button>
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Tabs para diferentes visões */}
        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="monthly" className="text-sm py-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visão Mensal
            </TabsTrigger>
            <TabsTrigger value="comparative" className="text-sm py-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análise Comparativa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-8">
            {/* Seletor de Período - Apenas para Visão Mensal */}
            <div className="flex justify-end">
              <PeriodSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />
            </div>

            {/* Cards de Performance Mensais */}
            <MonthlyPerformanceCards 
              transactions={transactions}
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
                transactions={transactions}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                totalBalance={totalBalance}
              />
              <WeeklyIncomeVsExpenseChart 
                transactions={transactions}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </div>
          </TabsContent>

          <TabsContent value="comparative" className="space-y-8">
            {/* Cards de Análise Comparativa */}
            <ComparativePerformanceCards 
              transactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PerformancePage;