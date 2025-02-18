// api/src/server.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { db } from './db/index.js';
import { usersTable } from './db/schema.js';
import "dotenv/config";

const app = new Hono();

// Enable CORS so that your frontend (web kiosk) can access this API
app.use('*', cors({
    origin: (origin) => origin, // Allow any origin
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
}));

// A simple GET endpoint to verify the server is running
app.get('/', (c) => c.text('Hono server running with Drizzle ORM'));


app.get("users", async (c) => {
  
  const users = await db
    .select()
    .from(usersTable);

  return c.json({
    message: "Successfully grabbed users",
    data: users
  });

})

// POST endpoint to insert a new user using Drizzle ORM
app.post('/api/users', async (c) => {
  try {
    // Parse the JSON body
    const { name, email } = await c.req.json<{ name: string; email: string }>();

    // Use Drizzle to insert a new user and return the inserted row
    const result = await db
      .insert(usersTable)
      .values({ name, email })
      .returning();

    // Drizzle returns an array of inserted rows; send back the first one
    return c.json(result[0], 201);
  } catch (error) {
    console.error('Error inserting user:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Start the server using @hono/node-server's serve() function


const port = Number(process.env.PORT) || 3000;
console.log(`Server running on port ${port}`);
serve({
  fetch: app.fetch,
  port
})