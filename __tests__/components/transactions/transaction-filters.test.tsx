import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TransactionFiltersComponent, TransactionFilters } from "@/features/transactions/components/TransactionFilters";

vi.mock("@/features/accounts/hooks/data", () => ({
  useGetAccounts: () => ({ data: [{ id: 1, name: "Conta Corrente" }] }),
}));
vi.mock("@/features/credit-cards/hooks/data", () => ({
  useGetCreditCards: () => ({ data: [{ id: 10, name: "Visa Gold" }] }),
}));

function Harness({ initial }: { initial?: Partial<TransactionFilters> }) {
  const [filters, setFilters] = React.useState<TransactionFilters>({
    search: "",
    type: "all",
    category: "",
    accountId: "",
    creditCardId: "",
    dateFrom: "",
    dateTo: "",
    ...(initial || {}),
  });
  return (
    <TransactionFiltersComponent
      filters={filters}
      onFiltersChange={setFilters}
      categories={["Alimentação", "Transporte"]}
    />
  );
}

function setup(initial?: Partial<TransactionFilters>) {
  render(<Harness initial={initial} />);
}

describe("TransactionFiltersComponent", () => {
  it("renders collapsed by default and expands on trigger click", () => {
    setup();
    const trigger = screen.getByRole("button", {
      name: /expandir filtros|recolher filtros/i,
    });
    expect(screen.queryByText("Filtros Avançados")).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByText("Filtros Avançados")).toBeInTheDocument();
  });

  it("clear filters does not close panel", () => {
    setup();
    const trigger = screen.getByRole("button", {
      name: /expandir filtros|recolher filtros/i,
    });
    fireEvent.click(trigger);
    expect(screen.getByText("Filtros Avançados")).toBeInTheDocument();

    // Change an advanced filter (dateFrom) so badges and clear button appear
    const dateFromInput = screen.getByLabelText(/data inicial/i) as HTMLInputElement;
    fireEvent.change(dateFromInput, { target: { value: "2025-01-01" } });

    const clearBtn = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(clearBtn);

    // Panel should remain open after clearing
    expect(screen.getByText("Filtros Avançados")).toBeInTheDocument();
  });

  it("renders active badges and allows removing", () => {
    setup({ type: "expense", category: "Alimentação", accountId: "1", creditCardId: "10", dateFrom: "2025-01-01" });
    const trigger = screen.getByRole("button", {
      name: /expandir filtros|recolher filtros/i,
    });
    fireEvent.click(trigger);

    const activeFilters = screen.getByTestId("active-filters");
    expect(activeFilters).toBeInTheDocument();
    const removeButtons = screen.getAllByRole("button", { name: /remover filtro/i });
    expect(removeButtons.length).toBeGreaterThan(0);
  });
});
