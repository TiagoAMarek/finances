import TransactionsPage from "@/app/transactions/page";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders, testHelpers } from "../utils/test-utils";

// Rely on shared MSW handlers that mutate the mock store (absolute and relative URLs)

describe("Transactions Page — Mutations", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it("opens create modal, creates a transaction and updates the list respecting active filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransactionsPage />);

    // Wait for primary action
    const newButton = await screen.findByRole("button", { name: /novo lançamento/i });
    await user.click(newButton);

    // Wait for list and capture initial badge count before opening modal
    const listWrapperInitial = await screen.findByTestId("transactions-list");
    const badgeInitial = within(listWrapperInitial).getByText(/\d+\s+lançamento/);
    const initialMatch = badgeInitial.textContent?.match(/^(\d+)/);
    const initialCount = initialMatch ? parseInt(initialMatch[1], 10) : NaN;

    // Modal should open
    const dialog = await screen.findByRole("dialog");

    // Fill fields (keep selectors generic and accessible)
    const desc = within(dialog).getByLabelText(/descrição/i);
    await user.clear(desc);
    await user.type(desc, "Compras do Mercado");

    const amount = within(dialog).getByLabelText(/valor/i);
    await user.clear(amount);
    await user.type(amount, "123.45");

    // Type select (Radix): pick the trigger that already shows Despesa/Receita label
    const comboTriggers = within(dialog).getAllByRole("combobox");
    const typeTrigger = comboTriggers.find((el) => el.textContent?.match(/receita|despesa/i));
    if (!typeTrigger) throw new Error("Type combobox not found");
    typeTrigger.focus();
    await user.keyboard("{ArrowDown}");
    const listbox = await screen.findByRole("listbox");
    const expenseOption = within(listbox).getByRole("option", { name: /despesa/i });
    await user.click(expenseOption);

    // Save
    // Choose required category and account to enable submit
    const selects = within(dialog).getAllByRole("combobox");
    // Category trigger usually has placeholder 'Selecione uma categoria'
    const categoryTrigger = selects.find((el) => /categoria/i.test(el.textContent || "")) || selects[1];
    categoryTrigger?.focus();
    await user.keyboard("{ArrowDown}");
    const listbox2 = await screen.findByRole("listbox");
    const firstCategory = within(listbox2).getAllByRole("option")[0];
    await user.click(firstCategory);

    // Ensure source type is Conta Bancária (default checked). Open account select and pick first account
    const accountTrigger = selects.find((el) => /conta bancária|conta/i.test(el.textContent || "")) || selects[2];
    accountTrigger?.focus();
    await user.keyboard("{ArrowDown}");
    const listbox3 = await screen.findByRole("listbox");
    const firstAccount = within(listbox3).getAllByRole("option")[0];
    await user.click(firstAccount);

    const createBtn = within(dialog).getByRole("button", { name: /criar lançamento/i });
    await user.click(createBtn);

    // Dialog closes and the list shows the new item (loose assertion: description appears)
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Assert list updated by checking badge count increment
    const header = await screen.findByTestId("transactions-list");
    const badge = within(header).getByText(/lançamento/);

    await waitFor(() => {
      const afterText = badge.textContent || "";
      const m = afterText.match(/^(\d+)/);
      const after = m ? parseInt(m[1], 10) : NaN;
      expect(Number.isNaN(initialCount)).toBe(false);
      expect(after).toBe(initialCount + 1);
    });
  });

  it("deletes a transaction and keeps list stable", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransactionsPage />);

    // Ensure list rendered
    await screen.findByTestId("transactions-list");

    // Open row actions menu then choose Editar transação
    const list = await screen.findByTestId("transactions-list");
    const firstRow = within(list).getAllByRole("button", { name: /mais opções/i })[0];
    await user.click(firstRow);

    const deleteItem = await screen.findByRole("menuitem", { name: /excluir transação/i });
    await user.click(deleteItem);

    const dialog = (await screen.findByRole("alertdialog").catch(() => screen.findByRole("dialog"))) as HTMLElement;
    const confirmBtn = within(dialog).getByRole("button", { name: /^excluir$/i });

    // Read badge count before confirming
    const listWrapper = await screen.findByTestId("transactions-list");
    const badge = within(listWrapper).getByText(/lançamento/);
    const beforeMatch = badge.textContent?.match(/^(\d+)/);
    const before = beforeMatch ? parseInt(beforeMatch[1], 10) : NaN;

    await user.click(confirmBtn);

    // Wait for dialog to close and badge to decrement
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      const afterText = badge.textContent || "";
      const m = afterText.match(/^(\d+)/);
      const after = m ? parseInt(m[1], 10) : NaN;
      expect(Number.isNaN(before)).toBe(false);
      expect(after).toBe(before - 1);
    });
  });
});
