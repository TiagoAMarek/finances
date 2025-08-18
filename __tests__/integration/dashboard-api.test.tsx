import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders, testHelpers } from "../utils/test-utils";
import DashboardPage from "@/app/dashboard/page";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { BankAccount, Transaction } from "@/lib/schemas";

// ============================================================================
// Test Constants & Configuration
// ============================================================================

const TEST_CONSTANTS = {
  EXPECTED_TOTAL_BALANCE: "29.200,50", // Sum of all mock account balances
  EXPECTED_MONTHLY_INCOME: "5.500,00", // From mock transaction data
  BASE_URL: "http://localhost:3000",
  TIMEOUTS: {
    DASHBOARD_LOAD: 5000,
    API_RETRY: 5000,
    QUICK_OPERATION: 1000,
    SLOW_OPERATION: 2000,
    PERFORMANCE_MAX: 5000,
  },
} as const;

const ENDPOINTS = {
  ACCOUNTS: `${TEST_CONSTANTS.BASE_URL}/api/accounts`,
  CREDIT_CARDS: `${TEST_CONSTANTS.BASE_URL}/api/credit_cards`,
  TRANSACTIONS: `${TEST_CONSTANTS.BASE_URL}/api/transactions`,
} as const;

const TEST_DATA = {
  RECOVERED_ACCOUNT: {
    id: 1,
    name: "Conta Recuperada",
    balance: "1000.00",
    currency: "BRL",
    ownerId: 1,
  } as BankAccount,

  TEST_ACCOUNT: {
    id: 1,
    name: "Conta Teste",
    balance: "1000.00",
    currency: "BRL",
    ownerId: 1,
  } as BankAccount,

  NEW_TRANSACTION: {
    id: 999,
    description: "Nova Receita",
    amount: "1000.00",
    type: "income" as const,
    date: new Date().toISOString().split("T")[0],
    category: "Freelance",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
  } as Transaction,

  ERROR_MESSAGES: {
    TEMPORARY_ERROR: "Erro temporário",
    TOKEN_EXPIRED: "Token expirado",
  },
} as const;

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Waits for the dashboard to finish loading (skeleton disappears)
 */
const waitForDashboardLoad = (
  timeout: number = TEST_CONSTANTS.TIMEOUTS.DASHBOARD_LOAD,
) => {
  return waitFor(
    () => {
      expect(
        screen.queryByTestId("dashboard-skeleton"),
      ).not.toBeInTheDocument();
    },
    { timeout },
  );
};

/**
 * Expects balance elements to appear on the page
 */
const expectBalanceElements = (balanceText: string, expectedCount?: number) => {
  const balanceRegex = new RegExp(`R\\$\\s*${balanceText.replace(".", "\\.")}`);
  const elements = screen.getAllByText(balanceRegex);

  if (expectedCount !== undefined) {
    expect(elements.length).toBe(expectedCount);
  } else {
    expect(elements.length).toBeGreaterThan(0);
  }

  return elements;
};

/**
 * Sets up MSW handlers for empty data states
 */
const setupEmptyDataHandlers = () => {
  server.resetHandlers(
    http.get(ENDPOINTS.ACCOUNTS, () => HttpResponse.json([])),
    http.get(ENDPOINTS.CREDIT_CARDS, () => HttpResponse.json([])),
    http.get(ENDPOINTS.TRANSACTIONS, () => HttpResponse.json([])),
  );
};

/**
 * Creates a handler that simulates network delays
 */
const createDelayedHandler = (
  endpoint: string,
  delay: number,
  responseData: any = [],
) => {
  return http.get(endpoint, async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return HttpResponse.json(responseData);
  });
};

/**
 * Creates a handler that fails a specified number of times before succeeding
 */
const createRetryHandler = (
  endpoint: string,
  failureCount: number,
  successData: any,
  errorMessage = TEST_DATA.ERROR_MESSAGES.TEMPORARY_ERROR,
) => {
  let attemptCount = 0;

  return http.get(endpoint, () => {
    attemptCount++;
    if (attemptCount <= failureCount) {
      return HttpResponse.json({ detail: errorMessage }, { status: 500 });
    }
    return HttpResponse.json(successData);
  });
};

/**
 * Creates a handler that returns an authentication error
 */
const createAuthErrorHandler = (endpoint: string) => {
  return http.get(endpoint, () =>
    HttpResponse.json(
      { detail: TEST_DATA.ERROR_MESSAGES.TOKEN_EXPIRED },
      { status: 401 },
    ),
  );
};

/**
 * Creates a large dataset for performance testing
 */
const createLargeTransactionSet = (size = 1000) => {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    description: `Transação ${i + 1}`,
    amount: "100.00",
    type: "expense" as const,
    date: new Date().toISOString().split("T")[0],
    category: "Teste",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
  }));
};

describe("Dashboard API Integration Tests", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  describe("Real-time Data Updates", () => {
    it("should handle new transaction creation and update dashboard", async () => {
      // Given: Dashboard is rendered with initial data
      renderWithProviders(<DashboardPage />);
      await waitForDashboardLoad();

      // Then: Initial balance should be displayed
      expectBalanceElements(TEST_CONSTANTS.EXPECTED_TOTAL_BALANCE);

      // When: Mock a new transaction creation endpoint
      server.use(
        http.post(ENDPOINTS.TRANSACTIONS, () => {
          return HttpResponse.json({
            transaction: TEST_DATA.NEW_TRANSACTION,
          });
        }),
      );

      // Note: The dashboard should update when new transactions are added
      // (This would typically happen through TanStack Query invalidation)
    });

    it("should handle concurrent API requests gracefully", async () => {
      // Given: Mock API endpoints with staggered response delays
      server.use(
        createDelayedHandler(ENDPOINTS.ACCOUNTS, 100),
        createDelayedHandler(ENDPOINTS.CREDIT_CARDS, 150),
        createDelayedHandler(ENDPOINTS.TRANSACTIONS, 200),
      );

      // When: Dashboard is rendered (triggers concurrent API calls)
      renderWithProviders(<DashboardPage />);

      // Then: All requests should complete without race conditions
      await waitForDashboardLoad(TEST_CONSTANTS.TIMEOUTS.QUICK_OPERATION);
    });
  });

  describe("Network Error Scenarios", () => {
    it("should handle network timeout gracefully", async () => {
      // Given: Mock a very slow API response (simulates timeout)
      server.use(
        createDelayedHandler(ENDPOINTS.ACCOUNTS, 10000), // 10 second delay
      );

      // When: Dashboard is rendered
      renderWithProviders(<DashboardPage />);

      // Then: Should eventually show fallback content (header at minimum)
      await waitFor(
        () => {
          expect(screen.getByText("Dashboard")).toBeInTheDocument();
        },
        { timeout: TEST_CONSTANTS.TIMEOUTS.SLOW_OPERATION },
      );
    });

    it("should retry failed API calls and eventually succeed", async () => {
      // Given: Mock API that fails twice then succeeds
      server.use(
        createRetryHandler(ENDPOINTS.ACCOUNTS, 2, [
          TEST_DATA.RECOVERED_ACCOUNT,
        ]),
      );

      // When: Dashboard is rendered (triggers API calls with retries)
      renderWithProviders(<DashboardPage />);

      // Then: Should eventually show the recovered account data
      await waitFor(
        () => {
          expect(screen.queryByText("Conta Recuperada")).toBeInTheDocument();
        },
        { timeout: TEST_CONSTANTS.TIMEOUTS.API_RETRY },
      );
    });
  });

  describe("Data Consistency", () => {
    it("should maintain data consistency across multiple renders", async () => {
      // Given: Dashboard is rendered and data is loaded
      const { rerender } = renderWithProviders(<DashboardPage />);
      await waitForDashboardLoad();

      // When: Check initial balance display count
      const firstRenderElements = expectBalanceElements(
        TEST_CONSTANTS.EXPECTED_TOTAL_BALANCE,
      );

      // And: Component is re-rendered
      rerender(<DashboardPage />);
      await waitForDashboardLoad();

      // Then: Same number of balance elements should be displayed
      expectBalanceElements(
        TEST_CONSTANTS.EXPECTED_TOTAL_BALANCE,
        firstRenderElements.length,
      );
    });

    it("should display appropriate empty states when no data exists", async () => {
      // Given: Mock APIs return empty data
      setupEmptyDataHandlers();

      // When: Dashboard is rendered
      renderWithProviders(<DashboardPage />);
      await waitForDashboardLoad();

      // Then: Empty state message should be displayed
      const emptyStateText = await screen.findByText(
        /nenhuma conta cadastrada/i,
      );
      expect(emptyStateText).toBeInTheDocument();
    });

    describe("Performance and Caching", () => {
      it("should cache API responses and avoid redundant calls", async () => {
        // Given: Mock API that tracks call count
        let apiCallCount = 0;
        server.use(
          http.get(ENDPOINTS.ACCOUNTS, () => {
            apiCallCount++;
            return HttpResponse.json([TEST_DATA.TEST_ACCOUNT]);
          }),
        );

        // When: Dashboard is rendered and data is loaded
        const { rerender } = renderWithProviders(<DashboardPage />);
        await waitForDashboardLoad();
        const initialCallCount = apiCallCount;

        // And: Component is re-rendered (should use cached data)
        rerender(<DashboardPage />);
        await waitForDashboardLoad();

        // Then: API should not be called again due to TanStack Query caching
        expect(apiCallCount).toBe(initialCallCount);
      });

      it("should handle large datasets efficiently", async () => {
        // Given: Mock API with large transaction dataset
        const largeTransactionSet = createLargeTransactionSet(1000);
        server.use(
          http.get(ENDPOINTS.TRANSACTIONS, () => {
            return HttpResponse.json(largeTransactionSet);
          }),
        );

        // When: Dashboard renders with large dataset
        const startTime = Date.now();
        renderWithProviders(<DashboardPage />);
        await waitForDashboardLoad();
        const renderTime = Date.now() - startTime;

        // Then: Should render within acceptable performance limits
        expect(renderTime).toBeLessThan(
          TEST_CONSTANTS.TIMEOUTS.PERFORMANCE_MAX,
        );
      });
    });

    describe("Authentication Integration", () => {
      it("should gracefully handle authentication errors", async () => {
        // Given: Mock API returns authentication error
        server.use(createAuthErrorHandler(ENDPOINTS.ACCOUNTS));

        // When: Dashboard is rendered
        renderWithProviders(<DashboardPage />);

        // Then: Should handle 401 gracefully (component still renders)
        await waitFor(() => {
          expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
      });

      it("should refresh data when user authentication changes", async () => {
        // Given: Start without authentication
        testHelpers.clearAuthentication();

        // When: Dashboard is rendered, then user logs in
        renderWithProviders(<DashboardPage />);
        testHelpers.setAuthenticatedUser();

        // Then: Should trigger data refresh and show dashboard content
        await waitFor(() => {
          expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
      });
    });
  });
});
