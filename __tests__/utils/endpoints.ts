export const BASE_URL = "http://localhost:3000";

export const ENDPOINTS = {
  ACCOUNTS: `${BASE_URL}/api/accounts`,
  CREDIT_CARDS: `${BASE_URL}/api/credit_cards`,
  TRANSACTIONS: `${BASE_URL}/api/transactions`,
} as const;
