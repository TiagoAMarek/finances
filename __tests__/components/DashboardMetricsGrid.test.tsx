import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import { DashboardMetricsGrid } from '@/app/dashboard/_components/DashboardMetricsGrid';

describe('DashboardMetricsGrid Component', () => {
  const mockData = {
    monthlyMetrics: {
      incomes: 17300.00,
      expenses: 3545.15,
      balance: 13754.85,
      transactions: [],
      transactionCount: 25,
    },
    totalBalance: 29200.50,
  };

  it('should render all metric cards', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    expect(screen.getByText('Saldo Total')).toBeInTheDocument();
    expect(screen.getByText('Receitas do Mês')).toBeInTheDocument();
    expect(screen.getByText('Despesas do Mês')).toBeInTheDocument();
    expect(screen.getByText('Saldo Mensal')).toBeInTheDocument();
  });

  it('should display formatted currency values correctly', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    expect(screen.getByText(/R\$\s*29\.200/)).toBeInTheDocument(); // Total Balance
    expect(screen.getByText(/R\$\s*17\.300/)).toBeInTheDocument(); // Monthly Incomes
    expect(screen.getByText(/R\$\s*3\.545/)).toBeInTheDocument();  // Monthly Expenses
    expect(screen.getByText(/R\$\s*13\.754/)).toBeInTheDocument(); // Monthly Balance
  });

  it('should handle zero values gracefully', () => {
    const zeroData = {
      monthlyMetrics: {
        incomes: 0,
        expenses: 0,
        balance: 0,
        transactions: [],
        transactionCount: 0,
      },
      totalBalance: 0,
    };

    renderWithProviders(<DashboardMetricsGrid {...zeroData} />);

    expect(screen.getByText(/R\$\s*0/)).toBeInTheDocument();
  });

  it('should handle negative values correctly', () => {
    const negativeData = {
      monthlyMetrics: {
        incomes: 1000.00,
        expenses: 2500.50,
        balance: -1500.50,
        transactions: [],
        transactionCount: 10,
      },
      totalBalance: -500.25,
    };

    renderWithProviders(<DashboardMetricsGrid {...negativeData} />);

    expect(screen.getByText(/R\$\s*-1\.500/)).toBeInTheDocument(); // Monthly balance
    expect(screen.getByText(/R\$\s*-500/)).toBeInTheDocument();   // Total balance
  });

  it('should display proper accessibility attributes', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    // Cards should be properly labelled for screen readers
    const cards = screen.getAllByRole('article') || 
                 screen.getAllByRole('region') ||
                 document.querySelectorAll('[role="group"]');
    
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should be responsive and maintain structure', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    // Grid should be present with proper class structure
    const gridContainer = document.querySelector('.grid') || 
                          document.querySelector('[class*="grid"]');
    
    expect(gridContainer).toBeTruthy();
  });
});