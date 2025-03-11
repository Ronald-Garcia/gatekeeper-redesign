CREATE TABLE "financial_statements_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"budgetCode" serial NOT NULL,
	"machineId" serial NOT NULL,
	"startTime" integer NOT NULL,
	"endTime" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_budgetCode_budgetCodes_id_fk" FOREIGN KEY ("budgetCode") REFERENCES "public"."budgetCodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_machineId_machines_table_id_fk" FOREIGN KEY ("machineId") REFERENCES "public"."machines_table"("id") ON DELETE no action ON UPDATE no action;