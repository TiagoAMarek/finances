import { NextRequest } from "next/server";

import { createErrorResponse, createSuccessResponse, getUserFromRequest } from "../../lib/auth";
import {
  migrateCategoriesData,
  checkMigrationStatus,
} from "../../lib/migrateCategoriesData";

// GET /api/admin/migrate-categories - Check migration status
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const status = await checkMigrationStatus();
    return createSuccessResponse({
      message: "Migration status retrieved successfully",
      status,
    });
  } catch (error) {
    console.error("Migration status check error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST /api/admin/migrate-categories - Run migration
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  // TODO: Security - Add role-based authorization
  // Currently any authenticated user can trigger migrations
  // Recommendation: Add isAdmin flag to JWT payload and check here
  // if (!user.isAdmin) {
  //   return createErrorResponse("Forbidden - Admin access required", 403);
  // }

  try {
    console.log("Starting category migration via API endpoint");
    const migrationStats = await migrateCategoriesData();

    if (migrationStats.errors.length > 0) {
      return createSuccessResponse(
        {
          message: "Migration completed with errors",
          stats: migrationStats,
        },
        207,
      ); // 207 Multi-Status
    }

    return createSuccessResponse({
      message: "Migration completed successfully",
      stats: migrationStats,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return createErrorResponse(
      "Migration failed: " +
        (error instanceof Error ? error.message : "Unknown error"),
      500,
    );
  }
}
