
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";



/*
 ******************
 * STORAGE TABLES *
 ******************
 */

/**
 * The table that stores user accounts of our app.
 * @primary id                  the database ID of the user.
 * @text    name                the name of the user.
 * @text    cardNum             the first 15 digits of card number of the user (stored as a text, as no integer operations are done on this entry) 
 * @integer lastDigitOfCardNum  the last digit of the card number (this allows for automatic updating of JCards)
 * @text    JHED                the JHED identifier of the user
 * @integer isAdmin             the flag that determines whether or not the user is an admin
 * @integer graduationYear      the graduation year of the user (optional, as admins do not have a graduation year)
 * @active  active              the flag that determines whether or not the user account is active.
 */
export const users = pgTable("users_table", {
  id: serial().primaryKey(),
  name: text().notNull(),
  cardNum: text().notNull().unique(),
  lastDigitOfCardNum: integer().notNull(),
  JHED: text().notNull(),
  isAdmin: integer().notNull(),
  graduationYear: integer(), //This is optional because some users like Rich do not have grad year.
  active: integer().notNull().default(1)
});

/**
 * The table that stores the machines registered with the app.
 * @primary id            the database ID of the machine.
 * @integer hourlyRate    the hourly rate of the machine
 * @text    name          the name of the machine.
 * @foreign machineTypeId the machineType associated with this machine
 */
export const machines = pgTable("machines_table", {
  id: serial().primaryKey(),
  hourlyRate: integer().notNull(),
  name: text().notNull(),
  machineTypeId: serial().notNull().references(() => machineTypes.id, {onDelete:"cascade"}),
  active: integer().notNull()
})

/**
 * The table that stores the budget codes registered with the app.
 * @primary id          the database ID of the budget code.
 * @text    code        the budget number (can have letters) of the budgetCode.
 * @text    name        the name of the budget code.
 */
export const budgetCodes = pgTable("budgetCodes" , {
  id: serial().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
  // active: integer().notNull().default(1)
})


/*
 *********************
 * RELATIONAL TABLES *
 *********************
 */

/**
 * The table that stores the different types of machines.
 * @primary id    the database ID of the machine type.
 * @text    type  the name of the machine type.
 */
export const machineTypes = pgTable("machine_type" , {
  id: serial().primaryKey(),
  name: text().unique().notNull()
})

/**
 * The table that associates users with machine types.
 * @primary id            the database ID of the association.
 * @foreign userId        the database ID of the user in this association.
 * @foreign machineTypeId the database ID of the machine type in this association 
 *                        (the machines the user is able to access).
 */
export const userMachineType = pgTable("user_machine_type",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => users.id, {onDelete: "cascade"}),
  machineTypeId: serial().notNull().references(()=> machineTypes.id, {onDelete:"cascade"})
});

/**
 * The table that associates users with budget codes.
 * @primary id           the database ID of the association.
 * @foreign userId       the database ID of the user in the association.
 * @foreign budgetCodeId the database ID of the budget code in the association.
 */
export const userBudgetCodeTable = pgTable("user_budget_code_table",{
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => users.id, {onDelete: "cascade"}),
  budgetCodeId: serial().notNull().references(()=> budgetCodes.id, {onDelete:"cascade"})
});

/**
 * The table that defines sessions.
 * @primary id           the database ID of the association.
 * @foreign userId       the database ID of the user in the association.
 * @integer expiresAt     the flag that determines session expiration.
 */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // Lucia expects a string ID
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp({ precision: 3, withTimezone: true }),
});

export const financialStatementsTable = pgTable("financial_statements_table", {
  id: serial().primaryKey(),
  userId: serial().notNull().references(() => users.id, {onDelete: "no action"}),
  budgetCode: serial().notNull().references(() => budgetCodes.id, {onDelete: "no action"}),
  machineId: serial().notNull().references(() => machines.id, {onDelete: "no action"}),
  dateAdded: timestamp({ precision: 3, withTimezone: true }).notNull(),
  timeSpent: integer().notNull(),
});

/**
 * The table that associates a user and a machine with a machine issue report.
 * @primary id         the database ID of the issue report.
 * @foreign userId     the database ID of the user reporting the issue.
 * @foreign machineId  the database ID of the affected machine.
 * @timestamp reportedAt  the timestamp when the issue was reported.
 * @integer resolved   the flag indicating if the issue has been resolved (0 = no, 1 = yes).
 */
export const machineIssues = pgTable("machine_issues", {
  id: serial().primaryKey(),
  userId: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  machineId: integer().notNull().references(() => machines.id, { onDelete: "cascade" }),
  reportedAt: timestamp({ precision: 3, withTimezone: true }).notNull().defaultNow(),
  resolved: integer().notNull().default(0), // 0 = Not Resolved, 1 = Resolved
});




