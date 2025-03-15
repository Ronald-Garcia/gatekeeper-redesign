import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./index";  
import { sessions, users } from "./schema";

const adapter = new DrizzlePostgreSQLAdapter(db as any, sessions as any, users as any);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    },
  },
  sessionExpiresIn: new TimeSpan(3, "m"),
  getUserAttributes: (userRow) => ({ ...userRow })
});
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
  }
}
