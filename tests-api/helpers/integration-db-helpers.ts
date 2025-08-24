import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  users,
  bankAccounts,
  creditCards,
  transactions,
  categories,
  defaultCategories,
} from "@/app/api/lib/schema";
import { hashPassword } from "@/app/api/lib/auth";

// Create a real SQLite in-memory database for integration tests
export function createIntegrationTestDb() {
  const sqlite = new Database(":memory:");

  // Enable foreign keys
  sqlite.exec("PRAGMA foreign_keys = ON;");

  const db = drizzle(sqlite, {
    schema: { users, bankAccounts, creditCards, transactions, categories, defaultCategories },
  });

  // Create tables manually since we're using in-memory
  // Using snake_case to match PostgreSQL schema
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      balance TEXT NOT NULL DEFAULT '0.00',
      currency TEXT NOT NULL DEFAULT 'BRL',
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS credit_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      "limit" TEXT NOT NULL DEFAULT '0.00',
      current_bill TEXT NOT NULL DEFAULT '0.00',
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
      color TEXT,
      icon TEXT,
      is_default BOOLEAN NOT NULL DEFAULT false,
      owner_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS default_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'both')),
      color TEXT,
      icon TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
      amount TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      category_id INTEGER,
      account_id INTEGER,
      credit_card_id INTEGER,
      to_account_id INTEGER,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE SET NULL,
      FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE SET NULL,
      FOREIGN KEY (to_account_id) REFERENCES bank_accounts(id) ON DELETE SET NULL
    );
  `);

  return { db, sqlite };
}

// Helper to create a test user with hashed password
export async function createTestUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userData: { name?: string; email?: string; password?: string } = {},
) {
  const name = userData.name || "Test User";
  const email = userData.email || "test@example.com";
  const plainPassword = userData.password || "Abcdef1!";
  const hashedPassword = await hashPassword(plainPassword);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      hashedPassword,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  return {
    user,
    plainPassword,
  };
}

// Helper to create test bank account
export async function createTestBankAccount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: number,
  accountData: { name?: string; balance?: string } = {},
) {
  const [account] = await db
    .insert(bankAccounts)
    .values({
      ownerId: userId,
      name: accountData.name || "Test Account",
      balance: accountData.balance || "1000.00",
    })
    .returning();

  return account;
}

// Helper to create test credit card
export async function createTestCreditCard(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: number,
  cardData: { name?: string; limit?: string } = {},
) {
  const [card] = await db
    .insert(creditCards)
    .values({
      ownerId: userId,
      name: cardData.name || "Test Card",
      limit: cardData.limit || "5000.00",
      currentBill: "0.00",
    })
    .returning();

  return card;
}

// Helper to create test category
export async function createTestCategory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: number,
  categoryData: {
    name?: string;
    type?: "income" | "expense" | "both";
    color?: string;
    icon?: string;
  } = {},
) {
  const [category] = await db
    .insert(categories)
    .values({
      ownerId: userId,
      name: categoryData.name || "Test Category",
      type: categoryData.type || "expense",
      color: categoryData.color || "#64748b",
      icon: categoryData.icon || "📁",
      isDefault: false,
    })
    .returning();

  return category;
}

// Helper to create test transaction
export async function createTestTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: number,
  transactionData: {
    type?: "income" | "expense" | "transfer";
    amount?: string;
    description?: string;
    date?: string;
    category?: string;
    categoryId?: number;
    accountId?: number;
    creditCardId?: number;
  } = {},
) {
  const [transaction] = await db
    .insert(transactions)
    .values({
      ownerId: userId,
      type: transactionData.type || "expense",
      amount: transactionData.amount || "100.00",
      description: transactionData.description || "Test Transaction",
      date: transactionData.date || new Date().toISOString().split("T")[0],
      category: transactionData.category || "General",
      categoryId: transactionData.categoryId || null,
      accountId: transactionData.accountId || null,
      creditCardId: transactionData.creditCardId || null,
    })
    .returning();

  return transaction;
}

// Helper to clean up database between tests
export function cleanupTestDb(sqlite: Database.Database) {
  sqlite.exec("DELETE FROM transactions;");
  sqlite.exec("DELETE FROM categories;");
  sqlite.exec("DELETE FROM default_categories;");
  sqlite.exec("DELETE FROM credit_cards;");
  sqlite.exec("DELETE FROM bank_accounts;");
  sqlite.exec("DELETE FROM users;");

  // Reset auto-increment counters
  sqlite.exec("DELETE FROM sqlite_sequence;");
}
