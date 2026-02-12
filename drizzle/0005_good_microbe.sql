ALTER TABLE "credit_card_statements" DROP CONSTRAINT "credit_card_statements_file_hash_unique";--> statement-breakpoint
ALTER TABLE "credit_card_statements" DROP COLUMN "file_name";--> statement-breakpoint
ALTER TABLE "credit_card_statements" DROP COLUMN "file_hash";--> statement-breakpoint
ALTER TABLE "credit_card_statements" ADD CONSTRAINT "credit_card_statements_owner_card_date_unique" UNIQUE("owner_id","credit_card_id","statement_date");