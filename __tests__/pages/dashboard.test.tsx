import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  testHelpers,
  mockLocation,
} from "../utils/test-utils";
import DashboardPage from "@/app/dashboard/page";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

// Use the same constants as integration tests
const TEST_CONSTANTS = {
  BASE_URL: "http://localhost:3000",
} as const;

const ENDPOINTS = {
  ACCOUNTS: `${TEST_CONSTANTS.BASE_URL}/api/accounts`,
  CREDIT_CARDS: `${TEST_CONSTANTS.BASE_URL}/api/credit_cards`,
  TRANSACTIONS: `${TEST_CONSTANTS.BASE_URL}/api/transactions`,
} as const;

describe("Dashboard Page", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  describe("Initial Load", () => {
    it("should render dashboard page", () => {
      renderWithProviders(<DashboardPage />);

      // Should render the dashboard title
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should fetch and display dashboard data successfully", async () => {
      renderWithProviders(<DashboardPage />);

      // Wait for data to load - look for metric cards that should be present
      await waitFor(
        () => {
          // Look for the specific monthly metric cards from the refactored interface
          const hasData =
            screen.queryByText("Receitas do Mês") ||
            screen.queryByText("Despesas do Mês") ||
            screen.queryByText("Saldo Mensal");
          expect(hasData).toBeTruthy();
        },
        { timeout: 5000 },
      );
    });

    it("should display account and credit card information", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(
        () => {
          // Look for any account or credit card names from our mock data
          const hasAccounts =
            screen.queryByText("Conta Corrente Principal") ||
            screen.queryByText("Conta Poupança");
          const hasCards =
            screen.queryByText("Cartão Platinum") ||
            screen.queryByText("Cartão Gold");

          expect(hasAccounts || hasCards).toBeTruthy();
        },
        { timeout: 5000 },
      );
    });

    it("should render accordion sections", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(
        () => {
          // Look for accordion sections - the dashboard should have resources and reports
          const hasAccordion =
            document.querySelector("[data-radix-collection-item]") ||
            document.querySelector('[role="button"][aria-expanded]') ||
            screen.queryByText("Recursos") ||
            screen.queryByText("Relatórios");

          expect(hasAccordion).toBeTruthy();
        },
        { timeout: 5000 },
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle accounts API error gracefully", async () => {
      // Mock API failure for accounts
      server.use(
        http.get(ENDPOINTS.ACCOUNTS, () => {
          return HttpResponse.json(
            { detail: "Erro interno do servidor" },
            { status: 500 },
          );
        }),
      );

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        // Should still render the page structure even with failed API calls
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("should handle credit cards API error gracefully", async () => {
      // Mock API failure for credit cards
      server.use(
        http.get(ENDPOINTS.CREDIT_CARDS, () => {
          return HttpResponse.json(
            { detail: "Erro interno do servidor" },
            { status: 500 },
          );
        }),
      );

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("should handle transactions API error gracefully", async () => {
      // Mock API failure for transactions
      server.use(
        http.get(ENDPOINTS.TRANSACTIONS, () => {
          return HttpResponse.json(
            { detail: "Erro interno do servidor" },
            { status: 500 },
          );
        }),
      );

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
      });
    });

    it("should handle authentication errors properly", async () => {
      // Set an invalid token to ensure the API is called
      testHelpers.setAuthenticatedUser("invalid-token");

      // Mock 401 response for all endpoints using proper constants
      server.use(
        http.get(ENDPOINTS.ACCOUNTS, () => {
          return HttpResponse.json(
            { detail: "Token inválido" },
            { status: 401 },
          );
        }),
        http.get(ENDPOINTS.CREDIT_CARDS, () => {
          return HttpResponse.json(
            { detail: "Token inválido" },
            { status: 401 },
          );
        }),
        http.get(ENDPOINTS.TRANSACTIONS, () => {
          return HttpResponse.json(
            { detail: "Token inválido" },
            { status: 401 },
          );
        }),
      );

      renderWithProviders(<DashboardPage />);

      // Should attempt to redirect to login when 401 is encountered
      await waitFor(
        () => {
          expect(mockLocation.href).toBe("/login");
        },
        { timeout: 5000 },
      );
    });
  });

  describe("Data Integration", () => {
    it("should calculate total balance correctly from all accounts", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        // Total balance should be displayed in the Saldo Total cards (there are multiple)
        const totalBalanceElements = screen.getAllByText(/R\$\s*29\.200/);
        expect(totalBalanceElements.length).toBeGreaterThan(0);
      });
    });

    it("should display monthly financial metrics", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        // Should display monthly income and expense metrics
        const monthlyIncomeElements = screen.getAllByText(/R\$\s*5\.500/);
        expect(monthlyIncomeElements.length).toBeGreaterThan(0);
      });
    });

    it("should display recent transactions data", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Should show transaction counts or indicators that data has loaded
      const transactionElements = screen.queryAllByText(/transações/i);
      const hasLaunchments = screen.queryByText(/lançamentos/i);
      const hasChart = document.querySelector('[data-testid*="chart"]');

      expect(
        transactionElements.length > 0 || hasLaunchments || hasChart,
      ).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should make API calls in parallel", async () => {
      const apiCallTimes: number[] = [];

      // Track API call timings using proper endpoint constants
      server.use(
        http.get(ENDPOINTS.ACCOUNTS, () => {
          apiCallTimes.push(Date.now());
          return HttpResponse.json([]);
        }),
        http.get(ENDPOINTS.CREDIT_CARDS, () => {
          apiCallTimes.push(Date.now());
          return HttpResponse.json([]);
        }),
        http.get(ENDPOINTS.TRANSACTIONS, () => {
          apiCallTimes.push(Date.now());
          return HttpResponse.json([]);
        }),
      );

      renderWithProviders(<DashboardPage />);

      await waitFor(
        () => {
          expect(apiCallTimes.length).toBeGreaterThanOrEqual(3);
        },
        { timeout: 5000 },
      );

      // All calls should happen within a small time window (parallel execution)
      const timeDiff = Math.max(...apiCallTimes) - Math.min(...apiCallTimes);
      expect(timeDiff).toBeLessThan(1000); // Less than 1 second difference
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Check for proper heading hierarchy
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("Dashboard");
    });

    it("should have accessible card structures", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Cards should have proper regions or landmarks
      const cards =
        screen.getAllByRole("region") ||
        screen.getAllByRole("article") ||
        document.querySelectorAll('[role="group"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});

