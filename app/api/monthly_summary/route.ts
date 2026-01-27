import { eq, and, gte, lte, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../lib/auth";
import { TRANSACTION_TYPES } from "../lib/constants";
import { db } from "../lib/db";
import { transactions } from "../lib/schema";
import { MonthlySummarySchema } from "../lib/validation";

// GET /api/monthly_summary?month=1&year=2024 - Get monthly financial summary
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "");
    const year = parseInt(searchParams.get("year") || "");

    const validatedData = MonthlySummarySchema.parse({ month, year });

    // Calculate date range for the month
    const startDate = `${validatedData.year}-${String(validatedData.month).padStart(2, "0")}-01`;
    const endDate = new Date(validatedData.year, validatedData.month, 0)
      .toISOString()
      .split("T")[0]; // Last day of month

    // Performance optimization: Use SQL aggregation instead of fetching all rows
    const result = await db
      .select({
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TRANSACTION_TYPES.INCOME} THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)`,
        totalExpense: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = ${TRANSACTION_TYPES.EXPENSE} THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.ownerId, user.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      );

    const totalIncome = parseFloat(result[0]?.totalIncome?.toString() || "0");
    const totalExpense = parseFloat(result[0]?.totalExpense?.toString() || "0");
    const balance = totalIncome - totalExpense;

    return createSuccessResponse({
      month: validatedData.month,
      year: validatedData.year,
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: balance,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Monthly summary error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
