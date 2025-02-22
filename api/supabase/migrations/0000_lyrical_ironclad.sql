CREATE TABLE "machine_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "machines_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"hourly_rate" integer NOT NULL,
	"name" text NOT NULL,
	"machine_type_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_machine_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"machine_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"card_number" text NOT NULL,
	"JHED" text NOT NULL,
	"graduation_year" date,
	"is_admin" boolean,
	CONSTRAINT "users_table_card_number_unique" UNIQUE("card_number")
);
--> statement-breakpoint
ALTER TABLE "machines_table" ADD CONSTRAINT "machines_table_machine_type_id_machine_type_id_fk" FOREIGN KEY ("machine_type_id") REFERENCES "public"."machine_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_table" ADD CONSTRAINT "user_machine_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_machine_table" ADD CONSTRAINT "user_machine_table_machine_id_machines_table_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."machines_table"("id") ON DELETE cascade ON UPDATE no action;