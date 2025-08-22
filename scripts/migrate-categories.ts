#!/usr/bin/env ts-node

/**
 * Category Migration Script
 *
 * This script migrates existing transactions with text-based categories
 * to use the new category system with proper foreign key references.
 *
 * Usage:
 *   pnpm tsx scripts/migrate-categories.ts [--dry-run]
 */

import {
  migrateCategoriesData,
  checkMigrationStatus,
} from "../app/api/lib/migrateCategoriesData";

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("🏷️  Category Migration Tool");
  console.log("============================");

  if (isDryRun) {
    console.log("⚠️  DRY RUN MODE - No changes will be made");
  }

  try {
    // Check current migration status
    console.log("\n📊 Checking migration status...");
    const status = await checkMigrationStatus();

    console.log(`Total transactions: ${status.totalTransactions}`);
    console.log(`Already migrated: ${status.migratedTransactions}`);
    console.log(`Pending migration: ${status.pendingMigration}`);

    if (status.pendingMigration === 0) {
      console.log("\n✅ No transactions need migration!");
      return;
    }

    if (isDryRun) {
      console.log(
        `\n🔍 Dry run complete. ${status.pendingMigration} transactions would be migrated.`,
      );
      return;
    }

    // Confirm migration
    console.log(
      `\n⚠️  About to migrate ${status.pendingMigration} transactions.`,
    );
    console.log("This will:");
    console.log("  • Create new categories based on existing category text");
    console.log("  • Update transactions to reference these categories");
    console.log("  • Preserve the original category text for backup");

    // Run migration
    console.log("\n🚀 Starting migration...");
    const migrationStats = await migrateCategoriesData();

    console.log("\n📈 Migration Results:");
    console.log(
      `  • Transactions processed: ${migrationStats.totalTransactions}`,
    );
    console.log(
      `  • Transactions migrated: ${migrationStats.migratedTransactions}`,
    );
    console.log(`  • Categories created: ${migrationStats.categoriesCreated}`);
    console.log(`  • Errors: ${migrationStats.errors.length}`);

    if (migrationStats.errors.length > 0) {
      console.log("\n❌ Errors occurred during migration:");
      migrationStats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (migrationStats.errors.length === 0) {
      console.log("\n✅ Migration completed successfully!");
    } else {
      console.log(
        "\n⚠️  Migration completed with errors. Please review the errors above.",
      );
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
}

export { main };

