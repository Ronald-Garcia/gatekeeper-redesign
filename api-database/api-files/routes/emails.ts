import { Resend } from "resend";
import { Hono } from "hono";
import { Context } from "../lib/context.js";
import { zValidator } from "@hono/zod-validator";
import { getTimeSchema, sendEmailSchema } from "../validators/emailSchemas.js";
import { db } from "../db/index.js";
import { budgetCodes, financialStatementsTable, machines, users } from "../db/schema.js";
import { transporter } from "../emails/index.js";
import writeXlsxFile from "write-excel-file/node";
import { between, eq } from "drizzle-orm";

export const emailRoutes = new Hono<Context>();

type StatementType = {
  user: {
    JHED: string
  },
  budgetCode: {
    name: string,
    code: string
  },
  machine: {
    name: string,
    hourlyRate: number
  },
  dateAdded: Date,
  timeSpent: number
}

emailRoutes.post("/statement-email/:email", 
    zValidator("json", getTimeSchema),
    zValidator("param", sendEmailSchema),
    async (c) => {

      let success = false;
      let message = "";

      const { email } = c.req.valid("param");
      const { startDate, endDate } = c.req.valid("json");
      const statements = await db.select({
        user: {
          JHED: users.JHED
        },
        budgetCode: {
          name: budgetCodes.name,
          code: budgetCodes.code
        },
        machine: {
          name: machines.name,
          hourlyRate: machines.hourlyRate
        },
        dateAdded: financialStatementsTable.dateAdded,
        timeSpent: financialStatementsTable.timeSpent
      }).from(financialStatementsTable)
                                      .innerJoin(users, eq(users.id, financialStatementsTable.userId))
                                      .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
                                      .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
                                      .where(between(financialStatementsTable.dateAdded, startDate, endDate));

      const excelSchema = [
        {
          column: "Charge",
          type: Number,
          value: (s: StatementType) => Math.round(s.timeSpent/60 / 15) * s.machine.hourlyRate
        },
        {
          column: "Receiver Type",
          type: String,
          value: (s: StatementType) => s.budgetCode.code.length === 10 ? "CC" : "IO"
        },
        {
          column: "Budget",
          type: String,
          value: (s: StatementType) => s.budgetCode.code
        },
        {
          column: "Text",
          type: String,
          value: (s: StatementType) => [s.user.JHED, s.budgetCode.name, s.dateAdded.toLocaleString()].join(", ")
        },
        {
          column: "Date",
          type: String,
          value: (s: StatementType) => s.dateAdded.toLocaleString()
        }

      ]

      const file = await writeXlsxFile(statements, {
        schema: excelSchema,
        buffer: true
      })

      transporter.sendMail({
          to: email,
          subject: "Financial Statements",
          html: "<h1>Financial Statements</h1>",
          attachments: [{
            filename: "statement.xlsx",
            content: file
          }]
      }).then(() => {
        success = true;
        message = "Successfully sent an email";
      }).catch((err) => {
        console.log(err);
        success = false;
        message = "Failed to send an email";
      });
    
    
      return c.json({
        success: success,
        data: statements,
        message: message
    });
});