"use client";

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
import { ArrowLeft, PieChart } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
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
              const typedValue = value as "3months" | "6months" | "12months";
              setIsAnalysisLoading(true);
              setTimeout(() => {
                setPeriodFilter(typedValue);
                setIsAnalysisLoading(false);
              }, 300);
            }}
            className="w-full space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="3months" className="text-sm py-3">
                Últimos 3 meses
              </TabsTrigger>
              <TabsTrigger value="6months" className="text-sm py-3">
                Últimos 6 meses
              </TabsTrigger>
              <TabsTrigger value="12months" className="text-sm py-3">
                Últimos 12 meses
              </TabsTrigger>
            </TabsList>

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

            <TabsContent value="6months">
              <div
                className={`transition-opacity duration-300 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  transactions={filteredTransactions}
                  periodFilter="6months"
                  isLoading={isAnalysisLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="12months">
              <div
                className={`transition-opacity duration-300 ${isAnalysisLoading ? "opacity-50" : "opacity-100"}`}
              >
                <ExpenseAnalysisContent
                  transactions={filteredTransactions}
                  periodFilter="12months"
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
