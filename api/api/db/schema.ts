
import { integer, pgTable, serial, text, boolean, date } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cardNum: text('card_number').notNull().unique(),
  lastDigitOfCardNum: integer('last_digit_of_card_num').notNull(),
  JHED: text('JHED').notNull(),
  graduationYear: date('graduation_year'),
  isAdmin: boolean('is_admin')
});

//Table that acts as the "trainings" for a user
export const userMachineRelation = pgTable('user_machine_table',{
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(
      () => usersTable.id,
      {onDelete: 'cascade'}),
  machineId: serial('machine_id')
    .notNull()
    .references(
      ()=> machinesTable.id,
      {onDelete:'cascade'})
});

export const machinesTable = pgTable('machines_table', {
  id: serial('id').primaryKey(),
  hourlyRate: integer('hourly_rate').notNull(),
  name: text("name").notNull(),
  machineType: serial("machine_type_id")
    .notNull()
    .references(
      () => machineTypes.id,
      {onDelete:'cascade'})
})

export const machineTypes = pgTable('machine_type' , {
  id: serial('id').primaryKey(),
  type: text('type').notNull()
})


export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;


export type InsertMachine = typeof machinesTable.$inferInsert;
export type SelectMachine = typeof machinesTable.$inferSelect;

export type InsertMachineType = typeof machineTypes.$inferInsert;
export type SelectMachineType = typeof machineTypes.$inferSelect;

export type InsertUserMachineRelation = typeof userMachineRelation.$inferInsert;
export type SelectUserMachineRelation = typeof userMachineRelation.$inferSelect;



