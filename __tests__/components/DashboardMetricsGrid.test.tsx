import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import { DashboardMetricsGrid } from '@/app/dashboard/_components/DashboardMetricsGrid';

describe('DashboardMetricsGrid Component', () => {
  const mockData = {
    totalBalance: 29200.50,
    totalBills: 4101.25,
    totalIncome: 17300.00,
    totalExpenses: 3545.15,
    accounts: [
      { id: 1, name: 'Conta Corrente', balance: '5250.00', currency: 'BRL', ownerId: 1 },
      { id: 2, name: 'Conta Poupança', balance: '12000.00', currency: 'BRL', ownerId: 1 },
    ],
    creditCards: [
      { id: 1, name: 'Cartão Platinum', limit: '5000.00', currentBill: '1250.75', ownerId: 1 },
    ],
    isLoading: false,
  };

  it('should render all metric cards', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    expect(screen.getByText('Saldo Total')).toBeInTheDocument();
    expect(screen.getByText('Receitas')).toBeInTheDocument();
    expect(screen.getByText('Despesas')).toBeInTheDocument();
    expect(screen.getByText('Fatura Total')).toBeInTheDocument();
  });

  it('should display formatted currency values correctly', () => {
    renderWithProviders(<DashboardMetricsGrid {...mockData} />);

    expect(screen.getByText(/R\$\s*29\.200,50/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*17\.300,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*3\.545,15/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*4\.101,25/)).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    const loadingData = { ...mockData, isLoading: true };
    renderWithProviders(<DashboardMetricsGrid {...loadingData} />);

    // Should show skeleton loaders or loading indicators
    expect(document.querySelector('.animate-pulse') || 
      screen.queryByTestId('metrics-loading')).toBeTruthy();
  });

  it('should handle zero values gracefully', () => {
    const zeroData = {
      ...mockData,
      totalBalance: 0,
      totalBills: 0,
      totalIncome: 0,
      totalExpenses: 0,
    };

    renderWithProviders(<DashboardMetricsGrid {...zeroData} />);

    expect(screen.getByText(/R\$\s*0,00/)).toBeInTheDocument();
  });

  it('should handle negative values correctly', () => {
    const negativeData = {
      ...mockData,
      totalBalance: -1500.50,
    };

    renderWithProviders(<DashboardMetricsGrid {...negativeData} />);

    expect(screen.getByText(/R\$\s*-1\.500,50/)).toBeInTheDocument();
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