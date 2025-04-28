import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from "dotenv";
dotenv.config({ path: "./api-database/.env" }); 

config({ path: '.env' }); // or .env.local

// the connection string of the postgresql database
const connectionString = "postgresql://postgres.jiykovdprkyxkstphgwc:mockinterlockdb@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
if (!connectionString) {
    console.log(connectionString);
    throw Error("null connection string");
}

export const client = postgres(connectionString, { prepare: false })
export const db = drizzle({ client });
