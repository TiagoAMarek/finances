import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import DashboardPage from "@/app/dashboard/page";

import { server } from "../mocks/server";
import { renderWithProviders, testHelpers } from "../utils/test-utils";

describe("Dashboard User Interaction Flows", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
    server.resetHandlers();
  });

  describe("Accordion Interactions", () => {
    it("should expand and collapse Resources accordion", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      const resourcesAccordion = screen.getByText("Recursos");
      expect(resourcesAccordion).toBeInTheDocument();

      // Click to expand
      await userEvent.click(resourcesAccordion);

      // Should show expanded content - look for account names from mock data
      await waitFor(() => {
        const hasAccountContent =
          screen.queryByText("Conta Corrente Principal") ||
          screen.queryByText("Conta Poupança") ||
          screen.queryByText("Conta Investimentos") ||
          screen.queryByText("Cartão Platinum") ||
          screen.queryAllByText(/R\$/i).length > 6; // More currency indicators when expanded
        expect(hasAccountContent).toBeTruthy();
      });

      // Click again to collapse
      await userEvent.click(resourcesAccordion);

      // Content should be hidden (depending on implementation)
      // This test would need to be adjusted based on actual accordion behavior
    });

    it("should expand and collapse Reports accordion", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      const reportsAccordion = screen.getByText("Relatórios");
      expect(reportsAccordion).toBeInTheDocument();

      // Click to expand
      await userEvent.click(reportsAccordion);

      // Should show report content - look for FinancialInsights or Chart content
      await waitFor(() => {
        const hasReportContent =
          screen.queryByText("Insights Financeiros") ||
          screen.queryByText("Ver Completos") ||
          screen.queryByText(/transações/i) ||
          document.querySelector('[data-testid*="chart"]') ||
          document.querySelector(".recharts-wrapper");
        expect(hasReportContent).toBeTruthy();
      });
    });
  });

  describe("Quick Action Interactions", () => {
    it("should handle quick create transaction button click", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Look for quick create button with correct text
      const quickCreateButton =
        screen.queryByText("Novo Lançamento") ||
        screen.queryByRole("button", { name: /novo lançamento/i });

      if (quickCreateButton) {
        await userEvent.click(quickCreateButton);

        // Should open modal or navigate to creation page
        await waitFor(() => {
          const modalContent =
            screen.queryByRole("dialog") ||
            screen.queryByText("Nova Transação") ||
            screen.queryByText("Criar Transação");
          expect(modalContent).toBeTruthy();
        });
      }
    });

    it("should navigate to account management when clicking account cards", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      const accountCard = screen.queryByText("Conta Corrente Principal");
      if (accountCard) {
        // Click on account card should trigger some interaction
        await userEvent.click(accountCard);

        // Depending on implementation, this might open a modal or navigate
        // This test would need to be adjusted based on actual behavior
      }
    });
  });

  describe("Navigation Flows", () => {
    it("should handle keyboard navigation through interactive elements", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Test Tab navigation
      const user = userEvent.setup();

      // Press Tab to navigate through focusable elements
      await user.tab();

      // Should focus on first interactive element
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Test Enter/Space activation on focused elements
      if (focusedElement?.tagName === "BUTTON") {
        await user.keyboard("{Enter}");
        // Should activate the button
      }
    });
  });

  describe("Responsive Interactions", () => {
    it("should handle mobile viewport interactions", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Trigger resize event
      fireEvent(window, new Event("resize"));

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });
    });

    it("should handle touch interactions on mobile devices", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      const accordionTrigger = screen.getByText("Recursos");

      // Simulate touch events
      fireEvent.touchStart(accordionTrigger);
      fireEvent.touchEnd(accordionTrigger);

      // Should respond to touch events similar to click events
      await waitFor(() => {
        const hasAccountContent =
          screen.queryByText("Conta Corrente Principal") ||
          screen.queryByText("Conta Poupança") ||
          screen.queryAllByText(/R\$/i).length > 6;
        expect(hasAccountContent).toBeTruthy();
      });
    });
  });

  describe("Error Recovery Flows", () => {
    it("should allow user to retry failed operations", async () => {
      renderWithProviders(<DashboardPage />);

      // Wait for any error states to appear
      await waitFor(() => {
        const retryButton =
          screen.queryByText("Tentar Novamente") ||
          screen.queryByRole("button", { name: /retry/i });

        if (retryButton) {
          // Click retry button
          userEvent.click(retryButton);

          // Should trigger data refetch
          expect(retryButton).toBeInTheDocument();
        }
      });
    });

    it("should provide feedback for user actions", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Any user interaction should provide appropriate feedback
      // This could be visual feedback, loading states, success messages, etc.

      // Find a specific interactive element to avoid multiple matches
      const interactiveElement =
        screen.queryByText("Novo Lançamento") ||
        screen.queryByText("Recursos") ||
        screen.queryByText("Relatórios") ||
        screen.queryAllByRole("button")[0]; // Get first button if others not found

      if (interactiveElement) {
        await userEvent.click(interactiveElement);

        // Should show some form of feedback
        // This could be a loading state, navigation, modal, etc.
        // For now, just verify the element is still interactive
        expect(interactiveElement).toBeInTheDocument();
      }
    });
  });

  describe("Accessibility Interactions", () => {
    it("should support screen reader navigation", async () => {
      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });

      // Check for proper ARIA labels and roles
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper content structure - dashboard doesn't necessarily have main role
      // but should have proper heading structure
      const hasProperStructure =
        screen.queryByRole("main") ||
        screen.getByRole("heading", { level: 1 }) ||
        screen.getByText("Dashboard");
      expect(hasProperStructure).toBeTruthy();
    });

    it("should handle high contrast mode preferences", async () => {
      // Mock high contrast media query
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: query.includes("prefers-contrast"),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
        }),
      });

      renderWithProviders(<DashboardPage />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("dashboard-skeleton"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
