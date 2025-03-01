import { sql } from "drizzle-orm";
import { db } from "./index.js";
// import { usersTable, tasksTable, test } from "./schema.js";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");

  // await db.delete(usersTable);
  // await db.delete(tasksTable);
  // await db.delete(test);

//   await db.execute(
//     sql`DELETE FROM sqlite_sequence WHERE name IN ('notes', 'tags', 'users')`,
//   );

  console.log("Inserting new seed data...");

  const sampleUsers = [];

  const sampleKeywords = [
    "fiftytwo",
    "blackjack",
    "uno",
    "twentyone",
    "21",
    "52",
    "gofish",
    "go fish",
    "speed",
    "spit",
    "shuffle",
    "riffle",
  ];

  for (let i = 1; i <= 5; i++) {
    // const [user] = await db
    //   .insert(usersTable)
    //   .values({
    //     name: "aa",
    //     email: "aa@gmail.com"
    //   })
    //   .returning();
      

    // sampleUsers.push(user);
  }

  for (let i = 1; i <= 100; i++) {
    const title = `User ${i} title ${i}`;
    const description = `User ${i} content ${i}`;

    // const [task] = await db
    //   .insert(tasksTable)
    //   .values({
    //     title,
    //     description,
    //     user_id: sampleUsers[Math.floor(Math.random() * 5)].id,
    //   })
    //   .returning();
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
  });
