ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bank_accounts_owner_idx" ON "bank_accounts" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "categories_owner_idx" ON "categories" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_cards_owner_idx" ON "credit_cards" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_owner_date_idx" ON "transactions" ("owner_id","date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_category_idx" ON "transactions" ("category_id");