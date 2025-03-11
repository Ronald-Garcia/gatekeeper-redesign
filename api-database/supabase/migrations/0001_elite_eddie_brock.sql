ALTER TABLE "machines_table" RENAME COLUMN "machineType" TO "machineTypeId";--> statement-breakpoint
ALTER TABLE "user_machine_type" RENAME COLUMN "machineType" TO "machineTypeId";--> statement-breakpoint
ALTER TABLE "machines_table" DROP CONSTRAINT "machines_table_machineType_machine_type_type_fk";
--> statement-breakpoint
ALTER TABLE "user_budget_code_table" DROP CONSTRAINT "user_budget_code_table_budgetCodeId_machines_table_id_fk";
--> statement-breakpoint
ALTER TABLE "user_machine_type" DROP CONSTRAINT "user_machine_type_machineType_machine_type_type_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'machine_type'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "machine_type" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "machine_type" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "machines_table" ADD CONSTRAINT "machines_table_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_budgetCodeId_budgetCodes_id_fk" FOREIGN KEY ("budgetCodeId") REFERENCES "public"."budgetCodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_type" ADD CONSTRAINT "user_machine_type_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machine_type" ADD CONSTRAINT "machine_type_type_unique" UNIQUE("type");