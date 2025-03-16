import { Resend } from "resend";
import { EmailTemplate } from "../emails/email-template.js";
import { Hono } from "hono";
import { Context } from "../lib/context.js";
import React from "react";
import { zValidator } from "@hono/zod-validator";
import { sendEmailSchema } from "../validators/emailSchemas.js";
import { db } from "../db/index.js";
import { financialStatementsTable } from "../db/schema.js";
const resend = new Resend(process.env.RESEND);
export const emailRoutes = new Hono<Context>();


emailRoutes.post("/statement-email/:email", 
    zValidator("param", sendEmailSchema),
    async (c) => {

    const { email } = c.req.valid("param");

    const statements = await db.select().from(financialStatementsTable);

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [email],
        subject: 'hello world',
        react: await EmailTemplate({ data: statements}),
      });
    
      if (error) {
        return c.json(error, 400);
      }
    
      return c.json(data);
});