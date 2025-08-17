"use client";

import { IncomeVsExpenseChart } from "@/components/IncomeVsExpenseChart";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { ArrowLeft, CreditCard } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { AdvancedExpenseAnalysis } from "@/components/AdvancedExpenseAnalysis";
import { ExpenseCategoriesChart } from "../../dashboard/_components/ExpenseCategoriesChart";
import { PeriodSelector } from "../_components/PeriodSelector";

const CreditCardsAnalysisPage: NextPage = () => {
  const { data: creditCards = [], isLoading: isLoadingCreditCards } =
    useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();

  const isLoading = isLoadingCreditCards || isLoadingTransactions;

  // Estados dos filtros
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filtrar dados específicos para cartões
  const getCreditCardData = () => {
    return transactions.filter((t) => {
      if (t.creditCardId === null) return false;

      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  };

  const creditCardTransactions = getCreditCardData();

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Análise por Cartões de Crédito"
          description="Performance detalhada dos seus cartões de crédito"
          action={<Skeleton className="h-9 w-32" />}
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
        title="Análise por Cartões de Crédito"
        description="Performance detalhada dos seus cartões de crédito"
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/reports" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Relatórios
              </Link>
            </Button>
            <PeriodSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Header da seção */}
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-purple-500" />
          <div>
            <h2 className="text-xl font-semibold">
              Gastos nos Cartões de Crédito
            </h2>
            <p className="text-sm text-muted-foreground">
              {creditCardTransactions.length} transações em {creditCards.length}{" "}
              cartões no período selecionado
            </p>
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <IncomeVsExpenseChart
            transactions={creditCardTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
          <ExpenseCategoriesChart
            transactions={creditCardTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
        </div>

        {/* Análise Avançada */}
        <AdvancedExpenseAnalysis
          transactions={creditCardTransactions}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedAccountId={null}
          selectedCreditCardId={null}
        />
      </div>
    </>
  );
};

export default CreditCardsAnalysisPage;
