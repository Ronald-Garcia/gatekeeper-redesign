CREATE TABLE "budgetCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_statements_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"budgetCode" serial NOT NULL,
	"machineId" serial NOT NULL,
	"startTime" integer NOT NULL,
	"endTime" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machine_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "machine_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "machines_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"hourlyRate" integer NOT NULL,
	"name" text NOT NULL,
	"machineTypeId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_budget_code_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"budgetCodeId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_machine_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"machineTypeId" serial NOT NULL
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
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_budgetCode_budgetCodes_id_fk" FOREIGN KEY ("budgetCode") REFERENCES "public"."budgetCodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_statements_table" ADD CONSTRAINT "financial_statements_table_machineId_machines_table_id_fk" FOREIGN KEY ("machineId") REFERENCES "public"."machines_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "machines_table" ADD CONSTRAINT "machines_table_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_budget_code_table" ADD CONSTRAINT "user_budget_code_table_budgetCodeId_budgetCodes_id_fk" FOREIGN KEY ("budgetCodeId") REFERENCES "public"."budgetCodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_type" ADD CONSTRAINT "user_machine_type_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_type" ADD CONSTRAINT "user_machine_type_machineTypeId_machine_type_id_fk" FOREIGN KEY ("machineTypeId") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;