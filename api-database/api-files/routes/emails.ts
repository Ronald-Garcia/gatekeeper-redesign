import { Hono } from "hono";
import { Context } from "../lib/context.js";
import { zValidator } from "@hono/zod-validator";
import { getDateSchema, getTimeSchema, sendEmailSchema } from "../validators/emailSchemas.js";
import { db } from "../db/index.js";
import { budgetCodes, financialStatementsTable, machines, users } from "../db/schema.js";
import { transporter } from "../emails/index.js";
import writeXlsxFile from "write-excel-file/node";
import { between, eq } from "drizzle-orm";
import { adminGuard } from "../middleware/adminGuard.js";
import { HTTPException } from "hono/http-exception";
import Bree from "bree"; 
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Routes for email operations.
 * @post    /statement-email/:email    sends financial statements via email for a date range.
 */
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

function getValidDate(year: number, month: number, day: number): Date {
  // Get the last day of the month: new Date(year, month + 1, 0) returns the last day.
  const lastDay = new Date(year, month + 1, 0).getDate();
  const validDay = Math.min(day, lastDay);
  return new Date(year, month, validDay);
}


async function sendEmail(email: string, scheduled: boolean, startDate?:Date, endDate?:Date, date?:Date) : Promise<StatementType[]> {

   if(scheduled) {

    if (!date) {
      throw new HTTPException(500, { message: "Dates undefined" });
     }

    const day = date.getDate();
    const now = new Date();
    // Compute startDate as the same day in the previous month and endDate as the same day in the current month.
    startDate = getValidDate(now.getFullYear(), now.getMonth() - 1, day);
    endDate = getValidDate(now.getFullYear(), now.getMonth(), day);
   }  


  
   if (!startDate || ! endDate) {
    throw new HTTPException(500, { message: "Dates undefined" });
   }
  
      // query the financial statements table for the specified date range with the user, budget code, and machine information
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
      
      // send the email with the financial statements
      transporter.sendMail({
          to: email,
          subject: "Financial Statements",
          html: "<h1>Financial Statements</h1>",
          attachments: [{
            filename: "statement.xlsx",
            content: file
          }]
      })

      return statements;
}







/**
 * Sends financial statements via email for a specified date range.
 * @param email        the email address to send statements to
 * @body startDate     the start date for the statements
 * @body endDate       the end date for the statements
 * @returns the financial statements data and email send status
 */
emailRoutes.post("/statement-email/:email", 
    zValidator("json", getTimeSchema),
    zValidator("param", sendEmailSchema),
    adminGuard,
    async (c) => {

      let success = true;
      let message = "Successfully sent an email";

      const { email } = c.req.valid("param");
      const { startDate, endDate } = c.req.valid("json");
      
      
      
      const statements = await sendEmail(email, false , startDate, endDate)
      .then(() => {
        success = true;
        message = "Successfully sent an email";
      }).catch((err) => {
        console.log(err);
        success = false;
        message = "Failed to send an email";
      })
    
      return c.json({
        success: success,
        data: statements,
        message: message
    });
});


emailRoutes.post("/statement-email/schedule/:email",
  zValidator("json", getDateSchema),
  zValidator("param", sendEmailSchema),
  adminGuard,
  async (c) => {
    const { email } = c.req.valid("param");
    const { date } = c.req.valid("json");



    //Create a Bree instance, might need to do singleton instancem for prod
    const bree = new Bree({
      root: join(__dirname, "../emails/jobs")

    });



    try {
      // Schedule the job

      bree.add({
        name: "index", 
        cron: `0 0 ${date} * *`, 
        worker: {
          workerData: { email, date },
        }
      });


      
 

    } catch (err) {
      console.error(err);
      throw new HTTPException(500, { message: "Failed to schedule email automation." });
    }

    return c.json({
      success: true,
      message: `Automated email scheduled to run on day ${date} of every month at midnight.`
    });
});