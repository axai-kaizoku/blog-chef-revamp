DROP INDEX IF EXISTS "post_name_idx";--> statement-breakpoint
ALTER TABLE "blog-chef-revamp_user" ADD COLUMN "password" varchar(255);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "blog-chef-revamp_post" USING btree ("name");