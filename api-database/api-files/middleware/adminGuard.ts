import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const adminGuard = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (!user ) {

    console.error("adminGuard: user is null", user);
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  
 else if (!user.isAdmin) {
    console.error("adminGuard: user is not admin", user);
    throw new HTTPException(403, { message: "Forbidden: Admins only" });
  }
  return next();
};
