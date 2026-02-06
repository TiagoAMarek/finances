import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

declare global {
  var __db: ReturnType<typeof drizzle> | undefined;
}

let _db: ReturnType<typeof drizzle> | undefined;

/**
 * Lazily initializes the database connection.
 * This is called at runtime (not module initialization) to avoid breaking Next.js build
 * when environment variables aren't available during static analysis phase.
 */
function initDb(): ReturnType<typeof drizzle> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (process.env.NODE_ENV === "production") {
    if (!_db) {
      _db = drizzle(postgres(process.env.DATABASE_URL), { schema });
    }
    return _db;
  } else {
    if (!global.__db) {
      global.__db = drizzle(postgres(process.env.DATABASE_URL), { schema });
    }
    return global.__db;
  }
}

/**
 * Database connection instance.
 * Uses a Proxy to lazily initialize the connection when first accessed.
 * The real database instance is cached after first initialization to avoid
 * repeated validation and function call overhead.
 */
let _proxyInitialized = false;
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    // Cache the real database instance in the target after first access
    if (!_proxyInitialized) {
      const realDb = initDb();
      Object.assign(target, realDb);
      _proxyInitialized = true;
    }
    return target[prop as keyof typeof target];
  },
});
