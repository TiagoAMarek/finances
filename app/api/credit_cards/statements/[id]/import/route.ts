import { eq, and, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import {
  creditCardStatements,
  statementLineItems,
  transactions,
  creditCards,
} from "../../../../lib/schema";
import { StatementImportSchema } from "@/lib/schemas/credit-card-statements";

// POST /api/credit_cards/statements/:id/import - Import statement line items as transactions
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const statementId = parseInt(params.id, 10);

    if (isNaN(statementId)) {
      return createErrorResponse("ID de fatura inválido", 400);
    }

    const body = await request.json();
    const validatedData = StatementImportSchema.parse(body);

    // Get statement and verify ownership
    const [statement] = await db
      .select()
      .from(creditCardStatements)
      .where(
        and(
          eq(creditCardStatements.id, statementId),
          eq(creditCardStatements.ownerId, user.userId)
        )
      );

    if (!statement) {
      return createErrorResponse("Fatura não encontrada", 404);
    }

    if (statement.status !== "reviewed") {
      return createErrorResponse(
        `Fatura não está pronta para importação (status: ${statement.status})`,
        400
      );
    }

    // Get line items
    const lineItems = await db
      .select()
      .from(statementLineItems)
      .where(eq(statementLineItems.statementId, statementId));

    if (lineItems.length === 0) {
      return createErrorResponse("Nenhum item encontrado na fatura", 400);
    }

    // Apply user's line item updates (category changes)
    if (validatedData.lineItemUpdates.length > 0) {
      for (const update of validatedData.lineItemUpdates) {
        await db
          .update(statementLineItems)
          .set({
            finalCategoryId: update.finalCategoryId,
            isDuplicate: update.isDuplicate !== undefined ? update.isDuplicate : undefined,
          })
          .where(eq(statementLineItems.id, update.id));
      }

      // Refresh line items after updates
      const updatedLineItems = await db
        .select()
        .from(statementLineItems)
        .where(eq(statementLineItems.statementId, statementId));
      
      lineItems.length = 0;
      lineItems.push(...updatedLineItems);
    }

    // Filter out excluded and duplicate items
    const itemsToImport = lineItems.filter(
      (item) =>
        !validatedData.excludeLineItemIds.includes(item.id) &&
        !item.isDuplicate
    );

    if (itemsToImport.length === 0) {
      return createErrorResponse(
        "Nenhum item válido para importar (todos marcados como duplicados ou excluídos)",
        400
      );
    }

    // Create transactions
    const createdTransactionIds: number[] = [];
    const skippedLineItemIds: number[] = [];

    for (const item of itemsToImport) {
      try {
        // Use finalCategoryId if set, otherwise suggestedCategoryId
        const categoryId = item.finalCategoryId || item.suggestedCategoryId;

        const [newTransaction] = await db
          .insert(transactions)
          .values({
            description: item.description,
            amount: item.amount,
            type: "expense", // Credit card transactions are always expenses
            date: item.date,
            categoryId,
            ownerId: user.userId,
            accountId: null, // Credit card transactions don't have account
            creditCardId: statement.creditCardId,
            toAccountId: null,
          })
          .returning({ id: transactions.id });

        // Link transaction to line item
        await db
          .update(statementLineItems)
          .set({ transactionId: newTransaction.id })
          .where(eq(statementLineItems.id, item.id));

        createdTransactionIds.push(newTransaction.id);
      } catch (error) {
        console.error(`Failed to import line item ${item.id}:`, error);
        skippedLineItemIds.push(item.id);
      }
    }

    // Update credit card currentBill if requested
    let newCurrentBill: string | undefined;
    if (validatedData.updateCurrentBill) {
      const [card] = await db
        .select()
        .from(creditCards)
        .where(eq(creditCards.id, statement.creditCardId));

      if (card) {
        const currentBill = parseFloat(card.currentBill);
        const statementAmount = parseFloat(statement.totalAmount);
        newCurrentBill = (currentBill + statementAmount).toFixed(2);

        await db
          .update(creditCards)
          .set({ currentBill: newCurrentBill })
          .where(eq(creditCards.id, statement.creditCardId));
      }
    }

    // Update statement status
    await db
      .update(creditCardStatements)
      .set({
        status: "imported",
        importedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(creditCardStatements.id, statementId));

    return createSuccessResponse({
      message: "Fatura importada com sucesso",
      result: {
        statementId,
        createdTransactionIds,
        skippedLineItemIds,
        updatedCurrentBill: validatedData.updateCurrentBill,
        newCurrentBill,
      },
      summary: {
        totalItems: lineItems.length,
        imported: createdTransactionIds.length,
        skipped: skippedLineItemIds.length,
        excluded: validatedData.excludeLineItemIds.length,
        duplicates: lineItems.filter((item) => item.isDuplicate).length,
      },
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Import statement error:", error);
    return createErrorResponse(
      `Erro ao importar fatura: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      500
    );
  }
}
