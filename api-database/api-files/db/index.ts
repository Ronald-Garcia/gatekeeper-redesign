import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' }); // or .env.local

const connectionString = "postgresql://postgres.wccelsyverzgugwhzobu:wse-interlock@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
if (!connectionString) {
    console.log(connectionString);
    throw Error("null connection string");
}

export const client = postgres(connectionString, { prepare: false })
export const db = drizzle({ client });
