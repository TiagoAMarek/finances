// Transaction types - avoiding magic strings
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

// Category types
export const CATEGORY_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
  BOTH: "both",
} as const;

export type CategoryType =
  (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];
