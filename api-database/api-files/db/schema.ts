
import { int } from "drizzle-orm/mysql-core";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users_table", {
  id: serial().primaryKey(),
  name: text().notNull(),
  cardNum: text().notNull().unique(),
  lastDigitOfCardNum: integer().notNull(),
  JHED: text().notNull(),
  isAdmin: integer().notNull(),
  graduationYear: integer() //This is optional because some users like Rich do not have grad year.
});

export const machineTypes = pgTable("machine_type" , {
  id: serial().primaryKey(),
  type: text().unique().notNull()
})

export const machines = pgTable("machines_table", {
  id: serial().primaryKey(),
  hourlyRate: integer().notNull(),
  name: text().notNull(),
  machineTypeId: serial().notNull().references(() => machineTypes.id, {onDelete:"cascade"})
})

//Table that acts as the "trainings" completed for a user
export const userMachineType = pgTable("user_machine_type",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => users.id, {onDelete: "cascade"}),
  machineTypeId: serial().notNull().references(()=> machineTypes.id, {onDelete:"cascade"})
});

export const budgetCodes = pgTable("budgetCodes" , {
  id: serial().primaryKey(),
  budgetCode: text().notNull(),
  name: text().notNull(),
})

export const userBudgetCodeTable = pgTable("user_budget_code_table",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => users.id, {onDelete: "cascade"}),
  budgetCodeId: serial().notNull().references(()=> budgetCodes.id, {onDelete:"cascade"})
});

export const financialStatementsTable = pgTable("financial_statements_table", {
  id: serial().primaryKey(),
  cardNum: text().notNull().unique(),
  budgetCode: text().notNull(),
  machineId: integer().notNull(),
  startTime: integer().notNull(),
  endTime: integer().notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;


export type InsertMachine = typeof machines.$inferInsert;
export type SelectMachine = typeof machines.$inferSelect;

export type InsertMachineType = typeof machineTypes.$inferInsert;
export type SelectMachineType = typeof machineTypes.$inferSelect;

export type InsertUserMachineRelation = typeof userMachineType.$inferInsert;
export type SelectUserMachineRelation = typeof userMachineType.$inferSelect;

export type InsertBudgetCode = typeof budgetCodes.$inferInsert;
export type SelectBudgetCode = typeof budgetCodes.$inferSelect



