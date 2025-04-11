import type { Context, Next } from "hono";
import { users } from "../db/schema.js";
import { gt, isNull, lt, not } from "drizzle-orm";
import { db } from "../db/index.js";

export const timeoutUserHandle = async (c: Context, next: Next) => {
  
    const now = new Date();

    await db.update(users).set({active: 1, timeoutDate: null}).where(not(isNull(users.timeoutDate)) && lt(users.timeoutDate, now));
    await db.update(users).set({active: 0}).where(gt(users.timeoutDate, now));

  return next();
};

    