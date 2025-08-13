"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { AdvancedExpenseAnalysis } from "../../dashboard/_components/AdvancedExpenseAnalysis";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExpenseAnalysisPage: NextPage = () => {
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();

  // Estados dos filtros
  const [periodFilter, setPeriodFilter] = useState<"7days" | "currentMonth" | "3months">("currentMonth");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  if (isLoadingTransactions) {
    return (
      <>
        <PageHeader
          title="Análise Detalhada de Gastos"
          description="Insights avançados sobre seus padrões de consumo"
          action={<Skeleton className="h-9 w-32" />}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>

            <Skeleton className="h-12 w-full" />

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Análise Detalhada de Gastos"
        description="Insights avançados sobre seus padrões de consumo"
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
        {/* Análise Detalhada de Gastos */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <PieChart className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold">Padrões de Consumo</h2>
              <p className="text-sm text-muted-foreground">
                Análise inteligente dos seus gastos em diferentes períodos
              </p>
            </div>
          </div>

          <Tabs
            value={periodFilter}
            onValueChange={(value: "7days" | "currentMonth" | "3months") => {
              setIsAnalysisLoading(true);
              setTimeout(() => {
                setPeriodFilter(value);
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
              <div className={`transition-opacity duration-300 ${isAnalysisLoading ? 'opacity-50' : 'opacity-100'}`}>
                <AdvancedExpenseAnalysis 
                  transactions={transactions}
                  selectedMonth={new Date().getMonth()}
                  selectedYear={new Date().getFullYear()}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                  periodFilter="7days"
                  isLoading={isAnalysisLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="currentMonth">
              <div className={`transition-opacity duration-300 ${isAnalysisLoading ? 'opacity-50' : 'opacity-100'}`}>
                <AdvancedExpenseAnalysis 
                  transactions={transactions}
                  selectedMonth={new Date().getMonth()}
                  selectedYear={new Date().getFullYear()}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
                  periodFilter="currentMonth"
                  isLoading={isAnalysisLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="3months">
              <div className={`transition-opacity duration-300 ${isAnalysisLoading ? 'opacity-50' : 'opacity-100'}`}>
                <AdvancedExpenseAnalysis 
                  transactions={transactions}
                  selectedMonth={new Date().getMonth()}
                  selectedYear={new Date().getFullYear()}
                  selectedAccountId={null}
                  selectedCreditCardId={null}
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