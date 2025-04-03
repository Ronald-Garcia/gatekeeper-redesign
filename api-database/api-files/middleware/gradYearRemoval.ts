import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "../db";
import { users } from "../db/schema";
import { lt } from "drizzle-orm";

export const inactivateGraduatedUsers = async (c: Context, next: Next) => {
  
    await db.update(users).set({active: 0 }).where(lt(users.graduationYear, new Date().getFullYear()));


  return next();
};

    