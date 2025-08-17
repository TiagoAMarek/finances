import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdvancedExpenseAnalysis } from "@/components/AdvancedExpenseAnalysis";
import { Transaction } from "@/lib/schemas";
import { useExpenseAnalysis } from "@/hooks/useExpenseAnalysis";

// Mock do Recharts para evitar problemas de renderização em testes
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`line-${dataKey}`} />
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock dos custom hooks para permitir testes unitários isolados
vi.mock("@/hooks/useExpenseAnalysis", () => ({
  useExpenseAnalysis: vi.fn(),
  useFilteredExpenseTransactions: vi.fn(),
  useExpenseStatistics: vi.fn(),
}));

// Dados de teste - usando datas atuais para garantir que sejam encontradas
const getCurrentDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getDateString = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "expense",
    amount: "1500.00",
    date: getDateString(5), // 5 dias atrás
    description: "Aluguel",
    category: "Moradia",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 2,
    type: "expense",
    amount: "800.00",
    date: getDateString(2), // 2 dias atrás
    description: "Supermercado",
    category: "Alimentação",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 3,
    type: "income",
    amount: "5000.00",
    date: getDateString(1), // 1 dia atrás
    description: "Salário",
    category: "Salário",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 4,
    type: "expense",
    amount: "300.00",
    date: getCurrentDateString(), // hoje
    description: "Gasolina",
    category: "Transporte",
    ownerId: 1,
    accountId: null,
    creditCardId: 1,
    toAccountId: undefined,
  },
  {
    id: 5,
    type: "expense",
    amount: "600.00",
    date: getDateString(30), // 30 dias atrás (mês passado)
    description: "Compras do mês passado",
    category: "Compras",
    ownerId: 1,
    accountId: 2,
    creditCardId: null,
    toAccountId: undefined,
  },
  {
    id: 6,
    type: "expense",
    amount: "200.00",
    date: getDateString(60), // 60 dias atrás (2 meses atrás)
    description: "Despesa antiga",
    category: "Diversos",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: undefined,
  },
];

// Mock default return for the hook
const mockExpenseAnalysisData = {
  chartData: [
    { period: "Sem 1", total: 1000, transactions: 2, averagePerTransaction: 500 },
    { period: "Sem 2", total: 1500, transactions: 3, averagePerTransaction: 500 },
  ],
  formattedChartData: [
    { month: "Sem 1", total: 1000, transactions: 2 },
    { month: "Sem 2", total: 1500, transactions: 3 },
  ],
  statistics: { max: 1500, min: 1000, average: 1250, total: 2500 },
  isEmpty: false,
  periodDescription: "neste mês",
};

const mockEmptyExpenseAnalysisData = {
  chartData: [],
  formattedChartData: [],
  statistics: { max: 0, min: 0, average: 0, total: 0 },
  isEmpty: true,
  periodDescription: "neste mês",
};

describe("AdvancedExpenseAnalysis", () => {
  const mockUseExpenseAnalysis = useExpenseAnalysis as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Default mock return
    mockUseExpenseAnalysis.mockReturnValue(mockExpenseAnalysisData);
  });
  describe("Renderização básica", () => {
    it("deve renderizar o componente com título e descrição", () => {
      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(
        screen.getByText("Evolução dos gastos ao longo do período"),
      ).toBeInTheDocument();
    });

    it("deve renderizar elementos do gráfico quando há despesas", () => {
      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("line-total")).toBeInTheDocument();
      expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
      expect(screen.getByTestId("x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    });

    it("deve renderizar estatísticas resumidas", () => {
      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      expect(screen.getByText("Maior")).toBeInTheDocument();
      expect(screen.getByText("Menor")).toBeInTheDocument();
      expect(screen.getByText("Média")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });
  });

  describe("Estado vazio", () => {
    it("deve exibir estado vazio quando não há despesas", () => {
      // Mock empty state
      mockUseExpenseAnalysis.mockReturnValue(mockEmptyExpenseAnalysisData);

      const transactionsWithoutExpenses: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "5000.00",
          date: "2024-08-01",
          description: "Salário",
          category: "Salário",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(
        <AdvancedExpenseAnalysis
          transactions={transactionsWithoutExpenses}
          periodFilter="currentMonth"
        />,
      );

      expect(screen.getByText("Nenhuma despesa registrada")).toBeInTheDocument();
      expect(screen.getByText("neste mês")).toBeInTheDocument();
    });

    it("deve exibir mensagem correta para período de 7 dias", () => {
      // Mock empty state with 7 days description
      mockUseExpenseAnalysis.mockReturnValue({
        ...mockEmptyExpenseAnalysisData,
        periodDescription: "nos últimos 7 dias",
      });

      render(
        <AdvancedExpenseAnalysis transactions={[]} periodFilter="7days" />,
      );

      expect(screen.getByText("Nenhuma despesa registrada")).toBeInTheDocument();
      expect(screen.getByText("nos últimos 7 dias")).toBeInTheDocument();
    });

    it("deve exibir mensagem correta para período de 3 meses", () => {
      // Mock empty state with 3 months description
      mockUseExpenseAnalysis.mockReturnValue({
        ...mockEmptyExpenseAnalysisData,
        periodDescription: "nos últimos 3 meses",
      });

      render(
        <AdvancedExpenseAnalysis transactions={[]} periodFilter="3months" />,
      );

      expect(screen.getByText("Nenhuma despesa registrada")).toBeInTheDocument();
      expect(screen.getByText("nos últimos 3 meses")).toBeInTheDocument();
    });
  });

  describe("Filtros de período", () => {
    it("deve funcionar com periodFilter='currentMonth'", () => {
      const currentDate = new Date();
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          periodFilter="currentMonth"
          selectedMonth={currentDate.getMonth()}
          selectedYear={currentDate.getFullYear()}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("deve funcionar com periodFilter='7days'", () => {
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          periodFilter="7days"
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("deve funcionar com periodFilter='3months'", () => {
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          periodFilter="3months"
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  describe("Filtros de conta e cartão", () => {
    it("deve filtrar transações por conta específica", () => {
      const currentDate = new Date();
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedAccountId={1}
          periodFilter="currentMonth"
          selectedMonth={currentDate.getMonth()}
          selectedYear={currentDate.getFullYear()}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("deve filtrar transações por cartão específico", () => {
      const currentDate = new Date();
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedCreditCardId={1}
          periodFilter="currentMonth"
          selectedMonth={currentDate.getMonth()}
          selectedYear={currentDate.getFullYear()}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("deve filtrar por conta e cartão simultaneamente", () => {
      const currentDate = new Date();
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedAccountId={1}
          periodFilter="currentMonth"
          selectedMonth={currentDate.getMonth()}
          selectedYear={currentDate.getFullYear()}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  describe("Props padrão", () => {
    it("deve usar valores padrão quando props opcionais não são fornecidas", () => {
      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("deve usar periodFilter padrão como 'currentMonth'", () => {
      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      // Deve renderizar o componente sem erros
      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
    });
  });

  describe("Casos edge", () => {
    it("deve lidar com array vazio de transações", () => {
      // Mock empty state
      mockUseExpenseAnalysis.mockReturnValue(mockEmptyExpenseAnalysisData);

      render(<AdvancedExpenseAnalysis transactions={[]} />);

      expect(screen.getByText("Nenhuma despesa registrada")).toBeInTheDocument();
      expect(screen.getByText("neste mês")).toBeInTheDocument();
    });

    it("deve lidar com transações apenas de receita", () => {
      // Mock empty state
      mockUseExpenseAnalysis.mockReturnValue(mockEmptyExpenseAnalysisData);

      const incomeOnlyTransactions: Transaction[] = [
        {
          id: 1,
          type: "income",
          amount: "5000.00",
          date: "2024-08-01",
          description: "Salário",
          category: "Salário",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "transfer",
          amount: "1000.00",
          date: "2024-08-15",
          description: "Transferência",
          category: "Transferência",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: 2,
        },
      ];

      render(
        <AdvancedExpenseAnalysis transactions={incomeOnlyTransactions} />,
      );

      expect(screen.getByText("Nenhuma despesa registrada")).toBeInTheDocument();
    });

    it("deve lidar com selectedAccountId null", () => {
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedAccountId={null}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
    });

    it("deve lidar com selectedCreditCardId null", () => {
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedCreditCardId={null}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
    });

    it("deve lidar com valores monetários extremos", () => {
      const extremeTransactions: Transaction[] = [
        {
          id: 1,
          type: "expense",
          amount: "0.01",
          date: "2024-08-01",
          description: "Centavo",
          category: "Teste",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
        {
          id: 2,
          type: "expense",
          amount: "999999.99",
          date: "2024-08-15",
          description: "Valor alto",
          category: "Teste",
          ownerId: 1,
          accountId: 1,
          creditCardId: null,
          toAccountId: undefined,
        },
      ];

      render(
        <AdvancedExpenseAnalysis
          transactions={extremeTransactions}
          selectedMonth={7}
          selectedYear={2024}
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  describe("Integração com data atual", () => {
    it("deve usar mês/ano atual quando não especificado", () => {
      // Não passar selectedMonth/selectedYear - deve usar data atual
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          periodFilter="currentMonth"
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
    });

    it("deve aceitar selectedMonth e selectedYear específicos", () => {
      render(
        <AdvancedExpenseAnalysis
          transactions={mockTransactions}
          selectedMonth={6} // Julho
          selectedYear={2024}
          periodFilter="currentMonth"
        />,
      );

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
    });
  });

  describe("Integração com hook", () => {
    it("deve chamar useExpenseAnalysis com props corretos", () => {
      const props = {
        transactions: mockTransactions,
        periodFilter: "currentMonth" as const,
        selectedMonth: 6,
        selectedYear: 2024,
        selectedAccountId: 1,
        selectedCreditCardId: null,
      };

      render(<AdvancedExpenseAnalysis {...props} />);

      expect(mockUseExpenseAnalysis).toHaveBeenCalledWith({
        transactions: mockTransactions,
        periodFilter: "currentMonth",
        selectedMonth: 6,
        selectedYear: 2024,
        selectedAccountId: 1,
        selectedCreditCardId: null,
      });
    });

    it("deve renderizar dados retornados pelo hook", () => {
      const customMockData = {
        ...mockExpenseAnalysisData,
        statistics: { max: 2000, min: 500, average: 1250, total: 3750 },
      };
      mockUseExpenseAnalysis.mockReturnValue(customMockData);

      render(<AdvancedExpenseAnalysis transactions={mockTransactions} />);

      expect(screen.getByText("Tendência de Gastos")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });
});