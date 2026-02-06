import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/api/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // @ts-ignore
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

