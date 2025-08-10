import { testUsers, testBankAccounts, testCreditCards, testTransactions } from './db-helpers';

// User fixtures
export const createUserFixture = (overrides: Record<string, any> = {}) => ({
  email: 'user@example.com',
  hashedPassword: '$2a$12$examplehashedpassword',
  ...overrides,
});

export const createUsersFixtures = () => [
  createUserFixture({ email: 'user1@example.com' }),
  createUserFixture({ email: 'user2@example.com' }),
  createUserFixture({ email: 'admin@example.com' }),
];

// Bank account fixtures
export const createBankAccountFixture = (ownerId: number, overrides: Record<string, any> = {}) => ({
  name: 'Conta Corrente',
  balance: '1000.00',
  currency: 'BRL',
  ownerId,
  ...overrides,
});

export const createBankAccountsFixtures = (ownerId: number) => [
  createBankAccountFixture(ownerId, { name: 'Conta Corrente', balance: '1000.00' }),
  createBankAccountFixture(ownerId, { name: 'Conta Poupança', balance: '5000.00' }),
  createBankAccountFixture(ownerId, { name: 'Conta Investimento', balance: '10000.00' }),
];

// Credit card fixtures
export const createCreditCardFixture = (ownerId: number, overrides: Record<string, any> = {}) => ({
  name: 'Cartão Visa',
  limit: '2000.00',
  currentBill: '500.00',
  ownerId,
  ...overrides,
});

export const createCreditCardsFixtures = (ownerId: number) => [
  createCreditCardFixture(ownerId, { name: 'Cartão Visa', limit: '2000.00', currentBill: '500.00' }),
  createCreditCardFixture(ownerId, { name: 'Cartão Mastercard', limit: '5000.00', currentBill: '1200.00' }),
];

// Transaction fixtures
export const createTransactionFixture = (ownerId: number, overrides: Record<string, any> = {}) => ({
  description: 'Compra no supermercado',
  amount: '150.00',
  type: 'expense' as const,
  date: '2024-01-15',
  category: 'Alimentação',
  ownerId,
  accountId: null,
  creditCardId: null,
  toAccountId: null,
  ...overrides,
});

export const createTransactionsFixtures = (ownerId: number, accountId?: number, creditCardId?: number) => [
  createTransactionFixture(ownerId, {
    description: 'Salário',
    amount: '5000.00',
    type: 'income',
    category: 'Salário',
    accountId,
    date: '2024-01-01',
  }),
  createTransactionFixture(ownerId, {
    description: 'Aluguel',
    amount: '1200.00',
    type: 'expense',
    category: 'Moradia',
    accountId,
    date: '2024-01-05',
  }),
  createTransactionFixture(ownerId, {
    description: 'Compra online',
    amount: '300.00',
    type: 'expense',
    category: 'Compras',
    creditCardId,
    date: '2024-01-10',
  }),
  createTransactionFixture(ownerId, {
    description: 'Transferência',
    amount: '500.00',
    type: 'transfer',
    category: 'Transfer',
    accountId,
    toAccountId: accountId ? accountId + 1 : undefined,
    date: '2024-01-15',
  }),
];

// Complete test data setup
export const createCompleteTestData = async (db: any, userId: number) => {
  // Create bank accounts
  const bankAccounts = await db.insert(testBankAccounts)
    .values(createBankAccountsFixtures(userId))
    .returning();

  // Create credit cards
  const creditCards = await db.insert(testCreditCards)
    .values(createCreditCardsFixtures(userId))
    .returning();

  // Create transactions
  const transactions = await db.insert(testTransactions)
    .values(createTransactionsFixtures(userId, bankAccounts[0]?.id, creditCards[0]?.id))
    .returning();

  return {
    bankAccounts,
    creditCards,
    transactions,
  };
};

// Invalid data fixtures for validation testing
export const invalidUserData = {
  missingEmail: { password: '123456' },
  invalidEmail: { email: 'invalid-email', password: '123456' },
  shortPassword: { email: 'user@example.com', password: '123' },
  missingPassword: { email: 'user@example.com' },
};

export const invalidBankAccountData = {
  missingName: { balance: '1000.00', currency: 'BRL' },
  emptyName: { name: '', balance: '1000.00', currency: 'BRL' },
  invalidCurrency: { name: 'Test Account', balance: '1000.00', currency: 'INVALID' },
};

export const invalidCreditCardData = {
  missingName: { limit: '2000.00', currentBill: '500.00' },
  emptyName: { name: '', limit: '2000.00', currentBill: '500.00' },
  negativeLimit: { name: 'Test Card', limit: '-1000.00', currentBill: '500.00' },
};

export const invalidTransactionData = {
  missingDescription: { amount: '100.00', type: 'expense', date: '2024-01-01', category: 'Test' },
  missingAmount: { description: 'Test', type: 'expense', date: '2024-01-01', category: 'Test' },
  invalidType: { description: 'Test', amount: '100.00', type: 'invalid', date: '2024-01-01', category: 'Test' },
  missingDate: { description: 'Test', amount: '100.00', type: 'expense', category: 'Test' },
  invalidDate: { description: 'Test', amount: '100.00', type: 'expense', date: 'invalid-date', category: 'Test' },
  missingCategory: { description: 'Test', amount: '100.00', type: 'expense', date: '2024-01-01' },
  bothAccountAndCard: { 
    description: 'Test', 
    amount: '100.00', 
    type: 'expense', 
    date: '2024-01-01', 
    category: 'Test',
    accountId: 1,
    creditCardId: 1,
  },
  transferToSameAccount: {
    description: 'Transfer',
    amount: '100.00',
    type: 'transfer',
    date: '2024-01-01',
    category: 'Transfer',
    fromAccountId: 1,
    toAccountId: 1,
  },
};