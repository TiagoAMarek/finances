import { setupWorker } from "msw/browser";
import { accountHandlers } from "../../__tests__/mocks/handlers/accounts";
import { creditCardHandlers } from "../../__tests__/mocks/handlers/credit-cards";
import { transactionHandlers } from "../../__tests__/mocks/handlers/transactions";

// Setup MSW browser worker with all API handlers
export const worker = setupWorker(
  ...accountHandlers,
  ...creditCardHandlers,
  ...transactionHandlers,
);
