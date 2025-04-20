CREATE TABLE "machine_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"machineId" integer NOT NULL,
	"reportedAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"resolved" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budgetCodes" ADD COLUMN "active" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "machines_table" ADD COLUMN "active" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "machines_table" ADD COLUMN "dateLastUsed" date;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "timeoutDate" timestamp (3) with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "machine_issues" ADD CONSTRAINT "machine_issues_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machine_issues" ADD CONSTRAINT "machine_issues_machineId_machines_table_id_fk" FOREIGN KEY ("machineId") REFERENCES "public"."machines_table"("id") ON DELETE cascade ON UPDATE no action;