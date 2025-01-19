DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "blog-chef-revamp_user" ADD COLUMN "role" "role" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_name_idx" ON "blog-chef-revamp_post" USING btree ("name");