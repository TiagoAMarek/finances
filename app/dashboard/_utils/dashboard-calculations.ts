import { Transaction, BankAccount } from "@/lib/schemas";

/**
 * Dashboard calculation utilities
 *
 * Centralized business logic for dashboard data processing,
 * following the pattern established in other utility files.
 */

export interface MonthlyMetrics {
  incomes: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
  transactionCount: number;
}

/**
 * Filters transactions for the current month and year
 */
export function filterTransactionsByCurrentMonth(
  transactions: Transaction[],
): Transaction[] {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });
}

/**
 * Calculates monthly financial metrics from transactions
 */
export function calculateMonthlyMetrics(
  transactions: Transaction[],
): MonthlyMetrics {
  const monthlyTransactions = filterTransactionsByCurrentMonth(transactions);

  const incomes = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = incomes - expenses;

  return {
    incomes,
    expenses,
    balance,
    transactions: monthlyTransactions,
    transactionCount: monthlyTransactions.length,
  };
}

/**
 * Calculates total balance from all bank accounts
 */
export function calculateTotalBalance(accounts: BankAccount[]): number {
  return accounts.reduce(
    (sum, account) => sum + parseFloat(account.balance),
    0,
  );
}

/**
 * Formats currency values consistently across the dashboard
 */
export function formatDashboardCurrency(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Determines if monthly balance indicates positive or negative trend
 */
export function getBalanceTrend(balance: number): "positive" | "negative" {
  return balance >= 0 ? "positive" : "negative";
}

/**
 * Gets appropriate badge variant based on balance
 */
export function getBalanceBadgeVariant(
  balance: number,
): "default" | "destructive" {
  return balance >= 0 ? "default" : "destructive";
}
