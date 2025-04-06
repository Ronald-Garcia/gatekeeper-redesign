import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { users } from "../db/schema";
import { gt, isNull, lt, not } from "drizzle-orm";

export const timeoutUserHandle = async (c: Context, next: Next) => {
  
    const now = new Date();

    await db.update(users).set({active: 1, timeoutDate: null}).where(not(isNull(users.timeoutDate)) && lt(users.timeoutDate, now));
    await db.update(users).set({active: 0}).where(gt(users.timeoutDate, now));

  return next();
};

    