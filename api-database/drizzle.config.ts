import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './api-files/db/schema.ts',
  out: process.env.TEST_DB_URL! ?  './supabase/test_migrations': './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.TEST_DB_URL || process.env.PROD_DB_URL!,
  },
});
