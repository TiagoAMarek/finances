import { BankAccount } from "@/lib/schemas";

export const mockAccounts: BankAccount[] = [
  {
    id: 1,
    name: "Conta Corrente Principal",
    balance: "5250.00",
    currency: "BRL",
    ownerId: 1,
  },
  {
    id: 2,
    name: "Conta Poupança",
    balance: "12000.00",
    currency: "BRL",
    ownerId: 1,
  },
  {
    id: 3,
    name: "Conta Investimentos",
    balance: "8750.50",
    currency: "BRL",
    ownerId: 1,
  },
  {
    id: 4,
    name: "Conta Reserva",
    balance: "3200.00",
    currency: "BRL",
    ownerId: 1,
  },
];

// Fixed ID counter for createMockAccount
let mockAccountIdCounter = 100;

export const createMockAccount = (
  overrides: Partial<BankAccount> = {},
): BankAccount => ({
  id: ++mockAccountIdCounter, // Sequential ID, not random
  name: "Conta Teste",
  balance: "1000.00",
  currency: "BRL",
  ownerId: 1,
  ...overrides,
});
