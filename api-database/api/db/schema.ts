
import { integer, pgTable, serial, text, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
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
  type: text().notNull()
})

export const machinesTable = pgTable("machines_table", {
  id: serial().primaryKey(),
  hourlyRate: integer().notNull(),
  name: text().notNull(),
  machineType: serial().notNull().references(() => machineTypes.id, {onDelete:"cascade"})
})

//Table that acts as the "trainings" for a user
export const userMachineTable = pgTable("user_machine_table",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  machineId: serial().notNull().references(()=> machinesTable.id, {onDelete:"cascade"})
});

export const budgetCodes = pgTable("budgetCodes" , {
  id: serial().primaryKey(),
  budgetCode: text().notNull(),
  name: text().notNull(),
})

export const userBudgetCodeTable = pgTable("user_budget_code_table",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => usersTable.id, {onDelete: "cascade"}),
  budgetCodeId: serial().notNull().references(()=> machinesTable.id, {onDelete:"cascade"})
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;


export type InsertMachine = typeof machinesTable.$inferInsert;
export type SelectMachine = typeof machinesTable.$inferSelect;

export type InsertMachineType = typeof machineTypes.$inferInsert;
export type SelectMachineType = typeof machineTypes.$inferSelect;

export type InsertUserMachineRelation = typeof userMachineTable.$inferInsert;
export type SelectUserMachineRelation = typeof userMachineTable.$inferSelect;

export type InsertBudgetCode = typeof budgetCodes.$inferInsert;
export type SelectBudgetCode = typeof budgetCodes.$inferSelect



