DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_name_idx" ON "blog-chef-revamp_post" USING btree ("name");