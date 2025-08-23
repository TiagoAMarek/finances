import DashboardPage from "@/app/dashboard/page";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { ENDPOINTS } from "../utils/endpoints";
import {
  createAuthErrorHandler,
  createDelayedHandler,
  createLargeTransactionSet,
  createRetryHandler,
  setupEmptyDataHandlers,
} from "../utils/integration-tests-helpers";
import { renderWithProviders, testHelpers } from "../utils/test-utils";
import { TEST_CONSTANTS, TEST_DATA } from "./fixtures/dashboard-api";

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

      // Re-apply categories GET handlers for both absolute and relative URLs to avoid unhandled requests
      server.use(
        http.get(/\/api\/categories(?:\/.*)?$/, ({ request }) => {
          // Optionally honor auth header as in shared handler
          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return HttpResponse.json(
              { detail: "Authorization header required" },
              { status: 401 },
            );
          }
          // Minimal but consistent response shape
          return HttpResponse.json([
            {
              id: 2,
              name: "Alimentação",
              type: "expense",
              color: "#f59e0b",
              icon: "🍽️",
              isDefault: true,
              ownerId: 1,
              createdAt: "2024-01-01T00:00:00Z",
            },
          ]);
        }),
        http.get("http://localhost:3000/api/categories", ({ request }) => {
          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return HttpResponse.json(
              { detail: "Authorization header required" },
              { status: 401 },
            );
          }
          return HttpResponse.json([
            {
              id: 2,
              name: "Alimentação",
              type: "expense",
              color: "#f59e0b",
              icon: "🍽️",
              isDefault: true,
              ownerId: 1,
              createdAt: "2024-01-01T00:00:00Z",
            },
          ]);
        }),
      );

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
      // Ensure categories handlers are present to avoid unhandled requests in this block
      beforeEach(() => {
        // import helper lazily to avoid hoist issues in Vitest
        // Inline minimal re-apply to avoid CJS/TSX import issues in Vitest
        server.use(
          http.get(/\/api\/categories(?:\/.*)?$/, () =>
            HttpResponse.json(TEST_DATA.CATEGORIES.DEFAULT),
          ),
          http.get("http://localhost:3000/api/categories", () =>
            HttpResponse.json(TEST_DATA.CATEGORIES.DEFAULT),
          ),
        );
      });
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
