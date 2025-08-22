import TransactionsPage from "@/app/transactions/page";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import {
  mockLocation,
  renderWithProviders,
  testHelpers,
} from "../utils/test-utils";

const TEST_CONSTANTS = { BASE_URL: "http://localhost:3000" } as const;
const ENDPOINTS = {
  ACCOUNTS: `${TEST_CONSTANTS.BASE_URL}/api/accounts`,
  CREDIT_CARDS: `${TEST_CONSTANTS.BASE_URL}/api/credit_cards`,
  TRANSACTIONS: `${TEST_CONSTANTS.BASE_URL}/api/transactions`,
} as const;

describe("Transactions Page — Auth", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    // set an invalid token to force API calls and 401 handling
    testHelpers.setAuthenticatedUser("invalid-token");
  });

  it("redirects to /login on 401 responses", async () => {
    server.use(
      http.get(ENDPOINTS.ACCOUNTS, () =>
        HttpResponse.json({ detail: "Token inválido" }, { status: 401 }),
      ),
      http.get(ENDPOINTS.CREDIT_CARDS, () =>
        HttpResponse.json({ detail: "Token inválido" }, { status: 401 }),
      ),
      http.get(ENDPOINTS.TRANSACTIONS, () =>
        HttpResponse.json({ detail: "Token inválido" }, { status: 401 }),
      ),
    );

    renderWithProviders(<TransactionsPage />);

    // Should attempt to redirect to login when 401 is encountered
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Some flows are async; poll until redirect occurs
    let attempts = 0;
    while (mockLocation.href !== "/login" && attempts < 50) {
      // wait 20ms and try again (up to 1s)

      await new Promise((r) => setTimeout(r, 20));
      attempts++;
    }

    expect(mockLocation.href).toBe("/login");
  });
});
