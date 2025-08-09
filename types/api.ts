// Types based on database schema (decimal fields come as strings from API)

export interface User {
  id: number;
  email: string;
  hashedPassword: string;
}

export interface BankAccount {
  id: number;
  name: string;
  balance: string; // Decimal fields come as strings from API
  currency: string;
  ownerId: number;
}

export interface CreditCard {
  id: number;
  name: string;
  limit: string; // Decimal fields come as strings from API
  currentBill: string; // Decimal fields come as strings from API
  ownerId: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: string; // Decimal fields come as strings from API
  type: 'income' | 'expense' | 'transfer';
  date: string; // ISO format string
  category: string;
  ownerId: number;
  accountId: number | null;
  creditCardId: number | null;
  toAccountId?: number | null; // For transfers
}

export interface MonthlySummary {
  month: number;
  year: number;
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
  user: Omit<User, 'hashedPassword'>;
}

// API Response wrappers
export interface ApiSuccessResponse<T> {
  [key: string]: T | string;
}

export interface ApiErrorResponse {
  detail: string;
}