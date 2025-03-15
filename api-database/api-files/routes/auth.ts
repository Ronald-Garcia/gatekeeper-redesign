import { Hono } from "hono";
import { lucia } from "../db/auth";
import { HTTPException } from "hono/http-exception";
import { Context } from "../lib/context";


const authRoutes = new Hono<Context>();

authRoutes.post("/logout", async (c) => {
  const cookie = c.req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);
  if (!sessionId) {
    throw new HTTPException(401, { message: "No session found" });
  }
  await lucia.invalidateSession(sessionId);
  const blankSessionCookie = lucia.createBlankSessionCookie();
  c.header("Set-Cookie", blankSessionCookie.serialize());
  return c.json({ success: true, message: "Signed out successfully" });
});

export default authRoutes;
