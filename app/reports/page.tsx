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
import { AccountCardFilter } from "@/components/AccountCardFilter";
import { FilterState } from "@/hooks/useAccountCardFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard } from "lucide-react";

const ReportsPage: NextPage = () => {
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } = useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();

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
      // Se ambos os arrays estão vazios E existem contas/cartões, não mostrar nada
      const hasAccounts = accounts.length > 0;
      const hasCreditCards = creditCards.length > 0;
      const noAccountsSelected = accountCardFilters.accounts.length === 0;
      const noCardsSelected = accountCardFilters.creditCards.length === 0;
      
      // Se nenhum filtro foi selecionado e existem opções, não mostrar nada
      if (hasAccounts && hasCreditCards && noAccountsSelected && noCardsSelected) {
        return false;
      }
      
      // Se só tem contas e nenhuma está selecionada, não mostrar nada
      if (hasAccounts && !hasCreditCards && noAccountsSelected) {
        return false;
      }
      
      // Se só tem cartões e nenhum está selecionado, não mostrar nada
      if (!hasAccounts && hasCreditCards && noCardsSelected) {
        return false;
      }
      
      const accountMatch = t.accountId ? 
        accountCardFilters.accounts.includes(t.accountId) : 
        noAccountsSelected;
      const cardMatch = t.creditCardId ? 
        accountCardFilters.creditCards.includes(t.creditCardId) : 
        noCardsSelected;
      
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
          action={<Skeleton className="h-9 w-32" />}
        />

        <div className="space-y-8 px-4 lg:px-6 pb-8">
          {/* Loading Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Loading Accordions */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {[1, 2].map((j) => (
                      <div key={j} className="rounded-lg border bg-card p-6 space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-48 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
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
        title="Relatórios"
        description="Análises detalhadas e gráficos das suas finanças"
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
      />

      <div className="space-y-8 px-4 lg:px-6 pb-8">
        {/* Cards de Performance */}
        <FinancialPerformanceCards 
          transactions={filteredTransactions}
          monthlyIncomes={monthlyIncomes}
          monthlyExpenses={monthlyExpenses}
          monthlyBalance={monthlyBalance}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedAccountId={null}
          selectedCreditCardId={null}
        />

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <BalanceEvolutionChart totalBalance={totalBalance} />
          <IncomeVsExpenseChart 
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
          <ExpenseCategoriesChart 
            transactions={filteredTransactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedAccountId={null}
            selectedCreditCardId={null}
          />
        </div>


        {/* Análise por Contas Bancárias (resumida) */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="accounts-analysis">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:bg-muted/50 rounded-lg transition-colors p-4">
              <div className="flex items-center justify-between w-full mr-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-500" />
                    <span>Visão Geral - Contas Bancárias</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {getAccountData().length} transações
                  </Badge>
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {accounts.length} contas
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Análise por Cartões de Crédito (resumida) */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="cards-analysis">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline hover:bg-muted/50 rounded-lg transition-colors p-4">
              <div className="flex items-center justify-between w-full mr-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    <span>Visão Geral - Cartões de Crédito</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {getCreditCardData().length} transações
                  </Badge>
                  <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                    {creditCards.length} cartões
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default ReportsPage;