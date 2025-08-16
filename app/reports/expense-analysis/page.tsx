"use client";

import { AccountCardFilter } from "@/components/AccountCardFilter";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterState } from "@/hooks/useAccountCardFilters";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { ArrowLeft, PieChart } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { ExpenseAnalysisContent } from "./_components/ExpenseAnalysisContent";
import { ExpenseAnalysisPageSkeleton } from "./_skeleton";

const ExpenseAnalysisPage: NextPage = () => {
  // Estados dos filtros
  const [periodFilter, setPeriodFilter] = useState<
    "7days" | "currentMonth" | "3months"
  >("currentMonth");
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
      <PageHeader
        title="Análise Detalhada de Gastos"
        description="Insights avançados sobre seus padrões de consumo"
        icon={PieChart}
        action={
          <div className="flex items-center gap-2">
            <AccountCardFilter
              accounts={accounts}
              creditCards={creditCards}
              onFiltersChange={setAccountCardFilters}
            />
            <Button variant="outline" size="sm" asChild>
              <Link href="/reports" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Relatórios
              </Link>
            </Button>
          </div>
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Análise Detalhada de Gastos */}
        <div className="space-y-6">
          <Tabs
            value={periodFilter}
            onValueChange={(value: string) => {
              const typedValue = value as "7days" | "currentMonth" | "3months";
              setIsAnalysisLoading(true);
              setTimeout(() => {
                setPeriodFilter(typedValue);
                setIsAnalysisLoading(false);
              }, 300);
            }}
            className="w-full space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="7days" className="text-sm py-3">
                Últimos 7 dias
              </TabsTrigger>
              <TabsTrigger value="currentMonth" className="text-sm py-3">
                Mês atual
              </TabsTrigger>
              <TabsTrigger value="3months" className="text-sm py-3">
                Últimos 3 meses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="7days">
              <div
                className={`transition-opacity duration-300 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  transactions={filteredTransactions}
                  periodFilter="7days"
                  isLoading={isAnalysisLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="currentMonth">
              <div
                className={`transition-opacity duration-300 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  transactions={filteredTransactions}
                  periodFilter="currentMonth"
                  isLoading={isAnalysisLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="3months">
              <div
                className={`transition-opacity duration-300 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  transactions={filteredTransactions}
                  periodFilter="3months"
                  isLoading={isAnalysisLoading}
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
