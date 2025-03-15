ALTER TABLE "sessions" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expiresAt" SET DEFAULT now();