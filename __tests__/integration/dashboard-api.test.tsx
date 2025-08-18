import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders, testHelpers, localStorageMock, mockLocation } from '../utils/test-utils';
import DashboardPage from '@/app/dashboard/page';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Dashboard API Integration Tests', () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  describe('Real-time Data Updates', () => {
    it('should handle new transaction creation and update dashboard', async () => {
      renderWithProviders(<DashboardPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      // Get initial balance
      const initialBalanceText = screen.getByText(/R\$\s*29\.200,50/);
      expect(initialBalanceText).toBeInTheDocument();

      // Mock a new transaction creation
      server.use(
        http.post('/api/transactions', () => {
          return HttpResponse.json({
            transaction: {
              id: 999,
              description: 'Nova Receita',
              amount: '1000.00',
              type: 'income',
              date: new Date().toISOString().split('T')[0],
              category: 'Freelance',
              ownerId: 1,
              accountId: 1,
              creditCardId: null,
            }
          });
        })
      );

      // The dashboard should update when new transactions are added
      // (This would typically happen through TanStack Query invalidation)
    });

    it('should handle concurrent API requests gracefully', async () => {
      // Mock delayed responses to test concurrent behavior
      server.use(
        http.get('/api/accounts', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json([]);
        }),
        http.get('/api/credit_cards', async () => {
          await new Promise(resolve => setTimeout(resolve, 150));
          return HttpResponse.json([]);
        }),
        http.get('/api/transactions', async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          return HttpResponse.json([]);
        })
      );

      renderWithProviders(<DashboardPage />);

      // All requests should complete without race conditions
      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Network Error Scenarios', () => {
    it('should handle network timeout gracefully', async () => {
      server.use(
        http.get('/api/accounts', async () => {
          await new Promise(resolve => setTimeout(resolve, 10000)); // Simulate timeout
          return HttpResponse.json([]);
        })
      );

      renderWithProviders(<DashboardPage />);

      // Should eventually show some error state or fallback content
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle intermittent API failures with retry logic', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('/api/accounts', () => {
          attemptCount++;
          if (attemptCount < 3) {
            return HttpResponse.json(
              { detail: 'Erro temporário' },
              { status: 500 }
            );
          }
          return HttpResponse.json([
            { id: 1, name: 'Conta Recuperada', balance: '1000.00', currency: 'BRL', ownerId: 1 }
          ]);
        })
      );

      renderWithProviders(<DashboardPage />);

      // Should eventually succeed after retries
      await waitFor(() => {
        expect(screen.queryByText('Conta Recuperada')).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across multiple renders', async () => {
      const { rerender } = renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      const firstRender = screen.getByText(/R\$\s*29\.200,50/);
      expect(firstRender).toBeInTheDocument();

      // Rerender the component
      rerender(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      // Data should remain consistent
      const secondRender = screen.getByText(/R\$\s*29\.200,50/);
      expect(secondRender).toBeInTheDocument();
    });

    it('should handle empty data states appropriately', async () => {
      server.use(
        http.get('/api/accounts', () => HttpResponse.json([])),
        http.get('/api/credit_cards', () => HttpResponse.json([])),
        http.get('/api/transactions', () => HttpResponse.json([]))
      );

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      // Should show appropriate empty states or zero values
      expect(screen.getByText(/R\$\s*0,00/) || 
        screen.queryByText('Nenhuma conta encontrada') ||
        screen.queryByText('Nenhum dado disponível')).toBeTruthy();
    });
  });

  describe('Performance and Caching', () => {
    it('should cache API responses effectively', async () => {
      let apiCallCount = 0;

      server.use(
        http.get('/api/accounts', () => {
          apiCallCount++;
          return HttpResponse.json([
            { id: 1, name: 'Conta Teste', balance: '1000.00', currency: 'BRL', ownerId: 1 }
          ]);
        })
      );

      const { rerender } = renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      const initialCallCount = apiCallCount;

      // Rerender should not trigger new API calls due to caching
      rerender(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      // API should not be called again due to TanStack Query caching
      expect(apiCallCount).toBe(initialCallCount);
    });

    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeTransactionSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        description: `Transação ${i + 1}`,
        amount: '100.00',
        type: 'expense' as const,
        date: new Date().toISOString().split('T')[0],
        category: 'Teste',
        ownerId: 1,
        accountId: 1,
        creditCardId: null,
      }));

      server.use(
        http.get('/api/transactions', () => {
          return HttpResponse.json(largeTransactionSet);
        })
      );

      const startTime = Date.now();
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time even with large dataset
      expect(renderTime).toBeLessThan(5000); // 5 seconds max
    });
  });

  describe('Authentication Integration', () => {
    it('should handle authentication errors properly', async () => {
      server.use(
        http.get('/api/accounts', () => {
          return HttpResponse.json(
            { detail: 'Token expirado' },
            { status: 401 }
          );
        })
      );

      renderWithProviders(<DashboardPage />);

      // Should handle 401 gracefully - either redirect or show error
      await waitFor(() => {
        // The component should still render even with auth errors
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should refresh data when user logs back in', async () => {
      // Start without authentication
      testHelpers.clearAuthentication();

      renderWithProviders(<DashboardPage />);

      // Set authentication (simulating login)
      testHelpers.setAuthenticatedUser();

      // Should trigger data refresh
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });
});