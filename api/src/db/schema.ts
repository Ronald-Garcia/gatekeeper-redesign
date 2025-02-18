import { pgTable, serial, varchar, text, integer } from 'drizzle-orm/pg-core';


// Define the users table schema using Drizzle's pg-core helpers
export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull()
  });

// Define the users table schema using Drizzle's pg-core helpers
export const tasksTable = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    user_id: integer("user_id").references(() => usersTable.id)
  });

  // Define the users table schema using Drizzle's pg-core helpers
export const test = pgTable('test', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    user_id: integer("user_id").references(() => usersTable.id)
  });

