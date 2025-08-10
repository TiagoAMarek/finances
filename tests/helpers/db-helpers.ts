import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// SQLite schema for testing (equivalent to PostgreSQL schema)
export const testUsers = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
});

export const testBankAccounts = sqliteTable('bank_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  balance: text('balance').default('0.00').notNull(), // Store as text to match API
  currency: text('currency').default('BRL').notNull(),
  ownerId: integer('owner_id').notNull().references(() => testUsers.id),
});

export const testCreditCards = sqliteTable('credit_cards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  limit: text('limit').default('0.00').notNull(), // Store as text to match API
  currentBill: text('current_bill').default('0.00').notNull(), // Store as text to match API
  ownerId: integer('owner_id').notNull().references(() => testUsers.id),
});

export const testTransactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  description: text('description').notNull(),
  amount: text('amount').notNull(), // Store as text to match API
  type: text('type').notNull(), // 'income', 'expense', 'transfer'
  date: text('date').notNull(), // ISO date string
  category: text('category').notNull(),
  ownerId: integer('owner_id').notNull().references(() => testUsers.id),
  accountId: integer('account_id').references(() => testBankAccounts.id),
  creditCardId: integer('credit_card_id').references(() => testCreditCards.id),
  toAccountId: integer('to_account_id').references(() => testBankAccounts.id), // For transfers
});

// Relations (if needed)
export const testUsersRelations = relations(testUsers, ({ many }) => ({
  bankAccounts: many(testBankAccounts),
  creditCards: many(testCreditCards),
  transactions: many(testTransactions),
}));

export const testBankAccountsRelations = relations(testBankAccounts, ({ one, many }) => ({
  owner: one(testUsers, {
    fields: [testBankAccounts.ownerId],
    references: [testUsers.id],
  }),
  transactions: many(testTransactions),
}));

export const testCreditCardsRelations = relations(testCreditCards, ({ one, many }) => ({
  owner: one(testUsers, {
    fields: [testCreditCards.ownerId],
    references: [testUsers.id],
  }),
  transactions: many(testTransactions),
}));

export const testTransactionsRelations = relations(testTransactions, ({ one }) => ({
  owner: one(testUsers, {
    fields: [testTransactions.ownerId],
    references: [testUsers.id],
  }),
  account: one(testBankAccounts, {
    fields: [testTransactions.accountId],
    references: [testBankAccounts.id],
  }),
  creditCard: one(testCreditCards, {
    fields: [testTransactions.creditCardId],
    references: [testCreditCards.id],
  }),
  toAccount: one(testBankAccounts, {
    fields: [testTransactions.toAccountId],
    references: [testBankAccounts.id],
  }),
}));

// Test database setup
export const createTestDb = () => {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, {
    schema: {
      users: testUsers,
      bankAccounts: testBankAccounts,
      creditCards: testCreditCards,
      transactions: testTransactions,
    }
  });

  // Create tables manually
  sqlite.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      hashed_password TEXT NOT NULL
    );

    CREATE TABLE bank_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance TEXT DEFAULT '0.00' NOT NULL,
      currency TEXT DEFAULT 'BRL' NOT NULL,
      owner_id INTEGER NOT NULL REFERENCES users(id)
    );

    CREATE TABLE credit_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      "limit" TEXT DEFAULT '0.00' NOT NULL,
      current_bill TEXT DEFAULT '0.00' NOT NULL,
      owner_id INTEGER NOT NULL REFERENCES users(id)
    );

    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      owner_id INTEGER NOT NULL REFERENCES users(id),
      account_id INTEGER REFERENCES bank_accounts(id),
      credit_card_id INTEGER REFERENCES credit_cards(id),
      to_account_id INTEGER REFERENCES bank_accounts(id)
    );
  `);

  return { db, sqlite };
};

// Helper to clean database between tests
export const cleanTestDb = (sqlite: Database) => {
  sqlite.exec(`
    DELETE FROM transactions;
    DELETE FROM bank_accounts;
    DELETE FROM credit_cards;
    DELETE FROM users;
  `);
};

// Export schema for use in tests
export const testSchema = {
  users: testUsers,
  bankAccounts: testBankAccounts,
  creditCards: testCreditCards,
  transactions: testTransactions,
};