CREATE TABLE "budgetCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"budgetCode" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machine_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machines_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"hourlyRate" integer NOT NULL,
	"name" text NOT NULL,
	"machineType" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_budget_code_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"budgetCodeId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_machine_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"machineId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"cardNum" text NOT NULL,
	"lastDigitOfCardNum" integer NOT NULL,
	"JHED" text NOT NULL,
	"isAdmin" integer NOT NULL,
	"graduationYear" integer,
	CONSTRAINT "users_table_cardNum_unique" UNIQUE("cardNum")
);
--> statement-breakpoint
ALTER TABLE "machines_table" ADD CONSTRAINT "machines_table_machineType_machine_type_id_fk" FOREIGN KEY ("machineType") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_budgetCodeId_machines_table_id_fk" FOREIGN KEY ("budgetCodeId") REFERENCES "public"."machines_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_table" ADD CONSTRAINT "user_machine_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_table" ADD CONSTRAINT "user_machine_table_machineId_machines_table_id_fk" FOREIGN KEY ("machineId") REFERENCES "public"."machines_table"("id") ON DELETE cascade ON UPDATE no action;