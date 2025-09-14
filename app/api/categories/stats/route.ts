import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { categories, transactions } from "../../lib/schema";

// GET /api/categories/stats - List user's categories with usage statistics
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    // Query categories with transaction stats using a left join and aggregation
    const categoriesWithStats = await db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
        color: categories.color,
        icon: categories.icon,
        isDefault: categories.isDefault,
        ownerId: categories.ownerId,
        createdAt: categories.createdAt,
        transactionCount: sql<number>`COALESCE(COUNT(${transactions.id}), 0)`,
        totalAmount: sql<string>`COALESCE(SUM(ABS(${transactions.amount})), 0)`,
        lastUsed: sql<string | null>`MAX(${transactions.date})`,
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(eq(categories.ownerId, user.userId))
      .groupBy(categories.id)
      .orderBy(categories.type, categories.name);

    return createSuccessResponse(categoriesWithStats);
  } catch (error) {
    console.error("Get categories with stats error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
