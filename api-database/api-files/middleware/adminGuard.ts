import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const adminGuard = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (!user || !user.isAdmin) {
    throw new HTTPException(403, { message: "Forbidden: Admins only" });
  }
  await next();
};
