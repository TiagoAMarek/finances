import { Transaction } from "@/lib/schemas";

// Fixed mock transactions for consistent visual testing
// Using fixed dates to ensure screenshot stability
export const mockTransactions: Transaction[] = [
  // Recent transactions (last 30 days)
  {
    id: 1,
    description: "Salário - Janeiro",
    amount: "5500.00",
    type: "income",
    date: "2024-01-25", // Fixed date
    categoryId: 1,
    category: "Salário",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
  {
    id: 2,
    description: "Supermercado Extra",
    amount: "234.50",
    type: "expense",
    date: "2024-01-22", // Fixed date
    categoryId: 1,
    category: "Alimentação",
    ownerId: 1,
    accountId: null,
    creditCardId: 1,
    toAccountId: null,
  },
  {
    id: 3,
    description: "Combustível",
    amount: "120.00",
    type: "expense",
    date: "2024-01-20", // Fixed date
    categoryId: 1,
    category: "Transporte",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
  {
    id: 4,
    description: "Freelance - Projeto Web",
    amount: "2500.00",
    type: "income",
    date: "2024-01-18", // Fixed date
    categoryId: 1,
    category: "Freelance",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
  {
    id: 5,
    description: "Conta de Luz",
    amount: "180.75",
    type: "expense",
    date: "2024-01-15", // Fixed date
    categoryId: 1,
    category: "Utilidades",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
  {
    id: 6,
    description: "Streaming Netflix",
    amount: "39.90",
    type: "expense",
    date: "2024-01-12", // Fixed date
    categoryId: 1,
    category: "Entretenimento",
    ownerId: 1,
    accountId: null,
    creditCardId: 2,
    toAccountId: null,
  },
  {
    id: 7,
    description: "Restaurante - Jantar",
    amount: "185.00",
    type: "expense",
    date: "2024-01-10", // Fixed date
    categoryId: 1,
    category: "Alimentação",
    ownerId: 1,
    accountId: null,
    creditCardId: 1,
    toAccountId: null,
  },
  {
    id: 8,
    description: "Transferência para Poupança",
    amount: "1000.00",
    type: "transfer",
    date: "2024-01-08", // Fixed date
    categoryId: 1,
    category: "Transferência",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: 2,
  },
  {
    id: 9,
    description: "Pagamento Cartão",
    amount: "850.00",
    type: "expense",
    date: "2024-01-05", // Fixed date
    categoryId: 1,
    category: "Pagamento Cartão",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
  {
    id: 10,
    description: "Curso Online",
    amount: "299.00",
    type: "expense",
    date: "2024-01-03", // Fixed date
    categoryId: 1,
    category: "Educação",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
    toAccountId: null,
  },
];

// Fixed ID counter for createMockTransaction
let mockTransactionIdCounter = 1000;

export const createMockTransaction = (
  overrides: Partial<Transaction> = {},
): Transaction => ({
  id: ++mockTransactionIdCounter, // Sequential ID, not random
  description: "Transação Teste",
  amount: "100.00",
  type: "expense",
  date: "2024-01-15", // Fixed date
  categoryId: 1,
  category: "Teste",
  ownerId: 1,
  accountId: 1,
  creditCardId: null,
  toAccountId: null,
  ...overrides,
});
