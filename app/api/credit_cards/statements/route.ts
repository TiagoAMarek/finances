import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import crypto from "crypto";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { creditCardStatements, creditCards } from "../../lib/schema";
import { StatementUploadSchema, StatementListQuerySchema } from "@/lib/schemas/credit-card-statements";

// GET /api/credit_cards/statements - List user's statements
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = {
      creditCardId: searchParams.get("creditCardId"),
      status: searchParams.get("status"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    };

    const validated = StatementListQuerySchema.parse(query);

    // Build where conditions
    const conditions = [eq(creditCardStatements.ownerId, user.userId)];

    if (validated.creditCardId) {
      conditions.push(eq(creditCardStatements.creditCardId, validated.creditCardId));
    }

    if (validated.status) {
      conditions.push(eq(creditCardStatements.status, validated.status));
    }

    if (validated.startDate) {
      conditions.push(gte(creditCardStatements.statementDate, validated.startDate));
    }

    if (validated.endDate) {
      conditions.push(lte(creditCardStatements.statementDate, validated.endDate));
    }

    // Query statements with pagination
    const offset = (validated.page - 1) * validated.limit;
    
    const statements = await db
      .select({
        id: creditCardStatements.id,
        creditCardId: creditCardStatements.creditCardId,
        bankCode: creditCardStatements.bankCode,
        statementDate: creditCardStatements.statementDate,
        dueDate: creditCardStatements.dueDate,
        totalAmount: creditCardStatements.totalAmount,
        fileName: creditCardStatements.fileName,
        status: creditCardStatements.status,
        importedAt: creditCardStatements.importedAt,
        createdAt: creditCardStatements.createdAt,
      })
      .from(creditCardStatements)
      .where(and(...conditions))
      .orderBy(desc(creditCardStatements.createdAt))
      .limit(validated.limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(creditCardStatements)
      .where(and(...conditions));

    return createSuccessResponse({
      statements,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total: count,
        totalPages: Math.ceil(count / validated.limit),
      },
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Get statements error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST /api/credit_cards/statements - Upload new statement
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const validatedData = StatementUploadSchema.parse(body);

    // Verify credit card belongs to user
    const [card] = await db
      .select()
      .from(creditCards)
      .where(
        and(
          eq(creditCards.id, validatedData.creditCardId),
          eq(creditCards.ownerId, user.userId)
        )
      );

    if (!card) {
      return createErrorResponse("Cartão de crédito não encontrado", 404);
    }

    // Decode base64 file data
    const pdfBuffer = Buffer.from(validatedData.fileData, "base64");

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (pdfBuffer.length > maxSize) {
      return createErrorResponse(
        "Arquivo muito grande. Tamanho máximo: 10MB",
        400
      );
    }

    // Calculate file hash for duplicate detection
    const fileHash = crypto
      .createHash("sha256")
      .update(pdfBuffer)
      .digest("hex");

    // Check for duplicate upload
    const [existing] = await db
      .select()
      .from(creditCardStatements)
      .where(
        and(
          eq(creditCardStatements.fileHash, fileHash),
          eq(creditCardStatements.ownerId, user.userId)
        )
      );

    if (existing) {
      return createErrorResponse(
        "Este arquivo já foi enviado anteriormente",
        409
      );
    }

    // Create statement record
    const [newStatement] = await db
      .insert(creditCardStatements)
      .values({
        creditCardId: validatedData.creditCardId,
        ownerId: user.userId,
        bankCode: validatedData.bankCode,
        fileName: validatedData.fileName,
        fileHash,
        fileData: validatedData.fileData, // Store base64
        status: "pending",
        // These will be filled during parsing
        statementDate: "1970-01-01",
        dueDate: "1970-01-01",
        previousBalance: "0.00",
        paymentsReceived: "0.00",
        purchases: "0.00",
        fees: "0.00",
        interest: "0.00",
        totalAmount: "0.00",
      })
      .returning();

    return createSuccessResponse(
      {
        message: "Fatura enviada com sucesso. Use o endpoint /parse para processar.",
        statement: {
          id: newStatement.id,
          fileName: newStatement.fileName,
          bankCode: newStatement.bankCode,
          status: newStatement.status,
          createdAt: newStatement.createdAt,
        },
      },
      201
    );
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Upload statement error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
