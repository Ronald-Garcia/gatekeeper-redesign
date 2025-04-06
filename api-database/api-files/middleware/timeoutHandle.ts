import type { Context, Next } from "hono";
import { users } from "../db/schema.js";
import { gt, lt } from "drizzle-orm";
import { db } from "../db/index.js";

export const timeoutUserHandle = async (c: Context, next: Next) => {
  
    const now = new Date();

    await db.update(users).set({active: 1}).where(lt(users.timeoutDate, now));
    await db.update(users).set({active: 0}).where(gt(users.timeoutDate, now));

  return next();
};

    