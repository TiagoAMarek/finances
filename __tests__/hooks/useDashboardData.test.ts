import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { TestProviders, testHelpers } from '../utils/test-utils';
import { useDashboardData } from '@/app/dashboard/_hooks/useDashboardData';

describe('useDashboardData Hook', () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it('should fetch all dashboard data successfully', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.accounts).toEqual([]);
    expect(result.current.creditCards).toEqual([]);
    expect(result.current.transactions).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have loaded data
    expect(result.current.accounts).toHaveLength(4);
    expect(result.current.creditCards).toHaveLength(3);
    expect(result.current.transactions).toHaveLength(18);
  });

  it('should calculate total balance correctly', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Total balance = 5250 + 12000 + 8750.50 + 3200 = 29200.50
    expect(result.current.totalBalance).toBe(29200.50);
  });

  it('should calculate monthly metrics correctly', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have monthly metrics with proper structure
    expect(result.current.monthlyMetrics).toBeDefined();
    expect(typeof result.current.monthlyMetrics.incomes).toBe('number');
    expect(typeof result.current.monthlyMetrics.expenses).toBe('number');
    expect(typeof result.current.monthlyMetrics.balance).toBe('number');
    expect(Array.isArray(result.current.monthlyMetrics.transactions)).toBe(true);
  });

  it('should filter transactions by type correctly', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Count income, expense, and transfer transactions
    const incomeTransactions = result.current.transactions.filter(t => t.type === 'income');
    const expenseTransactions = result.current.transactions.filter(t => t.type === 'expense');
    const transferTransactions = result.current.transactions.filter(t => t.type === 'transfer');

    expect(incomeTransactions.length).toBe(6); // Based on mock data
    expect(expenseTransactions.length).toBe(11); // Based on mock data
    expect(transferTransactions.length).toBe(1); // Based on mock data
  });

  it('should calculate recent transactions summary', async () => {
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Calculate totals from mock data
    const totalIncome = result.current.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = result.current.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    expect(totalIncome).toBeGreaterThan(0);
    expect(totalExpenses).toBeGreaterThan(0);
  });

  it('should handle empty data states properly', async () => {
    // Clear authentication to trigger empty states
    testHelpers.clearAuthentication();

    const { result } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have empty arrays and zero values when no authenticated data
    expect(result.current.accounts).toEqual([]);
    expect(result.current.creditCards).toEqual([]);
    expect(result.current.transactions).toEqual([]);
    expect(result.current.totalBalance).toBe(0);
  });

  it('should memoize expensive calculations', async () => {
    const { result, rerender } = renderHook(() => useDashboardData(), {
      wrapper: TestProviders,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const firstTotalBalance = result.current.totalBalance;
    const firstMonthlyMetrics = result.current.monthlyMetrics;

    // Rerender without changing data
    rerender();

    // Values should be the same (memoized)
    expect(result.current.totalBalance).toBe(firstTotalBalance);
    expect(result.current.monthlyMetrics).toBe(firstMonthlyMetrics);
  });
});