import { defineConfig } from "drizzle-kit";

function getDatabaseUrl(): string {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required for Drizzle migrations"
    );
  }
  return process.env.DATABASE_URL;
}

export default defineConfig({
  schema: "./app/api/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});

