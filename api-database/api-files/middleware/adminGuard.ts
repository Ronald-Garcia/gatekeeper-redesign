import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const adminGuard = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (!user ) {

    throw new HTTPException(401, { message: "Unauthorized" });
  }
  
 else if (!user.isAdmin) {
    throw new HTTPException(403, { message: "Unauthorized: Admins only" });
  }
  return next();
};
