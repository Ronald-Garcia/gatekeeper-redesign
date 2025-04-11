import type { Context, Next } from "hono";
import { users } from "../db/schema.js";
import { and, isNull, lt, not } from "drizzle-orm";
import { db } from "../db/index.js";

export const inactivateGraduatedUsers = async (c: Context, next: Next) => {
  
    await db.update(users).set({active: 0 }).where(and(not(isNull(users.graduationYear)), lt(users.graduationYear, new Date().getFullYear())));


  return next();
};

    