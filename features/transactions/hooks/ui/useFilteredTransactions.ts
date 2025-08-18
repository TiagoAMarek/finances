import { useMemo } from "react";
import { Transaction, BankAccount, CreditCard } from "@/lib/schemas";
import { FilterState } from "@/features/accounts/hooks/ui/useAccountCardFilters";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { useGetTransactions } from "../data";

interface UseFilteredTransactionsParams {
  accountCardFilters: FilterState;
  dateFilter?: {
    selectedMonth: number;
    selectedYear: number;
  };
}

interface UseFilteredTransactionsReturn {
  filteredTransactions: Transaction[];
  accounts: BankAccount[];
  creditCards: CreditCard[];
  transactions: Transaction[];
  isLoading: boolean;
}

/**
 * Hook for filtering transactions by account/card filters and date range
 * Combines data from multiple sources and applies filtering logic
 */
export function useFilteredTransactions({
  accountCardFilters,
  dateFilter,
}: UseFilteredTransactionsParams): UseFilteredTransactionsReturn {
  // Buscar dados usando hooks internos
  const { data: accounts = [], isLoading: isLoadingAccounts } =
    useGetAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } =
    useGetCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useGetTransactions();

  // Combinar estados de loading
  const isLoading =
    isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Aplicar filtro de data se fornecido
      if (dateFilter) {
        const transactionDate = new Date(t.date);
        const dateMatch =
          transactionDate.getMonth() === dateFilter.selectedMonth &&
          transactionDate.getFullYear() === dateFilter.selectedYear;
        if (!dateMatch) return false;
      }

      // Aplicar filtros de conta/cartão
      const hasAccounts = accounts.length > 0;
      const hasCreditCards = creditCards.length > 0;
      const noAccountsSelected = accountCardFilters.accounts.length === 0;
      const noCardsSelected = accountCardFilters.creditCards.length === 0;

      // Se nenhum filtro foi selecionado e existem opções, não mostrar nada
      if (
        hasAccounts &&
        hasCreditCards &&
        noAccountsSelected &&
        noCardsSelected
      ) {
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

      const accountMatch = t.accountId
        ? accountCardFilters.accounts.includes(t.accountId)
        : noAccountsSelected;
      const cardMatch = t.creditCardId
        ? accountCardFilters.creditCards.includes(t.creditCardId)
        : noCardsSelected;

      return accountMatch || cardMatch;
    });
  }, [transactions, accounts, creditCards, accountCardFilters, dateFilter]);

  return {
    filteredTransactions,
    accounts,
    creditCards,
    transactions,
    isLoading,
  };
}
