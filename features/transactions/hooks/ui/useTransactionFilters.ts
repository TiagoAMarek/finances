import { useState, useMemo } from "react";
import { Transaction } from "@/lib/schemas";

export interface TransactionFilters {
  search: string;
  type: "all" | "income" | "expense" | "transfer";
  category: string;
  accountId: string;
  creditCardId: string;
  dateFrom: string;
  dateTo: string;
}

const defaultFilters: TransactionFilters = {
  search: "",
  type: "all",
  category: "",
  accountId: "",
  creditCardId: "",
  dateFrom: "",
  dateTo: "",
};

/**
 * Hook for managing transaction filters and applying them to transaction list
 * Handles form state and filtering logic
 */
export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);

  // Extract unique categories from transactions
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      transactions.map((t) => t.category).filter(Boolean),
    );
    return Array.from(uniqueCategories).sort();
  }, [transactions]);

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      if (
        filters.search &&
        !transaction.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (filters.type !== "all" && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Account filter
      if (
        filters.accountId &&
        transaction.accountId?.toString() !== filters.accountId
      ) {
        return false;
      }

      // Credit Card filter
      if (
        filters.creditCardId &&
        transaction.creditCardId?.toString() !== filters.creditCardId
      ) {
        return false;
      }

      // Date range filter
      const transactionDate = new Date(transaction.date);
      if (filters.dateFrom && transactionDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && transactionDate > new Date(filters.dateTo)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    setFilters,
    resetFilters,
    categories,
    filteredTransactions,
    hasActiveFilters: Object.values(filters).some(
      (value) => value !== "" && value !== "all",
    ),
  };
}
