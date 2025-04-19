CREATE TABLE "budgetCodeType" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "budgetCodeType_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "budgetCodes" ADD COLUMN "budgetCodeTypeId" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "machine_issues" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "budgetCodes" ADD CONSTRAINT "budgetCodes_budgetCodeTypeId_budgetCodeType_id_fk" FOREIGN KEY ("budgetCodeTypeId") REFERENCES "public"."budgetCodeType"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machines_table" DROP COLUMN "dateLastUsed";