import {
  pgTable,
  integer,
  varchar,
  decimal,
  date,
  serial,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'income', 'expense', 'both'
  color: varchar("color", { length: 7 }), // hex color code
  icon: varchar("icon", { length: 50 }), // icon identifier
  isDefault: boolean("is_default").default(false).notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Default categories table (for seeding new users)
export const defaultCategories = pgTable("default_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'income', 'expense', 'both'
  color: varchar("color", { length: 7 }), // hex color code
  icon: varchar("icon", { length: 50 }), // icon identifier
});

// Bank accounts table
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
});

// Credit cards table
export const creditCards = pgTable("credit_cards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  limit: decimal("limit", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  currentBill: decimal("current_bill", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'income', 'expense', 'transfer'
  date: date("date").notNull(),
  category: varchar("category", { length: 100 }), // Keep for migration compatibility
  categoryId: integer("category_id").references(() => categories.id),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  accountId: integer("account_id").references(() => bankAccounts.id),
  creditCardId: integer("credit_card_id").references(() => creditCards.id),
  toAccountId: integer("to_account_id").references(() => bankAccounts.id), // For transfers
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bankAccounts: many(bankAccounts),
  creditCards: many(creditCards),
  transactions: many(transactions),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  owner: one(users, {
    fields: [categories.ownerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const bankAccountsRelations = relations(
  bankAccounts,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [bankAccounts.ownerId],
      references: [users.id],
    }),
    transactions: many(transactions),
  }),
);

export const creditCardsRelations = relations(creditCards, ({ one, many }) => ({
  owner: one(users, {
    fields: [creditCards.ownerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  owner: one(users, {
    fields: [transactions.ownerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  bankAccount: one(bankAccounts, {
    fields: [transactions.accountId],
    references: [bankAccounts.id],
  }),
  creditCard: one(creditCards, {
    fields: [transactions.creditCardId],
    references: [creditCards.id],
  }),
  toAccount: one(bankAccounts, {
    fields: [transactions.toAccountId],
    references: [bankAccounts.id],
  }),
}));
