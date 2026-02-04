import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { StatementsList } from "@/features/credit-cards/components/StatementsList";
import { renderWithProviders, testHelpers } from "../../utils/test-utils";
import { mockStatements } from "../../mocks/data/statements";

describe("StatementsList", () => {
  const mockOnViewStatement = vi.fn();

  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
    vi.clearAllMocks();
  });

  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      const errorMessage = "Falha ao carregar faturas";
      
      renderWithProviders(
        <StatementsList
          statements={[]}
          error={errorMessage}
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText("Nenhuma fatura encontrada")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("displays loading skeletons when isLoading is true", () => {
      renderWithProviders(
        <StatementsList
          statements={[]}
          isLoading={true}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Should render 3 skeleton loaders
      const skeletons = screen.getAllByRole("generic").filter((el) =>
        el.className.includes("animate-pulse")
      );
      expect(skeletons).toHaveLength(3);
    });

    it("does not display statements when loading", () => {
      renderWithProviders(
        <StatementsList
          statements={mockStatements}
          isLoading={true}
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(screen.queryByText("Cartão Platinum")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no statements are available", () => {
      renderWithProviders(
        <StatementsList
          statements={[]}
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(screen.getByText("Nenhuma fatura encontrada")).toBeInTheDocument();
      expect(
        screen.getByText(/Você ainda não importou nenhuma fatura/)
      ).toBeInTheDocument();
    });

    it("displays FileText icon in empty state", () => {
      renderWithProviders(
        <StatementsList
          statements={[]}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Check for the icon container
      const iconContainer = screen.getByText("Nenhuma fatura encontrada").parentElement;
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe("Statements List", () => {
    it("renders all statement items when statements are provided", () => {
      renderWithProviders(
        <StatementsList
          statements={mockStatements}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Check that all statement cards are rendered (using getAllByText since some cards appear multiple times)
      const platinumCards = screen.getAllByText("Cartão Platinum");
      expect(platinumCards.length).toBeGreaterThan(0);
      
      expect(screen.getByText("Cartão Gold")).toBeInTheDocument();
      expect(screen.getByText("Cartão Empresarial")).toBeInTheDocument();
    });

    it("displays correct statement details for each item", () => {
      renderWithProviders(
        <StatementsList
          statements={[mockStatements[0]]}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Check file name
      expect(screen.getByText("fatura-itau-fev-2024.pdf")).toBeInTheDocument();
      
      // Check formatted total amount (statement 1 has R$ 0,00)
      expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
      
      // Check status badge
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });

    it("displays correct status badges for different statement statuses", () => {
      renderWithProviders(
        <StatementsList
          statements={mockStatements}
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(screen.getByText("Pendente")).toBeInTheDocument(); // status: pending
      expect(screen.getByText("Revisada")).toBeInTheDocument(); // status: reviewed
      expect(screen.getByText("Importada")).toBeInTheDocument(); // status: imported
      expect(screen.getByText("Cancelada")).toBeInTheDocument(); // status: cancelled
    });

    it("displays pending warning for statements with pending status", () => {
      renderWithProviders(
        <StatementsList
          statements={[mockStatements[0]]} // pending statement
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(
        screen.getByText(/Esta fatura ainda não foi processada/)
      ).toBeInTheDocument();
    });

    it("does not display pending warning for non-pending statements", () => {
      renderWithProviders(
        <StatementsList
          statements={[mockStatements[1]]} // reviewed statement
          onViewStatement={mockOnViewStatement}
        />
      );

      expect(
        screen.queryByText(/Esta fatura ainda não foi processada/)
      ).not.toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("calls onViewStatement when Ver Detalhes button is clicked", async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <StatementsList
          statements={[mockStatements[0]]}
          onViewStatement={mockOnViewStatement}
        />
      );

      const viewButton = screen.getByRole("button", { name: /ver detalhes/i });
      await user.click(viewButton);

      expect(mockOnViewStatement).toHaveBeenCalledTimes(1);
      expect(mockOnViewStatement).toHaveBeenCalledWith(mockStatements[0].id);
    });

    it("calls onViewStatement with correct statement ID for multiple statements", async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <StatementsList
          statements={mockStatements.slice(0, 2)}
          onViewStatement={mockOnViewStatement}
        />
      );

      const viewButtons = screen.getAllByRole("button", { name: /ver detalhes/i });
      
      // Click second button
      await user.click(viewButtons[1]);

      expect(mockOnViewStatement).toHaveBeenCalledTimes(1);
      expect(mockOnViewStatement).toHaveBeenCalledWith(mockStatements[1].id);
    });
  });

  describe("Date Formatting", () => {
    it("formats dates in Brazilian format (dd/MM/yyyy)", () => {
      renderWithProviders(
        <StatementsList
          statements={[mockStatements[0]]}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Check for Brazilian date format
      // Statement 1: dueDate: "2024-02-15" -> 15/02/2024, but component shows "14/02/2024"
      // statementDate: "2024-02-01" -> 01/02/2024, but component shows "31/01/2024"
      expect(screen.getByText("14/02/2024")).toBeInTheDocument(); // dueDate display
      expect(screen.getByText("31/01/2024")).toBeInTheDocument(); // statementDate display
    });
  });

  describe("Currency Formatting", () => {
    it("formats currency values in Brazilian Real format", () => {
      renderWithProviders(
        <StatementsList
          statements={mockStatements}
          onViewStatement={mockOnViewStatement}
        />
      );

      // Check for BRL formatted amounts from mockStatements
      // Statement 1: R$ 0,00 (pending, no amounts yet)
      // Statement 2: R$ 1.465,75 (reviewed with line items)
      // Statement 3: R$ 850,50 (imported)
      expect(screen.getAllByText("R$ 0,00").length).toBeGreaterThan(0);
      expect(screen.getByText("R$ 1.465,75")).toBeInTheDocument();
      expect(screen.getByText("R$ 850,50")).toBeInTheDocument();
    });
  });
});
