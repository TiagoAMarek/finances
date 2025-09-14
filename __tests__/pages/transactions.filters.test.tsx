import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import TransactionsPage from "@/app/transactions/page";

import { renderWithProviders, testHelpers } from "../utils/test-utils";

// Page-level filters integration: interact with the filters UI and verify
// filtered state indicator toggles and clearing restores default view.

describe("Transactions Page — Filters", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it("applies text/type filters, shows filtered indicator, and clears filters", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TransactionsPage />);

    // Wait for the filters region to be rendered (skeleton gone)
    const filtersRegion = await screen.findByTestId("transaction-filters");

    // Search input
    const searchInput = within(filtersRegion).getByLabelText("Buscar");
    await user.clear(searchInput);
    await user.type(searchInput, "mercado");

    // Type filter select
    const typeTrigger = within(filtersRegion).getByLabelText("Tipo");
    // Open select via keyboard to avoid pointer capture issues in jsdom
    typeTrigger.focus();
    await user.keyboard("{ArrowDown}");
    // Radix Select renders a listbox in a Portal. Wait for listbox to appear, then pick the matching option.
    const listbox = await screen.findByRole("listbox");
    const despesaOption = within(listbox).getByRole("option", {
      name: /despesas/i,
    });
    await user.click(despesaOption);

    // Expect select value to reflect selection (combobox has text)
    expect(within(filtersRegion).getByRole("combobox")).toHaveTextContent(
      /despesas/i,
    );

    // Expect explicit active filters container present
    expect(screen.getByTestId("active-filters")).toBeInTheDocument();

    // Clear filters
    const clearButton = screen.getByRole("button", { name: /^limpar$/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByTestId("active-filters")).not.toBeInTheDocument();
    });
  });
});
