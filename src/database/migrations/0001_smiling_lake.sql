ALTER TABLE "users" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;