
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index.js";

async function runMigrations() {
  console.log("Running migrations...");

  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations completed successfully.");
}

runMigrations()
  .catch((e) => {
    console.error("Migration failed:");
    console.error(e);
  })
  .finally(() => {
    // Don't forget to close the connection, otherwise the script will hang
  });
