import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

declare global {
  var __db: ReturnType<typeof drizzle> | undefined;
}

let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(process.env.DATABASE_URL), { schema });
} else {
  if (!global.__db) {
    global.__db = drizzle(postgres(process.env.DATABASE_URL), { schema });
  }
  db = global.__db;
}

export { db };
