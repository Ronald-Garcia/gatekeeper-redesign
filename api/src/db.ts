// api/src/db.ts
import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'
import "dotenv/config";

//Make sure to make a env file for these variables.
const PASSWORD = process.env.PASSWORD;
const SERVERPORT = process.env.SERVERPORT;

const pool =  new pg.Pool({
  connectionString: `postgres://postgres:${PASSWORD}@localhost:${SERVERPORT}/team10_db`,
});
export const db = drizzle({ client: pool });
const result = await db.execute('select 1');


// Define the users table schema using Drizzle's pg-core helpers
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull()
});

