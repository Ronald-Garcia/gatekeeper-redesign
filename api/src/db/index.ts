// api/src/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'
import "dotenv/config";

//Make sure to make a env file for these variables.
const PASSWORD = process.env.PASSWORD;
const SERVERPORT = process.env.SERVERPORT;

const pool =  new pg.Pool({
  connectionString: `postgres://postgres:${PASSWORD}@127.0.0.1:${SERVERPORT}/team10_db`,
});
export const db = drizzle({ client: pool });




