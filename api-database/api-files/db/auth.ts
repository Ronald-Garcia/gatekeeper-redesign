import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./index.js";  
import { sessions, users } from "./schema.js";

const adapter = new DrizzlePostgreSQLAdapter(db as any, sessions as any, users as any);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: false,
      sameSite: "none",
    },
  },
  sessionExpiresIn: new TimeSpan(60, "m"),
  getUserAttributes: (userRow) => ({ ...userRow })
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
  }
}