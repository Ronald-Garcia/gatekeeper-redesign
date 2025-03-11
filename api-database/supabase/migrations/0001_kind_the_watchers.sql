ALTER TABLE "budgetCodes" RENAME COLUMN "budgetCode" TO "code";--> statement-breakpoint
ALTER TABLE "machine_type" RENAME COLUMN "type" TO "id";--> statement-breakpoint
ALTER TABLE "machines_table" RENAME COLUMN "machineType" TO "machineTypeId";--> statement-breakpoint
ALTER TABLE "user_machine_type" RENAME COLUMN "machineType" TO "machineTypeId";--> statement-breakpoint
ALTER TABLE "machines_table" DROP CONSTRAINT "machines_table_machineType_machine_type_type_fk";
--> statement-breakpoint
ALTER TABLE "user_budget_code_table" DROP CONSTRAINT "user_budget_code_table_budgetCodeId_machines_table_id_fk";
--> statement-breakpoint
ALTER TABLE "user_machine_type" DROP CONSTRAINT "user_machine_type_machineType_machine_type_type_fk";
--> statement-breakpoint
ALTER TABLE "machine_type" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "machines_table" ADD CONSTRAINT "machines_table_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_budgetCodeId_budgetCodes_id_fk" FOREIGN KEY ("budgetCodeId") REFERENCES "public"."budgetCodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_type" ADD CONSTRAINT "user_machine_type_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machine_type" ADD CONSTRAINT "machine_type_name_unique" UNIQUE("name");