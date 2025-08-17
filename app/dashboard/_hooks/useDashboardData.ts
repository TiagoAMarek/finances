import { useMemo } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useTransactions } from "@/hooks/useTransactions";
import {
  calculateMonthlyMetrics,
  calculateTotalBalance,
  MonthlyMetrics,
} from "../_utils/dashboard-calculations";
import { Transaction, BankAccount, CreditCard } from "@/lib/schemas";

/**
 * Interface for dashboard data
 */
export interface DashboardData {
  monthlyMetrics: MonthlyMetrics;
  totalBalance: number;
  accounts: BankAccount[];
  creditCards: CreditCard[];
  transactions: Transaction[];
  isLoading: boolean;
}

/**
 * Custom hook for dashboard data processing
 *
 * Centralizes all business logic and data fetching for the dashboard,
 * following the pattern established in useExpenseAnalysis and other hooks.
 *
 * Features:
 * - Memoized calculations for performance
 * - Centralized loading state management
 * - Optimized data processing
 * - Reusable across dashboard components
 */
export function useDashboardData(): DashboardData {
  // Fetch data using existing hooks
  const { data: accounts = [], isLoading: isLoadingAccounts } = useAccounts();
  const { data: creditCards = [], isLoading: isLoadingCreditCards } =
    useCreditCards();
  const { data: transactions = [], isLoading: isLoadingTransactions } =
    useTransactions();

  // Combine loading states
  const isLoading =
    isLoadingAccounts || isLoadingCreditCards || isLoadingTransactions;

  // Memoized monthly metrics calculation
  const monthlyMetrics = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        incomes: 0,
        expenses: 0,
        balance: 0,
        transactions: [],
        transactionCount: 0,
      };
    }
    return calculateMonthlyMetrics(transactions);
  }, [transactions, isLoading]);

  // Memoized total balance calculation
  const totalBalance = useMemo(() => {
    if (isLoading || accounts.length === 0) {
      return 0;
    }
    return calculateTotalBalance(accounts);
  }, [accounts, isLoading]);

  return {
    monthlyMetrics,
    totalBalance,
    accounts,
    creditCards,
    transactions,
    isLoading,
  };
}

/**
 * Hook for getting current month and year
 * Useful for components that need current date context
 */
export function useCurrentMonth(): {
  currentMonth: number;
  currentYear: number;
} {
  return useMemo(() => {
    const now = new Date();
    return {
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear(),
    };
  }, []);
}
