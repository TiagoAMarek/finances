import { CreditCard } from "@/lib/schemas";

export const mockCreditCards: CreditCard[] = [
  {
    id: 1,
    name: "Cartão Platinum",
    limit: "5000.00",
    currentBill: "1250.75",
    ownerId: 1,
  },
  {
    id: 2,
    name: "Cartão Gold",
    limit: "3000.00",
    currentBill: "750.00",
    ownerId: 1,
  },
  {
    id: 3,
    name: "Cartão Empresarial",
    limit: "10000.00",
    currentBill: "2100.50",
    ownerId: 1,
  },
];

export const createMockCreditCard = (
  overrides: Partial<CreditCard> = {},
): CreditCard => ({
  id: Math.floor(Math.random() * 1000) + 100,
  name: "Cartão Teste",
  limit: "2000.00",
  currentBill: "500.00",
  ownerId: 1,
  ...overrides,
});
