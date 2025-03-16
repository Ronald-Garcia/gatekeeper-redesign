import { Hono } from "hono";
import { lucia } from "../db/auth";
import { HTTPException } from "hono/http-exception";
import { Context } from "../lib/context";
import { zValidator } from "@hono/zod-validator";
import { getUserByCardNumSchema } from "../validators/schemas";
import { db } from "../db";
import { users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { appendLastNum } from "./users";


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

/**
 * Get user by card number.
 * @param cardNum the card number of the user.
 * @returns the user.
 */
authRoutes.post("/users/:cardNum", 
  zValidator("param",getUserByCardNumSchema), async(c) => {
 //Given you have a well formed card number, check if that card num exists in user table.
 const { cardNum } = c.req.valid("param");

 const cardNumTrunc = cardNum.substring(0, cardNum.length - 1);

 const lastDigitOfCardNum = Number.parseInt(cardNum.charAt(cardNum.length - 1));
 let [user] = await db
     .select()
     .from(users)
     .where(and(eq(users.cardNum, cardNumTrunc), eq(users.lastDigitOfCardNum, lastDigitOfCardNum)));
 
 // Check if exists. If not, throw error.
 // Also, do a check to see if this is an old jcard scan attempt. If yes, deny.
 if (!user || user.lastDigitOfCardNum > lastDigitOfCardNum) {    
     throw new HTTPException(404, { message: "User not found" });
 }

 // Check for a more recent jcard num. In this case, we will update the last digit with the new digit
 if (user.lastDigitOfCardNum > lastDigitOfCardNum) {
     [user] = await db
         .update(users)
         .set({lastDigitOfCardNum})
         .where(eq(users.id, user.id))
         .returning();
 }

  // Create a session using Lucia.
   const session = await lucia.createSession(user.id, {});
   // Create a session cookie.
   const sessionCookie = lucia.createSessionCookie(session.id);
   // Set the cookie in the response headers.
   c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
   
   appendLastNum(user);
   
   return c.json({
     success: true,
     message: "User has been validated in",
     data:user
   });
})




export default authRoutes;
