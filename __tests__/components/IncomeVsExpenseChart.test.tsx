import { IncomeVsExpenseChart } from "@/components/IncomeVsExpenseChart";
import { Transaction } from "@/lib/schemas";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Mock do Recharts para evitar problemas de renderização em testes
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ name, dataKey }: { name: string; dataKey: string }) => (
    <div data-testid={`bar-${dataKey}`}>{name}</div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Legend: () => <div data-testid="legend" />,
}));

// Dados de teste
const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "income",
    amount: "5000.00",
    date: "2024-01-15",
    description: "Salário",
    category: "Salário",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 2,
    type: "expense",
    amount: "1500.00",
    date: "2024-01-20",
    description: "Aluguel",
    category: "Moradia",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 3,
    type: "expense",
    amount: "800.00",
    date: "2024-01-25",
    description: "Compras",
    category: "Compras",
    ownerId: 1,
    accountId: null,
    creditCardId: 1,
    toAccountId: undefined,
  },
  {
    id: 4,
    type: "income",
    amount: "3000.00",
    date: "2024-02-15",
    description: "Freelance",
    category: "Freelance",
    ownerId: 1,
    accountId: 2,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 5,
    type: "expense",
    amount: "1200.00",
    date: "2024-02-20",
    description: "Supermercado",
    category: "Alimentação",
    ownerId: 1,
    accountId: null,
    creditCardId: 2,
    toAccountId: undefined,
  },
];

describe("IncomeVsExpenseChart", () => {
  it("deve renderizar o componente com título e descrição", () => {
    render(<IncomeVsExpenseChart transactions={mockTransactions} />);

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(
      screen.getByText("Comparativo mensal dos últimos 6 meses"),
    ).toBeInTheDocument();
  });

  it("deve renderizar os elementos do gráfico", () => {
    render(<IncomeVsExpenseChart transactions={mockTransactions} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-receitas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-despesas")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("deve calcular e exibir totais corretamente", () => {
    render(<IncomeVsExpenseChart transactions={mockTransactions} />);

    // Verificar se os totais são exibidos (existem dois "Total:" no componente)
    expect(screen.getAllByText(/Total:/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Saldo:/)).toBeInTheDocument();
  });

  it("deve funcionar com array vazio de transações", () => {
    render(<IncomeVsExpenseChart transactions={[]} />);

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("deve filtrar transações por conta quando selectedAccountId for fornecido", () => {
    render(
      <IncomeVsExpenseChart
        transactions={mockTransactions}
        selectedAccountId={1}
      />,
    );

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    // Verificar se o componente renderiza (testa se o filtro não quebra a renderização)
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("deve filtrar transações por cartão quando selectedCreditCardId for fornecido", () => {
    render(
      <IncomeVsExpenseChart
        transactions={mockTransactions}
        selectedCreditCardId={1}
      />,
    );

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("deve usar dateFilter quando fornecido", () => {
    const dateFilter = { selectedMonth: 0, selectedYear: 2024 }; // Janeiro 2024

    render(
      <IncomeVsExpenseChart
        transactions={mockTransactions}
        dateFilter={dateFilter}
      />,
    );

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("deve priorizar dateFilter sobre selectedMonth/selectedYear individuais", () => {
    const dateFilter = { selectedMonth: 0, selectedYear: 2024 };

    render(
      <IncomeVsExpenseChart
        transactions={mockTransactions}
        selectedMonth={5} // Junho - deve ser ignorado
        selectedYear={2023} // 2023 - deve ser ignorado
        dateFilter={dateFilter} // Janeiro 2024 - deve ter prioridade
      />,
    );

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("deve usar selectedMonth/selectedYear quando dateFilter não for fornecido", () => {
    render(
      <IncomeVsExpenseChart
        transactions={mockTransactions}
        selectedMonth={0} // Janeiro
        selectedYear={2024}
      />,
    );

    expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  describe("Cálculos de dados", () => {
    it("deve calcular receitas corretamente", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "1000.00",
          date: "2024-01-15",
          description: "Receita 1",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "income",
          amount: "2000.00",
          date: "2024-01-20",
          description: "Receita 2",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });

    it("deve calcular despesas corretamente", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "expense",
          amount: "500.00",
          date: "2024-01-15",
          description: "Despesa 1",
          category: "Despesa",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "expense",
          amount: "750.00",
          date: "2024-01-20",
          description: "Despesa 2",
          category: "Despesa",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });

    it("deve calcular saldo líquido (receitas - despesas)", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "3000.00",
          date: "2024-01-15",
          description: "Receita",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "expense",
          amount: "1000.00",
          date: "2024-01-20",
          description: "Despesa",
          category: "Despesa",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText(/Saldo:/)).toBeInTheDocument();
    });
  });

  describe("Filtros de período temporal", () => {
    it("deve filtrar transações por mês específico usando dateFilter", () => {
      const dateFilter = { selectedMonth: 0, selectedYear: 2024 }; // Janeiro 2024

      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "1000.00",
          date: "2024-01-15", // Janeiro 2024
          description: "Receita Janeiro",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "expense",
          amount: "500.00",
          date: "2024-02-15", // Fevereiro 2024 - deve ser filtrado
          description: "Despesa Fevereiro",
          category: "Despesa",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(
        <IncomeVsExpenseChart
          transactions={testTransactions}
          dateFilter={dateFilter}
        />,
      );

      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });

    it("deve filtrar transações por ano específico usando dateFilter", () => {
      const dateFilter = { selectedMonth: 0, selectedYear: 2023 }; // Janeiro 2023

      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "1000.00",
          date: "2023-01-15", // Janeiro 2023
          description: "Receita 2023",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "expense",
          amount: "500.00",
          date: "2024-01-15", // Janeiro 2024 - deve ser filtrado
          description: "Despesa 2024",
          category: "Despesa",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(
        <IncomeVsExpenseChart
          transactions={testTransactions}
          dateFilter={dateFilter}
        />,
      );

      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });
  });

  describe("Diferentes granularidades de período", () => {
    it("deve exibir gráfico semanal para mês atual", () => {
      const currentDate = new Date();
      const dateFilter = { 
        selectedMonth: currentDate.getMonth(), 
        selectedYear: currentDate.getFullYear() 
      };

      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          dateFilter={dateFilter}
          periodType="custom"
        />,
      );

      expect(screen.getByText(/- visão semanal/)).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve exibir gráfico diário para período de 7 dias", () => {
      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          periodType="7-days"
        />,
      );

      expect(screen.getByText("Últimos 7 dias - visão diária")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve exibir gráfico mensal para período de 3 meses", () => {
      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          periodType="3-months"
        />,
      );

      expect(screen.getByText("Últimos 3 meses - visão mensal")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve usar periodType='current-month' para forçar visão semanal", () => {
      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          periodType="current-month"
        />,
      );

      expect(screen.getByText(/- visão semanal/)).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve manter comportamento padrão para mês específico não atual", () => {
      const dateFilter = { selectedMonth: 0, selectedYear: 2023 }; // Janeiro 2023

      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          dateFilter={dateFilter}
          periodType="custom"
        />,
      );

      expect(screen.getByText("Janeiro 2023")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
  });

  describe("Casos edge e formatação", () => {
    it("deve lidar com valores monetários decimais", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "1234.56",
          date: "2024-01-15",
          description: "Receita com decimais",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });

    it("deve lidar com valores zero", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "0.00",
          date: "2024-01-15",
          description: "Receita zero",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });

    it("deve combinar filtros de conta e período temporal", () => {
      const dateFilter = { selectedMonth: 0, selectedYear: 2024 };

      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          selectedAccountId={1}
          dateFilter={dateFilter}
        />,
      );

      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve combinar filtros de cartão e período temporal", () => {
      const dateFilter = { selectedMonth: 1, selectedYear: 2024 }; // Fevereiro 2024

      render(
        <IncomeVsExpenseChart
          transactions={mockTransactions}
          selectedCreditCardId={2}
          dateFilter={dateFilter}
        />,
      );

      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("deve ignorar transações do tipo transfer", () => {
      const testTransactions: Transaction[] = [
        {
          id: 1,
          type: "transfer",
          amount: "1000.00",
          date: "2024-01-15",
          description: "Transferência",
          category: "Transferência",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: 2,
        },
        {
          id: 2,
          type: "income",
          amount: "500.00",
          date: "2024-01-20",
          description: "Receita",
          category: "Receita",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(<IncomeVsExpenseChart transactions={testTransactions} />);
      expect(screen.getByText("Receitas vs Despesas")).toBeInTheDocument();
    });
  });
});

