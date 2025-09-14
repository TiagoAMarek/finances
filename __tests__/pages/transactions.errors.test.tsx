import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import TransactionsPage from "@/app/transactions/page";

import { server } from "../mocks/server";
import { renderWithProviders, testHelpers } from "../utils/test-utils";

const TEST_CONSTANTS = { BASE_URL: "http://localhost:3000" } as const;
const ENDPOINTS = {
  ACCOUNTS: `${TEST_CONSTANTS.BASE_URL}/api/accounts`,
  CREDIT_CARDS: `${TEST_CONSTANTS.BASE_URL}/api/credit_cards`,
  TRANSACTIONS: `${TEST_CONSTANTS.BASE_URL}/api/transactions`,
} as const;

describe("Transactions Page — Error Handling", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    testHelpers.setAuthenticatedUser();
  });

  it("shows error alert when accounts API fails", async () => {
    server.use(
      http.get(ENDPOINTS.ACCOUNTS, () =>
        HttpResponse.json(
          { detail: "Erro interno do servidor" },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });

  it("shows error alert when credit cards API fails", async () => {
    server.use(
      http.get(ENDPOINTS.CREDIT_CARDS, () =>
        HttpResponse.json(
          { detail: "Erro interno do servidor" },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });

  it("shows error alert when transactions API fails", async () => {
    server.use(
      http.get(ENDPOINTS.TRANSACTIONS, () =>
        HttpResponse.json(
          { detail: "Erro interno do servidor" },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<TransactionsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });
});
