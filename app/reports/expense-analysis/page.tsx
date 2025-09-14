"use client";

import { PieChart, ChevronLeft } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

import { FilterState } from "@/features/accounts/hooks/ui";
import { ExpenseAnalysisContent } from "@/features/reports/components";
import { AccountCardFilter, PageHeader } from "@/features/shared/components";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui";
import { useFilteredTransactions } from "@/features/transactions/hooks/ui";

import { ExpenseAnalysisPageSkeleton } from "./_skeleton";

const ExpenseAnalysisPage: NextPage = () => {
  // Estados dos filtros
  const [periodFilter, setPeriodFilter] = useState<
    "3months" | "6months" | "12months"
  >("3months");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [accountCardFilters, setAccountCardFilters] = useState<FilterState>({
    accounts: [],
    creditCards: [],
  });

  // Usar hook para buscar e filtrar dados
  const { filteredTransactions, accounts, creditCards, isLoading } =
    useFilteredTransactions({
      accountCardFilters,
    });

  if (isLoading) return <ExpenseAnalysisPageSkeleton />;

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background border-b sm:hidden">
        <div className="flex items-center justify-between p-4">
          <Button 
            aria-label="Voltar para relatórios" 
            asChild 
            className="h-10 w-10 p-0"
            size="sm"
            variant="ghost"
          >
            <Link href="/reports">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold truncate mx-3">
            Análise de Gastos
          </h1>
          <div className="w-10" />
        </div>
        
        <div className="px-4 pb-4">
          <AccountCardFilter
            accounts={accounts}
            className="w-full"
            creditCards={creditCards}
            onFiltersChange={setAccountCardFilters}
          />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden sm:block">
        <PageHeader
          action={
            <div className="flex items-center gap-3">
              <AccountCardFilter
                accounts={accounts}
                creditCards={creditCards}
                onFiltersChange={setAccountCardFilters}
              />
              <Button asChild size="sm" variant="outline">
                <Link className="flex items-center gap-2" href="/reports">
                  <ChevronLeft className="h-4 w-4" />
                  Relatórios
                </Link>
              </Button>
            </div>
          }
          description="Insights avançados sobre seus padrões de consumo"
          icon={PieChart}
          title="Análise Detalhada de Gastos"
        />
      </div>

      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {/* Análise Detalhada de Gastos */}
        <div className="space-y-4 sm:space-y-6">
          <Tabs
            className="w-full space-y-4 sm:space-y-6"
            value={periodFilter}
            onValueChange={(value: string) => {
              const typedValue = value as "3months" | "6months" | "12months";
              setIsAnalysisLoading(true);
              setTimeout(() => {
                setPeriodFilter(typedValue);
                setIsAnalysisLoading(false);
              }, 300);
            }}
          >
            <TabsList className="w-full h-12 p-1 grid grid-cols-3 gap-1">
              <TabsTrigger
                aria-label="Ver dados dos últimos 3 meses"
                className="h-10 text-sm font-medium min-w-0 truncate transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                value="3months"
              >
                <span className="hidden sm:inline">Últimos 3 meses</span>
                <span className="sm:hidden">3m</span>
              </TabsTrigger>
              <TabsTrigger
                aria-label="Ver dados dos últimos 6 meses"
                className="h-10 text-sm font-medium min-w-0 truncate transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                value="6months"
              >
                <span className="hidden sm:inline">Últimos 6 meses</span>
                <span className="sm:hidden">6m</span>
              </TabsTrigger>
              <TabsTrigger
                aria-label="Ver dados dos últimos 12 meses"
                className="h-10 text-sm font-medium min-w-0 truncate transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                value="12months"
              >
                <span className="hidden sm:inline">Últimos 12 meses</span>
                <span className="sm:hidden">12m</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              aria-label="Dados dos últimos 3 meses" 
              className="mt-4 sm:mt-6"
              role="tabpanel"
              value="3months"
            >
              <div
                aria-busy={isAnalysisLoading}
                className={`transition-opacity duration-200 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  isLoading={isAnalysisLoading}
                  periodFilter="3months"
                  transactions={filteredTransactions}
                />
              </div>
            </TabsContent>

            <TabsContent 
              aria-label="Dados dos últimos 6 meses" 
              className="mt-4 sm:mt-6"
              role="tabpanel"
              value="6months"
            >
              <div
                aria-busy={isAnalysisLoading}
                className={`transition-opacity duration-200 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  isLoading={isAnalysisLoading}
                  periodFilter="6months"
                  transactions={filteredTransactions}
                />
              </div>
            </TabsContent>

            <TabsContent 
              aria-label="Dados dos últimos 12 meses" 
              className="mt-4 sm:mt-6"
              role="tabpanel"
              value="12months"
            >
              <div
                aria-busy={isAnalysisLoading}
                className={`transition-opacity duration-200 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  isLoading={isAnalysisLoading}
                  periodFilter="12months"
                  transactions={filteredTransactions}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ExpenseAnalysisPage;
