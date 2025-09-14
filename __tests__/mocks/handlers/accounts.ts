import { http, HttpResponse } from "msw";

import { BankAccountCreateInput, BankAccountUpdateInput } from "@/lib/schemas";

import { mockAccounts } from "../data/accounts";

export const accountHandlers = [
  // GET /api/accounts - Fetch all accounts
  http.get("http://localhost:3000/api/accounts", () => {
    return HttpResponse.json(mockAccounts);
  }),
  // Also handle relative URLs for backward compatibility
  http.get("/api/accounts", () => {
    return HttpResponse.json(mockAccounts);
  }),

  // POST /api/accounts - Create new account
  http.post("/api/accounts", async ({ request }) => {
    const newAccount = (await request.json()) as BankAccountCreateInput;
    const account = {
      id: Math.max(...mockAccounts.map((a) => a.id)) + 1,
      ...newAccount,
      ownerId: 1,
      balance: newAccount.balance || "0.00",
      currency: newAccount.currency || "BRL",
    };

    mockAccounts.push(account);
    return HttpResponse.json({ account });
  }),

  // PUT /api/accounts/:id - Update account
  http.put("/api/accounts/:id", async ({ request, params }) => {
    const accountId = parseInt(params.id as string);
    const updatedData = (await request.json()) as BankAccountUpdateInput;
    const accountIndex = mockAccounts.findIndex((a) => a.id === accountId);

    if (accountIndex === -1) {
      return HttpResponse.json(
        { detail: "Conta não encontrada." },
        { status: 404 },
      );
    }

    mockAccounts[accountIndex] = {
      ...mockAccounts[accountIndex],
      ...updatedData,
    };

    return HttpResponse.json({ account: mockAccounts[accountIndex] });
  }),

  // DELETE /api/accounts/:id - Delete account
  http.delete("/api/accounts/:id", ({ params }) => {
    const accountId = parseInt(params.id as string);
    const accountIndex = mockAccounts.findIndex((a) => a.id === accountId);

    if (accountIndex === -1) {
      return HttpResponse.json(
        { detail: "Conta não encontrada." },
        { status: 404 },
      );
    }

    mockAccounts.splice(accountIndex, 1);
    return HttpResponse.json({ message: "Conta excluída com sucesso." });
  }),
];
