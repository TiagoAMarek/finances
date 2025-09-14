import { sql } from "drizzle-orm";

import { db } from "./db";
import { DEFAULT_CATEGORIES } from "./defaultCategories";
import { transactions, categories } from "./schema";

interface CategoryMigrationStats {
  totalTransactions: number;
  migratedTransactions: number;
  categoriesCreated: number;
  errors: string[];
}

/**
 * Migrate existing transactions with text categories to use the new category system
 */
export async function migrateCategoriesData(): Promise<CategoryMigrationStats> {
  const stats: CategoryMigrationStats = {
    totalTransactions: 0,
    migratedTransactions: 0,
    categoriesCreated: 0,
    errors: [],
  };

  try {
    console.log("Starting category data migration...");

    // Get all transactions that have text categories but no categoryId
    const transactionsToMigrate = await db
      .select()
      .from(transactions)
      .where(
        sql`${transactions.category} IS NOT NULL AND ${transactions.categoryId} IS NULL`,
      );

    stats.totalTransactions = transactionsToMigrate.length;
    console.log(`Found ${stats.totalTransactions} transactions to migrate`);

    if (stats.totalTransactions === 0) {
      console.log("No transactions need migration");
      return stats;
    }

    // Group transactions by owner and category name
    const categoryMap = new Map<
      string,
      {
        userId: number;
        categoryName: string;
        transactionType: string;
        transactions: typeof transactionsToMigrate;
      }
    >();

    for (const transaction of transactionsToMigrate) {
      const key = `${transaction.ownerId}-${transaction.category}`;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          userId: transaction.ownerId,
          categoryName: transaction.category!,
          transactionType: transaction.type,
          transactions: [],
        });
      }
      categoryMap.get(key)!.transactions.push(transaction);
    }

    console.log(`Found ${categoryMap.size} unique category-user combinations`);

    // For each unique category-user combination, create or find the category
    for (const [, group] of categoryMap) {
      try {
        let categoryId: number;

        // Check if a category with this name already exists for this user
        const existingCategory = await db
          .select()
          .from(categories)
          .where(
            sql`${categories.ownerId} = ${group.userId} AND LOWER(${categories.name}) = LOWER(${group.categoryName})`,
          )
          .limit(1);

        if (existingCategory.length > 0) {
          categoryId = existingCategory[0].id;
          console.log(
            `Using existing category "${group.categoryName}" for user ${group.userId}`,
          );
        } else {
          // Determine category type based on transaction types in this group
          const types = [...new Set(group.transactions.map((t) => t.type))];
          let categoryType: "income" | "expense" | "both";

          if (types.length === 1) {
            categoryType =
              types[0] === "transfer"
                ? "both"
                : (types[0] as "income" | "expense");
          } else if (types.includes("income") && types.includes("expense")) {
            categoryType = "both";
          } else if (types.includes("income")) {
            categoryType = "income";
          } else {
            categoryType = "expense";
          }

          // Find a default category with similar name for color/icon, or use defaults
          const defaultCategory = DEFAULT_CATEGORIES.find(
            (dc) =>
              dc.name
                .toLowerCase()
                .includes(group.categoryName.toLowerCase()) ||
              group.categoryName.toLowerCase().includes(dc.name.toLowerCase()),
          );

          // Create new category
          const [newCategory] = await db
            .insert(categories)
            .values({
              name: group.categoryName,
              type: categoryType,
              color: defaultCategory?.color || "#64748b",
              icon: defaultCategory?.icon || "📁",
              isDefault: false,
              ownerId: group.userId,
            })
            .returning();

          categoryId = newCategory.id;
          stats.categoriesCreated++;
          console.log(
            `Created new category "${group.categoryName}" (${categoryType}) for user ${group.userId}`,
          );
        }

        // Update all transactions in this group to use the categoryId
        const transactionIds = group.transactions.map((t) => t.id);
        await db
          .update(transactions)
          .set({ categoryId: categoryId })
          .where(
            sql`${transactions.id} IN (${sql.join(transactionIds, sql`, `)})`,
          );

        stats.migratedTransactions += group.transactions.length;
        console.log(
          `Updated ${group.transactions.length} transactions for category "${group.categoryName}"`,
        );
      } catch (error) {
        const errorMsg = `Error migrating category "${group.categoryName}" for user ${group.userId}: ${error}`;
        console.error(errorMsg);
        stats.errors.push(errorMsg);
      }
    }

    console.log("Category data migration completed");
    console.log(
      `Stats: ${stats.migratedTransactions}/${stats.totalTransactions} transactions migrated, ${stats.categoriesCreated} categories created, ${stats.errors.length} errors`,
    );

    return stats;
  } catch (error) {
    const errorMsg = `Migration failed: ${error}`;
    console.error(errorMsg);
    stats.errors.push(errorMsg);
    throw error;
  }
}

/**
 * Check migration status - how many transactions still need migration
 */
export async function checkMigrationStatus(): Promise<{
  totalTransactions: number;
  migratedTransactions: number;
  pendingMigration: number;
}> {
  const [total] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions);

  const [migrated] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(sql`${transactions.categoryId} IS NOT NULL`);

  const [pending] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(
      sql`${transactions.category} IS NOT NULL AND ${transactions.categoryId} IS NULL`,
    );

  return {
    totalTransactions: total.count,
    migratedTransactions: migrated.count,
    pendingMigration: pending.count,
  };
}
