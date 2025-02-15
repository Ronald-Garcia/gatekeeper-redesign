// api/src/db.ts
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'

const pool =  new pg.Pool({
  connectionString: `postgres://postgres:IntelCorei7@localhost:5432/team10_db`,
});
export const db = drizzle({ client: pool });
const result = await db.execute('select 1');


// Define the users table schema using Drizzle's pg-core helpers
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull()
});

