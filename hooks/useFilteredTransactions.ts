import { useMemo } from "react";
import { Transaction, BankAccount, CreditCard } from "@/lib/schemas";
import { FilterState } from "./useAccountCardFilters";
import { useAccounts } from "./useAccounts";
import { useCreditCards } from "./useCreditCards";
import { useTransactions } from "./useTransactions";

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

export function useFilteredTransactions({
  accountCardFilters,
  dateFilter,
}: UseFilteredTransactionsParams): UseFilteredTransactionsReturn {
  // Buscar dados usando hooks internos
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } =
    useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();

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
