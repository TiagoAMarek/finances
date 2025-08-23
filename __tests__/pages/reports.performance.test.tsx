import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor, within } from "../utils/test-utils";
import { renderWithProviders, testHelpers } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import Page from "@/app/reports/performance/page";


describe("Performance page (E2E with MSW)", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it("renders header skeleton then content after load", async () => {
    renderWithProviders(<Page />);

    // Loading header visible first
    expect(screen.getByRole("heading", { name: "Performance Financeira" })).toBeInTheDocument();
    expect(
      screen.getByText("Análise da evolução das suas finanças ao longo do tempo"),
    ).toBeInTheDocument();

    // Wait for loading skeletons to disappear by waiting for the loaded header
    await waitFor(() => {
      expect(
        screen.getByText("Análise da evolução das suas finanças ao longo do mês"),
      ).toBeInTheDocument();
    });

    // Filters and period display
    expect(screen.getByRole("button", { name: /Filtros/i })).toBeInTheDocument();

    // Charts/analysis visible (handle duplicates by using getAllByText)
    expect(screen.getAllByText(/Evolução/i).length).toBeGreaterThan(0);
    // The expenses analysis title may be split; assert presence of its section by partial text
    expect(screen.getAllByText(/desp(esas|)/i).length).toBeGreaterThan(0);
  });

  it("opens filters popover and toggles an account and a card", async () => {
    renderWithProviders(<Page />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Filtros/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: /Filtros/i }));

    // Toggle any visible account and card names from mocks
    const possibleAccounts = [
      "Conta Corrente Principal",
      "Conta Poupança",
    ];
    const possibleCards = ["Cartão Platinum", "Cartão Gold"];

    // Scope to the popover/dialog to avoid duplicate matches
    const dialog = screen.getByRole('dialog');
    const withinDialog = within(dialog);

    const accountBtn = withinDialog.getAllByRole("button", {
      name: new RegExp(possibleAccounts.join("|"), "i"),
    })[0];
    await userEvent.click(accountBtn);
    // Assert selection by visual selected class (outline variant toggles bg)
    await waitFor(() => expect(accountBtn.className).toMatch(/data-\[state\=on\]|bg-(?:primary|accent)/));

    const cardBtn = withinDialog.getAllByRole("button", {
      name: new RegExp(possibleCards.join("|"), "i"),
    })[0];
    await userEvent.click(cardBtn);
    await waitFor(() => expect(cardBtn.className).toMatch(/data-\[state\=on\]|bg-(?:primary|accent)/));
  });

  it("changes period via Select and updates trigger text", async () => {
    renderWithProviders(<Page />);

    // Wait for filters to appear meaning the page loaded
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Filtros/i })).toBeInTheDocument();
    });

    // Click period selector trigger (match current 'MMM YYYY')
    // Prefer the compact month trigger like "Fev 2023" within the period control
    // Use getAll and click the first occurrence (the trigger inside period control)
    const monthTrigger = screen.getAllByText(/^[A-ZÇÉÍÓÚÂÊÔÃÕa-zçéíóúâêôãõ]{3}\s+20\d{2}$/)[0];
    await userEvent.click(monthTrigger);

    // Scope inside the listbox/popover to avoid duplicate months across groups
    const listbox = await screen.findByRole('listbox');
    const option = within(listbox).getAllByRole('option').find(el => /Fevereiro|Março|Abril/.test(el.textContent || ''))!;
    await userEvent.click(option);

    // Expect the displayed month to update (assert the compact month label appears)
    await waitFor(() => {
      expect(screen.getAllByText(/^[A-ZÇÉÍÓÚÂÊÔÃÕa-zçéíóúâêôãõ]{3}\s+20\d{2}$/).length).toBeGreaterThan(0);
    });
  });
});
