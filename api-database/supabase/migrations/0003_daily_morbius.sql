ALTER TABLE "sessions" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expiresAt" DROP DEFAULT;