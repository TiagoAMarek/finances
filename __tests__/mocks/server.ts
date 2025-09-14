import { setupServer } from "msw/node";

import { accountHandlers } from "./handlers/accounts";
import { authHandlers } from "./handlers/auth";
import { categoryHandlers } from "./handlers/categories";
import { creditCardHandlers } from "./handlers/credit-cards";
import { transactionHandlers } from "./handlers/transactions";

// Setup MSW server with all API handlers
export const server = setupServer(
  ...authHandlers,
  ...accountHandlers,
  ...creditCardHandlers,
  ...transactionHandlers,
  ...categoryHandlers,
);
