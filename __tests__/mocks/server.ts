import { setupServer } from "msw/node";
import { accountHandlers } from "./handlers/accounts";
import { creditCardHandlers } from "./handlers/credit-cards";
import { transactionHandlers } from "./handlers/transactions";

// Setup MSW server with all API handlers
export const server = setupServer(
  ...accountHandlers,
  ...creditCardHandlers,
  ...transactionHandlers,
);
