import TransactionsPage from "@/app/transactions/page";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders, testHelpers } from "../utils/test-utils";

// Initial smoke/integration tests for Transactions page
// Mirrors style of __tests__/pages/dashboard.test.tsx

describe("Transactions Page — Initial Load", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it("renders the page header immediately", () => {
    renderWithProviders(<TransactionsPage />);
    expect(screen.getByText("Lançamentos")).toBeInTheDocument();
  });

  it("shows loading state and then displays content after data loads", async () => {
    renderWithProviders(<TransactionsPage />);

    // While loading, we should at least see the header and the action area placeholder eventually stabilize
    // Wait for loading to finish by checking that a primary action becomes available
    await waitFor(
      () => {
        // Once data loaded, the "Novo Lançamento" button should be present
        expect(screen.getByText("Novo Lançamento")).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Expect some list content or indicators from the TransactionsList
    // We keep assertions loose because list rows/labels come from MSW fixtures
    const hasListIndicators = [
      ...screen.queryAllByText(/\bdespesa\b/i),
      ...screen.queryAllByText(/\breceita\b/i),
      ...screen.queryAllByText(/transfer/i),
    ];

    const structuralList =
      document.querySelector("[data-testid*='transaction']") ||
      document.querySelector("[role='table']") ||
      document.querySelector("[role='list']");

    expect(hasListIndicators.length > 0 || !!structuralList).toBeTruthy();
  });
});
