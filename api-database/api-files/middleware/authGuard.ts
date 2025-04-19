import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const authGuard = async (c: Context, next: Next) => {
  const session = c.get("session");
  const user = c.get("user");
  if (!session || !user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return next();
};