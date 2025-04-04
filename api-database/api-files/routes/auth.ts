import { Hono } from "hono";
import { lucia } from "../db/auth.js";
import { HTTPException } from "hono/http-exception";
import { Context } from "../lib/context.js";
import { zValidator } from "@hono/zod-validator";
import { getUserByCardNumSchema } from "../validators/schemas.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { appendLastNum } from "./users.js";
import { ServiceProvider, IdentityProvider } from "samlify"; 
import dotenv from 'dotenv';
dotenv.config();


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

//SAML configuration values
const JHU_SSO_URL = "https://idp.jh.edu/idp/profile/SAML2/Redirect/SSO";
// For the Service Provider, use your backend API URL (deployed on Vercel)
const SP_ENTITY_ID = process.env.SP_ENTITY_ID || "https://interlock-api-database-v1.vercel.app";
const BASE_URL = process.env.BASE_URL || "https://interlock-api-database-v1.vercel.app";

//Load your certificate and private key files from the certs folder.
const PbK = process.env.CERT;
const PvK = process.env.KEY;

// Configure the Service Provider (SP)
const sp = ServiceProvider({
  entityID: SP_ENTITY_ID,
  privateKey: PvK,
  assertionConsumerService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: `${BASE_URL}/auth/jhu/login/callback`,
    },
  ],
});


const idp =  IdentityProvider({
  // The IdP's entityID shoudl eb based on the notes 
  entityID: "https://idp.jh.edu/metadata",
  // Provide the signing certificate, from env in this case 
  signingCert: PbK,
  //Declare the Single Sign-On service endpoint
  singleSignOnService: [{
    Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
    Location: JHU_SSO_URL,
  }],
  // singleLogoutService ???
});


// Redirects the user to the JHU SSO sign-in page.
authRoutes.get("/jhu/login", (c) => {
  const { context } = sp.createLoginRequest(idp, "redirect");
  return c.redirect(context);
});


// Processes the SAML response, extracts the JHED (as "username"), and verifies registration.
authRoutes.post("/jhu/login/callback", async (c) => {
  const body = await c.req.parseBody();
  try {
    // Parse the SAML response with le  HTTP-POST binding
    const parseResult = await sp.parseLoginResponse(idp, "post", { body });
    const profile = parseResult.extract; // Contains assertion attributes from the IdP

    //Extract the JHED. username is jhed based on le madooei
    const jhed = profile.username;
    if (!jhed) {
      throw new Error("JHED attribute not found in SAML response");
    }

    // Compare the JHED with your database to ensure the user is registered
    const [user] = await db.select().from(users).where(eq(users.JHED, jhed));
    if (!user) {
      return c.json({ message: "Access Denied: User not registered" }, 403);
    }

    // Create a session for the user.
    const session = await lucia.createSession(user.id, {});
    // Create a session cookie based on the session ID.
    const sessionCookie = lucia.createSessionCookie(session.id);
    // Attach the session cookie to the response headers.
    c.header("Set-Cookie", sessionCookie.serialize(), { append: true });

    // return a welcome message, need to redirect to homepage
    return c.json({
      success: true,
      message: `Welcome ${user.name}`,
      data: { user, sessionId: session.id },
    });
  } catch (err) {
    console.error("SAML login error:", err);
    throw new HTTPException(400, { message: "SAML login failed" });
  }
});

// serves le Service Provider metadata in XML format for configuration in the IdP
authRoutes.get("/jhu/metadata", (c) => {
  const metadata = sp.getMetadata();
  c.header("Content-Type", "application/xml");
  return c.text(metadata);
});


export default authRoutes;
