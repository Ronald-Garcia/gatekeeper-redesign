import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from "dotenv";
dotenv.config(); 

// the connection string of the postgresql database
const connectionString =  process.env.TEST_DB_URL || process.env.PROD_DB_URL!
if (!connectionString) {
    console.log(connectionString);
    throw Error("null connection string");
}

export const client = postgres(connectionString, { prepare: false
}); 


    
export const db = drizzle({ client });
