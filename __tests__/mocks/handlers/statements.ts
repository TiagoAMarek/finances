import { http, HttpResponse } from "msw";
import type {
  StatementUploadInput,
  StatementImportInput,
} from "@/lib/schemas/credit-card-statements";
import {
  mockStatements,
  mockLineItems,
  createMockStatement,
  createMockLineItem,
  detectCategoryFromDescription,
} from "../data/statements";
import { mockCreditCards } from "../data/credit-cards";
import { mockTransactions, createMockTransaction } from "../data/transactions";

/**
 * MSW handlers for credit card statement import endpoints
 */
export const statementHandlers = [
  /**
   * POST /api/credit_cards/statements
   * Upload a credit card statement PDF
   */
  http.post<never, StatementUploadInput>(
    "*/api/credit_cards/statements",
    async ({ request }) => {
      const body = await request.json();

      // Validate credit card exists
      const card = mockCreditCards.find((c) => c.id === body.creditCardId);
      if (!card) {
        return HttpResponse.json(
          { error: "Cartão de crédito não encontrado" },
          { status: 404 }
        );
      }

      // Validate bank code
      if (body.bankCode !== "itau") {
        return HttpResponse.json(
          { error: "Banco não suportado. Apenas 'itau' está disponível." },
          { status: 400 }
        );
      }

      // Validate PDF data format (check for PDF magic bytes in base64)
      if (!body.fileData.startsWith("JVBERi")) {
        return HttpResponse.json(
          { error: "Arquivo inválido. Envie um PDF válido." },
          { status: 400 }
        );
      }

      // Calculate file hash (simple mock)
      const fileHash =
        "hash_" +
        body.fileName.replace(/[^a-z0-9]/gi, "") +
        "_" +
        Date.now().toString(36);

      // Pad to 64 characters (SHA-256 length)
      const paddedHash = fileHash.padEnd(64, "0");

      // Check for duplicate upload by file hash or file name
      const duplicate = mockStatements.find(
        (s) => s.fileHash === paddedHash || s.fileName === body.fileName
      );
      if (duplicate) {
        return HttpResponse.json(
          { error: "Esta fatura já foi enviada anteriormente." },
          { status: 409 }
        );
      }

      // Create new statement
      const newStatement = createMockStatement({
        creditCardId: body.creditCardId,
        bankCode: body.bankCode,
        fileName: body.fileName,
        fileHash: paddedHash,
        creditCard: {
          id: card.id,
          name: card.name,
          limit: card.limit,
          currentBill: card.currentBill,
        },
      });

      mockStatements.push(newStatement);

      return HttpResponse.json({
        statementId: newStatement.id,
        message: "Fatura enviada com sucesso",
      });
    }
  ),

  /**
   * GET /api/credit_cards/statements
   * List statements with pagination and filtering
   */
  http.get("*/api/credit_cards/statements", ({ request }) => {
    const url = new URL(request.url);
    const creditCardId = url.searchParams.get("creditCardId");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    // Filter statements
    let filtered = [...mockStatements];

    if (creditCardId) {
      filtered = filtered.filter(
        (s) => s.creditCardId === parseInt(creditCardId)
      );
    }

    if (status) {
      filtered = filtered.filter((s) => s.status === status);
    }

    // Sort by createdAt descending (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return HttpResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }),

  /**
   * GET /api/credit_cards/statements/:id
   * Get statement details
   */
  http.get<{ id: string }>("*/api/credit_cards/statements/:id", ({ params }) => {
    const statement = mockStatements.find((s) => s.id === parseInt(params.id));

    if (!statement) {
      return HttpResponse.json(
        { error: "Fatura não encontrada" },
        { status: 404 }
      );
    }

    return HttpResponse.json(statement);
  }),

  /**
   * POST /api/credit_cards/statements/:id/parse
   * Parse a statement and generate line items
   */
  http.post<{ id: string }>(
    "*/api/credit_cards/statements/:id/parse",
    ({ params }) => {
      const statementId = parseInt(params.id);
      const statement = mockStatements.find((s) => s.id === statementId);

      if (!statement) {
        return HttpResponse.json(
          { error: "Fatura não encontrada" },
          { status: 404 }
        );
      }

      if (statement.status !== "pending") {
        return HttpResponse.json(
          { error: "Esta fatura já foi processada" },
          { status: 400 }
        );
      }

      // Update statement status
      statement.status = "reviewed";
      statement.updatedAt = new Date().toISOString();

      // Generate line items (simulate parsing)
      const generatedItems = [
        createMockLineItem({
          statementId,
          description: "SUPERMERCADO EXTRA SAO PAULO BR",
          amount: "245.80",
          date: "2024-01-05",
          suggestedCategoryId: 4,
          suggestedCategory: { id: 4, name: "Alimentação", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "UBER *TRIP SAO PAULO BR",
          amount: "32.50",
          date: "2024-01-06",
          suggestedCategoryId: 5,
          suggestedCategory: { id: 5, name: "Transporte", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "IFOOD *RESTAURANTE ITALIANO",
          amount: "58.90",
          date: "2024-01-07",
          suggestedCategoryId: 4,
          suggestedCategory: { id: 4, name: "Alimentação", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "NETFLIX.COM SAO PAULO BR",
          amount: "45.90",
          date: "2024-01-08",
          suggestedCategoryId: 6,
          suggestedCategory: { id: 6, name: "Lazer", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "FARMACIA DROGASIL",
          amount: "127.50",
          date: "2024-01-09",
          suggestedCategoryId: 7,
          suggestedCategory: { id: 7, name: "Saúde", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "POSTO IPIRANGA",
          amount: "180.00",
          date: "2024-01-10",
          suggestedCategoryId: 5,
          suggestedCategory: { id: 5, name: "Transporte", type: "expense" },
        }),
        createMockLineItem({
          statementId,
          description: "MERCADO LIVRE",
          amount: "89.00",
          date: "2024-01-11",
          suggestedCategoryId: null,
          suggestedCategory: null,
        }),
        createMockLineItem({
          statementId,
          description: "TARIFA MANUTENCAO CONTA",
          amount: "15.00",
          date: "2024-01-12",
          type: "fee",
          suggestedCategoryId: null,
          suggestedCategory: null,
        }),
      ];

      // Add to mockLineItems
      generatedItems.forEach((item) => mockLineItems.push(item));

      // Update statement totals
      const totalPurchases = generatedItems
        .filter((i) => i.type === "purchase")
        .reduce((sum, i) => sum + parseFloat(i.amount), 0);

      const totalFees = generatedItems
        .filter((i) => i.type === "fee")
        .reduce((sum, i) => sum + parseFloat(i.amount), 0);

      statement.purchases = totalPurchases.toFixed(2);
      statement.fees = totalFees.toFixed(2);
      statement.totalAmount = (totalPurchases + totalFees).toFixed(2);

      return HttpResponse.json({
        message: "Fatura processada com sucesso",
        lineItemsCreated: generatedItems.length,
        duplicatesFound: generatedItems.filter((i) => i.isDuplicate).length,
      });
    }
  ),

  /**
   * GET /api/credit_cards/statements/:id/line-items
   * Get line items for a statement
   */
  http.get<{ id: string }>(
    "*/api/credit_cards/statements/:id/line-items",
    ({ params }) => {
      const statementId = parseInt(params.id);

      const statement = mockStatements.find((s) => s.id === statementId);
      if (!statement) {
        return HttpResponse.json(
          { error: "Fatura não encontrada" },
          { status: 404 }
        );
      }

      const items = mockLineItems.filter((i) => i.statementId === statementId);

      return HttpResponse.json({ data: items });
    }
  ),

  /**
   * POST /api/credit_cards/statements/:id/import
   * Import statement line items as transactions
   */
  http.post<{ id: string }, StatementImportInput>(
    "*/api/credit_cards/statements/:id/import",
    async ({ params, request }) => {
      const statementId = parseInt(params.id);
      const body = await request.json();

      const statement = mockStatements.find((s) => s.id === statementId);

      if (!statement) {
        return HttpResponse.json(
          { error: "Fatura não encontrada" },
          { status: 404 }
        );
      }

      if (statement.status === "imported") {
        return HttpResponse.json(
          { error: "Esta fatura já foi importada" },
          { status: 400 }
        );
      }

      // Get line items for this statement (exclude duplicates and excluded items)
      const lineItems = mockLineItems.filter(
        (i) =>
          i.statementId === statementId &&
          !body.excludeLineItemIds.includes(i.id) &&
          !i.isDuplicate
      );

      // Create transactions (add to mockTransactions)
      const createdIds: number[] = [];
      lineItems.forEach((item) => {
        // Determine amount sign based on type
        let amount = item.amount;
        if (item.type === "purchase" || item.type === "fee" || item.type === "interest") {
          amount = `-${item.amount}`;
        } else if (item.type === "payment") {
          // Payment is already negative in line items, make it positive
          amount = item.amount.replace("-", "");
        }

        const newTransaction = createMockTransaction({
          type: item.type === "payment" ? "income" : "expense",
          amount,
          description: item.description,
          date: item.date,
          categoryId: item.finalCategoryId || item.suggestedCategoryId,
          creditCardId: statement.creditCardId,
        });
        mockTransactions.push(newTransaction);
        createdIds.push(newTransaction.id);

        // Link transaction to line item
        item.transactionId = newTransaction.id;
      });

      // Update credit card currentBill if requested
      let newCurrentBill: string | undefined;
      if (body.updateCurrentBill) {
        const card = mockCreditCards.find(
          (c) => c.id === statement.creditCardId
        );
        if (card) {
          const oldBill = parseFloat(card.currentBill);
          const addedAmount = lineItems.reduce(
            (sum, i) => sum + parseFloat(i.amount),
            0
          );
          newCurrentBill = (oldBill + addedAmount).toFixed(2);
          card.currentBill = newCurrentBill;
        }
      }

      // Update statement status
      statement.status = "imported";
      statement.importedAt = new Date().toISOString();
      statement.updatedAt = new Date().toISOString();

      return HttpResponse.json({
        statementId,
        createdTransactionIds: createdIds,
        skippedLineItemIds: body.excludeLineItemIds,
        updatedCurrentBill: body.updateCurrentBill,
        newCurrentBill,
      });
    }
  ),
];
