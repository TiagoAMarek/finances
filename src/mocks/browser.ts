import { setupWorker } from "msw/browser";
import { accountHandlers } from "../../__tests__/mocks/handlers/accounts";
import { creditCardHandlers } from "../../__tests__/mocks/handlers/credit-cards";
import { transactionHandlers } from "../../__tests__/mocks/handlers/transactions";
import { authHandlers } from "../../__tests__/mocks/handlers/auth";
import { categoryHandlers } from "../../__tests__/mocks/handlers/categories";

// Setup MSW browser worker with all API handlers
export const worker = setupWorker(
  ...authHandlers,
  ...accountHandlers,
  ...creditCardHandlers,
  ...transactionHandlers,
  ...categoryHandlers,
);
