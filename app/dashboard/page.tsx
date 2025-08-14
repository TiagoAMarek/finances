"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import { ExpensesCard } from "./_components/ExpensesCard";
import { IncomesCard } from "./_components/IncomesCard";
import { TotalBalanceCard } from "./_components/TotalBalanceCard";
import { MonthlyBalanceCard } from "./_components/MonthlyBalanceCard";
import { AccountsOverview } from "./_components/AccountsOverview";
import { CreditCardsOverview } from "./_components/CreditCardsOverview";
import { FinancialInsights } from "./_components/FinancialInsights";
import { IncomeVsExpenseChart } from "./_components/IncomeVsExpenseChart";
import { PageHeader } from "@/components/PageHeader";
import { QuickCreateButton } from "@/components/QuickCreateButton";
import { CreateTransactionModal } from "../transactions/_components/CreateTransactionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTransactionActions } from "../transactions/_hooks/useTransactionActions";

const DashboardPage: NextPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } = useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  const { createTransaction, isCreating } = useTransactionActions();

  const isLoading = isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;

  // Calcular receitas e despesas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyIncomes = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyBalance = monthlyIncomes - monthlyExpenses;

  // Calcular saldo total de todas as contas
  const totalBalance = accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance),
    0,
  );

  const handleCreateTransaction = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateTransactionSubmit = async (data: {
    description: string;
    amount: string;
    type: 'income' | 'expense' | 'transfer';
    date: string;
    category: string;
    accountId?: number;
    creditCardId?: number;
  }) => {
    await createTransaction(data);
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Dashboard"
          description="Visão geral das suas finanças e transações recentes"
          action={<Skeleton className="h-9 w-32" />}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          {/* Loading Cards */}
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

          {/* Loading Accordions */}
          <div className="space-y-4">
            <div className="border rounded-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-center justify-between p-3 rounded border">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-7 w-7 rounded-lg" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="border rounded p-3">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças e transações recentes"
        action={
          <QuickCreateButton onClick={handleCreateTransaction}>
            Novo Lançamento
          </QuickCreateButton>
        }
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IncomesCard monthlyIncomes={monthlyIncomes} />
          <ExpensesCard monthlyExpenses={monthlyExpenses} />
          <MonthlyBalanceCard monthlyBalance={monthlyBalance} />
          <TotalBalanceCard totalBalance={totalBalance} />
        </div>

        {/* Visão Geral de Contas e Cartões */}
        <Accordion type="single" collapsible className="w-full" defaultValue="resources">
          <AccordionItem value="resources">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:bg-muted/50 rounded-lg transition-colors p-4">
              <div className="flex items-center justify-between w-full mr-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-500" />
                    <span>Recursos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {accounts.length} contas
                  </Badge>
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {creditCards.length} cartões
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:hidden">
                    {accounts.length + creditCards.length}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(totalBalance)}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
                <CreditCardsOverview creditCards={creditCards} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Insights Financeiros e Gráfico */}
        <Accordion type="single" collapsible className="w-full" defaultValue="reports">
          <AccordionItem value="reports">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:bg-muted/50 rounded-lg transition-colors p-4">
              <div className="flex items-center justify-between w-full mr-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <span>Relatórios</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={monthlyBalance >= 0 ? "default" : "destructive"} 
                    className="text-xs"
                  >
                    {monthlyBalance >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(Math.abs(monthlyBalance))}
                  </Badge>
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    {monthlyTransactions.length} transações
                  </Badge>
                  <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()} className="hidden md:flex">
                    <Link href="/reports" className="flex items-center gap-1 text-xs">
                      Ver Completos
                    </Link>
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <div>
                  <FinancialInsights
                    transactions={transactions}
                    monthlyIncomes={monthlyIncomes}
                    monthlyExpenses={monthlyExpenses}
                    monthlyBalance={monthlyBalance}
                  />
                </div>
                <div>
                  <IncomeVsExpenseChart
                    transactions={transactions}
                    selectedMonth={currentMonth}
                    selectedYear={currentYear}
                    selectedAccountId={null}
                    selectedCreditCardId={null}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <CreateTransactionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTransactionSubmit}
        isLoading={isCreating}
      />
    </>
  );
};

export default DashboardPage;
