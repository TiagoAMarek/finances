CREATE TABLE IF NOT EXISTS "credit_card_statements" (
	"id" serial PRIMARY KEY NOT NULL,
	"credit_card_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"bank_code" varchar(50) NOT NULL,
	"statement_date" date NOT NULL,
	"due_date" date NOT NULL,
	"previous_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"payments_received" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"purchases" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"fees" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"interest" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"imported_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "credit_card_statements_file_hash_unique" UNIQUE("file_hash"),
	CONSTRAINT "credit_card_statements_status_check" CHECK (status IN ('pending', 'reviewed', 'imported', 'cancelled'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "statement_line_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"statement_id" integer NOT NULL,
	"date" date NOT NULL,
	"description" varchar(500) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" varchar(20) NOT NULL,
	"category" varchar(100),
	"suggested_category_id" integer,
	"final_category_id" integer,
	"transaction_id" integer,
	"is_duplicate" boolean DEFAULT false NOT NULL,
	"duplicate_reason" varchar(255),
	"raw_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_card_statements_credit_card_idx" ON "credit_card_statements" ("credit_card_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_card_statements_owner_idx" ON "credit_card_statements" ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_card_statements_statement_date_idx" ON "credit_card_statements" ("statement_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_card_statements_owner_created_at_idx" ON "credit_card_statements" ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statement_line_items_statement_idx" ON "statement_line_items" ("statement_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statement_line_items_transaction_idx" ON "statement_line_items" ("transaction_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statement_line_items_date_amount_desc_idx" ON "statement_line_items" ("date","amount","description");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_card_statements" ADD CONSTRAINT "credit_card_statements_credit_card_id_credit_cards_id_fk" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_card_statements" ADD CONSTRAINT "credit_card_statements_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement_line_items" ADD CONSTRAINT "statement_line_items_statement_id_credit_card_statements_id_fk" FOREIGN KEY ("statement_id") REFERENCES "credit_card_statements"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement_line_items" ADD CONSTRAINT "statement_line_items_suggested_category_id_categories_id_fk" FOREIGN KEY ("suggested_category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement_line_items" ADD CONSTRAINT "statement_line_items_final_category_id_categories_id_fk" FOREIGN KEY ("final_category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "statement_line_items" ADD CONSTRAINT "statement_line_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
--> statement-breakpoint
-- Create trigger for credit_card_statements
DO $$ BEGIN
  CREATE TRIGGER update_credit_card_statements_updated_at 
  BEFORE UPDATE ON credit_card_statements 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
