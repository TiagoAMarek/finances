import { http, HttpResponse } from "msw";

import { TransactionCreateInput, TransactionUpdateInput } from "@/lib/schemas";

import { mockTransactions } from "../data/transactions";

export const transactionHandlers = [
  // GET /api/transactions - Fetch all transactions
  http.get("http://localhost:3000/api/transactions", () => {
    return HttpResponse.json(mockTransactions);
  }),
  // Also handle relative URLs for backward compatibility
  http.get("/api/transactions", () => {
    return HttpResponse.json(mockTransactions);
  }),

  // POST /api/transactions - Create new transaction
  http.post("http://localhost:3000/api/transactions", async ({ request }) => {
    const newTransaction = (await request.json()) as TransactionCreateInput;
    const transaction = {
      id: Math.max(...mockTransactions.map((t) => t.id)) + 1,
      ...newTransaction,
      ownerId: 1,
      category: null, // Legacy field
      categoryId: newTransaction.categoryId ?? null,
      accountId: newTransaction.accountId ?? null,
      creditCardId: newTransaction.creditCardId ?? null,
      toAccountId: newTransaction.toAccountId ?? null,
    };

    mockTransactions.push(transaction);
    return HttpResponse.json({ transaction });
  }),
  http.post("/api/transactions", async ({ request }) => {
    const newTransaction = (await request.json()) as TransactionCreateInput;
    const transaction = {
      id: Math.max(...mockTransactions.map((t) => t.id)) + 1,
      ...newTransaction,
      ownerId: 1,
      category: null, // Legacy field
      categoryId: newTransaction.categoryId ?? null,
      accountId: newTransaction.accountId ?? null,
      creditCardId: newTransaction.creditCardId ?? null,
      toAccountId: newTransaction.toAccountId ?? null,
    };

    mockTransactions.push(transaction);
    return HttpResponse.json({ transaction });
  }),

  // PUT /api/transactions/:id - Update transaction
  http.put("/api/transactions/:id", async ({ request, params }) => {
    const transactionId = parseInt(params.id as string);
    const updatedData = (await request.json()) as TransactionUpdateInput;
    const transactionIndex = mockTransactions.findIndex(
      (t) => t.id === transactionId,
    );

    if (transactionIndex === -1) {
      return HttpResponse.json(
        { detail: "Transação não encontrada." },
        { status: 404 },
      );
    }

    mockTransactions[transactionIndex] = {
      ...mockTransactions[transactionIndex],
      ...updatedData,
    };

    return HttpResponse.json({
      transaction: mockTransactions[transactionIndex],
    });
  }),

  // DELETE /api/transactions/:id - Delete transaction
  http.delete("http://localhost:3000/api/transactions/:id", ({ params }) => {
    const transactionId = parseInt(params.id as string);
    const transactionIndex = mockTransactions.findIndex(
      (t) => t.id === transactionId,
    );

    if (transactionIndex === -1) {
      return HttpResponse.json(
        { detail: "Transação não encontrada." },
        { status: 404 },
      );
    }

    mockTransactions.splice(transactionIndex, 1);
    return HttpResponse.json({ message: "Transação excluída com sucesso." });
  }),
  http.delete("/api/transactions/:id", ({ params }) => {
    const transactionId = parseInt(params.id as string);
    const transactionIndex = mockTransactions.findIndex(
      (t) => t.id === transactionId,
    );

    if (transactionIndex === -1) {
      return HttpResponse.json(
        { detail: "Transação não encontrada." },
        { status: 404 },
      );
    }

    mockTransactions.splice(transactionIndex, 1);
    return HttpResponse.json({ message: "Transação excluída com sucesso." });
  }),
];
