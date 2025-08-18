import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { ENDPOINTS } from "./endpoints";
import { TEST_DATA } from "../integration/fixtures/dashboard-api";
/**
 * Sets up MSW handlers for empty data states
 */
export const setupEmptyDataHandlers = () => {
  server.resetHandlers(
    http.get(ENDPOINTS.ACCOUNTS, () => HttpResponse.json([])),
    http.get(ENDPOINTS.CREDIT_CARDS, () => HttpResponse.json([])),
    http.get(ENDPOINTS.TRANSACTIONS, () => HttpResponse.json([])),
  );
};

/**
 * Creates a handler that simulates network delays
 */
export const createDelayedHandler = (
  endpoint: string,
  delay: number,
  responseData: any = [],
) => {
  return http.get(endpoint, async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return HttpResponse.json(responseData);
  });
};

/**
 * Creates a handler that fails a specified number of times before succeeding
 */
export const createRetryHandler = (
  endpoint: string,
  failureCount: number,
  successData: any,
  errorMessage = "Erro temporário",
) => {
  let attemptCount = 0;

  return http.get(endpoint, () => {
    attemptCount++;
    if (attemptCount <= failureCount) {
      return HttpResponse.json({ detail: errorMessage }, { status: 500 });
    }
    return HttpResponse.json(successData);
  });
};

/**
 * Creates a handler that returns an authentication error
 */
export const createAuthErrorHandler = (endpoint: string) => {
  return http.get(endpoint, () =>
    HttpResponse.json(
      { detail: TEST_DATA.ERROR_MESSAGES.TOKEN_EXPIRED },
      { status: 401 },
    ),
  );
};

/**
 * Creates a large dataset for performance testing
 */
export const createLargeTransactionSet = (size = 1000) => {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    description: `Transação ${i + 1}`,
    amount: "100.00",
    type: "expense" as const,
    date: new Date().toISOString().split("T")[0],
    category: "Teste",
    ownerId: 1,
    accountId: 1,
    creditCardId: null,
  }));
};
