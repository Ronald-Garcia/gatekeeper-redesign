import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: `postgres://postgres:${process.env.PASSWORD}@localhost:${process.env.SERVERPORT}/team10_db`,
  },
})
