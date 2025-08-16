import { useAccounts } from "@/hooks/useAccounts";
import { useCreditCards } from "@/hooks/useCreditCards";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useTransactions } from "@/hooks/useTransactions";
import { renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

// Mock dos hooks de dados
vi.mock("@/hooks/useAccounts");
vi.mock("@/hooks/useCreditCards");
vi.mock("@/hooks/useTransactions");

const mockUseAccounts = useAccounts as MockedFunction<typeof useAccounts>;
const mockUseCreditCards = useCreditCards as MockedFunction<
  typeof useCreditCards
>;
const mockUseTransactions = useTransactions as MockedFunction<
  typeof useTransactions
>;

// Dados de teste com estrutura correta conforme schemas
const mockAccounts = [
  {
    id: 1,
    name: "Conta Corrente",
    balance: "1000.00",
    currency: "BRL",
    ownerId: 1,
  },
  { id: 2, name: "Poupança", balance: "2000.00", currency: "BRL", ownerId: 1 },
];

const mockCreditCards = [
  { id: 1, name: "Visa", limit: "5000.00", currentBill: "500.00", ownerId: 1 },
  {
    id: 2,
    name: "Mastercard",
    limit: "3000.00",
    currentBill: "300.00",
    ownerId: 1,
  },
];

const mockTransactions = [
  {
    id: 1,
    type: "expense" as const,
    amount: "100.00",
    date: "2024-01-15",
    accountId: 1,
    creditCardId: null,
    description: "Compra 1",
    category: "Compras",
    ownerId: 1,
    toAccountId: undefined,
  },
  {
    id: 2,
    type: "income" as const,
    amount: "500.00",
    date: "2024-01-20",
    accountId: 2,
    creditCardId: null,
    description: "Salário",
    category: "Salário",
    ownerId: 1,
    toAccountId: undefined,
  },
  {
    id: 3,
    type: "expense" as const,
    amount: "50.00",
    date: "2024-01-25",
    accountId: null,
    creditCardId: 1,
    description: "Compra cartão",
    category: "Compras",
    ownerId: 1,
    toAccountId: undefined,
  },
  {
    id: 4,
    type: "expense" as const,
    amount: "200.00",
    date: "2024-02-10",
    accountId: 1,
    creditCardId: null,
    description: "Compra fev",
    category: "Compras",
    ownerId: 1,
    toAccountId: undefined,
  },
  {
    id: 5,
    type: "expense" as const,
    amount: "75.00",
    date: "2024-01-30",
    accountId: null,
    creditCardId: 2,
    description: "Compra cartão 2",
    category: "Compras",
    ownerId: 1,
    toAccountId: undefined,
  },
];

describe("useFilteredTransactions", () => {
  beforeEach(() => {
    // Setup padrão - dados carregados
    mockUseAccounts.mockReturnValue({
      data: mockAccounts,
      isLoading: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
      status: "success",
    } as any);

    mockUseCreditCards.mockReturnValue({
      data: mockCreditCards,
      isLoading: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
      status: "success",
    } as any);

    mockUseTransactions.mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
      status: "success",
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Estados de Loading", () => {
    it("deve retornar isLoading true quando accounts está carregando", () => {
      mockUseAccounts.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isFetching: true,
        isSuccess: false,
        isError: false,
        refetch: vi.fn(),
        status: "pending",
      } as any);

      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [] },
        }),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it("deve retornar isLoading true quando creditCards está carregando", () => {
      mockUseCreditCards.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isFetching: true,
        isSuccess: false,
        isError: false,
        refetch: vi.fn(),
        status: "pending",
      } as any);

      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [] },
        }),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it("deve retornar isLoading true quando transactions está carregando", () => {
      mockUseTransactions.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isFetching: true,
        isSuccess: false,
        isError: false,
        refetch: vi.fn(),
        status: "pending",
      } as any);

      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [] },
        }),
      );

      expect(result.current.isLoading).toBe(true);
    });

    it("deve retornar isLoading false quando todos os dados estão carregados", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1], creditCards: [1] },
        }),
      );

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("Retorno de Dados", () => {
    it("deve retornar todos os dados brutos corretamente", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1], creditCards: [1] },
        }),
      );

      expect(result.current.accounts).toEqual(mockAccounts);
      expect(result.current.creditCards).toEqual(mockCreditCards);
      expect(result.current.transactions).toEqual(mockTransactions);
    });
  });

  describe("Filtros de Conta/Cartão", () => {
    it("deve filtrar apenas transações da conta selecionada", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1], creditCards: [] },
        }),
      );

      // Lógica: accountMatch (conta 1) OR cardMatch (nenhum cartão selecionado, então transações sem cartão passam)
      // Passam: transações da conta 1 OU transações sem cartão
      const expectedTransactions = mockTransactions.filter(
        (t) => t.accountId === 1 || !t.creditCardId,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve filtrar apenas transações do cartão selecionado", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [1] },
        }),
      );

      // Lógica: accountMatch (nenhuma conta selecionada, então transações sem conta passam) OR cardMatch (cartão 1)
      // Passam: transações sem conta OU transações do cartão 1
      const expectedTransactions = mockTransactions.filter(
        (t) => !t.accountId || t.creditCardId === 1,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve filtrar transações de contas e cartões selecionados", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1], creditCards: [1] },
        }),
      );

      const expectedTransactions = mockTransactions.filter(
        (t) => t.accountId === 1 || t.creditCardId === 1,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve retornar array vazio quando nenhum filtro está selecionado", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [] },
        }),
      );

      expect(result.current.filteredTransactions).toEqual([]);
    });

    it("deve filtrar múltiplas contas", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1, 2], creditCards: [] },
        }),
      );

      const expectedTransactions = mockTransactions.filter(
        (t) => t.accountId === 1 || t.accountId === 2,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve filtrar múltiplos cartões", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [1, 2] },
        }),
      );

      const expectedTransactions = mockTransactions.filter(
        (t) => t.creditCardId === 1 || t.creditCardId === 2,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });
  });

  describe("Filtros de Data", () => {
    it("deve filtrar transações por mês e ano", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1, 2], creditCards: [1, 2] },
          dateFilter: { selectedMonth: 0, selectedYear: 2024 }, // Janeiro 2024
        }),
      );

      const expectedTransactions = mockTransactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === 0 && date.getFullYear() === 2024;
      });
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve retornar transações vazias para mês sem transações", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1, 2], creditCards: [1, 2] },
          dateFilter: { selectedMonth: 11, selectedYear: 2024 }, // Dezembro 2024
        }),
      );

      expect(result.current.filteredTransactions).toEqual([]);
    });

    it("deve funcionar sem filtro de data", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1, 2], creditCards: [1, 2] },
        }),
      );

      expect(result.current.filteredTransactions).toEqual(mockTransactions);
    });

    it("deve combinar filtros de data e conta/cartão", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [1], creditCards: [] },
          dateFilter: { selectedMonth: 0, selectedYear: 2024 }, // Janeiro 2024
        }),
      );

      const expectedTransactions = mockTransactions.filter((t) => {
        const date = new Date(t.date);
        const dateMatch = date.getMonth() === 0 && date.getFullYear() === 2024;
        const accountOrCardMatch = t.accountId === 1 || !t.creditCardId;
        return dateMatch && accountOrCardMatch;
      });
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });
  });

  describe("Casos Edge", () => {
    it("deve lidar com dados vazios", () => {
      mockUseAccounts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isFetching: false,
        isSuccess: true,
        isError: false,
        refetch: vi.fn(),
        status: "success",
      } as any);

      mockUseCreditCards.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isFetching: false,
        isSuccess: true,
        isError: false,
        refetch: vi.fn(),
        status: "success",
      } as any);

      mockUseTransactions.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isFetching: false,
        isSuccess: true,
        isError: false,
        refetch: vi.fn(),
        status: "success",
      } as any);

      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [] },
        }),
      );

      expect(result.current.accounts).toEqual([]);
      expect(result.current.creditCards).toEqual([]);
      expect(result.current.transactions).toEqual([]);
      expect(result.current.filteredTransactions).toEqual([]);
    });

    it("deve lidar com contas inexistentes nos filtros", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [999], creditCards: [] }, // ID inexistente
        }),
      );

      // Como nenhuma transação tem accountId 999, mas creditCards está vazio (noCardsSelected = true)
      // Passam apenas transações sem cartão (creditCardId null)
      const expectedTransactions = mockTransactions.filter(
        (t) => !t.creditCardId,
      );
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });

    it("deve lidar com cartões inexistentes nos filtros", () => {
      const { result } = renderHook(() =>
        useFilteredTransactions({
          accountCardFilters: { accounts: [], creditCards: [999] }, // ID inexistente
        }),
      );

      // Como nenhuma transação tem creditCardId 999, mas accounts está vazio (noAccountsSelected = true)
      // Passam apenas transações sem conta (accountId null)
      const expectedTransactions = mockTransactions.filter((t) => !t.accountId);
      expect(result.current.filteredTransactions).toEqual(expectedTransactions);
    });
  });
});

