import { relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  varchar,
  decimal,
  date,
  serial,
  boolean,
  timestamp,
  index,
  text,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

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
}, (table) => ({
  // Performance: Index for filtering categories by owner
  ownerIdx: index("categories_owner_idx").on(table.ownerId),
}));

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
}, (table) => ({
  // Performance: Index for filtering bank accounts by owner
  ownerIdx: index("bank_accounts_owner_idx").on(table.ownerId),
}));

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
}, (table) => ({
  // Performance: Index for filtering credit cards by owner
  ownerIdx: index("credit_cards_owner_idx").on(table.ownerId),
}));

// Credit card statements table
export const creditCardStatements = pgTable("credit_card_statements", {
  id: serial("id").primaryKey(),
  creditCardId: integer("credit_card_id")
    .notNull()
    .references(() => creditCards.id),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  bankCode: varchar("bank_code", { length: 50 }).notNull(), // 'itau', 'nubank', etc.
  statementDate: date("statement_date").notNull(), // closing date
  dueDate: date("due_date").notNull(),
  previousBalance: decimal("previous_balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  paymentsReceived: decimal("payments_received", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  purchases: decimal("purchases", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  interest: decimal("interest", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(), // amount due
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileHash: varchar("file_hash", { length: 64 }).notNull(), // SHA-256 for duplicate detection
  status: varchar("status", { length: 20 })
    .$type<"pending" | "reviewed" | "imported" | "cancelled">()
    .default("pending")
    .notNull(),
  importedAt: timestamp("imported_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Performance: Index for filtering statements by credit card
  creditCardIdx: index("credit_card_statements_credit_card_idx").on(table.creditCardId),
  // Performance: Index for filtering statements by owner
  ownerIdx: index("credit_card_statements_owner_idx").on(table.ownerId),
  // Performance: Index for statement date queries
  statementDateIdx: index("credit_card_statements_statement_date_idx").on(table.statementDate),
  // Uniqueness: Prevent duplicate file uploads
  fileHashUnique: unique("credit_card_statements_file_hash_unique").on(table.fileHash),
  // Performance: Composite index for owner and creation date
  ownerCreatedAtIdx: index("credit_card_statements_owner_created_at_idx").on(table.ownerId, table.createdAt),
}));

// Statement line items table
export const statementLineItems = pgTable("statement_line_items", {
  id: serial("id").primaryKey(),
  statementId: integer("statement_id")
    .notNull()
    .references(() => creditCardStatements.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'purchase', 'payment', 'fee', 'interest', 'reversal'
  category: varchar("category", { length: 100 }), // original category from PDF
  suggestedCategoryId: integer("suggested_category_id").references(() => categories.id), // from AI
  finalCategoryId: integer("final_category_id").references(() => categories.id), // user confirmed
  transactionId: integer("transaction_id").references(() => transactions.id), // linked after import
  isDuplicate: boolean("is_duplicate").default(false).notNull(),
  duplicateReason: varchar("duplicate_reason", { length: 255 }),
  rawData: jsonb("raw_data"), // store original parsed data
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Performance: Index for filtering line items by statement
  statementIdx: index("statement_line_items_statement_idx").on(table.statementId),
  // Performance: Index for finding linked transactions
  transactionIdx: index("statement_line_items_transaction_idx").on(table.transactionId),
  // Performance: Composite index for date, amount, description (duplicate detection)
  dateAmountDescIdx: index("statement_line_items_date_amount_desc_idx").on(table.date, table.amount, table.description),
}));

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
}, (table) => ({
  // Performance: Composite index for date-based queries filtered by owner
  ownerDateIdx: index("transactions_owner_date_idx").on(table.ownerId, table.date),
  // Performance: Index for category lookups
  categoryIdx: index("transactions_category_idx").on(table.categoryId),
}));

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
  statements: many(creditCardStatements),
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

// Credit card statements relations
export const creditCardStatementsRelations = relations(creditCardStatements, ({ one, many }) => ({
  owner: one(users, {
    fields: [creditCardStatements.ownerId],
    references: [users.id],
  }),
  creditCard: one(creditCards, {
    fields: [creditCardStatements.creditCardId],
    references: [creditCards.id],
  }),
  lineItems: many(statementLineItems),
}));

// Statement line items relations
export const statementLineItemsRelations = relations(statementLineItems, ({ one }) => ({
  statement: one(creditCardStatements, {
    fields: [statementLineItems.statementId],
    references: [creditCardStatements.id],
  }),
  suggestedCategory: one(categories, {
    fields: [statementLineItems.suggestedCategoryId],
    references: [categories.id],
  }),
  finalCategory: one(categories, {
    fields: [statementLineItems.finalCategoryId],
    references: [categories.id],
  }),
  transaction: one(transactions, {
    fields: [statementLineItems.transactionId],
    references: [transactions.id],
  }),
}));
