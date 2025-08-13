"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { BalanceEvolutionChart } from "../dashboard/_components/BalanceEvolutionChart";
import { IncomeVsExpenseChart } from "../dashboard/_components/IncomeVsExpenseChart";
import { ExpenseCategoriesChart } from "../dashboard/_components/ExpenseCategoriesChart";
import { FinancialPerformanceCards } from "../dashboard/_components/FinancialPerformanceCards";
import { PeriodSelector } from "./_components/PeriodSelector";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ReportsPage: NextPage = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { isLoading: isLoadingCreditCards } = useCreditCards();
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


  // Filtrar dados específicos para contas
  const getAccountData = () => {
    return filteredTransactions.filter(t => t.accountId !== null);
  };

  // Filtrar dados específicos para cartões
  const getCreditCardData = () => {
    return filteredTransactions.filter(t => t.creditCardId !== null);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Relatórios"
          description="Análises detalhadas e gráficos das suas finanças"
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          {/* Loading Performance Cards */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Loading Charts */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Loading Analysis */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 px-4 lg:px-6 pb-8">
        {/* Header com Filtro de Período */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Análises detalhadas e gráficos das suas finanças</p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <PeriodSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        </div>

        {/* Tabs para Relatórios */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Contas Bancárias
            </TabsTrigger>
            <TabsTrigger value="cards" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Cartões de Crédito
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Financeira</h3>
              <FinancialPerformanceCards 
                transactions={transactions}
                monthlyIncomes={monthlyIncomes}
                monthlyExpenses={monthlyExpenses}
                monthlyBalance={monthlyBalance}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                selectedAccountId={null}
                selectedCreditCardId={null}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Evolução Financeira</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <BalanceEvolutionChart totalBalance={totalBalance} />
                <IncomeVsExpenseChart 
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Análise de Gastos</h3>
              <div className="w-full max-w-4xl">
                <ExpenseCategoriesChart 
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
              </div>
            </div>
          </TabsContent>

          {/* Relatórios de Contas */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relatórios de Contas Bancárias</h3>
                <Badge variant="outline">
                  {getAccountData().length} transações
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <IncomeVsExpenseChart 
                  transactions={getAccountData()}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
                <ExpenseCategoriesChart 
                  transactions={getAccountData()}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
              </div>
            </div>
          </TabsContent>

          {/* Relatórios de Cartões */}
          <TabsContent value="cards" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Relatórios de Cartões de Crédito</h3>
                <Badge variant="outline">
                  {getCreditCardData().length} transações
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <IncomeVsExpenseChart 
                  transactions={getCreditCardData()}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
                <ExpenseCategoriesChart 
                  transactions={getCreditCardData()}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ReportsPage;