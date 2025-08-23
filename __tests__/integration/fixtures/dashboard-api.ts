import { BankAccount, Transaction } from "@/lib/schemas";

export const TEST_CONSTANTS = {
  EXPECTED_TOTAL_BALANCE: "29.200,50", // Sum of all mock account balances
  EXPECTED_MONTHLY_INCOME: "5.500,00", // From mock transaction data
  BASE_URL: "http://localhost:3000",
  TIMEOUTS: {
    DASHBOARD_LOAD: 5000,
    API_RETRY: 5000,
    QUICK_OPERATION: 1000,
    SLOW_OPERATION: 2000,
    PERFORMANCE_MAX: 5000,
  },
} as const;

export const TEST_DATA = {
  RECOVERED_ACCOUNT: {
    id: 1,
    name: "Conta Recuperada",
    balance: "1000.00",
    currency: "BRL",
    ownerId: 1,
  } as BankAccount,

  TEST_ACCOUNT: {
    id: 1,
    name: "Conta Teste",
    balance: "1000.00",
    currency: "BRL",
    ownerId: 1,
  } as BankAccount,

  NEW_TRANSACTION: {
    id: 999,
    description: "Nova Receita",
    amount: "1000.00",
    type: "income" as const,
    date: new Date().toISOString().split("T")[0],
    category: "Freelance",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
  } as Transaction,

  ERROR_MESSAGES: {
    TEMPORARY_ERROR: "Erro temporário",
    TOKEN_EXPIRED: "Token expirado",
  },

  CATEGORIES: {
    DEFAULT: [
      { id: 1, name: "Alimentação", type: "expense", ownerId: 1 },
      { id: 2, name: "Transporte", type: "expense", ownerId: 1 },
      { id: 3, name: "Salário", type: "income", ownerId: 1 },
    ],
  },
} as const;
