import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { users } from "../db/schema";
import { and, isNull, lt, not } from "drizzle-orm";

export const inactivateGraduatedUsers = async (c: Context, next: Next) => {
  
    await db.update(users).set({active: 0 }).where(and(not(isNull(users.graduationYear)), lt(users.graduationYear, new Date().getFullYear())));


  return next();
};

    